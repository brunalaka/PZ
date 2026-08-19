import { NYC_BOSTON_TRIPS, StaticTrip } from './trips-data';
import type { AgentResult, TripData, Recommendation } from './agent-types';

// ── Station classification ────────────────────────────────────────────────────

const MAIN_DEP_STATIONS = new Set([
  'New York Port Authority',
  'NYC Midtown (31st St & 8th Ave)',
  'New York (Hudson Yards)',
  'NYC Downtown Canal Street',
]);

const MAIN_ARR_STATIONS = new Set([
  'Boston (South Station)',
]);

function isMainDep(s: string): boolean { return MAIN_DEP_STATIONS.has(s); }
function isMainArr(s: string): boolean { return MAIN_ARR_STATIONS.has(s); }

// ── Helpers ───────────────────────────────────────────────────────────────────

function tripToData(t: StaticTrip): TripData {
  return {
    tripId: t.id,
    dep: t.dep,
    arr: t.arr,
    depStation: t.depStation,
    arrStation: t.arrStation,
    duration: t.duration,
    stops: t.stops,
    price: t.price,
    currency: t.currency,
    carrier: t.carrier,
  };
}

function parseHHMM(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function durationMinutes(dur: string): number {
  const h = dur.match(/(\d+)h/);
  const m = dur.match(/(\d+)m/);
  return (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0);
}

function isOvernightDep(dep: string): boolean {
  const min = parseHHMM(dep);
  return min >= 22 * 60 || min < 5 * 60;
}

function isMorningDep(dep: string): boolean {
  const min = parseHHMM(dep);
  return min >= 8 * 60 && min < 10 * 60;
}

function formatClockTime(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr;
  const period = h < 12 ? 'am' : 'pm';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return m === '00' ? `${h}${period}` : `${h}:${m}${period}`;
}

// ── Scoring ───────────────────────────────────────────────────────────────────

interface Weights { duration: number; price: number; mainStation: number; morning: number; }

function computeScores(pool: StaticTrip[], w: Weights): Map<string, number> {
  const durations = pool.map(t => durationMinutes(t.duration));
  const prices    = pool.map(t => t.price);
  const minDur    = Math.min(...durations);
  const maxDur    = Math.max(...durations);
  const minPrice  = Math.min(...prices);
  const maxPrice  = Math.max(...prices);
  const durRange   = maxDur   - minDur   || 1;
  const priceRange = maxPrice - minPrice || 1;

  const scores = new Map<string, number>();
  for (const t of pool) {
    const durScore   = (maxDur   - durationMinutes(t.duration)) / durRange;
    const priceScore = (maxPrice - t.price)                     / priceRange;
    const mainScore  = isMainDep(t.depStation) ? 1 : 0;
    const morningScore = isMorningDep(t.dep)   ? 1 : 0;
    scores.set(t.id,
      durScore    * w.duration    +
      priceScore  * w.price       +
      mainScore   * w.mainStation +
      morningScore * w.morning
    );
  }
  return scores;
}

// ── Recommendation text ───────────────────────────────────────────────────────

// index 0 = best overall, 1 = fastest, 2 = cheapest — always.
// top3 is passed so trips 1 and 2 can be described relative to trip 0.
function generateRecommendation(
  trip: StaticTrip,
  index: number,
  top3: StaticTrip[],
  wantCheapest: boolean,
  wantFastest: boolean,
): Recommendation {
  const best      = top3[0];
  const tripDur   = durationMinutes(trip.duration);
  const bestDur   = durationMinutes(best.duration);
  const durDiff   = tripDur - bestDur;       // positive = slower than best
  const priceDiff = trip.price - best.price; // positive = more expensive

  const isMain        = isMainDep(trip.depStation);
  const bestIsMain    = isMainDep(best.depStation);
  const isMorning     = isMorningDep(trip.dep);
  const bestIsMorning = isMorningDep(best.dep);
  const isTransfer    = trip.stops !== 'Direct';
  const depMin        = parseHHMM(trip.dep);

  const top3Prices = top3.map(t => t.price);
  const top3Durs   = top3.map(t => durationMinutes(t.duration));
  const isCheapestInTop3 = trip.price === Math.min(...top3Prices);
  const isFastestInTop3  = tripDur    === Math.min(...top3Durs);

  // Notes about non-obvious trade-offs, appended inline without a label
  const tradeoffNotes: string[] = [];
  if (!isMain) {
    const short = trip.depStation.includes('Queens')
      ? trip.depStation.split('(')[0].trim()
      : trip.depStation;
    tradeoffNotes.push(`Keep in mind it departs from ${short}, not a central Manhattan stop`);
  }
  if (isTransfer) tradeoffNotes.push('It involves a transfer, which adds time to the journey');
  const tradeoffSuffix = tradeoffNotes.length > 0
    ? ' ' + tradeoffNotes.join('. ') + '.'
    : '';

  let heading: string;
  let descCore: string;

  // ── Trip 0: describe its own absolute strengths ───────────────────────────
  if (index === 0) {
    if (wantCheapest) {
      heading = isMorning && isMain ? 'Cheapest morning departure'
              : isMorning           ? 'Cheapest morning trip'
              : isMain              ? 'Cheapest from central Manhattan'
              : 'Lowest price available';
      descCore = `The lowest price available${isFastestInTop3 ? ', and also the fastest of these results' : ''}${isMorning ? ' with a morning departure' : ''}.`;
    } else if (wantFastest) {
      heading = isMorning && isMain ? 'Fastest with a morning start'
              : isMorning           ? 'Fastest morning departure'
              : isMain              ? 'Fastest from central Manhattan'
              : 'Shortest journey time';
      descCore = `The shortest journey time available${isCheapestInTop3 ? ', also the most affordable here' : ''}${isMorning && isMain ? ', with a morning departure from a central station' : ''}.`;
    } else {
      const strengths: string[] = [];
      if (isCheapestInTop3) strengths.push('most affordable of these three');
      if (isFastestInTop3)  strengths.push('fastest journey time');
      if (isMorning && isMain) strengths.push('morning departure from a central station');
      else if (isMorning)   strengths.push('morning departure');
      else if (isMain)      strengths.push('central station departure');

      heading = isCheapestInTop3 && isFastestInTop3 && isMorning && isMain ? 'Fast, affordable, central morning trip'
              : isCheapestInTop3 && isFastestInTop3  ? 'Fastest and most affordable'
              : isFastestInTop3 && isMorning && isMain ? 'Fast morning trip from central Manhattan'
              : isCheapestInTop3 && isMorning && isMain ? 'Affordable morning trip from central Manhattan'
              : isFastestInTop3 && isMorning  ? 'Fast morning departure'
              : isCheapestInTop3 && isMorning ? 'Affordable morning departure'
              : isFastestInTop3 && isMain     ? 'Fast trip from central Manhattan'
              : isCheapestInTop3 && isMain    ? 'Good value from central Manhattan'
              : isMorning && isMain           ? 'Morning trip from central Manhattan'
              : isMorning                     ? 'Good morning departure'
              : isMain                        ? 'Solid trip from central Manhattan'
              :                                 'Recommended trip';

      if (strengths.length >= 2) {
        const joined = strengths.join(', ').replace(/,([^,]*)$/, ' and$1');
        descCore = joined.charAt(0).toUpperCase() + joined.slice(1) + '.';
      } else {
        descCore = 'The strongest option based on price, speed, and convenience.';
      }
    }

  // ── Trips 1 & 2: compare against trip 0 ──────────────────────────────────
  } else {
    if (index === 1) {
      // Fastest slot
      heading = isMorning && isMain ? 'Fastest morning departure'
              : isMorning           ? 'Quick morning trip'
              : isMain && priceDiff <= 0 ? 'Fastest and good value'
              : isMain              ? 'Fastest from central Manhattan'
              : priceDiff <= 0      ? 'Fast and affordable'
              :                       'Gets you there earliest';
    } else {
      // Cheapest slot
      heading = isMorning && isMain ? 'Budget morning trip from central Manhattan'
              : isMorning           ? 'Budget morning departure'
              : isMain && durDiff <= 0 ? 'Cheapest and fast'
              : isMain              ? 'Best price from central Manhattan'
              : durDiff <= 0        ? 'Cheapest and no slower'
              :                       'Best price available';
    }

    const tripArr  = parseHHMM(trip.arr);
    const bestArr  = parseHHMM(best.arr);
    const arrDiff  = tripArr - bestArr; // negative = arrives earlier

    const sentences: string[] = [];

    // Primary stat: the defining quality of this slot
    if (index === 1) {
      // Fastest slot
      if (arrDiff < 0) {
        sentences.push(`Gets you to Boston by ${formatClockTime(trip.arr)}, earlier than the top pick`);
      } else if (durDiff < 0) {
        sentences.push(`Shorter journey time than the top pick`);
      }
      if (priceDiff < 0) {
        sentences.push(`also $${Math.abs(priceDiff).toFixed(2)} cheaper`);
      } else if (priceDiff > 0) {
        sentences.push(`costs $${priceDiff.toFixed(2)} more than the top pick`);
      }
    } else {
      // Cheapest slot
      if (priceDiff < 0) {
        sentences.push(`$${Math.abs(priceDiff).toFixed(2)} cheaper than the top pick`);
      }
      if (arrDiff < 0) {
        sentences.push(`arrives at ${formatClockTime(trip.arr)}, giving you more time in Boston`);
      } else if (depMin < parseHHMM(best.dep)) {
        sentences.push(`departs earlier if you prefer an earlier start`);
      }
      if (durDiff > 0) {
        sentences.push(`journey is a bit longer at ${trip.duration}`);
      }
    }

    // Bonus qualities not shared with the top pick
    if (isMain && !bestIsMain) {
      sentences.push('departs from a central Manhattan station, which may be easier to reach');
    }
    if (isMorning && !bestIsMorning) {
      sentences.push('morning departure if you prefer an earlier start');
    }
    if (!isMorning && bestIsMorning && depMin >= 12 * 60 && depMin < 17 * 60) {
      sentences.push('afternoon departure if you need the morning free');
    }
    if (!isMorning && bestIsMorning && depMin >= 17 * 60) {
      sentences.push('evening departure, keeping your full morning and afternoon in New York');
    }

    if (sentences.length === 0) {
      sentences.push('a different departure time if the top pick does not fit your schedule');
    }

    const joined = sentences.join('. ');
    descCore = joined.charAt(0).toUpperCase() + joined.slice(1) + '.';
  }

  return { heading, description: descCore + tradeoffSuffix, trip: tripToData(trip) };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function localSearch(query: string, activeFilters: string[] = []): AgentResult {
  const q = query.toLowerCase();

  // Detect explicit user intent from query + active filter chips
  const wantCheapest    = /cheap|budget|low.?price|afford|least expensive/.test(q) || activeFilters.includes('Cheapest trips');
  const wantFastest     = /fast|quick|short|least time|fewest hours/.test(q)       || activeFilters.includes('Fastest trips');
  const wantDirect      = /direct|no stop|non.?stop/.test(q)                       || activeFilters.includes('Direct trips only');
  const wantNight       = /night|overnight/.test(q);
  const wantGreyhound   = /greyhound/.test(q);
  const wantFlixBus     = /flix/.test(q);
  const wantMainStation = activeFilters.includes('Only main stations');

  const depAfterMatch  = q.match(/(?:depart(?:ing)?|leave[s]?|after|from)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  const arrBeforeMatch = q.match(/arrive\s+(?:before\s+)?(?:by\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  const wantMorning    = /morning/.test(q);
  const wantAfternoon  = /afternoon/.test(q);
  const wantEvening    = /evening/.test(q);

  function parseTime(match: RegExpMatchArray): number {
    let h = parseInt(match[1]);
    const m  = match[2] ? parseInt(match[2]) : 0;
    const period = match[3];
    if (period === 'pm' && h < 12) h += 12;
    if (period === 'am' && h === 12) h = 0;
    return h * 60 + m;
  }

  const depAfterMinutes  = depAfterMatch  ? parseTime(depAfterMatch)  : null;
  const arrBeforeMinutes = arrBeforeMatch ? parseTime(arrBeforeMatch) : null;

  // ── Step 1: hard filters from explicit user intent ────────────────────────

  let pool = NYC_BOSTON_TRIPS.filter((t) => {
    const depMin = parseHHMM(t.dep);
    const arrMin = parseHHMM(t.arr);

    if (wantDirect      && t.stops !== 'Direct')      return false;
    if (wantGreyhound   && t.carrier !== 'Greyhound') return false;
    if (wantFlixBus     && t.carrier !== 'FlixBus')   return false;
    if (wantMainStation && (!isMainDep(t.depStation) || !isMainArr(t.arrStation))) return false;
    if (depAfterMinutes  !== null && depMin < depAfterMinutes)  return false;
    if (arrBeforeMinutes !== null && arrMin > arrBeforeMinutes) return false;
    if (wantMorning   && (depMin < 5 * 60 || depMin >= 12 * 60)) return false;
    if (wantAfternoon && (depMin < 12 * 60 || depMin >= 17 * 60)) return false;
    if (wantEvening   && depMin < 17 * 60) return false;

    return true;
  });

  // Fall back to full dataset if filters left nothing
  if (pool.length === 0) pool = NYC_BOSTON_TRIPS;

  // ── Step 2: overnight exclusion ───────────────────────────────────────────

  if (!wantNight) {
    const dayPool = pool.filter(t => !isOvernightDep(t.dep));
    if (dayPool.length > 0) pool = dayPool;
  }

  // ── Step 3: direct-first hard filter ─────────────────────────────────────
  // Keep only direct trips. Only include transfers as fallback when fewer than
  // 3 direct trips remain (not enough to fill the top recommendations).

  const directPool = pool.filter(t => t.stops === 'Direct');
  const includesTransfers = directPool.length < 3;
  if (!includesTransfers) pool = directPool;

  // ── Step 4: score and rank ────────────────────────────────────────────────

  const weights: Weights = wantCheapest
    ? { duration: 0.15, price: 0.70, mainStation: 0.10, morning: 0.05 }
    : wantFastest
    ? { duration: 0.70, price: 0.15, mainStation: 0.10, morning: 0.05 }
    : { duration: 0.35, price: 0.30, mainStation: 0.20, morning: 0.15 };

  // Use balanced weights for the "best overall" score regardless of user intent —
  // user intent shapes which trip wins fastest/cheapest slots, not the overall rank.
  const balancedWeights: Weights = { duration: 0.35, price: 0.30, mainStation: 0.20, morning: 0.15 };
  const scores = computeScores(pool, weights);
  const balancedScores = computeScores(pool, balancedWeights);
  const ranked = [...pool].sort((a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0));

  // ── Step 5: pick the three featured slots ────────────────────────────────
  // Slot 0 — best overall (balanced score)
  // Slot 1 — fastest (shortest duration, ties broken by balanced score)
  // Slot 2 — cheapest (lowest price, ties broken by balanced score)
  // All three must be distinct. Remaining trips fill the carousel.

  const byBalanced = [...pool].sort((a, b) =>
    (balancedScores.get(b.id) ?? 0) - (balancedScores.get(a.id) ?? 0)
  );

  const bestOverall = byBalanced[0];

  const minDur = Math.min(...pool.map(t => durationMinutes(t.duration)));
  const fastestCandidates = pool
    .filter(t => durationMinutes(t.duration) === minDur)
    .sort((a, b) => (balancedScores.get(b.id) ?? 0) - (balancedScores.get(a.id) ?? 0));
  const fastest = fastestCandidates.find(t => t.id !== bestOverall.id) ?? fastestCandidates[0];

  const minPrice = Math.min(...pool.map(t => t.price));
  const cheapestCandidates = pool
    .filter(t => t.price === minPrice)
    .sort((a, b) => (balancedScores.get(b.id) ?? 0) - (balancedScores.get(a.id) ?? 0));
  const cheapest = cheapestCandidates.find(t => t.id !== bestOverall.id && t.id !== fastest.id)
    ?? cheapestCandidates.find(t => t.id !== bestOverall.id)
    ?? cheapestCandidates[0];

  const top3 = [bestOverall, fastest, cheapest];
  const usedIds = new Set(top3.map(t => t.id));

  // Carousel: up to 7 from ranked pool, excluding the featured three
  const rest = ranked.filter(t => !usedIds.has(t.id)).slice(0, 7);

  const recommendations: Recommendation[] = top3.map((t, i) =>
    generateRecommendation(t, i, top3, wantCheapest, wantFastest)
  );

  // ── Summary sentence ──────────────────────────────────────────────────────

  let summary = 'Here are the best options for your New York to Boston trip.';
  if (wantCheapest)       summary = 'Here are the most affordable trips from New York to Boston.';
  else if (wantFastest)   summary = 'Here are the fastest trips from New York to Boston.';
  else if (wantMorning)   summary = 'Here are the best morning departures from New York to Boston.';
  else if (wantAfternoon) summary = 'Here are the best afternoon departures from New York to Boston.';
  else if (wantEvening)   summary = 'Here are the best evening departures from New York to Boston.';
  else if (wantGreyhound) summary = 'Here are the top Greyhound trips from New York to Boston.';
  else if (wantFlixBus)   summary = 'Here are the top FlixBus trips from New York to Boston.';
  else if (arrBeforeMinutes !== null) {
    const hh = arrBeforeMatch![1].padStart(2, '0');
    const mm = (arrBeforeMatch![2] ?? '00').padStart(2, '0');
    const period = arrBeforeMatch![3] ? ` ${arrBeforeMatch![3]}` : '';
    summary = `Here are trips that arrive before ${hh}:${mm}${period}.`;
  } else if (depAfterMinutes !== null) {
    const hh = depAfterMatch![1].padStart(2, '0');
    const mm = (depAfterMatch![2] ?? '00').padStart(2, '0');
    const period = depAfterMatch![3] ? ` ${depAfterMatch![3]}` : '';
    summary = `Here are trips departing after ${hh}:${mm}${period}.`;
  }

  if (includesTransfers) {
    summary += ' Direct options were limited, so some trips with transfers are included.';
  }

  return { summary, recommendations, moreResults: rest.map(tripToData) };
}
