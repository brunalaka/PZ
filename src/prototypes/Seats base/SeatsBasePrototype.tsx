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

import flixbusLogo from '@flixbus/honeycomb/dist/img/logos/svg/flixbus-white.svg';
import heroImage from './hero-image.jpg';
import mapThumbnail from './map-thumbnail.png';
import './SeatsBasePrototype.css';
import { tripResults, type TripResult } from './resultsData';

const Highlight = ({ children }: { children: string }) => (
  <mark className="match-highlight">{children}</mark>
);

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
  { key: 'main-station', label: 'Main station only' },
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
  infoText,
  trip,
}: {
  anchorRef?: Ref<HTMLElement>;
  infoText?: TripInfoText | null;
  trip: TripResult;
}) => {
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

      {infoText && (
        <span className="trip-card-info-text">{infoText}</span>
      )}
    </article>
  );
};

const SearchResultsPage = ({
  appliedTimeFilters,
  areMoreResultsShown,
  onAppliedTimeFiltersChange,
  onBackToHome,
  onResetMoreResults,
  onShowMoreResults,
}: {
  appliedTimeFilters: TimeFilterKey[];
  areMoreResultsShown: boolean;
  onAppliedTimeFiltersChange: (filters: TimeFilterKey[]) => void;
  onBackToHome: () => void;
  onResetMoreResults: () => void;
  onShowMoreResults: () => void;
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
  const [shouldScrollToMoreResults, setShouldScrollToMoreResults] = useState(false);
  const firstAdditionalResultRef = useRef<HTMLElement | null>(null);
  const resultsListSectionRef = useRef<HTMLElement | null>(null);
  const loadMoreTimeoutRef = useRef<number | null>(null);
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
  const initialResults = sortedResults.slice(0, 10);
  const additionalResults = sortedResults.slice(10);
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

  useEffect(() => {
    if (!areMoreResultsShown || !shouldScrollToMoreResults) return;

    setShouldScrollToMoreResults(false);
    window.requestAnimationFrame(() => {
      firstAdditionalResultRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
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

  const handleTransportFilterChange = (nextTransportFilter: TransportFilter) => {
    if (nextTransportFilter === transportFilter) return;

    stopLoadingMoreResults();
    setIsAllFiltersPanelOpen(false);
    setIsSortPanelOpen(false);
    setIsResultsTimesPanelOpen(false);
    setIsPricePanelOpen(false);
    setTransportFilter(nextTransportFilter);
    onResetMoreResults();
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
    stopLoadingMoreResults();
    onResetMoreResults();
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

    stopLoadingMoreResults();
    onResetMoreResults();
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
    onResetMoreResults();
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
    stopLoadingMoreResults();
    onResetMoreResults();
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
    stopLoadingMoreResults();
    onResetMoreResults();
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
    stopLoadingMoreResults();
    onResetMoreResults();
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
    stopLoadingMoreResults();
    onResetMoreResults();
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

  const handleShowMoreResults = () => {
    if (areMoreResultsShown || isLoadingMoreResults) return;

    setIsLoadingMoreResults(true);
    loadMoreTimeoutRef.current = window.setTimeout(() => {
      onShowMoreResults();
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
            onClick={onBackToHome}
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

        <ScrollableFilterRow className="sp-results-filter-row" ariaLabel="Main filters">
          <button
            aria-label={isAllFiltersApplied ? `All filters, ${appliedAllFiltersCount} applied` : 'All filters'}
            aria-haspopup="dialog"
            aria-pressed={isAllFiltersApplied}
            className={`sp-results-tag sp-results-tag--icon${isAllFiltersApplied ? ' sp-results-tag--selected sp-results-tag--with-count' : ''}`}
            onClick={openAllFiltersPanel}
            type="button"
          >
            <Icon InlineIcon={IconFilter} aria-hidden="true" size={4} />
            {isAllFiltersApplied && (
              <span className="sp-all-filters-count-badge" aria-hidden="true">
                {appliedAllFiltersCount}
              </span>
            )}
            <span className="sp-visually-hidden">All filters</span>
          </button>
          <Tag
            Elem="button"
            aria-haspopup="dialog"
            display="outlined"
            extraClasses="sp-results-tag"
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
            extraClasses={`sp-results-tag${isResultsTimeFilterApplied ? ' sp-results-tag--selected' : ''}`}
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
            extraClasses={`sp-results-tag${activePriceRange ? ' sp-results-tag--selected' : ''}${isPriceFilterDisabled && !activePriceRange ? ' sp-results-tag--disabled' : ''}`}
            onClick={handlePriceTagClick}
            tagTextColor="#353535"
            type="button"
          >
            Price
            <Icon InlineIcon={activePriceRange ? IconClose : IconArrowDown} aria-hidden="true" size={3} />
          </Tag>
        </ScrollableFilterRow>
      </section>

      <section className="sp-quick-filters" aria-label="Quick filters">
        <ScrollableFilterRow className="sp-quick-filter-row">
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
                extraClasses={`sp-results-tag${isSelected ? ' sp-results-tag--selected' : ''}${isDisabled ? ' sp-results-tag--disabled' : ''}`}
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

      <section ref={resultsListSectionRef} className="sp-results-list-section" aria-label="Available trips">
        <Text Elem="p" small extraClasses="sp-results-count">{sortedResults.length} results</Text>

        {sortedResults.length === 0 ? (
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
                key={`${trip.departureTime}-${trip.arrivalTime}-${trip.departureStation}-${index}`}
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
                key={`${trip.departureTime}-${trip.arrivalTime}-${trip.departureStation}-${index + 10}`}
                trip={trip}
              />
            ))}
          </div>
        )}
      </section>

      {isAllFiltersPanelOpen && <div className="sp-results-modal-overlay" aria-hidden="true" onClick={cancelAllFiltersPanel} />}

      {isAllFiltersPanelOpen && (
        <Panel
          active
          disableBodyStyleModifications
          disableFocusManagement
          extraClasses="sp-all-filters-panel"
          id="sp-all-filters-panel"
          onOverlayClick={cancelAllFiltersPanel}
          position="bottom"
          style={{ top: 'auto', bottom: 0 }}
        >
          <PanelHeader>
            <div className="sp-filter-panel-header-content">
              <span className="sp-all-filters-panel-heading">Filters</span>
              <Button
                appearance="secondary"
                extraClasses="sp-panel-reset-button"
                onClick={resetAllFiltersPanel}
                type="button"
              >
                Reset
              </Button>
            </div>
          </PanelHeader>
          <PanelContent extraClasses="sp-all-filters-panel-content">
            <section className="sp-all-filters-section" aria-label="Trip duration">
              <Text Elem="p" extraClasses="sp-all-filters-section-title">
                Trip duration
              </Text>
              <div className="sp-duration-range-shell">
                <Range
                  aria-label="Minimum trip duration"
                  disabled={isAllFiltersDurationDisabled}
                  displayValues
                  extraClasses="sp-duration-range-control"
                  format={formatDurationLabel}
                  id="sp-trip-duration-range"
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

            <Divider extraClasses="sp-all-filters-divider" />

            <section className="sp-all-filters-section sp-all-filters-section--compact" aria-label="Unavailable trips">
              <Checkbox
                checked={draftShowUnavailableTrips}
                extraClasses="sp-all-filter-checkbox"
                id="sp-show-unavailable-trips"
                label="Show unavailable trips"
                name="sp-show-unavailable-trips"
                onChange={() => setDraftShowUnavailableTrips((isSelected) => !isSelected)}
                value="show-unavailable-trips"
              />
            </section>

            <Divider extraClasses="sp-all-filters-divider" />

            <section className="sp-all-filters-section" aria-label="Stops in Berlin">
              <Text Elem="p" extraClasses="sp-all-filters-section-title">
                Stops - Berlin
              </Text>
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
                      id={`sp-berlin-stop-${toIdSlug(option.station)}`}
                      key={option.station}
                      label={(
                        <span className="sp-station-filter-label">
                          <Icon InlineIcon={option.icon} aria-hidden="true" size={4} />
                          <span>{option.station} ({stationCount})</span>
                        </span>
                      )}
                      name="sp-berlin-stops"
                      onChange={() => toggleDraftBerlinStop(option.station)}
                      value={option.station}
                    />
                  );
                })}
              </div>
            </section>

            <Divider extraClasses="sp-all-filters-divider" />

            <section className="sp-all-filters-section" aria-label="Stops in Hamburg">
              <Text Elem="p" extraClasses="sp-all-filters-section-title">
                Stops - Hamburg
              </Text>
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
                      id={`sp-hamburg-stop-${toIdSlug(option.station)}`}
                      key={option.station}
                      label={(
                        <span className="sp-station-filter-label">
                          <Icon InlineIcon={option.icon} aria-hidden="true" size={4} />
                          <span>{option.station} ({stationCount})</span>
                        </span>
                      )}
                      name="sp-hamburg-stops"
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
              <Button
                appearance="secondary"
                extraClasses="sp-all-filters-footer-button sp-filter-cancel-button"
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
                extraClasses="sp-all-filters-footer-button"
                onClick={confirmAllFiltersPanel}
                type="button"
              >
                Show trips ({allFiltersDraftResults.length})
              </Button>
            </PanelFooterColumn>
          </PanelFooter>
        </Panel>
      )}

      {isSortPanelOpen && <div className="sp-results-modal-overlay" aria-hidden="true" onClick={cancelSortPanel} />}

      {isSortPanelOpen && (
        <Panel
          active
          disableBodyStyleModifications
          disableFocusManagement
          extraClasses="sp-sort-panel"
          id="sp-sort-filter-panel"
          onOverlayClick={cancelSortPanel}
          position="bottom"
          style={{ top: 'auto', bottom: 0 }}
        >
          <PanelHeader>
            <div className="sp-filter-panel-header-content">
              <span className="sp-sort-panel-heading">Sort by</span>
              <Button
                appearance="secondary"
                extraClasses="sp-panel-reset-button"
                onClick={resetSortPanel}
                type="button"
              >
                Reset
              </Button>
            </div>
          </PanelHeader>
          <PanelContent extraClasses="sp-sort-panel-content">
            <div className="sp-sort-option-list">
              {sortOptions.map((option) => (
                <Radio
                  checked={draftSort === option.key}
                  extraClasses="sp-sort-option"
                  id={`sp-sort-option-${option.key}`}
                  key={option.key}
                  label={(
                    <span className="sp-sort-option-label">
                      <span className="sp-sort-option-name">{option.label}</span>
                      {' '}
                      <span className="sp-sort-option-detail">({option.detail})</span>
                    </span>
                  )}
                  name="sp-sort-option"
                  onChange={() => setDraftSort(option.key)}
                  value={option.key}
                />
              ))}
            </div>
          </PanelContent>
          <PanelFooter extraClasses="sp-sort-panel-footer">
            <PanelFooterColumn>
              <Button
                appearance="secondary"
                extraClasses="sp-sort-footer-button sp-filter-cancel-button"
                onClick={cancelSortPanel}
                type="button"
              >
                Cancel
              </Button>
            </PanelFooterColumn>
            <PanelFooterColumn>
              <Button
                appearance="primary"
                extraClasses="sp-sort-footer-button"
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
        <div className="sp-results-modal-overlay" aria-hidden="true" onClick={cancelResultsTimesPanel} />
      )}

      {isResultsTimesPanelOpen && (
        <Panel
          active
          disableBodyStyleModifications
          disableFocusManagement
          extraClasses="sp-times-panel sp-results-times-panel"
          id="sp-results-times-filter-panel"
          onOverlayClick={cancelResultsTimesPanel}
          position="bottom"
          style={{ top: 'auto', bottom: 0 }}
        >
          <PanelHeader>
            <div className="sp-filter-panel-header-content">
              <span className="sp-times-panel-heading">Times</span>
              <Button
                appearance="secondary"
                extraClasses="sp-panel-reset-button"
                onClick={resetResultsTimesPanel}
                type="button"
              >
                Reset
              </Button>
            </div>
          </PanelHeader>
          <PanelContent extraClasses="sp-times-panel-content">
            <div className="sp-time-filter-groups">
              {timeFilterSections.map((section, sectionIndex) => (
                <div className="sp-time-filter-group" key={section.id}>
                  <Text Elem="p" extraClasses="sp-time-filter-group-title">
                    {section.title}
                  </Text>

                  <div className="sp-time-option-list">
                    {section.options.map((option) => {
                      const isChecked = draftResultsTimeFilters.includes(option.key);
                      const isDisabled = !isChecked && getTimeOptionTripCount(option.key) === 0;

                      return (
                        <Checkbox
                          checked={isChecked}
                          disabled={isDisabled}
                          extraClasses={`sp-time-option${isDisabled ? ' sp-time-option--disabled' : ''}`}
                          id={`sp-results-time-filter-${option.key}`}
                          key={option.key}
                          label={(
                            <span className="sp-time-option-label">
                              <Icon InlineIcon={option.icon} aria-hidden="true" size={4} />
                              <span className="sp-time-option-text">
                                <span className="sp-time-option-name">{option.label}</span>
                                <span className="sp-time-option-range">{option.time}</span>
                              </span>
                            </span>
                          )}
                          name="sp-results-time-filter"
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
              <Button
                appearance="secondary"
                extraClasses="sp-times-footer-button sp-filter-cancel-button"
                onClick={cancelResultsTimesPanel}
                type="button"
              >
                Cancel
              </Button>
            </PanelFooterColumn>
            <PanelFooterColumn>
              <Button
                appearance="primary"
                extraClasses="sp-times-footer-button"
                onClick={confirmResultsTimesPanel}
                type="button"
              >
                Show trips ({draftTimeFilteredResults.length})
              </Button>
            </PanelFooterColumn>
          </PanelFooter>
        </Panel>
      )}

      {isPricePanelOpen && <div className="sp-results-modal-overlay" aria-hidden="true" onClick={cancelPricePanel} />}

      {isPricePanelOpen && (
        <Panel
          active
          disableBodyStyleModifications
          disableFocusManagement
          extraClasses="sp-price-panel"
          id="sp-price-filter-panel"
          onOverlayClick={cancelPricePanel}
          position="bottom"
          style={{ top: 'auto', bottom: 0 }}
        >
          <PanelHeader>
            <div className="sp-filter-panel-header-content">
              <span className="sp-price-panel-heading">Price per passenger</span>
              <Button
                appearance="secondary"
                extraClasses="sp-panel-reset-button"
                onClick={resetPricePanel}
                type="button"
              >
                Reset
              </Button>
            </div>
          </PanelHeader>
          <PanelContent extraClasses="sp-price-panel-content">
            <div className="sp-price-range-shell">
              <Range
                aria-label="Minimum price"
                displayValues
                extraClasses="sp-price-range-control"
                format={(value) => `€${value}`}
                id="sp-price-range"
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
          <PanelFooter extraClasses="sp-price-panel-footer">
            <PanelFooterColumn>
              <Button
                appearance="secondary"
                extraClasses="sp-price-footer-button sp-filter-cancel-button"
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
                extraClasses="sp-price-footer-button"
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

export const SeatsBasePrototype = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [fromValue, setFromValue] = useState('Berlin');
  const [isFromPanelOpen, setIsFromPanelOpen] = useState(false);
  const [isTimesPanelOpen, setIsTimesPanelOpen] = useState(false);
  const [appliedTimeFilters, setAppliedTimeFilters] = useState<TimeFilterKey[]>([]);
  const [draftTimeFilters, setDraftTimeFilters] = useState<TimeFilterKey[]>([]);
  const [areMoreResultsShown, setAreMoreResultsShown] = useState(false);

  const closeFromPanel = () => setIsFromPanelOpen(false);

  const openFromPanel = () => {
    setIsTimesPanelOpen(false);
    setIsFromPanelOpen(true);
  };

  const selectBerlinAllStops = () => {
    setFromValue('Berlin (all stops)');
    closeFromPanel();
  };

  const openTimesPanel = () => {
    setDraftTimeFilters(appliedTimeFilters);
    setIsFromPanelOpen(false);
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
    setAreMoreResultsShown(false);
    setCurrentPage('results');
    window.scrollTo({ top: 0 });
  };

  const showHomepage = () => {
    setAreMoreResultsShown(false);
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
    }
  };

  const isTimeFilterApplied = appliedTimeFilters.length > 0;
  const hasModalOpen = isFromPanelOpen || isTimesPanelOpen;

  if (currentPage === 'results') {
    return (
      <SearchResultsPage
        appliedTimeFilters={appliedTimeFilters}
        areMoreResultsShown={areMoreResultsShown}
        onAppliedTimeFiltersChange={setAppliedTimeFilters}
        onBackToHome={showHomepage}
        onResetMoreResults={() => setAreMoreResultsShown(false)}
        onShowMoreResults={() => setAreMoreResultsShown(true)}
      />
    );
  }

  return (
    <main className="sp-search-homepage" aria-label="FlixBus search prototype">
      <HeaderBar extraClasses="sp-search-header">
        <Button
          aria-label="Open menu"
          display="square"
          extraClasses="sp-header-icon-button"
          type="button"
        >
          <Icon InlineIcon={IconBurger} aria-hidden="true" size={4} />
        </Button>

        <HeaderBrand
          alt="FlixBus"
          extraClasses="sp-search-logo"
          height="24"
          href="/"
          src={flixbusLogo}
          width="135"
        />

        <Button
          aria-label="Open profile"
          display="square"
          extraClasses="sp-header-icon-button sp-profile-button"
          type="button"
        >
          <Icon InlineIcon={IconProfileSolid} aria-hidden="true" size={6} />
        </Button>
      </HeaderBar>

      <section className="sp-hero-image" aria-label="Low cost bus travel">
        <img src={heroImage} alt="" aria-hidden="true" />
        <h1>Low cost bus travel from just €5</h1>
      </section>

      <form
        className="sp-search-mask"
        onSubmit={(event) => {
          event.preventDefault();
          showSearchResults();
        }}
      >
        <div className="sp-trip-type-selection" role="radiogroup" aria-label="Trip type">
          <Radio
            defaultChecked
            id="sp-trip-one-way"
            label="One Way"
            name="sp-trip-type"
            value="one-way"
          />
          <Radio
            id="sp-trip-round-trip"
            label="Round Trip"
            name="sp-trip-type"
            value="round-trip"
          />
        </div>

        <Input
          aria-haspopup="dialog"
          extraClasses="sp-search-field"
          iconLeft={<Icon InlineIcon={IconPinSolid} aria-hidden="true" />}
          id="sp-from"
          label="From"
          name="sp-from"
          onClick={openFromPanel}
          readOnly
          value={fromValue}
        />

        <Input
          extraClasses="sp-search-field"
          iconLeft={<Icon InlineIcon={IconPinSolid} aria-hidden="true" />}
          id="sp-to"
          label="To"
          name="sp-to"
          readOnly
          value="Hamburg"
        />

        <Input
          extraClasses="sp-search-field"
          iconLeft={<Icon InlineIcon={IconCalendarSolid} aria-hidden="true" />}
          id="sp-departure"
          label="Departure"
          name="sp-departure"
          readOnly
          value="Sun, 20 Nov"
        />

        <Select
          defaultValue="1-adult"
          extraClasses="sp-search-field sp-search-select"
          id="sp-passengers"
          label="Passengers"
          name="sp-passengers"
        >
          <SelectOption value="1-adult">1 Adult</SelectOption>
          <SelectOption value="2-adults">2 Adults</SelectOption>
          <SelectOption value="1-adult-1-child">1 Adult, 1 Child</SelectOption>
        </Select>

        <div className="sp-time-filter">
          <Text small extraClasses="sp-time-filter-copy">
            Want to travel at a specific time?
          </Text>
          <Tag
            Elem="button"
            appearance={isTimeFilterApplied ? 'selected' : undefined}
            aria-pressed={isTimeFilterApplied}
            display={isTimeFilterApplied ? 'subtle' : 'outlined'}
            extraClasses={`sp-time-filter-tag${isTimeFilterApplied ? ' sp-time-filter-tag--selected' : ''}`}
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
          extraClasses="sp-search-button"
          size="lg"
          type="submit"
        >
          Search
        </Button>
      </form>

      {hasModalOpen && <div className="sp-modal-overlay" aria-hidden="true" onClick={closeActiveHomeModal} />}

      {isFromPanelOpen && (
        <Panel
          active
          disableBodyStyleModifications
          disableFocusManagement
          extraClasses="sp-from-panel"
          fullSize
          id="sp-from-input-panel"
          onOverlayClick={closeFromPanel}
          position="bottom"
          style={{ top: 'auto', bottom: 0 }}
        >
          <PanelHeader>
            <span className="sp-from-panel-heading">From</span>
            <Button
              aria-label="Close"
              display="square"
              extraClasses="sp-from-panel-close-button"
              onClick={closeFromPanel}
              type="button"
            >
              <Icon InlineIcon={IconClose} aria-hidden="true" size={4} />
            </Button>
          </PanelHeader>
          <PanelContent extraClasses="sp-from-panel-content">
            <Input
              aria-label="Search for departure city"
              extraClasses="sp-from-panel-input"
              id="sp-from-panel-search"
              name="sp-from-panel-search"
              readOnly
              value="Ber"
            />

            <div className="sp-suggestions-list">
              <button className="sp-suggestion-row sp-suggestion-city" type="button" onClick={selectBerlinAllStops}>
                <span className="sp-suggestion-content">
                  <span className="sp-suggestion-main">
                    <Highlight>Ber</Highlight>lin <span>(all stops)</span>
                  </span>
                  <span className="sp-suggestion-sub">Berlin, Germany</span>
                </span>
              </button>

              <Divider extraClasses="sp-suggestion-divider" />

              <div className="sp-suggestion-row">
                <Icon InlineIcon={IconBusStop} aria-hidden="true" size={4} />
                <span className="sp-suggestion-main"><Highlight>Ber</Highlight>lin central bus station</span>
              </div>

              <Divider extraClasses="sp-suggestion-divider" />

              <div className="sp-suggestion-row">
                <Icon InlineIcon={IconTrainStop} aria-hidden="true" size={4} />
                <span className="sp-suggestion-main"><Highlight>Ber</Highlight>lin central station</span>
              </div>

              <Divider extraClasses="sp-suggestion-divider" />

              <div className="sp-suggestion-row">
                <Icon InlineIcon={IconBusStop} aria-hidden="true" size={4} />
                <span className="sp-suggestion-main"><Highlight>Ber</Highlight>lin Südkreuz</span>
              </div>

              <Divider extraClasses="sp-suggestion-divider" />

              <div className="sp-suggestion-row sp-suggestion-more">
                <Icon InlineIcon={IconOffer} aria-hidden="true" size={4} />
                <span className="sp-suggestion-main">5 other stations in <Highlight>Ber</Highlight>lin</span>
                <Icon InlineIcon={IconArrowRight} aria-hidden="true" size={4} />
              </div>

              <Divider extraClasses="sp-suggestion-divider" />

              <div className="sp-suggestion-row sp-suggestion-city">
                <span className="sp-suggestion-content">
                  <span className="sp-suggestion-main"><Highlight>Ber</Highlight>lin Airport BER, T 1/2 (2)</span>
                  <span className="sp-suggestion-sub">Germany</span>
                </span>
              </div>

              <Divider extraClasses="sp-suggestion-divider" />

              <div className="sp-suggestion-row sp-suggestion-city">
                <span className="sp-suggestion-content">
                  <span className="sp-suggestion-main"><Highlight>Ber</Highlight>gisch Gladbach</span>
                  <span className="sp-suggestion-sub">Germany</span>
                </span>
              </div>

              <Divider extraClasses="sp-suggestion-divider" />

              <div className="sp-suggestion-row">
                <Icon InlineIcon={IconTrainStop} aria-hidden="true" size={4} />
                <span className="sp-suggestion-main"><Highlight>Ber</Highlight>gisch Gladbach</span>
              </div>

              <Divider extraClasses="sp-suggestion-divider" />

              <div className="sp-suggestion-row">
                <Icon InlineIcon={IconTrainStop} aria-hidden="true" size={4} />
                <span className="sp-suggestion-main">Duckterath</span>
              </div>
            </div>

            <div className="sp-map-prompt">
              <img src={mapThumbnail} alt="" aria-hidden="true" />
              <div>
                <Text Elem="p" extraClasses="sp-map-prompt-title">Not sure where to start?</Text>
                <a href="#map">Explore the map</a>
              </div>
            </div>
          </PanelContent>
        </Panel>
      )}

      {isTimesPanelOpen && (
        <Panel
          active
          disableBodyStyleModifications
          disableFocusManagement
          extraClasses="sp-times-panel"
          id="sp-times-filter-panel"
          onOverlayClick={cancelTimesPanel}
          position="bottom"
          style={{ top: 'auto', bottom: 0 }}
        >
        <PanelHeader>
          <div className="sp-filter-panel-header-content">
            <span className="sp-times-panel-heading">Times</span>
            <Button
              appearance="secondary"
              extraClasses="sp-panel-reset-button"
              onClick={resetTimesPanel}
              type="button"
            >
              Reset
            </Button>
          </div>
        </PanelHeader>
        <PanelContent extraClasses="sp-times-panel-content">
          <div className="sp-time-filter-groups">
            {timeFilterSections.map((section, sectionIndex) => (
              <div className="sp-time-filter-group" key={section.id}>
                <Text Elem="p" extraClasses="sp-time-filter-group-title">
                  {section.title}
                </Text>

                <div className="sp-time-option-list">
                  {section.options.map((option) => (
                    <Checkbox
                      checked={draftTimeFilters.includes(option.key)}
                      extraClasses="sp-time-option"
                      id={`sp-time-filter-${option.key}`}
                      key={option.key}
                      label={(
                        <span className="sp-time-option-label">
                          <Icon InlineIcon={option.icon} aria-hidden="true" size={4} />
                          <span className="sp-time-option-text">
                            <span className="sp-time-option-name">{option.label}</span>
                            <span className="sp-time-option-range">{option.time}</span>
                          </span>
                        </span>
                      )}
                      name="sp-time-filter"
                      onChange={() => toggleDraftTimeFilter(option.key)}
                      value={option.key}
                    />
                  ))}
                </div>

                {sectionIndex === 0 && <Divider extraClasses="sp-time-filter-divider" />}
              </div>
            ))}
          </div>
        </PanelContent>
        <PanelFooter extraClasses="sp-times-panel-footer">
          <PanelFooterColumn>
            <Button
              appearance="secondary"
              extraClasses="sp-times-footer-button sp-filter-cancel-button"
              onClick={cancelTimesPanel}
              type="button"
            >
              Cancel
            </Button>
          </PanelFooterColumn>
          <PanelFooterColumn>
            <Button
              appearance="primary"
              extraClasses="sp-times-footer-button"
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
  );
};
