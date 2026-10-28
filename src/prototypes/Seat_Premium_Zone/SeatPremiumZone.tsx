import React, {
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
  Panel,
  PanelContent,
  PanelFooter,
  PanelFooterColumn,
  PanelHeader,
  Radio,
  Range,
  Tag,
  Text,
} from '@flixbus/honeycomb-react';
import {
  Icon,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconInfo,
  IconBus,
  IconBusTrain,
  IconBusStop,
  IconClose,
  IconEditSolid,
  IconFilter,
  IconNight,
  IconRefresh,
  IconRideTransfer,
  IconSocket,
  IconSort,
  IconStopwatch,
  IconSun,
  IconSunrise,
  IconSunset,
  IconTrain,
  IconTrainStop,
  IconTransfer,
  IconWifi,
} from '@flixbus/honeycomb-icons-react';

import './SeatPremiumZone.css';
import { tripResults, type TripResult } from './resultsData';
import { SeatMap } from './SeatMap';
import iconDiamondDark from './assets/icon-diamond-dark.svg';
import iconDiamondLight from './assets/icon-diamond-light.svg';
import photoSeatPremiumZone from './assets/photo-seat-premium-zone.png';
import arrowRightArcDots from './arrow-right-arc-dots.svg';

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
type TransportFilter = 'all' | 'train';
type SortOption = 'departure' | 'price' | 'duration' | 'best';
type TimeFilterPeriod = 'morning' | 'afternoon' | 'evening' | 'night';
type QuickFilterKey = 'main-station' | 'direct' | 'under-20';
type TripInfoText = 'LOWEST PRICE' | 'FASTEST TRIP';
type PriceRange = { max: number; min: number };
type DurationRange = { max: number; min: number };

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

const quickFilterOptions: Array<{ key: QuickFilterKey; label: string }> = [
  { key: 'main-station', label: 'Main station only' },
  { key: 'direct', label: 'Direct only' },
  { key: 'under-20', label: 'Under €20' },
];

const sortOptions: Array<{ detail: string; key: SortOption; label: string }> = [
  { key: 'departure', label: 'Departure', detail: 'earliest first' },
  { key: 'price', label: 'Price', detail: 'cheapest first' },
  { key: 'duration', label: 'Duration', detail: 'shortest first' },
  { key: 'best', label: 'Best', detail: 'cheapest and shortest with the least amount of transfers first' },
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
  return { min: Math.min(...prices), max: Math.max(...prices) };
};

const clampPriceRange = (range: PriceRange, bounds: PriceRange): PriceRange => ({
  min: Math.max(bounds.min, Math.min(range.min, bounds.max)),
  max: Math.max(bounds.min, Math.min(range.max, bounds.max)),
});

const isFullPriceRange = (range: PriceRange | null, bounds: PriceRange) => (
  !range || (range.min <= bounds.min && range.max >= bounds.max)
);

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
  return { min: Math.min(...durations), max: Math.max(...durations) };
};

const clampDurationRange = (range: DurationRange, bounds: DurationRange): DurationRange => ({
  min: Math.max(bounds.min, Math.min(range.min, bounds.max)),
  max: Math.max(bounds.min, Math.min(range.max, bounds.max)),
});

const isFullDurationRange = (range: DurationRange | null, bounds: DurationRange) => (
  !range || (range.min <= bounds.min && range.max >= bounds.max)
);

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

const addMinutes = (time: string, minutes: number): string => {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

type TripLeg = {
  arrivalStation: string;
  arrivalTime: string;
  departureStation: string;
  departureTime: string;
  mode: 'Bus' | 'Train';
};

type TripLegs = {
  legs: TripLeg[];
  transfers: Array<{ duration: string }>;
};

const buildTripLegs = (trip: TripResult): TripLegs => {
  if (trip.connection === 'Direct') {
    return {
      legs: [{ arrivalStation: trip.arrivalStation, arrivalTime: trip.arrivalTime, departureStation: trip.departureStation, departureTime: trip.departureTime, mode: trip.mode }],
      transfers: [],
    };
  }
  const totalMin = parseDurationInMinutes(trip.duration);
  const transferMin = 30;
  const leg1Min = Math.round((totalMin - transferMin) * 0.55);
  const transferStation = trip.mode === 'Train' ? 'Hamburg-Harburg' : 'Hannover ZOB';
  const leg1ArrivalTime = addMinutes(trip.departureTime, leg1Min);
  const leg2DepartureTime = addMinutes(leg1ArrivalTime, transferMin);
  return {
    legs: [
      { arrivalStation: transferStation, arrivalTime: leg1ArrivalTime, departureStation: trip.departureStation, departureTime: trip.departureTime, mode: trip.mode },
      { arrivalStation: trip.arrivalStation, arrivalTime: trip.arrivalTime, departureStation: transferStation, departureTime: leg2DepartureTime, mode: trip.mode },
    ],
    transfers: [{ duration: '30 min' }],
  };
};

const lowestTripPriceInCents = Math.min(...tripResults.map(parsePriceInCents));
const fastestTripDurationInMinutes = Math.min(...tripResults.map((trip) => parseDurationInMinutes(trip.duration)));

const getTripInfoText = (trip: TripResult): TripInfoText | null => {
  if (parsePriceInCents(trip) === lowestTripPriceInCents) return 'LOWEST PRICE';
  if (parseDurationInMinutes(trip.duration) === fastestTripDurationInMinutes) return 'FASTEST TRIP';
  return null;
};

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
      try { row.setPointerCapture(event.pointerId); } catch { /* best effort */ }
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
      if (row.hasPointerCapture(event.pointerId)) row.releasePointerCapture(event.pointerId);
    } catch { /* best effort */ }
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
  infoText,
  isDetailsOpen,
  onOpenDetails,
  onOpenPremiumZoneInfo,
  onSelectSeat,
  trip,
}: {
  anchorRef?: Ref<HTMLElement>;
  infoText?: TripInfoText | null;
  isDetailsOpen?: boolean;
  onOpenDetails?: () => void;
  onOpenPremiumZoneInfo?: () => void;
  onSelectSeat?: () => void;
  trip: TripResult;
}) => {
  const urgencyText = trip.urgencyText;
  const TransportIcon = trip.mode === 'Train' ? IconTrain : IconBus;

  return (
    <article
      className={`trip-card${infoText ? ' trip-card--with-info' : ''}`}
      ref={anchorRef}
      aria-label={`${trip.departureTime} ${trip.departureStation} to ${trip.arrivalStation}${infoText ? `, ${infoText}` : ''}`}
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

      {urgencyText && <p className="trip-card-urgency-text">{urgencyText}</p>}

      <div className="trip-card-actions">
        <div className="trip-details">
          <button
            className={`connection-pill${isDetailsOpen ? ' connection-pill--open' : ''}`}
            type="button"
            aria-expanded={isDetailsOpen}
            onClick={onOpenDetails}
          >
            <Icon InlineIcon={TransportIcon} aria-hidden="true" size={3} />
            <span>{trip.mode}</span>
            <span className="connection-separator" aria-hidden="true" />
            <span>{trip.connection}</span>
            <span className="connection-pill-arrow" aria-hidden="true">
              <Icon InlineIcon={IconArrowDown} aria-hidden="true" size={2} />
            </span>
          </button>
          <div
            className="amenities amenities--clickable"
            aria-label="Amenities"
            role="button"
            tabIndex={0}
            onClick={onOpenDetails}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenDetails?.(); }}
          >
            <Icon InlineIcon={IconWifi} aria-hidden="true" size={3} />
            <Icon InlineIcon={IconSocket} aria-hidden="true" size={3} />
            <div className="amenity-tooltip" aria-hidden="true">
              <div className="amenity-tooltip-item">
                <Icon InlineIcon={IconWifi} aria-hidden="true" size={3} />
                <span>Free Wi-Fi</span>
              </div>
              <div className="amenity-tooltip-item">
                <Icon InlineIcon={IconSocket} aria-hidden="true" size={3} />
                <span>Charging point</span>
              </div>
            </div>
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
            onClick={onSelectSeat}
          >
            <Icon InlineIcon={IconArrowRight} aria-hidden="true" size={4} />
          </Button>
        </div>
      </div>

      {trip.premiumZone && (
        <div className="trip-pz-row">
          <img src={iconDiamondDark} width={24} height={24} alt="" aria-hidden="true" />
          <span className="trip-pz-label">Premium Zone available</span>
        </div>
      )}

      {infoText && <span className="trip-card-info-text">{infoText}</span>}
    </article>
  );
};

export const SeatPremiumZone = () => {
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
  const [appliedTimeFilters, setAppliedTimeFilters] = useState<TimeFilterKey[]>([]);
  const [draftResultsTimeFilters, setDraftResultsTimeFilters] = useState<TimeFilterKey[]>([]);
  const [isResultsTimesPanelOpen, setIsResultsTimesPanelOpen] = useState(false);
  const [areMoreResultsShown, setAreMoreResultsShown] = useState(false);
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [isPremiumZoneInfoOpen, setIsPremiumZoneInfoOpen] = useState(false);
  const [tripDetailsSheet, setTripDetailsSheet] = useState<TripResult | null>(null);
  const [isLoadingMoreResults, setIsLoadingMoreResults] = useState(false);
  const [shouldScrollToMoreResults, setShouldScrollToMoreResults] = useState(false);
  const firstAdditionalResultRef = useRef<HTMLElement | null>(null);
  const resultsListSectionRef = useRef<HTMLElement | null>(null);
  const loadMoreTimeoutRef = useRef<number | null>(null);

  const anyPanelOpen =
    isPricePanelOpen ||
    isPremiumZoneInfoOpen ||
    !!tripDetailsSheet ||
    isSeatMapOpen ||
    isResultsTimesPanelOpen;
  useEffect(() => {
    document.body.style.overflow = anyPanelOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [anyPanelOpen]);

  const transportFilteredResults = transportFilter === 'train'
    ? tripResults.filter((trip) => trip.mode === 'Train')
    : tripResults;
  const quickFilteredResults = filterTripsByQuickFilters(transportFilteredResults, quickFilters);
  const timeFilteredResults = filterTripsByTimes(quickFilteredResults, appliedTimeFilters);
  const stopFilteredResults = filterTripsByStops(timeFilteredResults, appliedBerlinStops, appliedHamburgStops);
  const durationFilteredResults = filterTripsByDurationRange(stopFilteredResults, appliedDurationRange);
  const priceBounds = getPriceBounds(durationFilteredResults);
  const isPriceFilterDisabled = !appliedPriceRange && priceBounds.min >= priceBounds.max;
  const priceFilteredResults = filterTripsByPriceRange(durationFilteredResults, appliedPriceRange);
  const sortedResults = sortTripResults(priceFilteredResults, appliedSort);
  const displayResults = sortedResults;
  const initialResults = displayResults.slice(0, 10);
  const additionalResults = displayResults.slice(10);
  const hasAdditionalResults = additionalResults.length > 0;
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
  const timePanelStopFilteredResults = filterTripsByStops(quickFilteredResults, appliedBerlinStops, appliedHamburgStops);
  const timePanelDurationFilteredResults = filterTripsByDurationRange(timePanelStopFilteredResults, appliedDurationRange);
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
  const getBerlinStopOptionTripCount = (station: string) => getAllFiltersDraftResults([station], draftHamburgStops).length;
  const getHamburgStopOptionTripCount = (station: string) => getAllFiltersDraftResults(draftBerlinStops, [station]).length;

  const getResultsForQuickFilterSelection = (candidateQuickFilters: QuickFilterKey[]) => {
    const candidateQuickFilteredResults = filterTripsByQuickFilters(transportFilteredResults, candidateQuickFilters);
    const candidateTimeFilteredResults = filterTripsByTimes(candidateQuickFilteredResults, appliedTimeFilters);
    const candidateStopFilteredResults = filterTripsByStops(candidateTimeFilteredResults, appliedBerlinStops, appliedHamburgStops);
    const candidateDurationFilteredResults = filterTripsByDurationRange(candidateStopFilteredResults, appliedDurationRange);
    return filterTripsByPriceRange(candidateDurationFilteredResults, appliedPriceRange);
  };
  const getQuickFilterCandidateCount = (key: QuickFilterKey) => (
    getResultsForQuickFilterSelection(quickFilters.includes(key) ? quickFilters : [...quickFilters, key]).length
  );

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

  useEffect(() => {
    if (!areMoreResultsShown || !shouldScrollToMoreResults) return;
    setShouldScrollToMoreResults(false);
    window.requestAnimationFrame(() => {
      firstAdditionalResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [areMoreResultsShown, shouldScrollToMoreResults]);

  useEffect(() => () => {
    if (loadMoreTimeoutRef.current === null) return;
    window.clearTimeout(loadMoreTimeoutRef.current);
  }, []);

  const stopLoadingMoreResults = () => {
    if (loadMoreTimeoutRef.current !== null) {
      window.clearTimeout(loadMoreTimeoutRef.current);
      loadMoreTimeoutRef.current = null;
    }
    setIsLoadingMoreResults(false);
    setShouldScrollToMoreResults(false);
  };

  const resetMoreResults = () => setAreMoreResultsShown(false);

  useEffect(() => {
    if (!isAllFiltersPanelOpen || isAllFiltersDurationDisabled || !draftDurationRange) return;
    const nextDraftRange = clampDurationRange(draftDurationRange, allFiltersDurationBounds);
    if (nextDraftRange.min !== draftDurationRange.min || nextDraftRange.max !== draftDurationRange.max) {
      setDraftDurationRange(nextDraftRange);
    }
  }, [allFiltersDurationBounds.max, allFiltersDurationBounds.min, draftDurationRange, isAllFiltersDurationDisabled, isAllFiltersPanelOpen]);

  useEffect(() => {
    if (!isPricePanelOpen || priceBounds.min >= priceBounds.max || !draftPriceRange) return;
    const nextDraftRange = clampPriceRange(draftPriceRange, priceBounds);
    if (nextDraftRange.min !== draftPriceRange.min || nextDraftRange.max !== draftPriceRange.max) {
      setDraftPriceRange(nextDraftRange);
    }
  }, [draftPriceRange, isPricePanelOpen, priceBounds.max, priceBounds.min]);

  const handleTransportFilterChange = (nextFilter: TransportFilter) => {
    if (nextFilter === transportFilter) return;
    stopLoadingMoreResults();
    setIsAllFiltersPanelOpen(false);
    setIsSortPanelOpen(false);
    setIsResultsTimesPanelOpen(false);
    setIsPricePanelOpen(false);
    setTransportFilter(nextFilter);
    resetMoreResults();
  };

  const toggleQuickFilter = (key: QuickFilterKey) => {
    setQuickFilters((current) => current.includes(key) ? current.filter((k) => k !== key) : [...current, key]);
    setIsAllFiltersPanelOpen(false);
    setIsSortPanelOpen(false);
    setIsResultsTimesPanelOpen(false);
    setIsPricePanelOpen(false);
    stopLoadingMoreResults();
    resetMoreResults();
  };

  const openSortPanel = () => {
    setDraftSort(appliedSort);
    setIsAllFiltersPanelOpen(false);
    setIsResultsTimesPanelOpen(false);
    setIsPricePanelOpen(false);
    setIsSortPanelOpen(true);
  };

  const cancelSortPanel = () => { setDraftSort(appliedSort); setIsSortPanelOpen(false); };

  const confirmSortPanel = () => {
    const changed = draftSort !== appliedSort;
    setAppliedSort(draftSort);
    setIsSortPanelOpen(false);
    if (!changed) return;
    stopLoadingMoreResults();
    resetMoreResults();
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
    stopLoadingMoreResults();
    resetMoreResults();
  };

  const handlePriceTagClick = () => { activePriceRange ? clearPriceFilter() : openPricePanel(); };

  const cancelPricePanel = () => {
    setDraftPriceRange(priceBounds.min >= priceBounds.max ? priceBounds : clampPriceRange(appliedPriceRange ?? priceBounds, priceBounds));
    setIsPricePanelOpen(false);
  };

  const confirmPricePanel = () => {
    if (priceBounds.min >= priceBounds.max) { setAppliedPriceRange(null); setIsPricePanelOpen(false); return; }
    const nextPriceRange = clampPriceRange(effectiveDraftPriceRange, priceBounds);
    setAppliedPriceRange(isFullPriceRange(nextPriceRange, priceBounds) ? null : nextPriceRange);
    setIsPricePanelOpen(false);
    stopLoadingMoreResults();
    resetMoreResults();
  };

  const updateDraftPriceMin = (nextMin: number) => setDraftPriceRange((cur) => { const c = cur ?? priceBounds; return { min: Math.min(nextMin, c.max), max: c.max }; });
  const updateDraftPriceMax = (nextMax: number) => setDraftPriceRange((cur) => { const c = cur ?? priceBounds; return { min: c.min, max: Math.max(nextMax, c.min) }; });

  const openAllFiltersPanel = () => {
    setDraftBerlinStops(appliedBerlinStops);
    setDraftHamburgStops(appliedHamburgStops);
    setDraftShowUnavailableTrips(appliedShowUnavailableTrips);
    setDraftDurationRange(isAllFiltersDurationDisabled ? null : clampDurationRange(appliedDurationRange ?? allFiltersDurationBounds, allFiltersDurationBounds));
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
    setDraftDurationRange(isAllFiltersDurationDisabled ? null : clampDurationRange(appliedDurationRange ?? allFiltersDurationBounds, allFiltersDurationBounds));
    setIsAllFiltersPanelOpen(false);
  };

  const confirmAllFiltersPanel = () => {
    const nextDurationRange = isAllFiltersDurationDisabled ? null : clampDurationRange(effectiveDraftDurationRange, allFiltersDurationBounds);
    setAppliedBerlinStops(draftBerlinStops);
    setAppliedHamburgStops(draftHamburgStops);
    setAppliedShowUnavailableTrips(draftShowUnavailableTrips);
    setAppliedDurationRange(isFullDurationRange(nextDurationRange, allFiltersDurationBounds) ? null : nextDurationRange);
    setIsAllFiltersPanelOpen(false);
    stopLoadingMoreResults();
    resetMoreResults();
  };

  const updateDraftDurationMin = (nextMin: number) => {
    if (isAllFiltersDurationDisabled) return;
    setDraftDurationRange((cur) => { const c = clampDurationRange(cur ?? allFiltersDurationBounds, allFiltersDurationBounds); return { min: Math.min(nextMin, c.max), max: c.max }; });
  };
  const updateDraftDurationMax = (nextMax: number) => {
    if (isAllFiltersDurationDisabled) return;
    setDraftDurationRange((cur) => { const c = clampDurationRange(cur ?? allFiltersDurationBounds, allFiltersDurationBounds); return { min: c.min, max: Math.max(nextMax, c.min) }; });
  };

  const toggleDraftBerlinStop = (station: string) => setDraftBerlinStops((cur) => cur.includes(station) ? cur.filter((s) => s !== station) : [...cur, station]);
  const toggleDraftHamburgStop = (station: string) => setDraftHamburgStops((cur) => cur.includes(station) ? cur.filter((s) => s !== station) : [...cur, station]);

  const openResultsTimesPanel = () => {
    setDraftResultsTimeFilters(appliedTimeFilters);
    setIsAllFiltersPanelOpen(false);
    setIsSortPanelOpen(false);
    setIsPricePanelOpen(false);
    setIsResultsTimesPanelOpen(true);
  };

  const clearResultsTimesFilter = () => {
    setDraftResultsTimeFilters([]);
    setAppliedTimeFilters([]);
    setIsResultsTimesPanelOpen(false);
    stopLoadingMoreResults();
    resetMoreResults();
  };

  const handleResultsTimesTagClick = () => { isResultsTimeFilterApplied ? clearResultsTimesFilter() : openResultsTimesPanel(); };

  const cancelResultsTimesPanel = () => { setDraftResultsTimeFilters(appliedTimeFilters); setIsResultsTimesPanelOpen(false); };

  const confirmResultsTimesPanel = () => {
    setAppliedTimeFilters(draftResultsTimeFilters);
    setIsResultsTimesPanelOpen(false);
    stopLoadingMoreResults();
    resetMoreResults();
  };

  const toggleDraftResultsTimeFilter = (key: TimeFilterKey) => (
    setDraftResultsTimeFilters((cur) => cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key])
  );

  const handleShowMoreResults = () => {
    if (areMoreResultsShown || isLoadingMoreResults) return;
    setIsLoadingMoreResults(true);
    loadMoreTimeoutRef.current = window.setTimeout(() => {
      setAreMoreResultsShown(true);
      setIsLoadingMoreResults(false);
      setShouldScrollToMoreResults(true);
      loadMoreTimeoutRef.current = null;
    }, 700);
  };

  const isAllTransportSelected = transportFilter === 'all';
  const isTrainSelected = transportFilter === 'train';

  return (
    <main className="sp-search-homepage sp-results-page" aria-label="Search results">
      <section className="sp-results-search-header" aria-label="Search summary">
        <HeaderBar extraClasses="sp-results-header-bar">
          <Button
            aria-label="Back"
            display="square"
            extraClasses="sp-results-header-button"
            type="button"
          >
            <Icon InlineIcon={IconArrowLeft} aria-hidden="true" size={4} />
          </Button>

          <div className="sp-results-route-title">
            <span>Berlin</span>
            <Icon InlineIcon={IconArrowRight} aria-hidden="true" size={3} />
            <span>Hamburg</span>
          </div>

          <Button
            aria-label="Edit search"
            display="square"
            extraClasses="sp-results-header-button sp-results-edit-button"
            type="button"
          >
            <Icon InlineIcon={IconEditSolid} aria-hidden="true" size={4} />
          </Button>
        </HeaderBar>

        <div className="sp-date-row" aria-label="Travel dates">
          <button className="sp-date-pill sp-date-pill--muted" type="button">Sat, 19 Nov</button>
          <button className="sp-date-pill sp-date-pill--selected" type="button">Sun, 20 Nov</button>
          <button className="sp-date-pill" type="button">Mon, 21 Nov</button>
        </div>
      </section>

      <section className="sp-results-controls" aria-label="Filters">
        <div className="sp-transport-switcher" role="tablist" aria-label="Transport type">
          <button
            className={`sp-transport-tab${isAllTransportSelected ? ' sp-transport-tab--active' : ''}`}
            type="button"
            role="tab"
            aria-selected={isAllTransportSelected}
            onClick={() => handleTransportFilterChange('all')}
          >
            <Icon InlineIcon={IconBusTrain} aria-hidden="true" size={5} />
            <span>Bus &amp; Train</span>
          </button>
          <button
            className={`sp-transport-tab${isTrainSelected ? ' sp-transport-tab--active' : ''}`}
            type="button"
            role="tab"
            aria-selected={isTrainSelected}
            onClick={() => handleTransportFilterChange('train')}
          >
            <Icon InlineIcon={IconTrain} aria-hidden="true" size={5} />
            <span>Train</span>
          </button>
        </div>

        <div className="sp-filter-bar">
          <div className="sp-filter-bar-left">
            <Tag
              Elem="button"
              appearance={isAllFiltersApplied ? 'selected' : undefined}
              display={isAllFiltersApplied ? 'subtle' : 'outlined'}
              extraClasses="sp-filter-bar-btn"
              aria-label={isAllFiltersApplied ? `All filters, ${appliedAllFiltersCount} applied` : 'All filters'}
              aria-haspopup="dialog"
              aria-pressed={isAllFiltersApplied}
              onClick={openAllFiltersPanel}
              tagTextColor="#353535"
              type="button"
            >
              <Icon InlineIcon={IconFilter} aria-hidden="true" size={4} />
              Filters
              {isAllFiltersApplied && <span className="sp-all-filters-count-badge" aria-hidden="true">{appliedAllFiltersCount}</span>}
            </Tag>
          </div>
          <div className="sp-filter-bar-center">
            <Checkbox
              checked={quickFilters.includes('direct')}
              id="sp-filter-direct-only"
              label="Direct only"
              name="sp-filter-direct-only"
              onChange={() => toggleQuickFilter('direct')}
              value="direct"
            />
          </div>
          <div className="sp-filter-bar-right">
            <span className="sp-filter-bar-count">{displayResults.length} results</span>
          </div>
        </div>
      </section>

      <section ref={resultsListSectionRef} className="sp-results-list-section" aria-label="Available trips">
        <button
          className={`sp-pz-infobox${isPremiumZoneInfoOpen ? ' sp-pz-infobox--open' : ''}`}
          type="button"
          aria-label="Learn about Premium Zone"
          aria-expanded={isPremiumZoneInfoOpen}
          onClick={() => setIsPremiumZoneInfoOpen(true)}
        >
          <div className="sp-pz-infobox-inner">
            <Icon InlineIcon={IconInfo} aria-hidden="true" size={4} />
            <div className="sp-pz-infobox-text">
              <p className="sp-pz-infobox-title"><strong>New!</strong> Premium Zone</p>
              <p className="sp-pz-infobox-desc">Enjoy a more comfortable journey, faster Wi-Fi and priority boarding.</p>
            </div>
            <span className="sp-pz-infobox-arrow" aria-hidden="true">
              <Icon InlineIcon={IconArrowDown} aria-hidden="true" size={4} />
            </span>
          </div>
        </button>

        {displayResults.length === 0 ? (
          <div className="sp-results-empty-state" role="status">
            <Text Elem="p" extraClasses="sp-results-empty-message">
              There are no results for the filters applied. Try adjusting your filters to see more trips.
            </Text>
          </div>
        ) : (
          <div className="sp-trip-list">
            {initialResults.map((trip, index) => (
              <TripCard
                infoText={getTripInfoText(trip)}
                isDetailsOpen={tripDetailsSheet === trip}
                key={`${trip.departureTime}-${trip.arrivalTime}-${trip.departureStation}-${index}`}
                onOpenDetails={() => setTripDetailsSheet(trip)}
                onOpenPremiumZoneInfo={() => setIsPremiumZoneInfoOpen(true)}
                onSelectSeat={() => setIsSeatMapOpen(true)}
                trip={trip}
              />
            ))}

            {hasAdditionalResults && !areMoreResultsShown && (
              <Button
                aria-expanded={areMoreResultsShown}
                aria-busy={isLoadingMoreResults}
                appearance="secondary"
                extraClasses={`sp-show-more-results-button${isLoadingMoreResults ? ' sp-show-more-results-button--loading' : ''}`}
                onClick={handleShowMoreResults}
                size="lg"
                type="button"
              >
                <Icon InlineIcon={IconRefresh} aria-hidden="true" size={4} />
                Show more results
              </Button>
            )}

            {areMoreResultsShown && additionalResults.map((trip, index) => (
              <TripCard
                anchorRef={index === 0 ? firstAdditionalResultRef : undefined}
                infoText={getTripInfoText(trip)}
                isDetailsOpen={tripDetailsSheet === trip}
                key={`${trip.departureTime}-${trip.arrivalTime}-${trip.departureStation}-${index + 10}`}
                onOpenDetails={() => setTripDetailsSheet(trip)}
                onOpenPremiumZoneInfo={() => setIsPremiumZoneInfoOpen(true)}
                onSelectSeat={() => setIsSeatMapOpen(true)}
                trip={trip}
              />
            ))}
          </div>
        )}
      </section>

      {isAllFiltersPanelOpen && <div className="sp-results-modal-overlay" aria-hidden="true" onClick={cancelAllFiltersPanel} />}

      {isAllFiltersPanelOpen && (
        <Panel active disableBodyStyleModifications disableFocusManagement extraClasses="sp-all-filters-panel" id="spz-all-filters-panel" onOverlayClick={cancelAllFiltersPanel} position="bottom" style={{ top: 'auto', bottom: 0 }}>
          <PanelHeader>
            <div className="sp-filter-panel-header-content">
              <span className="sp-all-filters-panel-heading">Filters</span>
              <Button appearance="secondary" extraClasses="sp-panel-reset-button" onClick={resetAllFiltersPanel} type="button">Reset</Button>
            </div>
          </PanelHeader>
          <PanelContent extraClasses="sp-all-filters-panel-content">
            <section className="sp-all-filters-section" aria-label="Trip duration">
              <Text Elem="p" extraClasses="sp-all-filters-section-title">Trip duration</Text>
              <div className="sp-duration-range-shell">
                <Range
                  aria-label="Minimum trip duration"
                  disabled={isAllFiltersDurationDisabled}
                  displayValues
                  extraClasses="sp-duration-range-control"
                  format={formatDurationLabel}
                  id="spz-trip-duration-range"
                  max={allFiltersDurationBounds.max}
                  min={allFiltersDurationBounds.min}
                  onChange={(e) => updateDraftDurationMin(Number(e.target.value))}
                  onInput={(e) => updateDraftDurationMin(Number((e.target as HTMLInputElement).value))}
                  rangeEnd={{
                    'aria-label': 'Maximum trip duration',
                    disabled: isAllFiltersDurationDisabled,
                    onChange: (e) => updateDraftDurationMax(Number(e.target.value)),
                    onInput: (e) => updateDraftDurationMax(Number((e.target as HTMLInputElement).value)),
                    value: effectiveDraftDurationRange.max,
                  }}
                  step={1}
                  value={effectiveDraftDurationRange.min}
                />
              </div>
            </section>

            <Divider extraClasses="sp-all-filters-divider" />

            <section className="sp-all-filters-section sp-all-filters-section--compact" aria-label="Unavailable trips">
              <Checkbox
                checked={draftShowUnavailableTrips}
                extraClasses="sp-all-filter-checkbox"
                id="spz-show-unavailable-trips"
                label="Show unavailable trips"
                name="spz-show-unavailable-trips"
                onChange={() => setDraftShowUnavailableTrips((v) => !v)}
                value="show-unavailable-trips"
              />
            </section>

            <Divider extraClasses="sp-all-filters-divider" />

            <section className="sp-all-filters-section" aria-label="Stops in Berlin">
              <Text Elem="p" extraClasses="sp-all-filters-section-title">Stops - Berlin</Text>
              <div className="sp-station-filter-list">
                {berlinStopOptions.map((option) => {
                  const isChecked = draftBerlinStops.includes(option.station);
                  const stationCount = getBerlinStopOptionTripCount(option.station);
                  const isDisabled = !isChecked && stationCount === 0;
                  return (
                    <Checkbox
                      checked={isChecked}
                      disabled={isDisabled}
                      extraClasses={`sp-station-filter-option${isDisabled ? ' sp-station-filter-option--disabled' : ''}`}
                      id={`spz-berlin-stop-${toIdSlug(option.station)}`}
                      key={option.station}
                      label={<span className="sp-station-filter-label"><Icon InlineIcon={option.icon} aria-hidden="true" size={4} /><span>{option.station} ({stationCount})</span></span>}
                      name="spz-berlin-stops"
                      onChange={() => toggleDraftBerlinStop(option.station)}
                      value={option.station}
                    />
                  );
                })}
              </div>
            </section>

            <Divider extraClasses="sp-all-filters-divider" />

            <section className="sp-all-filters-section" aria-label="Stops in Hamburg">
              <Text Elem="p" extraClasses="sp-all-filters-section-title">Stops - Hamburg</Text>
              <div className="sp-station-filter-list">
                {hamburgStopOptions.map((option) => {
                  const isChecked = draftHamburgStops.includes(option.station);
                  const stationCount = getHamburgStopOptionTripCount(option.station);
                  const isDisabled = !isChecked && stationCount === 0;
                  return (
                    <Checkbox
                      checked={isChecked}
                      disabled={isDisabled}
                      extraClasses={`sp-station-filter-option${isDisabled ? ' sp-station-filter-option--disabled' : ''}`}
                      id={`spz-hamburg-stop-${toIdSlug(option.station)}`}
                      key={option.station}
                      label={<span className="sp-station-filter-label"><Icon InlineIcon={option.icon} aria-hidden="true" size={4} /><span>{option.station} ({stationCount})</span></span>}
                      name="spz-hamburg-stops"
                      onChange={() => toggleDraftHamburgStop(option.station)}
                      value={option.station}
                    />
                  );
                })}
              </div>
            </section>
          </PanelContent>
          <PanelFooter extraClasses="sp-all-filters-panel-footer">
            <PanelFooterColumn>
              <Button appearance="secondary" extraClasses="sp-all-filters-footer-button sp-filter-cancel-button" onClick={cancelAllFiltersPanel} type="button">Cancel</Button>
            </PanelFooterColumn>
            <PanelFooterColumn>
              <Button appearance="primary" disabled={allFiltersDraftResults.length === 0} extraClasses="sp-all-filters-footer-button" onClick={confirmAllFiltersPanel} type="button">
                Show trips ({allFiltersDraftResults.length})
              </Button>
            </PanelFooterColumn>
          </PanelFooter>
        </Panel>
      )}

      {isSortPanelOpen && <div className="sp-results-modal-overlay" aria-hidden="true" onClick={cancelSortPanel} />}

      {isSortPanelOpen && (
        <Panel active disableBodyStyleModifications disableFocusManagement extraClasses="sp-sort-panel" id="spz-sort-filter-panel" onOverlayClick={cancelSortPanel} position="bottom" style={{ top: 'auto', bottom: 0 }}>
          <PanelHeader>
            <div className="sp-filter-panel-header-content">
              <span className="sp-sort-panel-heading">Sort by</span>
              <Button appearance="secondary" extraClasses="sp-panel-reset-button" onClick={() => setDraftSort('departure')} type="button">Reset</Button>
            </div>
          </PanelHeader>
          <PanelContent extraClasses="sp-sort-panel-content">
            <div className="sp-sort-option-list">
              {sortOptions.map((option) => (
                <Radio
                  checked={draftSort === option.key}
                  extraClasses="sp-sort-option"
                  id={`spz-sort-option-${option.key}`}
                  key={option.key}
                  label={<span className="sp-sort-option-label"><span className="sp-sort-option-name">{option.label}</span>{' '}<span className="sp-sort-option-detail">({option.detail})</span></span>}
                  name="spz-sort-option"
                  onChange={() => setDraftSort(option.key)}
                  value={option.key}
                />
              ))}
            </div>
          </PanelContent>
          <PanelFooter extraClasses="sp-sort-panel-footer">
            <PanelFooterColumn>
              <Button appearance="secondary" extraClasses="sp-sort-footer-button sp-filter-cancel-button" onClick={cancelSortPanel} type="button">Cancel</Button>
            </PanelFooterColumn>
            <PanelFooterColumn>
              <Button appearance="primary" extraClasses="sp-sort-footer-button" onClick={confirmSortPanel} type="button">Confirm</Button>
            </PanelFooterColumn>
          </PanelFooter>
        </Panel>
      )}

      {isResultsTimesPanelOpen && <div className="sp-results-modal-overlay" aria-hidden="true" onClick={cancelResultsTimesPanel} />}

      {isResultsTimesPanelOpen && (
        <Panel active disableBodyStyleModifications disableFocusManagement extraClasses="sp-times-panel sp-results-times-panel" id="spz-results-times-filter-panel" onOverlayClick={cancelResultsTimesPanel} position="bottom" style={{ top: 'auto', bottom: 0 }}>
          <PanelHeader>
            <div className="sp-filter-panel-header-content">
              <span className="sp-times-panel-heading">Times</span>
              <Button appearance="secondary" extraClasses="sp-panel-reset-button" onClick={() => setDraftResultsTimeFilters([])} type="button">Reset</Button>
            </div>
          </PanelHeader>
          <PanelContent extraClasses="sp-times-panel-content">
            <div className="sp-time-filter-groups">
              {timeFilterSections.map((section, sectionIndex) => (
                <div className="sp-time-filter-group" key={section.id}>
                  <Text Elem="p" extraClasses="sp-time-filter-group-title">{section.title}</Text>
                  <div className="sp-time-option-list">
                    {section.options.map((option) => {
                      const isChecked = draftResultsTimeFilters.includes(option.key);
                      const isDisabled = !isChecked && getTimeOptionTripCount(option.key) === 0;
                      return (
                        <Checkbox
                          checked={isChecked}
                          disabled={isDisabled}
                          extraClasses={`sp-time-option${isDisabled ? ' sp-time-option--disabled' : ''}`}
                          id={`spz-results-time-filter-${option.key}`}
                          key={option.key}
                          label={<span className="sp-time-option-label"><Icon InlineIcon={option.icon} aria-hidden="true" size={4} /><span className="sp-time-option-text"><span className="sp-time-option-name">{option.label}</span><span className="sp-time-option-range">{option.time}</span></span></span>}
                          name="spz-results-time-filter"
                          onChange={() => toggleDraftResultsTimeFilter(option.key)}
                          value={option.key}
                        />
                      );
                    })}
                  </div>
                  {sectionIndex === 0 && <Divider extraClasses="sp-time-filter-divider" />}
                </div>
              ))}
            </div>
          </PanelContent>
          <PanelFooter extraClasses="sp-times-panel-footer">
            <PanelFooterColumn>
              <Button appearance="secondary" extraClasses="sp-times-footer-button sp-filter-cancel-button" onClick={cancelResultsTimesPanel} type="button">Cancel</Button>
            </PanelFooterColumn>
            <PanelFooterColumn>
              <Button appearance="primary" extraClasses="sp-times-footer-button" onClick={confirmResultsTimesPanel} type="button">
                Show trips ({draftTimeFilteredResults.length})
              </Button>
            </PanelFooterColumn>
          </PanelFooter>
        </Panel>
      )}

      {isPricePanelOpen && <div className="sp-results-modal-overlay" aria-hidden="true" onClick={cancelPricePanel} />}

      {tripDetailsSheet && (() => {
        const { legs, transfers } = buildTripLegs(tripDetailsSheet);
        const TransportIcon = tripDetailsSheet.mode === 'Train' ? IconTrain : IconBus;
        const brandName = tripDetailsSheet.mode === 'Train' ? 'FlixTrain' : 'FlixBus';
        return (
          <Panel
            active
            position="bottom"
            hasOverlay
            onOverlayClick={() => setTripDetailsSheet(null)}
            disableBodyStyleModifications
            disableFocusManagement
            extraClasses="sp-trip-details-panel"
            id="spz-trip-details-panel"
          >
            <PanelHeader>
              <div className="sp-tdp-header">
                <div className="sp-tdp-header-info">
                  <span className="sp-tdp-header-date">Sun, 20 Nov</span>
                  <span className="sp-tdp-header-meta">
                    <Icon InlineIcon={IconStopwatch} aria-hidden="true" size={3} />
                    {tripDetailsSheet.duration}
                    <span className="sp-tdp-header-sep" aria-hidden="true" />
                    {tripDetailsSheet.connection === 'Direct' ? (
                      'Direct'
                    ) : (
                      <>
                        <Icon InlineIcon={IconTransfer} aria-hidden="true" size={3} />
                        {tripDetailsSheet.connection}
                      </>
                    )}
                  </span>
                </div>
                <Button
                  appearance="link"
                  display="square"
                  extraClasses="sp-tdp-close"
                  aria-label="Close trip details"
                  type="button"
                  onClick={() => setTripDetailsSheet(null)}
                >
                  <Icon InlineIcon={IconClose} aria-hidden="true" size={4} />
                </Button>
              </div>
            </PanelHeader>
            <PanelContent extraClasses="sp-tdp-content">
              {legs.map((leg, legIndex) => (
                <React.Fragment key={legIndex}>
                  {legIndex > 0 && transfers[legIndex - 1] && (
                    <div className="sp-tdp-transfer-box">
                      <img src={arrowRightArcDots} width={24} height={24} alt="" aria-hidden="true" />
                      <span>Transfer time: {transfers[legIndex - 1].duration}</span>
                    </div>
                  )}
                  <div className="sp-tdp-leg">
                    <div className="sp-tdp-timeline">
                      <span className="sp-tdp-dot" />
                      <span className="sp-tdp-line" />
                      <span className="sp-tdp-dot sp-tdp-dot--arrival" />
                    </div>
                    <div className="sp-tdp-leg-stops">
                      <span className="sp-tdp-station">{leg.departureStation}</span>
                      <div className="sp-tdp-labels">
                        <span className="sp-tdp-mode-pill">
                          <Icon InlineIcon={TransportIcon} aria-hidden="true" size={3} />
                          {tripDetailsSheet.mode}
                        </span>
                        <Tag extraClasses="sp-tdp-brand-tag" tagTextColor="var(--hcr-content-primary-color, #353535)">
                          {brandName}
                        </Tag>
                      </div>
                      {tripDetailsSheet.connection !== 'Direct' && (
                        <span className="sp-tdp-stops-count">2 stops</span>
                      )}
                      <span className="sp-tdp-station sp-tdp-station--bold">{leg.arrivalStation}</span>
                    </div>
                    <div className="sp-tdp-times">
                      <span className="sp-tdp-time">{leg.departureTime}</span>
                      <span className="sp-tdp-time sp-tdp-time--bold">{leg.arrivalTime}</span>
                    </div>
                  </div>
                  <div className="sp-tdp-amenities">
                    <Icon InlineIcon={IconWifi} aria-hidden="true" size={4} />
                    <span>Free Wi-Fi</span>
                    <Icon InlineIcon={IconSocket} aria-hidden="true" size={4} />
                    <span>Charging point</span>
                  </div>
                  {tripDetailsSheet.premiumZone && legIndex === legs.length - 1 && (
                    <div className="sp-tdp-pz-tag-row">
                      <Tag extraClasses="sp-pz-pill">
                        <img src={iconDiamondLight} width={24} height={24} alt="" aria-hidden="true" className="sp-pz-pill-icon" />
                        Premium Zone
                        <button
                          type="button"
                          className="sp-pz-info-btn"
                          aria-label="Learn about Premium Zone"
                          onClick={() => setIsPremiumZoneInfoOpen(true)}
                        >
                          <Icon InlineIcon={IconInfo} aria-hidden="true" size={4} />
                        </button>
                      </Tag>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </PanelContent>
            <PanelFooter>
              <PanelFooterColumn>
                <Button
                  appearance="primary"
                  extraClasses="sp-tdp-continue"
                  type="button"
                  onClick={() => {
                    setTripDetailsSheet(null);
                    setIsSeatMapOpen(true);
                  }}
                >
                  Continue
                </Button>
              </PanelFooterColumn>
            </PanelFooter>
          </Panel>
        );
      })()}

      <SeatMap active={isSeatMapOpen} onClose={() => setIsSeatMapOpen(false)} />

      {isPremiumZoneInfoOpen && (
        <Panel
          active
          id="spz-pz-info-panel"
          position="bottom"
          hasOverlay
          onOverlayClick={() => setIsPremiumZoneInfoOpen(false)}
          disableBodyStyleModifications
          disableFocusManagement
          extraClasses="sp-pz-info-panel"
        >
          <PanelHeader>
            <div className="sp-pz-info-header">
              <span className="sp-pz-info-title">Premium Zone</span>
              <Button
                appearance="link"
                display="square"
                aria-label="Close"
                type="button"
                onClick={() => setIsPremiumZoneInfoOpen(false)}
              >
                <Icon InlineIcon={IconClose} aria-hidden="true" size={4} />
              </Button>
            </div>
          </PanelHeader>
          <PanelContent extraClasses="sp-pz-info-content">
            <Tag extraClasses="sp-pz-pill">
              <img src={iconDiamondLight} width={24} height={24} alt="" aria-hidden="true" className="sp-pz-pill-icon" />
              Premium Zone
            </Tag>
            <p className="sp-pz-info-tagline">Comfort | faster Wi-Fi | priority boarding</p>
            <img
              src={photoSeatPremiumZone}
              alt="Premium Zone seating interior"
              className="sp-pz-info-photo"
            />
            <p className="sp-pz-info-desc">
              A new way to travel for those who value comfort, privacy and a little more personal space. Choose a ride with <strong>Premium Zone</strong> available and select a seat in this area to enjoy a more comfortable journey, faster Wi-Fi and priority boarding.
            </p>
          </PanelContent>
        </Panel>
      )}

      {isPricePanelOpen && (
        <Panel active disableBodyStyleModifications disableFocusManagement extraClasses="sp-price-panel" id="spz-price-filter-panel" onOverlayClick={cancelPricePanel} position="bottom" style={{ top: 'auto', bottom: 0 }}>
          <PanelHeader>
            <div className="sp-filter-panel-header-content">
              <span className="sp-price-panel-heading">Price per passenger</span>
              <Button appearance="secondary" extraClasses="sp-panel-reset-button" onClick={() => setDraftPriceRange(priceBounds)} type="button">Reset</Button>
            </div>
          </PanelHeader>
          <PanelContent extraClasses="sp-price-panel-content">
            <div className="sp-price-range-shell">
              <Range
                aria-label="Minimum price"
                displayValues
                extraClasses="sp-price-range-control"
                format={(value) => `€${value}`}
                id="spz-price-range"
                max={priceBounds.max}
                min={priceBounds.min}
                onChange={(e) => updateDraftPriceMin(Number(e.target.value))}
                onInput={(e) => updateDraftPriceMin(Number((e.target as HTMLInputElement).value))}
                rangeEnd={{
                  'aria-label': 'Maximum price',
                  onChange: (e) => updateDraftPriceMax(Number(e.target.value)),
                  onInput: (e) => updateDraftPriceMax(Number((e.target as HTMLInputElement).value)),
                  value: effectiveDraftPriceRange.max,
                }}
                step={1}
                value={effectiveDraftPriceRange.min}
              />
            </div>
          </PanelContent>
          <PanelFooter extraClasses="sp-price-panel-footer">
            <PanelFooterColumn>
              <Button appearance="secondary" extraClasses="sp-price-footer-button sp-filter-cancel-button" onClick={cancelPricePanel} type="button">Cancel</Button>
            </PanelFooterColumn>
            <PanelFooterColumn>
              <Button appearance="primary" disabled={draftPriceFilteredResults.length === 0} extraClasses="sp-price-footer-button" onClick={confirmPricePanel} type="button">
                Show trips ({draftPriceFilteredResults.length})
              </Button>
            </PanelFooterColumn>
          </PanelFooter>
        </Panel>
      )}
    </main>
  );
};
