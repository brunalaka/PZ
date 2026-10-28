import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
  type WheelEvent,
} from 'react';
import {
  Button,
  Checkbox,
  Divider,
  HeaderBar,
  HeaderBrand,
  Input,
  Panel,
  PanelContent,
  PanelFooter,
  PanelFooterColumn,
  PanelHeader,
  Radio,
  Range,
  Select,
  SelectOption,
  Tag,
  Text,
  ThemeWrapper,
} from '@flixbus/honeycomb-react';
import {
  Icon,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconBurger,
  IconBus,
  IconBusTrain,
  IconBusStop,
  IconCalendarSolid,
  IconClose,
  IconEditSolid,
  IconFilter,
  IconNight,
  IconOffer,
  IconPin,
  IconPinSolid,
  IconRefresh,
  IconProfileSolid,
  IconSocket,
  IconSort,
  IconSun,
  IconSunrise,
  IconSunset,
  IconTrain,
  IconTrainStop,
  IconWifi,
} from '@flixbus/honeycomb-icons-react';

import '@flixbus/honeycomb/dist/css/honeycomb-fonts.css';
import flixbusLogo from '@flixbus/honeycomb/dist/img/logos/svg/flixbus-white.svg';
import heroImage from './assets/hero-image.jpg';
import mapThumbnail from './assets/map-thumbnail.png';
import './App.css';
import { tripResults, type TripResult, stationSuggestions, type StationSuggestion } from './resultsData';

const normalizeText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/gi, 'ss')
    .toLowerCase();

const HighlightMatch = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <>{text}</>;
  const normText = normalizeText(text);
  const normQuery = normalizeText(query.trim());
  const idx = normText.indexOf(normQuery);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="match-highlight">{text.slice(idx, idx + normQuery.length)}</mark>
      {text.slice(idx + normQuery.length)}
    </>
  );
};

const getFilteredStations = (query: string): StationSuggestion[] => {
  const q = normalizeText(query.trim());
  if (!q) return [];
  const matches = stationSuggestions.filter((s) => normalizeText(s.name).includes(q));
  matches.sort((a, b) => {
    const aStarts = normalizeText(a.name).startsWith(q);
    const bStarts = normalizeText(b.name).startsWith(q);
    if (aStarts !== bStarts) return aStarts ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return matches.slice(0, 8);
};

const timeFilterSections = [
  {
    id: 'departure',
    title: 'Departure from: Berlin',
    options: [
      { key: 'departure-morning', label: 'Morning', time: '8 AM - 12 PM', icon: IconSunrise },
      { key: 'departure-afternoon', label: 'Afternoon', time: '12 PM - 8 PM', icon: IconSun },
      { key: 'departure-evening', label: 'Evening', time: '8 PM - 12 AM', icon: IconSunset },
      { key: 'departure-night', label: 'Night', time: '12 AM - 4 AM', icon: IconNight },
    ],
  },
  {
    id: 'arrival',
    title: 'Arrival in: Hamburg',
    options: [
      { key: 'arrival-morning', label: 'Morning', time: '8 AM - 12 PM', icon: IconSunrise },
      { key: 'arrival-afternoon', label: 'Afternoon', time: '12 PM - 8 PM', icon: IconSun },
      { key: 'arrival-evening', label: 'Evening', time: '8 PM - 12 AM', icon: IconSunset },
      { key: 'arrival-night', label: 'Night', time: '12 AM - 4 AM', icon: IconNight },
    ],
  },
] as const;

type TimeFilterKey = (typeof timeFilterSections)[number]['options'][number]['key'];
type AppPage = 'home' | 'results';
type TransportFilter = 'all' | 'train';
type SortOption = 'departure' | 'price' | 'duration' | 'best';
type TimeFilterPeriod = 'morning' | 'afternoon' | 'evening' | 'night';
type QuickFilterKey = 'main-station' | 'direct' | 'under-20';
type TripInfoText = 'LOWEST PRICE' | 'FASTEST TRIP';
type TripInfoTexts = TripInfoText[];
type PriceRange = {
  max: number;
  min: number;
};
type DurationRange = {
  max: number;
  min: number;
};

const berlinStopOptions = [
  { station: 'Berlin Alexanderplatz', icon: IconBusStop },
  { station: 'Berlin Alt-Tegel', icon: IconBusStop },
  { station: 'Berlin Central Station', icon: IconTrainStop },
  { station: 'Berlin Ostbahnhof', icon: IconTrainStop },
  { station: 'Berlin S-Treptower Park', icon: IconBusStop },
  { station: 'Berlin Südkreuz', icon: IconBusStop },
  { station: 'Berlin central bus station', icon: IconBusStop },
  { station: 'Berlin-Spandau', icon: IconTrainStop },
];

const hamburgStopOptions = [
  { station: 'Hamburg Central Station', icon: IconTrainStop },
  { station: 'Hamburg ZOB', icon: IconBusStop },
];

const mainDepartureStations = ['Berlin Central Station', 'Berlin central bus station'];
const mainArrivalStations = ['Hamburg Central Station', 'Hamburg ZOB'];

const quickFilterOptions: Array<{
  key: QuickFilterKey;
  label: string;
}> = [
  { key: 'main-station', label: 'Main stations only' },
  { key: 'direct', label: 'Direct only' },
  { key: 'under-20', label: 'Under €20' },
];

const sortOptions: Array<{
  detail: string;
  key: SortOption;
  label: string;
}> = [
  { key: 'departure', label: 'Departure', detail: 'earliest first' },
  { key: 'price', label: 'Price', detail: 'cheapest first' },
  { key: 'duration', label: 'Duration', detail: 'shortest first' },
  {
    key: 'best',
    label: 'Best',
    detail: 'cheapest and shortest with the least amount of transfers first',
  },
];

const parseTimeInMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 60) + minutes;
};

const timeFilterPeriods: Record<TimeFilterPeriod, { max: number; min: number }> = {
  morning: { min: 8 * 60, max: 12 * 60 },
  afternoon: { min: 12 * 60, max: 20 * 60 },
  evening: { min: 20 * 60, max: 24 * 60 },
  night: { min: 0, max: 4 * 60 },
};

const getTimeFilterField = (key: TimeFilterKey) => (
  key.startsWith('arrival') ? 'arrivalTime' : 'departureTime'
);

const getTimeFilterPeriod = (key: TimeFilterKey) => key.split('-')[1] as TimeFilterPeriod;

const isTimeWithinPeriod = (time: string, period: TimeFilterPeriod) => {
  const minutes = parseTimeInMinutes(time);
  const range = timeFilterPeriods[period];

  return minutes >= range.min && minutes < range.max;
};

const tripMatchesTimeFilter = (trip: TripResult, key: TimeFilterKey) => (
  isTimeWithinPeriod(trip[getTimeFilterField(key)], getTimeFilterPeriod(key))
);

const filterTripsByTimes = (trips: TripResult[], filters: TimeFilterKey[]) => {
  if (filters.length === 0) return trips;

  const departureFilters = filters.filter((key) => getTimeFilterField(key) === 'departureTime');
  const arrivalFilters = filters.filter((key) => getTimeFilterField(key) === 'arrivalTime');

  return trips.filter((trip) => {
    const matchesDeparture = departureFilters.length === 0 ||
      departureFilters.some((key) => tripMatchesTimeFilter(trip, key));
    const matchesArrival = arrivalFilters.length === 0 ||
      arrivalFilters.some((key) => tripMatchesTimeFilter(trip, key));

    return matchesDeparture && matchesArrival;
  });
};

const parseDurationInMinutes = (duration: string) => {
  const match = duration.match(/(\d+):(\d+)/);
  if (!match) return Number.MAX_SAFE_INTEGER;

  return (Number(match[1]) * 60) + Number(match[2]);
};

const parsePrice = (trip: TripResult) => Number(`${trip.priceMain}${trip.priceCents}`);
const parsePriceInCents = (trip: TripResult) => (
  (Number(trip.priceMain) * 100) + Number(trip.priceCents.replace('.', '').padEnd(2, '0'))
);
const getRoundedPrice = (trip: TripResult) => Math.round(parsePrice(trip));

const filterTripsByQuickFilters = (trips: TripResult[], filters: QuickFilterKey[]) => {
  if (filters.length === 0) return trips;

  return trips.filter((trip) => {
    const matchesMainStation = !filters.includes('main-station') || (
      mainDepartureStations.includes(trip.departureStation) &&
      mainArrivalStations.includes(trip.arrivalStation)
    );
    const matchesDirectOnly = !filters.includes('direct') || trip.connection === 'Direct';
    const matchesUnder20 = !filters.includes('under-20') || parsePrice(trip) < 20;

    return matchesMainStation && matchesDirectOnly && matchesUnder20;
  });
};

const getPriceBounds = (trips: TripResult[]): PriceRange => {
  if (trips.length === 0) return { min: 0, max: 0 };

  const prices = trips.map(getRoundedPrice);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

const clampPriceRange = (range: PriceRange, bounds: PriceRange): PriceRange => ({
  min: Math.max(bounds.min, Math.min(range.min, bounds.max)),
  max: Math.max(bounds.min, Math.min(range.max, bounds.max)),
});

const isFullPriceRange = (range: PriceRange | null, bounds: PriceRange) => (
  !range || (range.min <= bounds.min && range.max >= bounds.max)
);

const filterTripsByPrice = (trips: TripResult[], range: PriceRange | null, bounds: PriceRange) => {
  if (isFullPriceRange(range, bounds)) return trips;

  return trips.filter((trip) => {
    const roundedPrice = getRoundedPrice(trip);
    return roundedPrice >= range.min && roundedPrice <= range.max;
  });
};

const filterTripsByPriceRange = (trips: TripResult[], range: PriceRange | null) => {
  if (!range) return trips;

  return trips.filter((trip) => {
    const roundedPrice = getRoundedPrice(trip);
    return roundedPrice >= range.min && roundedPrice <= range.max;
  });
};

const formatDurationLabel = (minutes: number) => (
  `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')} hrs`
);

const getDurationBounds = (trips: TripResult[]): DurationRange => {
  if (trips.length === 0) return { min: 0, max: 0 };

  const durations = trips.map((trip) => parseDurationInMinutes(trip.duration));
  return {
    min: Math.min(...durations),
    max: Math.max(...durations),
  };
};

const clampDurationRange = (range: DurationRange, bounds: DurationRange): DurationRange => ({
  min: Math.max(bounds.min, Math.min(range.min, bounds.max)),
  max: Math.max(bounds.min, Math.min(range.max, bounds.max)),
});

const isFullDurationRange = (range: DurationRange | null, bounds: DurationRange) => (
  !range || (range.min <= bounds.min && range.max >= bounds.max)
);

const filterTripsByDuration = (
  trips: TripResult[],
  range: DurationRange | null,
  bounds: DurationRange,
) => {
  if (isFullDurationRange(range, bounds)) return trips;

  return trips.filter((trip) => {
    const duration = parseDurationInMinutes(trip.duration);
    return duration >= range.min && duration <= range.max;
  });
};

const filterTripsByDurationRange = (trips: TripResult[], range: DurationRange | null) => {
  if (!range) return trips;

  return trips.filter((trip) => {
    const duration = parseDurationInMinutes(trip.duration);
    return duration >= range.min && duration <= range.max;
  });
};

const filterTripsByStops = (
  trips: TripResult[],
  departureStops: string[],
  arrivalStops: string[],
) => trips.filter((trip) => {
  const matchesDeparture = departureStops.length === 0 || departureStops.includes(trip.departureStation);
  const matchesArrival = arrivalStops.length === 0 || arrivalStops.includes(trip.arrivalStation);

  return matchesDeparture && matchesArrival;
});

const toIdSlug = (value: string) => (
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
);

const sortTripResults = (trips: TripResult[], sortOption: SortOption) => {
  const withOriginalIndex = trips.map((trip, index) => ({ index, trip }));

  if (sortOption === 'best') {
    const getTransferPenalty = (trip: TripResult) => (trip.connection === 'Direct' ? 0 : 1);
    const getBestScore = (trip: TripResult) => (
      parsePrice(trip) +
      parseDurationInMinutes(trip.duration) * 0.05 +
      getTransferPenalty(trip) * 5
    );

    return withOriginalIndex
      .sort((first, second) => {
        const firstTransferPenalty = getTransferPenalty(first.trip);
        const secondTransferPenalty = getTransferPenalty(second.trip);

        return getBestScore(first.trip) - getBestScore(second.trip) ||
          parsePrice(first.trip) - parsePrice(second.trip) ||
          parseDurationInMinutes(first.trip.duration) - parseDurationInMinutes(second.trip.duration) ||
          firstTransferPenalty - secondTransferPenalty ||
          parseTimeInMinutes(first.trip.departureTime) - parseTimeInMinutes(second.trip.departureTime) ||
          first.index - second.index;
      })
      .map(({ trip }) => trip);
  }

  return withOriginalIndex
    .sort((first, second) => {
      if (sortOption === 'price') {
        return parsePrice(first.trip) - parsePrice(second.trip) ||
          parseTimeInMinutes(first.trip.departureTime) - parseTimeInMinutes(second.trip.departureTime) ||
          first.index - second.index;
      }

      if (sortOption === 'duration') {
        return parseDurationInMinutes(first.trip.duration) - parseDurationInMinutes(second.trip.duration) ||
          parsePrice(first.trip) - parsePrice(second.trip) ||
          parseTimeInMinutes(first.trip.departureTime) - parseTimeInMinutes(second.trip.departureTime) ||
          first.index - second.index;
      }

      return parseTimeInMinutes(first.trip.departureTime) - parseTimeInMinutes(second.trip.departureTime) ||
        first.index - second.index;
    })
    .map(({ trip }) => trip);
};

const lowestTripPriceInCents = Math.min(...tripResults.map(parsePriceInCents));
const fastestTripDurationInMinutes = Math.min(...tripResults.map((trip) => parseDurationInMinutes(trip.duration)));

const getTripInfoTexts = (trip: TripResult): TripInfoTexts => {
  const infoTexts: TripInfoTexts = [];

  if (parsePriceInCents(trip) === lowestTripPriceInCents) infoTexts.push('LOWEST PRICE');
  if (parseDurationInMinutes(trip.duration) === fastestTripDurationInMinutes) infoTexts.push('FASTEST TRIP');

  return infoTexts;
};

const isRecommendedTrip = (trip: TripResult) => (
  trip.departureTime === '18:15' &&
  trip.duration === '3:15 hrs' &&
  trip.arrivalTime === '21:30' &&
  trip.departureStation === 'Berlin central bus station' &&
  trip.arrivalStation === 'Hamburg ZOB' &&
  trip.mode === 'Bus' &&
  trip.connection === 'Direct' &&
  trip.priceMain === '13' &&
  trip.priceCents === '.48'
);

const recommendedTrip = tripResults.find(isRecommendedTrip);

const ScrollableFilterRow = ({
  ariaLabel,
  children,
  className,
}: {
  ariaLabel?: string;
  children: ReactNode;
  className: string;
}) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({
    hasDragged: false,
    isDragging: false,
    scrollLeft: 0,
    startX: 0,
    suppressClickUntil: 0,
  });

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    if (!row || row.scrollWidth <= row.clientWidth) return;

    dragState.current = {
      hasDragged: false,
      isDragging: true,
      scrollLeft: row.scrollLeft,
      startX: event.clientX,
      suppressClickUntil: dragState.current.suppressClickUntil,
    };
    row.dataset.dragging = 'false';
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    if (!row || !dragState.current.isDragging) return;

    const dragDistance = event.clientX - dragState.current.startX;
    if (Math.abs(dragDistance) <= 4) return;

    if (!dragState.current.hasDragged) {
      dragState.current.hasDragged = true;
      row.dataset.dragging = 'true';
      try {
        row.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is best effort; drag scrolling still works without it.
      }
    }
    row.scrollLeft = dragState.current.scrollLeft - dragDistance;
    event.preventDefault();
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    if (!row || !dragState.current.isDragging) return;

    dragState.current.isDragging = false;
    if (dragState.current.hasDragged) {
      dragState.current.suppressClickUntil = Date.now() + 250;
    }
    row.dataset.dragging = 'false';
    try {
      if (row.hasPointerCapture(event.pointerId)) {
        row.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore release failures from browsers that did not grant capture.
    }
  };

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (Date.now() > dragState.current.suppressClickUntil) return;

    event.preventDefault();
    event.stopPropagation();
    dragState.current.hasDragged = false;
    dragState.current.suppressClickUntil = 0;
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    if (!row || row.scrollWidth <= row.clientWidth) return;

    const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const nextScrollLeft = row.scrollLeft + horizontalDelta;
    const maxScrollLeft = row.scrollWidth - row.clientWidth;
    const canScroll =
      (horizontalDelta < 0 && row.scrollLeft > 0) ||
      (horizontalDelta > 0 && row.scrollLeft < maxScrollLeft);

    if (!canScroll) return;

    event.preventDefault();
    row.scrollLeft = Math.max(0, Math.min(maxScrollLeft, nextScrollLeft));
  };

  return (
    <div
      ref={rowRef}
      className={className}
      aria-label={ariaLabel}
      data-dragging="false"
      onClickCapture={handleClickCapture}
      onPointerCancel={finishDrag}
      onPointerDown={handlePointerDown}
      onPointerLeave={finishDrag}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onWheel={handleWheel}
    >
      {children}
    </div>
  );
};

const TripCard = ({
  anchorRef,
  infoTexts = [],
  isNewlyLoaded = false,
  isRecommended = false,
  trip,
}: {
  anchorRef?: Ref<HTMLElement>;
  infoTexts?: TripInfoTexts;
  isNewlyLoaded?: boolean;
  isRecommended?: boolean;
  trip: TripResult;
}) => {
  const TransportIcon = trip.mode === 'Train' ? IconTrain : IconBus;
  const hasInfoTexts = infoTexts.length > 0;

  return (
    <article
      className={`trip-card${hasInfoTexts ? ' trip-card--with-info' : ''}${isRecommended ? ' trip-card--recommended' : ''}${isNewlyLoaded ? ' trip-card--newly-loaded' : ''}`}
      ref={anchorRef}
      aria-label={`${trip.departureTime} ${trip.departureStation} to ${trip.arrivalStation}${hasInfoTexts ? `, ${infoTexts.join(', ')}` : ''}`}
    >
      <div className="trip-card-info">
        <div className="trip-times">
          <div className="trip-departure">
            <span className="trip-time">{trip.departureTime}</span>
            <span className="trip-duration-line">
              <span className="trip-duration">{trip.duration}</span>
            </span>
          </div>
          <div className="trip-arrival">
            <span className="trip-time">{trip.arrivalTime}</span>
          </div>
        </div>

        <div className="trip-stops">
          <span>{trip.departureStation}</span>
          <span>{trip.arrivalStation}</span>
        </div>
      </div>

      <div className="trip-card-actions">
        <div className="trip-details">
          <button className="connection-pill" type="button">
            <Icon InlineIcon={TransportIcon} aria-hidden="true" size={3} />
            <span>{trip.mode}</span>
            <span className="connection-separator" aria-hidden="true" />
            <span>{trip.connection}</span>
            <Icon InlineIcon={IconArrowDown} aria-hidden="true" size={2} />
          </button>

          <div className="amenities" aria-label="Amenities">
            <Icon InlineIcon={IconWifi} aria-hidden="true" size={3} />
            <Icon InlineIcon={IconSocket} aria-hidden="true" size={3} />
          </div>
        </div>

        <div className="price-and-cta">
          <div className="trip-price" aria-label={`From €${trip.priceMain}${trip.priceCents}`}>
            <span className="price-currency">€</span>
            <span className="price-main">{trip.priceMain}</span>
            <span className="price-cents">{trip.priceCents}</span>
          </div>
          <Button
            aria-label="Select trip"
            appearance="primary"
            display="square"
            extraClasses="trip-cta-button"
            type="button"
          >
            <Icon InlineIcon={IconArrowRight} aria-hidden="true" size={4} />
          </Button>
        </div>
      </div>

      {isRecommended && (
        <div className="recommended-trip-badge">BEST OVERALL</div>
      )}

      {hasInfoTexts && (
        <div className="trip-card-info-text-list">
          {infoTexts.map((infoText) => (
            <span className="trip-card-info-text" key={infoText}>{infoText}</span>
          ))}
        </div>
      )}
    </article>
  );
};

const RecommendedTripCard = ({ trip }: { trip: TripResult }) => (
  <TripCard
    infoTexts={getTripInfoTexts(trip)}
    isRecommended
    trip={trip}
  />
);

const SearchResultsPage = ({
  appliedTimeFilters,
  onAppliedTimeFiltersChange,
  onBackToHome,
}: {
  appliedTimeFilters: TimeFilterKey[];
  onAppliedTimeFiltersChange: (filters: TimeFilterKey[]) => void;
  onBackToHome: () => void;
}) => {
  const [transportFilter, setTransportFilter] = useState<TransportFilter>('all');
  const [appliedSort, setAppliedSort] = useState<SortOption>('departure');
  const [draftSort, setDraftSort] = useState<SortOption>('departure');
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);
  const [appliedPriceRange, setAppliedPriceRange] = useState<PriceRange | null>(null);
  const [draftPriceRange, setDraftPriceRange] = useState<PriceRange | null>(null);
  const [isPricePanelOpen, setIsPricePanelOpen] = useState(false);
  const [appliedDurationRange, setAppliedDurationRange] = useState<DurationRange | null>(null);
  const [draftDurationRange, setDraftDurationRange] = useState<DurationRange | null>(null);
  const [appliedBerlinStops, setAppliedBerlinStops] = useState<string[]>([]);
  const [draftBerlinStops, setDraftBerlinStops] = useState<string[]>([]);
  const [appliedHamburgStops, setAppliedHamburgStops] = useState<string[]>([]);
  const [draftHamburgStops, setDraftHamburgStops] = useState<string[]>([]);
  const [appliedShowUnavailableTrips, setAppliedShowUnavailableTrips] = useState(false);
  const [draftShowUnavailableTrips, setDraftShowUnavailableTrips] = useState(false);
  const [isAllFiltersPanelOpen, setIsAllFiltersPanelOpen] = useState(false);
  const [quickFilters, setQuickFilters] = useState<QuickFilterKey[]>([]);
  const [draftResultsTimeFilters, setDraftResultsTimeFilters] = useState<TimeFilterKey[]>([]);
  const [isResultsTimesPanelOpen, setIsResultsTimesPanelOpen] = useState(false);
  const [isLoadingMoreResults, setIsLoadingMoreResults] = useState(false);
  const [visibleRegularResultCount, setVisibleRegularResultCount] = useState(5);
  const infiniteScrollTriggerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreTimeoutRef = useRef<number | null>(null);
  const transportFilteredResults = transportFilter === 'train'
    ? tripResults.filter((trip) => trip.mode === 'Train')
    : tripResults;
  const quickFilteredResults = filterTripsByQuickFilters(transportFilteredResults, quickFilters);
  const timeFilteredResults = filterTripsByTimes(quickFilteredResults, appliedTimeFilters);
  const stopFilteredResults = filterTripsByStops(timeFilteredResults, appliedBerlinStops, appliedHamburgStops);
  const durationBoundsBaseResults = filterTripsByPriceRange(stopFilteredResults, appliedPriceRange);
  const durationBounds = getDurationBounds(durationBoundsBaseResults);
  const isDurationFilterDisabled = !appliedDurationRange && durationBounds.min >= durationBounds.max;
  const durationFilteredResults = filterTripsByDurationRange(stopFilteredResults, appliedDurationRange);
  const priceBounds = getPriceBounds(durationFilteredResults);
  const isPriceFilterDisabled = !appliedPriceRange && priceBounds.min >= priceBounds.max;
  const priceFilteredResults = filterTripsByPriceRange(durationFilteredResults, appliedPriceRange);
  const sortedResults = sortTripResults(priceFilteredResults, appliedSort);
  const regularResults = recommendedTrip
    ? sortedResults.filter((trip) => !isRecommendedTrip(trip))
    : sortedResults;
  const visibleRegularResults = regularResults.slice(0, visibleRegularResultCount);
  const hasMoreRegularResults = visibleRegularResultCount < regularResults.length;
  const newlyLoadedStartIndex = Math.max(0, visibleRegularResultCount - 5);
  const appliedSortLabel = sortOptions.find((option) => option.key === appliedSort)?.label ?? 'Departure';
  const isResultsTimeFilterApplied = appliedTimeFilters.length > 0;
  const activeDurationRange = appliedDurationRange;
  const appliedAllFiltersCount = [
    Boolean(activeDurationRange),
    appliedBerlinStops.length > 0,
    appliedHamburgStops.length > 0,
    appliedShowUnavailableTrips,
  ].filter(Boolean).length;
  const isAllFiltersApplied = appliedAllFiltersCount > 0;
  const activePriceRange = appliedPriceRange;
  const effectiveDraftPriceRange = priceBounds.min >= priceBounds.max
    ? priceBounds
    : clampPriceRange(draftPriceRange ?? appliedPriceRange ?? priceBounds, priceBounds);
  const draftPriceFilteredResults = filterTripsByPriceRange(durationFilteredResults, effectiveDraftPriceRange);
  const timePanelStopFilteredResults = filterTripsByStops(
    quickFilteredResults,
    appliedBerlinStops,
    appliedHamburgStops,
  );
  const timePanelDurationFilteredResults = filterTripsByDurationRange(
    timePanelStopFilteredResults,
    appliedDurationRange,
  );
  const timePanelBaseResults = filterTripsByPriceRange(timePanelDurationFilteredResults, appliedPriceRange);
  const draftTimeFilteredResults = filterTripsByTimes(timePanelBaseResults, draftResultsTimeFilters);
  const allFiltersDurationBoundsBaseResults = filterTripsByPriceRange(timeFilteredResults, appliedPriceRange);
  const allFiltersDurationBounds = getDurationBounds(allFiltersDurationBoundsBaseResults);
  const isAllFiltersDurationDisabled = allFiltersDurationBounds.min >= allFiltersDurationBounds.max;
  const effectiveDraftDurationRange = isAllFiltersDurationDisabled
    ? allFiltersDurationBounds
    : clampDurationRange(draftDurationRange ?? appliedDurationRange ?? allFiltersDurationBounds, allFiltersDurationBounds);

  const getAllFiltersDraftResults = (departureStops: string[], arrivalStops: string[]) => {
    const draftStopResults = filterTripsByStops(timeFilteredResults, departureStops, arrivalStops);
    const draftDurationResults = filterTripsByDurationRange(
      draftStopResults,
      isAllFiltersDurationDisabled ? null : effectiveDraftDurationRange,
    );

    return filterTripsByPriceRange(draftDurationResults, appliedPriceRange);
  };

  const allFiltersDraftResults = getAllFiltersDraftResults(draftBerlinStops, draftHamburgStops);
  const getBerlinStopOptionTripCount = (station: string) => (
    getAllFiltersDraftResults([station], draftHamburgStops).length
  );
  const getHamburgStopOptionTripCount = (station: string) => (
    getAllFiltersDraftResults(draftBerlinStops, [station]).length
  );
  const getResultsForQuickFilterSelection = (candidateQuickFilters: QuickFilterKey[]) => {
    const candidateQuickFilteredResults = filterTripsByQuickFilters(transportFilteredResults, candidateQuickFilters);
    const candidateTimeFilteredResults = filterTripsByTimes(candidateQuickFilteredResults, appliedTimeFilters);
    const candidateStopFilteredResults = filterTripsByStops(
      candidateTimeFilteredResults,
      appliedBerlinStops,
      appliedHamburgStops,
    );
    const candidateDurationFilteredResults = filterTripsByDurationRange(
      candidateStopFilteredResults,
      appliedDurationRange,
    );

    return filterTripsByPriceRange(candidateDurationFilteredResults, appliedPriceRange);
  };
  const getQuickFilterCandidateCount = (key: QuickFilterKey) => (
    getResultsForQuickFilterSelection(
      quickFilters.includes(key) ? quickFilters : [...quickFilters, key],
    ).length
  );

  useEffect(() => () => {
    if (loadMoreTimeoutRef.current === null) return;

    window.clearTimeout(loadMoreTimeoutRef.current);
  }, []);

  useEffect(() => {
    setVisibleRegularResultCount(5);
  }, [
    appliedBerlinStops,
    appliedDurationRange,
    appliedHamburgStops,
    appliedPriceRange,
    appliedSort,
    appliedTimeFilters,
    quickFilters,
    transportFilter,
  ]);

  useEffect(() => {
    if (!hasMoreRegularResults || sortedResults.length === 0) return;

    const trigger = infiniteScrollTriggerRef.current;
    if (!trigger) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || isLoadingMoreResults || loadMoreTimeoutRef.current !== null) return;

        setIsLoadingMoreResults(true);
        loadMoreTimeoutRef.current = window.setTimeout(() => {
          setVisibleRegularResultCount((currentCount) => (
            Math.min(currentCount + 5, regularResults.length)
          ));
          setIsLoadingMoreResults(false);
          loadMoreTimeoutRef.current = null;
        }, 1200);
      },
      { rootMargin: '24px 0px' },
    );

    observer.observe(trigger);

    return () => observer.disconnect();
  }, [hasMoreRegularResults, isLoadingMoreResults, regularResults.length, sortedResults.length]);

  const stopLoadingMoreResults = () => {
    if (loadMoreTimeoutRef.current !== null) {
      window.clearTimeout(loadMoreTimeoutRef.current);
      loadMoreTimeoutRef.current = null;
    }
    setIsLoadingMoreResults(false);
  };

  const resetVisibleResults = () => {
    stopLoadingMoreResults();
    setVisibleRegularResultCount(5);
  };

  const handleTransportFilterChange = (nextTransportFilter: TransportFilter) => {
    if (nextTransportFilter === transportFilter) return;

    resetVisibleResults();
    setIsAllFiltersPanelOpen(false);
    setIsSortPanelOpen(false);
    setIsResultsTimesPanelOpen(false);
    setIsPricePanelOpen(false);
    setTransportFilter(nextTransportFilter);
  };

  const toggleQuickFilter = (key: QuickFilterKey) => {
    setQuickFilters((currentFilters) => (
      currentFilters.includes(key)
        ? currentFilters.filter((filterKey) => filterKey !== key)
        : [...currentFilters, key]
    ));
    setIsAllFiltersPanelOpen(false);
    setIsSortPanelOpen(false);
    setIsResultsTimesPanelOpen(false);
    setIsPricePanelOpen(false);
    resetVisibleResults();
  };

  useEffect(() => {
    if (!isAllFiltersPanelOpen || isAllFiltersDurationDisabled || !draftDurationRange) return;

    const nextDraftRange = clampDurationRange(draftDurationRange, allFiltersDurationBounds);
    if (nextDraftRange.min !== draftDurationRange.min || nextDraftRange.max !== draftDurationRange.max) {
      setDraftDurationRange(nextDraftRange);
    }
  }, [
    allFiltersDurationBounds.max,
    allFiltersDurationBounds.min,
    draftDurationRange,
    isAllFiltersDurationDisabled,
    isAllFiltersPanelOpen,
  ]);

  useEffect(() => {
    if (!isPricePanelOpen || priceBounds.min >= priceBounds.max || !draftPriceRange) return;

    const nextDraftRange = clampPriceRange(draftPriceRange, priceBounds);
    if (nextDraftRange.min !== draftPriceRange.min || nextDraftRange.max !== draftPriceRange.max) {
      setDraftPriceRange(nextDraftRange);
    }
  }, [draftPriceRange, isPricePanelOpen, priceBounds.max, priceBounds.min]);

  const openSortPanel = () => {
    setDraftSort(appliedSort);
    setIsAllFiltersPanelOpen(false);
    setIsResultsTimesPanelOpen(false);
    setIsPricePanelOpen(false);
    setIsSortPanelOpen(true);
  };

  const resetSortPanel = () => setDraftSort('departure');

  const cancelSortPanel = () => {
    setDraftSort(appliedSort);
    setIsSortPanelOpen(false);
  };

  const confirmSortPanel = () => {
    const hasSortChanged = draftSort !== appliedSort;

    setAppliedSort(draftSort);
    setIsSortPanelOpen(false);
    if (!hasSortChanged) return;

    resetVisibleResults();
  };

  const openPricePanel = () => {
    if (isPriceFilterDisabled) return;

    setDraftPriceRange(effectiveDraftPriceRange);
    setIsAllFiltersPanelOpen(false);
    setIsSortPanelOpen(false);
    setIsResultsTimesPanelOpen(false);
    setIsPricePanelOpen(true);
  };

  const clearPriceFilter = () => {
    setAppliedPriceRange(null);
    setDraftPriceRange(priceBounds);
    setIsPricePanelOpen(false);
    resetVisibleResults();
  };

  const handlePriceTagClick = () => {
    if (activePriceRange) {
      clearPriceFilter();
      return;
    }

    openPricePanel();
  };

  const resetPricePanel = () => setDraftPriceRange(priceBounds);

  const cancelPricePanel = () => {
    setDraftPriceRange(
      priceBounds.min >= priceBounds.max
        ? priceBounds
        : clampPriceRange(appliedPriceRange ?? priceBounds, priceBounds),
    );
    setIsPricePanelOpen(false);
  };

  const confirmPricePanel = () => {
    if (priceBounds.min >= priceBounds.max) {
      setAppliedPriceRange(null);
      setIsPricePanelOpen(false);
      return;
    }

    const nextPriceRange = clampPriceRange(effectiveDraftPriceRange, priceBounds);

    setAppliedPriceRange(isFullPriceRange(nextPriceRange, priceBounds) ? null : nextPriceRange);
    setIsPricePanelOpen(false);
    resetVisibleResults();
  };

  const updateDraftPriceMin = (nextMin: number) => {
    setDraftPriceRange((currentRange) => {
      const current = currentRange ?? priceBounds;
      return {
        min: Math.min(nextMin, current.max),
        max: current.max,
      };
    });
  };

  const updateDraftPriceMax = (nextMax: number) => {
    setDraftPriceRange((currentRange) => {
      const current = currentRange ?? priceBounds;
      return {
        min: current.min,
        max: Math.max(nextMax, current.min),
      };
    });
  };

  const openAllFiltersPanel = () => {
    setDraftBerlinStops(appliedBerlinStops);
    setDraftHamburgStops(appliedHamburgStops);
    setDraftShowUnavailableTrips(appliedShowUnavailableTrips);
    setDraftDurationRange(
      isAllFiltersDurationDisabled
        ? null
        : clampDurationRange(appliedDurationRange ?? allFiltersDurationBounds, allFiltersDurationBounds),
    );
    setIsSortPanelOpen(false);
    setIsResultsTimesPanelOpen(false);
    setIsPricePanelOpen(false);
    setIsAllFiltersPanelOpen(true);
  };

  const resetAllFiltersPanel = () => {
    setDraftBerlinStops([]);
    setDraftHamburgStops([]);
    setDraftShowUnavailableTrips(false);
    setDraftDurationRange(isAllFiltersDurationDisabled ? null : allFiltersDurationBounds);
  };

  const cancelAllFiltersPanel = () => {
    setDraftBerlinStops(appliedBerlinStops);
    setDraftHamburgStops(appliedHamburgStops);
    setDraftShowUnavailableTrips(appliedShowUnavailableTrips);
    setDraftDurationRange(
      isAllFiltersDurationDisabled
        ? null
        : clampDurationRange(appliedDurationRange ?? allFiltersDurationBounds, allFiltersDurationBounds),
    );
    setIsAllFiltersPanelOpen(false);
  };

  const confirmAllFiltersPanel = () => {
    const nextDurationRange = isAllFiltersDurationDisabled
      ? null
      : clampDurationRange(effectiveDraftDurationRange, allFiltersDurationBounds);

    setAppliedBerlinStops(draftBerlinStops);
    setAppliedHamburgStops(draftHamburgStops);
    setAppliedShowUnavailableTrips(draftShowUnavailableTrips);
    setAppliedDurationRange(
      isFullDurationRange(nextDurationRange, allFiltersDurationBounds) ? null : nextDurationRange,
    );
    setIsAllFiltersPanelOpen(false);
    resetVisibleResults();
  };

  const updateDraftDurationMin = (nextMin: number) => {
    if (isAllFiltersDurationDisabled) return;

    setDraftDurationRange((currentRange) => {
      const current = clampDurationRange(currentRange ?? allFiltersDurationBounds, allFiltersDurationBounds);
      return {
        min: Math.min(nextMin, current.max),
        max: current.max,
      };
    });
  };

  const updateDraftDurationMax = (nextMax: number) => {
    if (isAllFiltersDurationDisabled) return;

    setDraftDurationRange((currentRange) => {
      const current = clampDurationRange(currentRange ?? allFiltersDurationBounds, allFiltersDurationBounds);
      return {
        min: current.min,
        max: Math.max(nextMax, current.min),
      };
    });
  };

  const toggleDraftBerlinStop = (station: string) => {
    setDraftBerlinStops((currentStops) => (
      currentStops.includes(station)
        ? currentStops.filter((currentStation) => currentStation !== station)
        : [...currentStops, station]
    ));
  };

  const toggleDraftHamburgStop = (station: string) => {
    setDraftHamburgStops((currentStops) => (
      currentStops.includes(station)
        ? currentStops.filter((currentStation) => currentStation !== station)
        : [...currentStops, station]
    ));
  };

  const openResultsTimesPanel = () => {
    setDraftResultsTimeFilters(appliedTimeFilters);
    setIsAllFiltersPanelOpen(false);
    setIsSortPanelOpen(false);
    setIsPricePanelOpen(false);
    setIsResultsTimesPanelOpen(true);
  };

  const clearResultsTimesFilter = () => {
    setDraftResultsTimeFilters([]);
    onAppliedTimeFiltersChange([]);
    setIsResultsTimesPanelOpen(false);
    resetVisibleResults();
  };

  const handleResultsTimesTagClick = () => {
    if (isResultsTimeFilterApplied) {
      clearResultsTimesFilter();
      return;
    }

    openResultsTimesPanel();
  };

  const cancelResultsTimesPanel = () => {
    setDraftResultsTimeFilters(appliedTimeFilters);
    setIsResultsTimesPanelOpen(false);
  };

  const confirmResultsTimesPanel = () => {
    onAppliedTimeFiltersChange(draftResultsTimeFilters);
    setIsResultsTimesPanelOpen(false);
    resetVisibleResults();
  };

  const resetResultsTimesPanel = () => setDraftResultsTimeFilters([]);

  const toggleDraftResultsTimeFilter = (key: TimeFilterKey) => {
    setDraftResultsTimeFilters((currentFilters) => (
      currentFilters.includes(key)
        ? currentFilters.filter((filterKey) => filterKey !== key)
        : [...currentFilters, key]
    ));
  };

  const getTimeOptionCandidateFilters = (key: TimeFilterKey) => {
    const optionField = getTimeFilterField(key);
    const oppositeFieldFilters = draftResultsTimeFilters.filter(
      (filterKey) => getTimeFilterField(filterKey) !== optionField,
    );

    return [...oppositeFieldFilters, key];
  };

  const getTimeOptionTripCount = (key: TimeFilterKey) => (
    filterTripsByTimes(timePanelBaseResults, getTimeOptionCandidateFilters(key)).length
  );

  const isAllTransportSelected = transportFilter === 'all';
  const isTrainSelected = transportFilter === 'train';

  return (
    <main className="search-homepage results-page" aria-label="Search results">
      <section className="results-search-header" aria-label="Search summary">
        <HeaderBar extraClasses="results-header-bar">
          <Button
            aria-label="Back"
            display="square"
            extraClasses="results-header-button"
            onClick={onBackToHome}
            type="button"
          >
            <Icon InlineIcon={IconArrowLeft} aria-hidden="true" size={4} />
          </Button>

          <div className="results-route-title">
            <span>Berlin</span>
            <Icon InlineIcon={IconArrowRight} aria-hidden="true" size={3} />
            <span>Hamburg</span>
          </div>

          <Button
            aria-label="Edit search"
            display="square"
            extraClasses="results-header-button results-edit-button"
            type="button"
          >
            <Icon InlineIcon={IconEditSolid} aria-hidden="true" size={4} />
          </Button>
        </HeaderBar>

        <div className="date-row" aria-label="Travel dates">
          <button className="date-pill date-pill--muted" type="button">Sat, 19 Nov</button>
          <button className="date-pill date-pill--selected" type="button">Sun, 20 Nov</button>
          <button className="date-pill" type="button">Mon, 21 Nov</button>
        </div>
      </section>

      <section className="results-controls" aria-label="Filters">
        <div className="transport-switcher" role="tablist" aria-label="Transport type">
          <button
            className={`transport-tab${isAllTransportSelected ? ' transport-tab--active' : ''}`}
            type="button"
            role="tab"
            aria-selected={isAllTransportSelected}
            onClick={() => handleTransportFilterChange('all')}
          >
            <Icon InlineIcon={IconBusTrain} aria-hidden="true" size={5} />
            <span>Bus &amp; Train</span>
          </button>
          <button
            className={`transport-tab${isTrainSelected ? ' transport-tab--active' : ''}`}
            type="button"
            role="tab"
            aria-selected={isTrainSelected}
            onClick={() => handleTransportFilterChange('train')}
          >
            <Icon InlineIcon={IconTrain} aria-hidden="true" size={5} />
            <span>Train</span>
          </button>
        </div>

        <ScrollableFilterRow className="results-filter-row" ariaLabel="Main filters">
          <button
            aria-label={isAllFiltersApplied ? `All filters, ${appliedAllFiltersCount} applied` : 'All filters'}
            aria-haspopup="dialog"
            aria-pressed={isAllFiltersApplied}
            className={`results-tag results-tag--icon${isAllFiltersApplied ? ' results-tag--selected results-tag--with-count' : ''}`}
            onClick={openAllFiltersPanel}
            type="button"
          >
            <Icon InlineIcon={IconFilter} aria-hidden="true" size={4} />
            {isAllFiltersApplied && (
              <span className="all-filters-count-badge" aria-hidden="true">
                {appliedAllFiltersCount}
              </span>
            )}
            <span className="visually-hidden">All filters</span>
          </button>
          <Tag
            Elem="button"
            aria-haspopup="dialog"
            display="outlined"
            extraClasses="results-tag"
            onClick={openSortPanel}
            tagTextColor="#353535"
            type="button"
          >
            <Icon InlineIcon={IconSort} aria-hidden="true" size={4} />
            Sort: {appliedSortLabel}
          </Tag>
          <Tag
            Elem="button"
            appearance={isResultsTimeFilterApplied ? 'selected' : undefined}
            aria-haspopup={isResultsTimeFilterApplied ? undefined : 'dialog'}
            aria-pressed={isResultsTimeFilterApplied}
            display={isResultsTimeFilterApplied ? 'subtle' : 'outlined'}
            extraClasses={`results-tag${isResultsTimeFilterApplied ? ' results-tag--selected' : ''}`}
            onClick={handleResultsTimesTagClick}
            tagTextColor="#353535"
            type="button"
          >
            Times
            <Icon InlineIcon={isResultsTimeFilterApplied ? IconClose : IconArrowDown} aria-hidden="true" size={3} />
          </Tag>
          <Tag
            Elem="button"
            appearance={activePriceRange ? 'selected' : undefined}
            aria-disabled={isPriceFilterDisabled && !activePriceRange}
            aria-haspopup={activePriceRange ? undefined : 'dialog'}
            aria-pressed={Boolean(activePriceRange)}
            disabled={isPriceFilterDisabled && !activePriceRange}
            display={activePriceRange ? 'subtle' : 'outlined'}
            extraClasses={`results-tag${activePriceRange ? ' results-tag--selected' : ''}${isPriceFilterDisabled && !activePriceRange ? ' results-tag--disabled' : ''}`}
            onClick={handlePriceTagClick}
            tagTextColor="#353535"
            type="button"
          >
            Price
            <Icon InlineIcon={activePriceRange ? IconClose : IconArrowDown} aria-hidden="true" size={3} />
          </Tag>
        </ScrollableFilterRow>
      </section>

      <section className="quick-filters" aria-label="Quick filters">
        <ScrollableFilterRow className="quick-filter-row">
          {quickFilterOptions.map((option) => {
            const isSelected = quickFilters.includes(option.key);
            const isDisabled = !isSelected && getQuickFilterCandidateCount(option.key) === 0;

            return (
              <Tag
                Elem="button"
                appearance={isSelected ? 'selected' : undefined}
                aria-disabled={isDisabled}
                aria-pressed={isSelected}
                disabled={isDisabled}
                display={isSelected ? 'subtle' : 'outlined'}
                extraClasses={`results-tag${isSelected ? ' results-tag--selected' : ''}${isDisabled ? ' results-tag--disabled' : ''}`}
                key={option.key}
                onClick={() => toggleQuickFilter(option.key)}
                tagTextColor="#353535"
                type="button"
              >
                {option.label}
                {isSelected && <Icon InlineIcon={IconClose} aria-hidden="true" size={3} />}
              </Tag>
            );
          })}
        </ScrollableFilterRow>
      </section>

      <section className="results-list-section" aria-label="Available trips">
        <Text Elem="p" small extraClasses="results-count">{sortedResults.length} results</Text>

        {sortedResults.length === 0 ? (
          <div className="results-empty-state" role="status">
            <Text Elem="p" extraClasses="results-empty-message">
              There are no results for the filters applied. Try adjusting your filters to see more trips.
            </Text>
          </div>
        ) : (
          <div className="trip-list">
            {recommendedTrip && <RecommendedTripCard trip={recommendedTrip} />}

            {visibleRegularResults.map((trip, index) => (
              <TripCard
                infoTexts={getTripInfoTexts(trip)}
                isNewlyLoaded={visibleRegularResultCount > 5 && index >= newlyLoadedStartIndex}
                key={`${trip.departureTime}-${trip.arrivalTime}-${trip.departureStation}-${index}`}
                trip={trip}
              />
            ))}

            {hasMoreRegularResults && (
              <div
                ref={infiniteScrollTriggerRef}
                className={`infinite-results-loader${isLoadingMoreResults ? ' infinite-results-loader--active' : ''}`}
                aria-live="polite"
                role="status"
              >
                {isLoadingMoreResults ? (
                  <>
                    <Icon InlineIcon={IconRefresh} aria-hidden="true" size={4} />
                    <span>Loading more trips...</span>
                  </>
                ) : (
                  <span className="visually-hidden">Scroll to load more trips</span>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {isAllFiltersPanelOpen && <div className="results-modal-overlay" aria-hidden="true" onClick={cancelAllFiltersPanel} />}

      {isAllFiltersPanelOpen && (
        <Panel
          active
          disableBodyStyleModifications
          disableFocusManagement
          extraClasses="all-filters-panel"
          id="all-filters-panel"
          onOverlayClick={cancelAllFiltersPanel}
          position="bottom"
          style={{ top: 'auto', bottom: 0 }}
        >
          <PanelHeader>
            <div className="filter-panel-header-content">
              <span className="all-filters-panel-heading">Filters</span>
              <Button
                appearance="secondary"
                extraClasses="panel-reset-button"
                onClick={resetAllFiltersPanel}
                type="button"
              >
                Reset
              </Button>
            </div>
          </PanelHeader>
          <PanelContent extraClasses="all-filters-panel-content">
            <section className="all-filters-section" aria-label="Trip duration">
              <Text Elem="h4" extraClasses="all-filters-section-title">
                Trip duration
              </Text>
              <div className="duration-range-shell">
                <Range
                  aria-label="Minimum trip duration"
                  disabled={isAllFiltersDurationDisabled}
                  displayValues
                  extraClasses="duration-range-control"
                  format={formatDurationLabel}
                  id="trip-duration-range"
                  max={allFiltersDurationBounds.max}
                  min={allFiltersDurationBounds.min}
                  onChange={(event) => updateDraftDurationMin(Number(event.target.value))}
                  onInput={(event) => updateDraftDurationMin(Number((event.target as HTMLInputElement).value))}
                  rangeEnd={{
                    'aria-label': 'Maximum trip duration',
                    disabled: isAllFiltersDurationDisabled,
                    onChange: (event) => updateDraftDurationMax(Number(event.target.value)),
                    onInput: (event) => updateDraftDurationMax(Number((event.target as HTMLInputElement).value)),
                    value: effectiveDraftDurationRange.max,
                  }}
                  step={1}
                  value={effectiveDraftDurationRange.min}
                />
              </div>
            </section>

            <Divider extraClasses="all-filters-divider" />

            <section className="all-filters-section all-filters-section--compact" aria-label="Unavailable trips">
              <Checkbox
                checked={draftShowUnavailableTrips}
                extraClasses="all-filter-checkbox"
                id="show-unavailable-trips"
                label="Show unavailable trips"
                name="show-unavailable-trips"
                onChange={() => setDraftShowUnavailableTrips((isSelected) => !isSelected)}
                value="show-unavailable-trips"
              />
            </section>

            <Divider extraClasses="all-filters-divider" />

            <section className="all-filters-section" aria-label="Stops in Berlin">
              <Text Elem="h4" extraClasses="all-filters-section-title">
                Stops - Berlin
              </Text>
              <div className="station-filter-list">
                {berlinStopOptions.map((option) => {
                  const isChecked = draftBerlinStops.includes(option.station);
                  const stationCount = getBerlinStopOptionTripCount(option.station);
                  const isDisabled = !isChecked && stationCount === 0;

                  return (
                    <Checkbox
                      checked={isChecked}
                      disabled={isDisabled}
                      extraClasses={`station-filter-option${isDisabled ? ' station-filter-option--disabled' : ''}`}
                      id={`berlin-stop-${toIdSlug(option.station)}`}
                      key={option.station}
                      label={(
                        <span className="station-filter-label">
                          <Icon InlineIcon={option.icon} aria-hidden="true" size={4} />
                          <span>{option.station} ({stationCount})</span>
                        </span>
                      )}
                      name="berlin-stops"
                      onChange={() => toggleDraftBerlinStop(option.station)}
                      value={option.station}
                    />
                  );
                })}
              </div>
            </section>

            <Divider extraClasses="all-filters-divider" />

            <section className="all-filters-section" aria-label="Stops in Hamburg">
              <Text Elem="h4" extraClasses="all-filters-section-title">
                Stops - Hamburg
              </Text>
              <div className="station-filter-list">
                {hamburgStopOptions.map((option) => {
                  const isChecked = draftHamburgStops.includes(option.station);
                  const stationCount = getHamburgStopOptionTripCount(option.station);
                  const isDisabled = !isChecked && stationCount === 0;

                  return (
                    <Checkbox
                      checked={isChecked}
                      disabled={isDisabled}
                      extraClasses={`station-filter-option${isDisabled ? ' station-filter-option--disabled' : ''}`}
                      id={`hamburg-stop-${toIdSlug(option.station)}`}
                      key={option.station}
                      label={(
                        <span className="station-filter-label">
                          <Icon InlineIcon={option.icon} aria-hidden="true" size={4} />
                          <span>{option.station} ({stationCount})</span>
                        </span>
                      )}
                      name="hamburg-stops"
                      onChange={() => toggleDraftHamburgStop(option.station)}
                      value={option.station}
                    />
                  );
                })}
              </div>
            </section>
          </PanelContent>
          <PanelFooter extraClasses="all-filters-panel-footer">
            <PanelFooterColumn>
              <Button
                appearance="secondary"
                extraClasses="all-filters-footer-button filter-cancel-button"
                onClick={cancelAllFiltersPanel}
                type="button"
              >
                Cancel
              </Button>
            </PanelFooterColumn>
            <PanelFooterColumn>
              <Button
                appearance="primary"
                disabled={allFiltersDraftResults.length === 0}
                extraClasses="all-filters-footer-button"
                onClick={confirmAllFiltersPanel}
                type="button"
              >
                Show trips ({allFiltersDraftResults.length})
              </Button>
            </PanelFooterColumn>
          </PanelFooter>
        </Panel>
      )}

      {isSortPanelOpen && <div className="results-modal-overlay" aria-hidden="true" onClick={cancelSortPanel} />}

      {isSortPanelOpen && (
        <Panel
          active
          disableBodyStyleModifications
          disableFocusManagement
          extraClasses="sort-panel"
          id="sort-filter-panel"
          onOverlayClick={cancelSortPanel}
          position="bottom"
          style={{ top: 'auto', bottom: 0 }}
        >
          <PanelHeader>
            <div className="filter-panel-header-content">
              <span className="sort-panel-heading">Sort by</span>
              <Button
                appearance="secondary"
                extraClasses="panel-reset-button"
                onClick={resetSortPanel}
                type="button"
              >
                Reset
              </Button>
            </div>
          </PanelHeader>
          <PanelContent extraClasses="sort-panel-content">
            <div className="sort-option-list">
              {sortOptions.map((option) => (
                <Radio
                  checked={draftSort === option.key}
                  extraClasses="sort-option"
                  id={`sort-option-${option.key}`}
                  key={option.key}
                  label={(
                    <span className="sort-option-label">
                      <span className="sort-option-name">{option.label}</span>
                      {' '}
                      <span className="sort-option-detail">({option.detail})</span>
                    </span>
                  )}
                  name="sort-option"
                  onChange={() => setDraftSort(option.key)}
                  value={option.key}
                />
              ))}
            </div>
          </PanelContent>
          <PanelFooter extraClasses="sort-panel-footer">
            <PanelFooterColumn>
              <Button
                appearance="secondary"
                extraClasses="sort-footer-button filter-cancel-button"
                onClick={cancelSortPanel}
                type="button"
              >
                Cancel
              </Button>
            </PanelFooterColumn>
            <PanelFooterColumn>
              <Button
                appearance="primary"
                extraClasses="sort-footer-button"
                onClick={confirmSortPanel}
                type="button"
              >
                Confirm
              </Button>
            </PanelFooterColumn>
          </PanelFooter>
        </Panel>
      )}

      {isResultsTimesPanelOpen && (
        <div className="results-modal-overlay" aria-hidden="true" onClick={cancelResultsTimesPanel} />
      )}

      {isResultsTimesPanelOpen && (
        <Panel
          active
          disableBodyStyleModifications
          disableFocusManagement
          extraClasses="times-panel results-times-panel"
          id="results-times-filter-panel"
          onOverlayClick={cancelResultsTimesPanel}
          position="bottom"
          style={{ top: 'auto', bottom: 0 }}
        >
          <PanelHeader>
            <div className="filter-panel-header-content">
              <span className="times-panel-heading">Times</span>
              <Button
                appearance="secondary"
                extraClasses="panel-reset-button"
                onClick={resetResultsTimesPanel}
                type="button"
              >
                Reset
              </Button>
            </div>
          </PanelHeader>
          <PanelContent extraClasses="times-panel-content">
            <div className="time-filter-groups">
              {timeFilterSections.map((section, sectionIndex) => (
                <div className="time-filter-group" key={section.id}>
                  <Text Elem="h4" extraClasses="time-filter-group-title">
                    {section.title}
                  </Text>

                  <div className="time-option-list">
                    {section.options.map((option) => {
                      const isChecked = draftResultsTimeFilters.includes(option.key);
                      const isDisabled = !isChecked && getTimeOptionTripCount(option.key) === 0;

                      return (
                        <Checkbox
                          checked={isChecked}
                          disabled={isDisabled}
                          extraClasses={`time-option${isDisabled ? ' time-option--disabled' : ''}`}
                          id={`results-time-filter-${option.key}`}
                          key={option.key}
                          label={(
                            <span className="time-option-label">
                              <Icon InlineIcon={option.icon} aria-hidden="true" size={4} />
                              <span className="time-option-text">
                                <span className="time-option-name">{option.label}</span>
                                <span className="time-option-range">{option.time}</span>
                              </span>
                            </span>
                          )}
                          name="results-time-filter"
                          onChange={() => toggleDraftResultsTimeFilter(option.key)}
                          value={option.key}
                        />
                      );
                    })}
                  </div>

                  {sectionIndex === 0 && <Divider extraClasses="time-filter-divider" />}
                </div>
              ))}
            </div>
          </PanelContent>
          <PanelFooter extraClasses="times-panel-footer">
            <PanelFooterColumn>
              <Button
                appearance="secondary"
                extraClasses="times-footer-button filter-cancel-button"
                onClick={cancelResultsTimesPanel}
                type="button"
              >
                Cancel
              </Button>
            </PanelFooterColumn>
            <PanelFooterColumn>
              <Button
                appearance="primary"
                extraClasses="times-footer-button"
                onClick={confirmResultsTimesPanel}
                type="button"
              >
                Show trips ({draftTimeFilteredResults.length})
              </Button>
            </PanelFooterColumn>
          </PanelFooter>
        </Panel>
      )}

      {isPricePanelOpen && <div className="results-modal-overlay" aria-hidden="true" onClick={cancelPricePanel} />}

      {isPricePanelOpen && (
        <Panel
          active
          disableBodyStyleModifications
          disableFocusManagement
          extraClasses="price-panel"
          id="price-filter-panel"
          onOverlayClick={cancelPricePanel}
          position="bottom"
          style={{ top: 'auto', bottom: 0 }}
        >
          <PanelHeader>
            <div className="filter-panel-header-content">
              <span className="price-panel-heading">Price per passenger</span>
              <Button
                appearance="secondary"
                extraClasses="panel-reset-button"
                onClick={resetPricePanel}
                type="button"
              >
                Reset
              </Button>
            </div>
          </PanelHeader>
          <PanelContent extraClasses="price-panel-content">
            <div className="price-range-shell">
              <Range
                aria-label="Minimum price"
                displayValues
                extraClasses="price-range-control"
                format={(value) => `€${value}`}
                id="price-range"
                max={priceBounds.max}
                min={priceBounds.min}
                onChange={(event) => updateDraftPriceMin(Number(event.target.value))}
                onInput={(event) => updateDraftPriceMin(Number((event.target as HTMLInputElement).value))}
                rangeEnd={{
                  'aria-label': 'Maximum price',
                  onChange: (event) => updateDraftPriceMax(Number(event.target.value)),
                  onInput: (event) => updateDraftPriceMax(Number((event.target as HTMLInputElement).value)),
                  value: effectiveDraftPriceRange.max,
                }}
                step={1}
                value={effectiveDraftPriceRange.min}
              />
            </div>
          </PanelContent>
          <PanelFooter extraClasses="price-panel-footer">
            <PanelFooterColumn>
              <Button
                appearance="secondary"
                extraClasses="price-footer-button filter-cancel-button"
                onClick={cancelPricePanel}
                type="button"
              >
                Cancel
              </Button>
            </PanelFooterColumn>
            <PanelFooterColumn>
              <Button
                appearance="primary"
                disabled={draftPriceFilteredResults.length === 0}
                extraClasses="price-footer-button"
                onClick={confirmPricePanel}
                type="button"
              >
                Show trips ({draftPriceFilteredResults.length})
              </Button>
            </PanelFooterColumn>
          </PanelFooter>
        </Panel>
      )}
    </main>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [fromValue, setFromValue] = useState('Berlin');
  const [fromSearchQuery, setFromSearchQuery] = useState('');
  const [isFromPanelOpen, setIsFromPanelOpen] = useState(false);
  const [toValue, setToValue] = useState('Hamburg');
  const [toSearchQuery, setToSearchQuery] = useState('');
  const [isToPanelOpen, setIsToPanelOpen] = useState(false);
  const [isTimesPanelOpen, setIsTimesPanelOpen] = useState(false);
  const [appliedTimeFilters, setAppliedTimeFilters] = useState<TimeFilterKey[]>([]);
  const [draftTimeFilters, setDraftTimeFilters] = useState<TimeFilterKey[]>([]);

  const closeFromPanel = () => setIsFromPanelOpen(false);

  const openFromPanel = () => {
    setFromSearchQuery('');
    setIsTimesPanelOpen(false);
    setIsFromPanelOpen(true);
  };

  const selectStation = (station: StationSuggestion) => {
    setFromValue(station.name);
    closeFromPanel();
  };

  const closeToPanel = () => setIsToPanelOpen(false);

  const openToPanel = () => {
    setToSearchQuery('');
    setIsFromPanelOpen(false);
    setIsTimesPanelOpen(false);
    setIsToPanelOpen(true);
  };

  const selectToStation = (station: StationSuggestion) => {
    setToValue(station.name);
    closeToPanel();
  };

  const openTimesPanel = () => {
    setDraftTimeFilters(appliedTimeFilters);
    setIsFromPanelOpen(false);
    setIsToPanelOpen(false);
    setIsTimesPanelOpen(true);
  };

  const handleHomeTimesTagClick = () => {
    if (appliedTimeFilters.length > 0) {
      setAppliedTimeFilters([]);
      setDraftTimeFilters([]);
      setIsTimesPanelOpen(false);
      return;
    }

    openTimesPanel();
  };

  const cancelTimesPanel = () => {
    setDraftTimeFilters(appliedTimeFilters);
    setIsTimesPanelOpen(false);
  };

  const resetTimesPanel = () => setDraftTimeFilters([]);

  const confirmTimesPanel = () => {
    setAppliedTimeFilters(draftTimeFilters);
    setIsTimesPanelOpen(false);
  };

  const toggleDraftTimeFilter = (key: TimeFilterKey) => {
    setDraftTimeFilters((currentFilters) => (
      currentFilters.includes(key)
        ? currentFilters.filter((filterKey) => filterKey !== key)
        : [...currentFilters, key]
    ));
  };

  const showSearchResults = () => {
    setIsFromPanelOpen(false);
    setIsTimesPanelOpen(false);
    setCurrentPage('results');
    window.scrollTo({ top: 0 });
  };

  const showHomepage = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0 });
  };

  const closeActiveHomeModal = () => {
    if (isTimesPanelOpen) {
      cancelTimesPanel();
      return;
    }

    if (isFromPanelOpen) {
      closeFromPanel();
      return;
    }

    if (isToPanelOpen) {
      closeToPanel();
    }
  };

  const isTimeFilterApplied = appliedTimeFilters.length > 0;
  const hasModalOpen = isFromPanelOpen || isToPanelOpen || isTimesPanelOpen;

  if (currentPage === 'results') {
    return (
      <ThemeWrapper theme="flix">
        <SearchResultsPage
          appliedTimeFilters={appliedTimeFilters}
          onAppliedTimeFiltersChange={setAppliedTimeFilters}
          onBackToHome={showHomepage}
        />
      </ThemeWrapper>
    );
  }

  return (
    <ThemeWrapper theme="flix">
      <main className="search-homepage" aria-label="FlixBus search prototype">
        <HeaderBar extraClasses="search-header">
          <Button
            aria-label="Open menu"
            display="square"
            extraClasses="header-icon-button"
            type="button"
          >
            <Icon InlineIcon={IconBurger} aria-hidden="true" size={4} />
          </Button>

          <HeaderBrand
            alt="FlixBus"
            extraClasses="search-logo"
            height="24"
            href="/"
            src={flixbusLogo}
            width="135"
          />

          <Button
            aria-label="Open profile"
            display="square"
            extraClasses="header-icon-button profile-button"
            type="button"
          >
            <Icon InlineIcon={IconProfileSolid} aria-hidden="true" size={6} />
          </Button>
        </HeaderBar>

        <section className="hero-image" aria-label="Low cost bus travel">
          <img src={heroImage} alt="" aria-hidden="true" />
          <h1>Low cost bus travel from just €5</h1>
        </section>

        <form
          className="search-mask"
          onSubmit={(event) => {
            event.preventDefault();
            showSearchResults();
          }}
        >
          <div className="trip-type-selection" role="radiogroup" aria-label="Trip type">
            <Radio
              defaultChecked
              id="trip-one-way"
              label="One Way"
              name="trip-type"
              value="one-way"
            />
            <Radio
              id="trip-round-trip"
              label="Round Trip"
              name="trip-type"
              value="round-trip"
            />
          </div>

          <Input
            aria-haspopup="dialog"
            extraClasses="search-field"
            iconLeft={<Icon InlineIcon={IconPinSolid} aria-hidden="true" />}
            id="from"
            label="From"
            name="from"
            onClick={openFromPanel}
            readOnly
            value={fromValue}
          />

          <Input
            extraClasses="search-field"
            iconLeft={<Icon InlineIcon={IconPinSolid} aria-hidden="true" />}
            id="to"
            label="To"
            name="to"
            onClick={openToPanel}
            readOnly
            value={toValue}
          />

          <Input
            extraClasses="search-field"
            iconLeft={<Icon InlineIcon={IconCalendarSolid} aria-hidden="true" />}
            id="departure"
            label="Departure"
            name="departure"
            readOnly
            value="Sun, 20 Nov"
          />

          <Select
            defaultValue="1-adult"
            extraClasses="search-field search-select"
            id="passengers"
            label="Passengers"
            name="passengers"
          >
            <SelectOption value="1-adult">1 Adult</SelectOption>
            <SelectOption value="2-adults">2 Adults</SelectOption>
            <SelectOption value="1-adult-1-child">1 Adult, 1 Child</SelectOption>
          </Select>

          <div className="time-filter">
            <Text small extraClasses="time-filter-copy">
              Want to travel at a specific time?
            </Text>
            <Tag
              Elem="button"
              appearance={isTimeFilterApplied ? 'selected' : undefined}
              aria-pressed={isTimeFilterApplied}
              display={isTimeFilterApplied ? 'subtle' : 'outlined'}
              extraClasses={`time-filter-tag${isTimeFilterApplied ? ' time-filter-tag--selected' : ''}`}
              onClick={handleHomeTimesTagClick}
              tagTextColor="#353535"
              type="button"
            >
              Departure / arrival times
              <Icon
                InlineIcon={isTimeFilterApplied ? IconClose : IconArrowDown}
                aria-hidden="true"
                size={3}
              />
            </Tag>
          </div>

          <Button
            appearance="primary"
            extraClasses="search-button"
            size="lg"
            type="submit"
          >
            Search
          </Button>
        </form>

        {hasModalOpen && <div className="modal-overlay" aria-hidden="true" onClick={closeActiveHomeModal} />}

        {isFromPanelOpen && (
          <Panel
            active
            disableBodyStyleModifications
            disableFocusManagement
            extraClasses="from-panel"
            fullSize
            id="from-input-panel"
            onOverlayClick={closeFromPanel}
            position="bottom"
            style={{ top: 'auto', bottom: 0 }}
          >
            <PanelHeader>
              <span className="from-panel-heading">From</span>
              <Button
                aria-label="Close"
                display="square"
                extraClasses="from-panel-close-button"
                onClick={closeFromPanel}
                type="button"
              >
                <Icon InlineIcon={IconClose} aria-hidden="true" size={4} />
              </Button>
            </PanelHeader>
            <PanelContent extraClasses="from-panel-content">
              <Input
                aria-label="Search for departure city"
                extraClasses="from-panel-input"
                id="from-panel-search"
                name="from-panel-search"
                value={fromSearchQuery}
                onChange={(e) => setFromSearchQuery((e.target as HTMLInputElement).value)}
                autoFocus
              />

              <div className="suggestions-list">
                {getFilteredStations(fromSearchQuery).length === 0 && fromSearchQuery.trim() !== '' && (
                  <p className="suggestion-empty-state">No stations found for "{fromSearchQuery}"</p>
                )}
                {getFilteredStations(fromSearchQuery).map((station, i, arr) => (
                  <div key={station.name}>
                    <button
                      className="suggestion-row"
                      type="button"
                      onClick={() => selectStation(station)}
                    >
                      <Icon
                        InlineIcon={station.iconType === 'train-stop' ? IconTrainStop : IconBusStop}
                        aria-hidden="true"
                        size={4}
                      />
                      <span className="suggestion-station-content">
                        <span className="suggestion-main">
                          <HighlightMatch text={station.name} query={fromSearchQuery} />
                        </span>
                        {station.lines && station.lines.length > 0 && (
                          <span className="suggestion-lines">
                            {station.lines.map((line) => (
                              <span key={line} className="line-chip">{line}</span>
                            ))}
                          </span>
                        )}
                      </span>
                      <span className={`station-type-label station-type-label--${station.type === 'local' ? 'local' : 'flix'}`}>
                        {station.type === 'local' ? 'Local' : station.type === 'flixtrain' ? 'FlixTrain' : 'FlixBus'}
                      </span>
                    </button>
                    {i < arr.length - 1 && <Divider extraClasses="suggestion-divider" />}
                  </div>
                ))}
              </div>
            </PanelContent>
          </Panel>
        )}

        {isToPanelOpen && (
          <Panel
            active
            disableBodyStyleModifications
            disableFocusManagement
            extraClasses="from-panel"
            fullSize
            id="to-input-panel"
            onOverlayClick={closeToPanel}
            position="bottom"
            style={{ top: 'auto', bottom: 0 }}
          >
            <PanelHeader>
              <span className="from-panel-heading">To</span>
              <Button
                aria-label="Close"
                display="square"
                extraClasses="from-panel-close-button"
                onClick={closeToPanel}
                type="button"
              >
                <Icon InlineIcon={IconClose} aria-hidden="true" size={4} />
              </Button>
            </PanelHeader>
            <PanelContent extraClasses="from-panel-content">
              <Input
                aria-label="Search for arrival city"
                extraClasses="from-panel-input"
                id="to-panel-search"
                name="to-panel-search"
                value={toSearchQuery}
                onChange={(e) => setToSearchQuery((e.target as HTMLInputElement).value)}
                autoFocus
              />

              <div className="suggestions-list">
                {getFilteredStations(toSearchQuery).length === 0 && toSearchQuery.trim() !== '' && (
                  <p className="suggestion-empty-state">No stations found for "{toSearchQuery}"</p>
                )}
                {getFilteredStations(toSearchQuery).map((station, i, arr) => (
                  <div key={station.name}>
                    <button
                      className="suggestion-row"
                      type="button"
                      onClick={() => selectToStation(station)}
                    >
                      <Icon
                        InlineIcon={station.iconType === 'train-stop' ? IconTrainStop : IconBusStop}
                        aria-hidden="true"
                        size={4}
                      />
                      <span className="suggestion-station-content">
                        <span className="suggestion-main">
                          <HighlightMatch text={station.name} query={toSearchQuery} />
                        </span>
                        {station.lines && station.lines.length > 0 && (
                          <span className="suggestion-lines">
                            {station.lines.map((line) => (
                              <span key={line} className="line-chip">{line}</span>
                            ))}
                          </span>
                        )}
                      </span>
                      <span className={`station-type-label station-type-label--${station.type === 'local' ? 'local' : 'flix'}`}>
                        {station.type === 'local' ? 'Local' : station.type === 'flixtrain' ? 'FlixTrain' : 'FlixBus'}
                      </span>
                    </button>
                    {i < arr.length - 1 && <Divider extraClasses="suggestion-divider" />}
                  </div>
                ))}
              </div>
            </PanelContent>
          </Panel>
        )}

        {isTimesPanelOpen && (
          <Panel
            active
            disableBodyStyleModifications
            disableFocusManagement
            extraClasses="times-panel"
            id="times-filter-panel"
            onOverlayClick={cancelTimesPanel}
            position="bottom"
            style={{ top: 'auto', bottom: 0 }}
          >
          <PanelHeader>
            <div className="filter-panel-header-content">
              <span className="times-panel-heading">Times</span>
              <Button
                appearance="secondary"
                extraClasses="panel-reset-button"
                onClick={resetTimesPanel}
                type="button"
              >
                Reset
              </Button>
            </div>
          </PanelHeader>
          <PanelContent extraClasses="times-panel-content">
            <div className="time-filter-groups">
              {timeFilterSections.map((section, sectionIndex) => (
                <div className="time-filter-group" key={section.id}>
                  <Text Elem="h4" extraClasses="time-filter-group-title">
                    {section.title}
                  </Text>

                  <div className="time-option-list">
                    {section.options.map((option) => (
                      <Checkbox
                        checked={draftTimeFilters.includes(option.key)}
                        extraClasses="time-option"
                        id={`time-filter-${option.key}`}
                        key={option.key}
                        label={(
                          <span className="time-option-label">
                            <Icon InlineIcon={option.icon} aria-hidden="true" size={4} />
                            <span className="time-option-text">
                              <span className="time-option-name">{option.label}</span>
                              <span className="time-option-range">{option.time}</span>
                            </span>
                          </span>
                        )}
                        name="time-filter"
                        onChange={() => toggleDraftTimeFilter(option.key)}
                        value={option.key}
                      />
                    ))}
                  </div>

                  {sectionIndex === 0 && <Divider extraClasses="time-filter-divider" />}
                </div>
              ))}
            </div>
          </PanelContent>
          <PanelFooter extraClasses="times-panel-footer">
            <PanelFooterColumn>
              <Button
                appearance="secondary"
                extraClasses="times-footer-button filter-cancel-button"
                onClick={cancelTimesPanel}
                type="button"
              >
                Cancel
              </Button>
            </PanelFooterColumn>
            <PanelFooterColumn>
              <Button
                appearance="primary"
                extraClasses="times-footer-button"
                onClick={confirmTimesPanel}
                type="button"
              >
                Confirm
              </Button>
            </PanelFooterColumn>
          </PanelFooter>
          </Panel>
        )}
      </main>
    </ThemeWrapper>
  );
};

export default App;
