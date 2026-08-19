import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AgentResult, TripData } from './agent-types';
import { localSearch } from './local-search';
import {
  BackButton,
  Button,
  Calendar,
  CalendarHeaderSimple,
  ChoiceWrapper,
  ChoiceWrapperItem,
  Divider,
  Fieldset,
  Header,
  HeaderBrand,
  Panel,
  PanelContent,
  PanelFooter,
  PanelFooterColumn,
  PanelHeader,
  Quantity,
  Tag,
} from '@flixbus/honeycomb-react';
import {
  Icon,
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconBus,
  IconCheckmark,
  IconCheckmarkStrong,
  IconCheckmarkStrongSolid,
  IconDelete,
  IconLuggageGroup,
  IconLuggageBooked,
  IconMicrophone,
  IconQuestion,
  IconSeat,
  IconSend,
  IconSpark,
  IconThumbsDown,
  IconThumbsUp,
  IconTrip,
} from '@flixbus/honeycomb-icons-react';

import './results-page.css';

function formatTime(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr;
  const period = h < 12 ? 'am' : 'pm';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${period}`;
}

function formatPrice(price: number, currency: string): string {
  const sym: Record<string, string> = { EUR: '€', USD: '$', GBP: '£' };
  const s = sym[currency] ?? currency + ' ';
  const [intPart, decPart = '00'] = price.toFixed(2).split('.');
  return `${s}${intPart}.${decPart}`;
}

function splitPrice(price: number): { sym: string; int: string; dec: string } {
  const [intPart, decPart = '00'] = price.toFixed(2).split('.');
  return { sym: '', int: intPart, dec: `.${decPart}` };
}

const TRIP_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TRIP_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatTripDate(date: Date): string {
  return `${TRIP_DAYS[date.getDay()]}, ${date.getDate()} ${TRIP_MONTHS[date.getMonth()]}`;
}

const OUTBOUND_DATE = 'Fri, 4 Oct';


type SeatVariant = 'classic' | 'front' | 'panorama';
interface Seat { id: string; variant: SeatVariant; }

const SEAT_PRICE: Record<SeatVariant, number> = { classic: 7.09, front: 9.99, panorama: 12.89 };
const SEAT_DESCRIPTIONS: Record<SeatVariant, string> = {
  panorama: 'Panorama seat with a view',
  front: 'Front seat',
  classic: 'Regular seat',
};

interface LuggageSelectedBlockProps {
  additional: number;
  special: number;
  tripData: TripData | null;
  returnDate?: Date;
  totalPrice: number;
  seatConfirmed: boolean;
  confirmedSeats: string[];
  showSeat: boolean;
  onSelectSeat?: () => void;
  onAddReturnTrip: () => void;
  anyChatActive?: boolean;
}

const LuggageSelectedBlock = React.forwardRef<HTMLDivElement, LuggageSelectedBlockProps>(
  ({ additional, special, tripData, returnDate, totalPrice, seatConfirmed, confirmedSeats, showSeat, onSelectSeat, onAddReturnTrip, anyChatActive }, ref) => {
    const [cardDone, setCardDone] = React.useState(false);
    const [actionsDone, setActionsDone] = React.useState(false);
    const [totalExpanded, setTotalExpanded] = React.useState(false);
    const currSym = '$';
    const SERVICE_FEE = 0.99;
    const seatTotal = confirmedSeats.reduce((sum, id) => {
      const seat = AVAILABLE_SEATS.find((s) => s.id === id);
      return sum + (seat ? SEAT_PRICE[seat.variant] : 0);
    }, 0);
    const breakdownItems = tripData ? (
      <>
        <div className="aif-trip-selected__card-total-row">
          <span>1 Adult</span>
          <span>{currSym}{tripData.price.toFixed(2)}</span>
        </div>
        {seatConfirmed && confirmedSeats.length > 0 && (
          <div className="aif-trip-selected__card-total-row">
            <span>{confirmedSeats.length} Seat{confirmedSeats.length > 1 ? 's' : ''}</span>
            <span>{currSym}{seatTotal.toFixed(2)}</span>
          </div>
        )}
        {additional > 0 && (
          <div className="aif-trip-selected__card-total-row">
            <span>{additional} Additional luggage</span>
            <span>{currSym}{(additional * LUGGAGE_OPTIONS.additional.price).toFixed(2)}</span>
          </div>
        )}
        {special > 0 && (
          <div className="aif-trip-selected__card-total-row">
            <span>{special} Special luggage</span>
            <span>{currSym}{(special * LUGGAGE_OPTIONS.special.price).toFixed(2)}</span>
          </div>
        )}
      </>
    ) : null;

    const extraRows = (
      <>
        {seatConfirmed && confirmedSeats.length > 0 && (
          <>
            <Divider />
            <div className="aif-trip-selected__card-extra-row">
              <Icon InlineIcon={IconSeat} aria-hidden="true" extraClasses="aif-trip-selected__card-extra-icon" />
              <span className="aif-trip-selected__card-extra-text">
                {confirmedSeats.length} Seat{confirmedSeats.length > 1 ? 's' : ''}: {confirmedSeats.join(', ')}
              </span>
            </div>
          </>
        )}
        {additional > 0 && (
          <>
            <Divider />
            <div className="aif-trip-selected__card-extra-row">
              <Icon InlineIcon={IconLuggageGroup} aria-hidden="true" extraClasses="aif-trip-selected__card-extra-icon" />
              <span className="aif-trip-selected__card-extra-text">{additional} Additional luggage</span>
            </div>
          </>
        )}
        {special > 0 && (
          <>
            <Divider />
            <div className="aif-trip-selected__card-extra-row">
              <Icon InlineIcon={IconLuggageGroup} aria-hidden="true" extraClasses="aif-trip-selected__card-extra-icon" />
              <span className="aif-trip-selected__card-extra-text">{special} Special luggage</span>
            </div>
          </>
        )}
      </>
    );

    return (
      <div className="aif-luggage-selected" ref={ref}>
        {/* Header — streams */}
        <div className="aif-trip-selected__header">
          <Icon InlineIcon={IconCheckmarkStrongSolid} aria-hidden="true" extraClasses="aif-trip-selected__checkmark aif-reveal" />
          <StreamingText text="Luggage added!" className="aif-trip-selected__heading" onComplete={() => setCardDone(true)} />
        </div>

        {/* Trip card + total — fades in after header streams */}
        {cardDone && tripData && (
          <div className="aif-trip-selected__card-group aif-reveal" onAnimationEnd={() => setActionsDone(true)}>
            <div className="aif-trip-selected__card">
              <div className="aif-trip-selected__card-body">
                <p className="aif-trip-selected__card-date">{OUTBOUND_DATE}</p>
                <div className="aif-trip-selected__card-top">
                  <div className="aif-trip-selected__card-col">
                    <div className="aif-trip-selected__card-time-row">
                      <h3 className="aif-trip-selected__card-time">{formatTime(tripData.dep)}</h3>
                      <Divider extraClasses="aif-trip-selected__card-divider" />
                    </div>
                    <span className="aif-trip-selected__card-station">{tripData.depStation}</span>
                  </div>
                  <div className="aif-trip-selected__card-col">
                    <div className="aif-trip-selected__card-time-row">
                      <h3 className="aif-trip-selected__card-time">{formatTime(tripData.arr)}</h3>
                    </div>
                    <span className="aif-trip-selected__card-station">{tripData.arrStation}</span>
                  </div>
                </div>
                {returnDate && (
                  <>
                    <Divider />
                    <p className="aif-trip-selected__card-date">{formatTripDate(returnDate)}</p>
                    <div className="aif-trip-selected__card-top">
                      <div className="aif-trip-selected__card-col">
                        <div className="aif-trip-selected__card-time-row">
                          <h3 className="aif-trip-selected__card-time">{formatTime(tripData.dep)}</h3>
                          <Divider extraClasses="aif-trip-selected__card-divider" />
                        </div>
                        <span className="aif-trip-selected__card-station">{tripData.depStation}</span>
                      </div>
                      <div className="aif-trip-selected__card-col">
                        <div className="aif-trip-selected__card-time-row">
                          <h3 className="aif-trip-selected__card-time">{formatTime(tripData.arr)}</h3>
                        </div>
                        <span className="aif-trip-selected__card-station">{tripData.arrStation}</span>
                      </div>
                    </div>
                  </>
                )}
                {extraRows}
              </div>
            </div>
            {/* Total accordion */}
            <div className="aif-trip-selected__total">
              <button
                className="aif-trip-selected__card-total-btn"
                onClick={() => setTotalExpanded((v) => !v)}
                aria-expanded={totalExpanded}
              >
                <span className="aif-trip-selected__card-total-label">Total</span>
                <span className="aif-trip-selected__card-total-amount">{currSym}{totalPrice.toFixed(2)}</span>
                <Icon
                  InlineIcon={totalExpanded ? IconArrowUp : IconArrowDown}
                  aria-hidden="true"
                  extraClasses="aif-trip-selected__card-total-chevron"
                />
              </button>
              {totalExpanded && (
                <div className="aif-trip-selected__card-total-breakdown">
                  {returnDate ? (
                    <>
                      <div className="aif-trip-selected__card-total-section">
                        <span className="aif-trip-selected__card-total-section-heading">Outbound</span>
                        {breakdownItems}
                      </div>
                      <Divider />
                      <div className="aif-trip-selected__card-total-section">
                        <span className="aif-trip-selected__card-total-section-heading">Return</span>
                        {breakdownItems}
                      </div>
                    </>
                  ) : breakdownItems}
                  <Divider />
                  <div className="aif-trip-selected__card-total-row aif-trip-selected__card-total-row--service">
                    <span>Service fee</span>
                    <span>{currSym}{SERVICE_FEE.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions — fades in after card, hidden once a new chat is initiated */}
        {actionsDone && !anyChatActive && (
          <div className="aif-reveal aif-actions">
            <p className="aif-actions__label">What would you like to do next?</p>
            <div className="aif-actions__ctas">
              {showSeat && (
                <Button aria-label="Select seat" onClick={onSelectSeat}>
                  <Icon InlineIcon={IconSeat} aria-hidden="true" />Select seat
                </Button>
              )}
              <Button aria-label="Add return trip" onClick={onAddReturnTrip}>
                <Icon InlineIcon={IconTrip} aria-hidden="true" />Add return trip
              </Button>
              <Button appearance="primary" aria-label="Go to checkout">
                Go to checkout<Icon InlineIcon={IconArrowRight} aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
LuggageSelectedBlock.displayName = 'LuggageSelectedBlock';

const AVAILABLE_SEATS: Seat[] = [
  // Panorama — row 1 right (great views, front of bus)
  { id: '1C', variant: 'panorama' }, { id: '1D', variant: 'panorama' },
  // Front — row 2 right + rows 3–5 all seats
  { id: '2C', variant: 'front' }, { id: '2D', variant: 'front' },
  { id: '3A', variant: 'front' }, { id: '3B', variant: 'front' }, { id: '3C', variant: 'front' }, { id: '3D', variant: 'front' },
  { id: '4A', variant: 'front' }, { id: '4B', variant: 'front' }, { id: '4C', variant: 'front' }, { id: '4D', variant: 'front' },
  { id: '5A', variant: 'front' }, { id: '5B', variant: 'front' }, { id: '5C', variant: 'front' }, { id: '5D', variant: 'front' },
  // Classic — rows 6–11 all seats + 12D + 20A + 20B
  { id: '6A', variant: 'classic' }, { id: '6B', variant: 'classic' }, { id: '6C', variant: 'classic' }, { id: '6D', variant: 'classic' },
  { id: '7A', variant: 'classic' }, { id: '7B', variant: 'classic' }, { id: '7C', variant: 'classic' }, { id: '7D', variant: 'classic' },
  { id: '8A', variant: 'classic' }, { id: '8B', variant: 'classic' }, { id: '8C', variant: 'classic' }, { id: '8D', variant: 'classic' },
  { id: '9A', variant: 'classic' }, { id: '9B', variant: 'classic' }, { id: '9C', variant: 'classic' }, { id: '9D', variant: 'classic' },
  { id: '10A', variant: 'classic' }, { id: '10B', variant: 'classic' }, { id: '10C', variant: 'classic' }, { id: '10D', variant: 'classic' },
  { id: '11A', variant: 'classic' }, { id: '11B', variant: 'classic' }, { id: '11C', variant: 'classic' }, { id: '11D', variant: 'classic' },
  { id: '12D', variant: 'classic' },
  { id: '20A', variant: 'classic' }, { id: '20B', variant: 'classic' },
];


function renderAIText(text: string, baseClass = 'aif-results-page__summary') {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let bulletGroup: string[] = [];
  let key = 0;

  const renderBulletContent = (text: string) => {
    const [main, dims] = text.split(' | ');
    const priceMatch = main.match(/^(.*?)(\s*\$[\d.]+)$/);
    const mainNode = priceMatch
      ? <>{priceMatch[1]} <span className="aif-ai-price">{priceMatch[2].trim()}</span></>
      : main;
    if (dims) {
      return <>{mainNode}<span className="aif-ai-dims">{dims}</span></>;
    }
    return mainNode;
  };

  const flushBullets = () => {
    if (bulletGroup.length === 0) return;
    nodes.push(
      <ul key={key++} className={`${baseClass} aif-ai-list`}>
        {bulletGroup.map((b, i) => <li key={i}>{renderBulletContent(b)}</li>)}
      </ul>
    );
    bulletGroup = [];
  };

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const bulletMatch = trimmed.match(/^[-*]\s+(.*)/);
    if (bulletMatch) {
      bulletGroup.push(bulletMatch[1]);
    } else {
      flushBullets();
      nodes.push(<p key={key++} className={baseClass}>{trimmed}</p>);
    }
  }
  flushBullets();
  return <>{nodes}</>;
}

function StreamingText({ text, className, onComplete }: {
  text: string;
  className: string;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = React.useState('');

  React.useEffect(() => {
    const words = text.split(' ');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(words.slice(0, i).join(' '));
      if (i >= words.length) {
        clearInterval(id);
        onComplete?.();
      }
    }, 45);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <p className={className}>{displayed}</p>;
}

function SparkAnimatedIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="aif-spark-animated" aria-hidden="true">
      <path className="aif-spark-animated__star aif-spark-animated__star--1" d="M5.06 6.93C4.4 6.26 2 6 2 6s2.44-.27 3.1-.93C5.78 4.4 6 2 6 2s.23 2.42.9 3.09 3.11.9 3.11.9-2.37.26-3.04.93S6.01 10 6.01 10s-.28-2.4-.95-3.07" />
      <path className="aif-spark-animated__star aif-spark-animated__star--2" d="M15.79 10.17C14.45 8.84 13.98 4 13.98 4s-.44 4.82-1.77 6.15C10.88 11.5 6 12.02 6 12.02s4.8.5 6.13 1.83S14.02 20 14.02 20s.57-4.82 1.9-6.16S22 11.98 22 11.98s-4.88-.48-6.21-1.8" />
      <path className="aif-spark-animated__star aif-spark-animated__star--3" d="M7.99 16s-.16 1.8-.66 2.3S5 19 5 19s1.8.2 2.3.7S8 22 8 22s.22-1.8.72-2.31c.5-.5 2.28-.7 2.28-.7s-1.83-.18-2.33-.67S7.99 16 7.99 16" />
    </svg>
  );
}

function StreamingMessage({ text, baseClass = 'aif-results-page__summary', onComplete }: {
  text: string;
  baseClass?: string;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const words = text.split(' ');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(words.slice(0, i).join(' '));
      if (i >= words.length) {
        clearInterval(id);
        onComplete?.();
      }
    }, 45);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="aif-reveal">{renderAIText(displayed, baseClass)}</div>;
}

const TripSelectedBlock = React.forwardRef<HTMLDivElement, {
  tripData: TripData | null;
  returnDate?: Date;
  seatChatActive: boolean;
  seatConfirmed: boolean;
  seatPhase: 'preference' | 'options' | null;
  seatPreferences: string[];
  seatOptions: Seat[];
  userPreferenceBubble: string;
  onPreferencesChange: (values: string[]) => void;
  onPreferenceConfirm: () => void;
  onSeatOptionSelect: (seatId: string) => void;
  luggageChatActive: boolean;
  luggageConfirmed: boolean;
  startSeatChat: () => void;
  startLuggageChat: () => void;
  onAddReturnTrip: () => void;
  confirmedSeats: string[];
  luggagePhase: 'type' | 'quantity' | null;
  selectedLuggageType: 'additional' | 'special' | null;
  luggageUserTypeBubble: string;
  luggageQuantity: number;
  onLuggageTypeSelect: (type: string) => void;
  onLuggageQuantitySelect: (qty: number) => void;
  confirmedLuggageAdditional: number;
  confirmedLuggageSpecial: number;
  seatSelectedRef: React.RefObject<HTMLDivElement | null>;
  luggageSelectedRef: React.RefObject<HTMLDivElement | null>;
  chatOrder: Array<'seat' | 'luggage'>;
}>(({
  tripData, returnDate, seatChatActive, seatConfirmed, seatPhase, seatPreferences, seatOptions,
  userPreferenceBubble, onPreferencesChange, onPreferenceConfirm, onSeatOptionSelect,
  luggageChatActive, luggageConfirmed,
  startSeatChat, startLuggageChat,
  confirmedSeats,
  luggagePhase, selectedLuggageType, luggageUserTypeBubble, luggageQuantity,
  onLuggageTypeSelect, onLuggageQuantitySelect,
  confirmedLuggageAdditional, confirmedLuggageSpecial, seatSelectedRef, luggageSelectedRef,
  chatOrder,
}, ref) => {
  const [cardDone, setCardDone] = React.useState(false);
  const [luggageDone, setLuggageDone] = React.useState(false);
  const [seatCardDone, setSeatCardDone] = React.useState(false);
  const [seatActionsDone, setSeatActionsDone] = React.useState(false);
  const [totalExpanded, setTotalExpanded] = React.useState(false);
  const [seatCardTotalExpanded, setSeatCardTotalExpanded] = React.useState(false);
  const [seatPrefTextDone, setSeatPrefTextDone] = React.useState(false);
  const [seatOptsTextDone, setSeatOptsTextDone] = React.useState(false);
  const [luggageTypeTextDone, setLuggageTypeTextDone] = React.useState(false);
  const [luggageQtyTextDone, setLuggageQtyTextDone] = React.useState(false);
  const [returnTripChatActive, setReturnTripChatActive] = React.useState(false);
  const seatCardGroupRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (seatActionsDone && seatCardGroupRef.current) {
      seatCardGroupRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [seatActionsDone]);

  const currSym = tripData ? ({ EUR: '€', USD: '$', GBP: '£' }[tripData.currency] ?? tripData.currency) : '';
  const seatTotal = confirmedSeats.reduce((sum, id) => {
    const seat = AVAILABLE_SEATS.find((s) => s.id === id);
    return sum + (seat ? SEAT_PRICE[seat.variant] : 0);
  }, 0);
  const luggageTotal =
    confirmedLuggageAdditional * LUGGAGE_OPTIONS.additional.price +
    confirmedLuggageSpecial * LUGGAGE_OPTIONS.special.price;
  const SERVICE_FEE = 0.99;
  const totalPrice = (tripData?.price ?? 0) + seatTotal + luggageTotal + SERVICE_FEE;

  const breakdownItems = tripData ? (
    <>
      <div className="aif-trip-selected__card-total-row">
        <span>1 Adult</span>
        <span>{currSym}{tripData.price.toFixed(2)}</span>
      </div>
      {seatConfirmed && confirmedSeats.length > 0 && (
        <div className="aif-trip-selected__card-total-row">
          <span>{confirmedSeats.length} Seat{confirmedSeats.length > 1 ? 's' : ''}</span>
          <span>{currSym}{seatTotal.toFixed(2)}</span>
        </div>
      )}
      {luggageConfirmed && confirmedLuggageAdditional > 0 && (
        <div className="aif-trip-selected__card-total-row">
          <span>{confirmedLuggageAdditional} Additional luggage</span>
          <span>{currSym}{(confirmedLuggageAdditional * LUGGAGE_OPTIONS.additional.price).toFixed(2)}</span>
        </div>
      )}
      {luggageConfirmed && confirmedLuggageSpecial > 0 && (
        <div className="aif-trip-selected__card-total-row">
          <span>{confirmedLuggageSpecial} Special luggage</span>
          <span>{currSym}{(confirmedLuggageSpecial * LUGGAGE_OPTIONS.special.price).toFixed(2)}</span>
        </div>
      )}
    </>
  ) : null;

  return (
    <div className="aif-trip-selected" ref={ref}>
      {/* Header — streams */}
      <div className="aif-trip-selected__header">
        <Icon InlineIcon={IconCheckmarkStrongSolid} aria-hidden="true" extraClasses="aif-trip-selected__checkmark aif-reveal" />
        <StreamingText text="Trip selected!" className="aif-trip-selected__heading" onComplete={() => setCardDone(true)} />
      </div>

      {/* Trip card + total — fades in after header streams */}
      {cardDone && tripData && (
        <div className="aif-trip-selected__card-group aif-reveal" onAnimationEnd={() => setLuggageDone(true)}>
          {/* Card body */}
          <div className="aif-trip-selected__card">
            <div className="aif-trip-selected__card-body">
              <p className="aif-trip-selected__card-date">{OUTBOUND_DATE}</p>
              <div className="aif-trip-selected__card-top">
                <div className="aif-trip-selected__card-col">
                  <div className="aif-trip-selected__card-time-row">
                    <h3 className="aif-trip-selected__card-time">{formatTime(tripData.dep)}</h3>
                    <Divider extraClasses="aif-trip-selected__card-divider" />
                  </div>
                  <span className="aif-trip-selected__card-station">{tripData.depStation}</span>
                </div>
                <div className="aif-trip-selected__card-col">
                  <div className="aif-trip-selected__card-time-row">
                    <h3 className="aif-trip-selected__card-time">{formatTime(tripData.arr)}</h3>
                  </div>
                  <span className="aif-trip-selected__card-station">{tripData.arrStation}</span>
                </div>
              </div>

              {/* Return leg */}
              {returnDate && (
                <>
                  <Divider />
                  <p className="aif-trip-selected__card-date">{formatTripDate(returnDate)}</p>
                  <div className="aif-trip-selected__card-top">
                    <div className="aif-trip-selected__card-col">
                      <div className="aif-trip-selected__card-time-row">
                        <h3 className="aif-trip-selected__card-time">{formatTime(tripData.dep)}</h3>
                        <Divider extraClasses="aif-trip-selected__card-divider" />
                      </div>
                      <span className="aif-trip-selected__card-station">{tripData.depStation}</span>
                    </div>
                    <div className="aif-trip-selected__card-col">
                      <div className="aif-trip-selected__card-time-row">
                        <h3 className="aif-trip-selected__card-time">{formatTime(tripData.arr)}</h3>
                      </div>
                      <span className="aif-trip-selected__card-station">{tripData.arrStation}</span>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Total accordion — separate card, 12px gap below card body */}
          <div className="aif-trip-selected__total">
            <button
              className="aif-trip-selected__card-total-btn"
              onClick={() => setTotalExpanded((v) => !v)}
              aria-expanded={totalExpanded}
            >
              <span className="aif-trip-selected__card-total-label">Total</span>
              <span className="aif-trip-selected__card-total-amount">
                {currSym}{totalPrice.toFixed(2)}
              </span>
              <Icon
                InlineIcon={totalExpanded ? IconArrowUp : IconArrowDown}
                aria-hidden="true"
                extraClasses="aif-trip-selected__card-total-chevron"
              />
            </button>
            {totalExpanded && (
              <div className="aif-trip-selected__card-total-breakdown">
                {returnDate ? (
                  <>
                    <div className="aif-trip-selected__card-total-section">
                      <span className="aif-trip-selected__card-total-section-heading">Outbound</span>
                      {breakdownItems}
                    </div>
                    <Divider />
                    <div className="aif-trip-selected__card-total-section">
                      <span className="aif-trip-selected__card-total-section-heading">Return</span>
                      {breakdownItems}
                    </div>
                  </>
                ) : breakdownItems}
                <Divider />
                <div className="aif-trip-selected__card-total-row aif-trip-selected__card-total-row--service">
                  <span>Service fee</span>
                  <span>{currSym}{SERVICE_FEE.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Included luggage — fades in after card */}
      {luggageDone && (
        <div className="aif-reveal aif-trip-selected__luggage">
          <p className="aif-trip-selected__luggage-title">Included per person</p>
          <p className="aif-trip-selected__luggage-detail">1 Hand Luggage | 7 kg · 42x30x18 cm</p>
          <p className="aif-trip-selected__luggage-detail">1 Hold Luggage | 20 kg · 80x50x30 cm</p>
        </div>
      )}

      {/* Chats rendered in the order they were initiated */}
      {luggageDone && chatOrder.map((kind) => kind === 'seat' ? (
        <React.Fragment key="seat">
          {/* Seat chat — ChoiceWrapper UI */}
          {(seatChatActive || seatConfirmed) && seatPhase && (
            <div className="aif-seat-chat">
              <div className="aif-seat-chat__bubble aif-seat-chat__bubble--user">I want to select a seat</div>
              {/* Step 1: preference checkboxes */}
              {seatPhase === 'preference' ? (
                <StreamingMessage key="seat-pref-q" text="Surely, what type of seat would you prefer:" baseClass="aif-seat-chat__ai-text" onComplete={() => setSeatPrefTextDone(true)} />
              ) : (
                <p className="aif-seat-chat__ai-text">Surely, what type of seat would you prefer:</p>
              )}
              {(seatPrefTextDone || seatPhase !== 'preference') && <div className="aif-choice-block">
                <ChoiceWrapper
                  multi
                  appearance="column"
                  value={seatPreferences}
                  onChoiceChange={seatPhase === 'preference'
                    ? (values) => onPreferencesChange(values as string[])
                    : undefined}
                  extraClasses={`aif-choice-wrapper${seatPhase !== 'preference' ? ' aif-choice-wrapper--inactive' : ''}`}
                  style={{ marginBottom: 0 }}
                >
                  <ChoiceWrapperItem id="pref-aisle" value="aisle" name="seat-prefs" label="Aisle seat" />
                  <ChoiceWrapperItem id="pref-window" value="window" name="seat-prefs" label="Window seat" />
                  <ChoiceWrapperItem id="pref-front" value="front" name="seat-prefs" label="Front of the bus" />
                  <ChoiceWrapperItem id="pref-back" value="back" name="seat-prefs" label="Back of the bus" />
                </ChoiceWrapper>
                {seatPhase === 'preference' && (
                  <div className="aif-choice-confirm">
                    <Button
                      appearance="primary"
                      disabled={seatPreferences.length === 0}
                      onClick={onPreferenceConfirm}
                    >
                      Confirm
                    </Button>
                  </div>
                )}
              </div>}

              {/* Step 2: user bubble + seat options */}
              {(seatPhase === 'options' || seatConfirmed) && (
                <>
                  <div className="aif-seat-chat__bubble aif-seat-chat__bubble--user">{userPreferenceBubble}</div>
                  <StreamingMessage key="seat-opts-q" text="I have these options that match your preferences. Which one do you prefer?" baseClass="aif-seat-chat__ai-text" onComplete={() => setSeatOptsTextDone(true)} />
                  {(seatOptsTextDone || seatConfirmed) && seatOptions.length > 0 && (
                    <ChoiceWrapper
                      appearance="column"
                      value={seatConfirmed ? confirmedSeats[0] : undefined}
                      onChoiceChange={!seatConfirmed
                        ? (value) => onSeatOptionSelect(value as string)
                        : undefined}
                      extraClasses={`aif-choice-wrapper${seatConfirmed ? ' aif-choice-wrapper--inactive' : ''}`}
                      style={{ marginBottom: 0 }}
                    >
                      {seatOptions.map((seat) => (
                        <ChoiceWrapperItem
                          key={seat.id}
                          id={`seat-opt-${seat.id}`}
                          value={seat.id}
                          name="seat-options"
                          label={
                            <>
                              <strong>{seat.id}, ${SEAT_PRICE[seat.variant].toFixed(2)}</strong>
                              <br />
                              <span>{SEAT_DESCRIPTIONS[seat.variant]}</span>
                            </>
                          }
                        />
                      ))}
                    </ChoiceWrapper>
                  )}
                  {seatConfirmed && confirmedSeats.length > 0 && (
                    <div className="aif-seat-chat__bubble aif-seat-chat__bubble--user">
                      {confirmedSeats[0]}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {/* Seat selected */}
          {seatConfirmed && (
            <div className="aif-seat-selected" ref={seatSelectedRef}>
              <div className="aif-trip-selected__header">
                <Icon InlineIcon={IconCheckmarkStrongSolid} aria-hidden="true" extraClasses="aif-trip-selected__checkmark aif-reveal" />
                <StreamingText text="Seat selected!" className="aif-trip-selected__heading" onComplete={() => setSeatCardDone(true)} />
              </div>
              {seatCardDone && tripData && (
                <div ref={seatCardGroupRef} className="aif-trip-selected__card-group aif-reveal" onAnimationEnd={() => setSeatActionsDone(true)}>
                  {/* Card body */}
                  <div className="aif-trip-selected__card">
                    <div className="aif-trip-selected__card-body">
                      <p className="aif-trip-selected__card-date">{OUTBOUND_DATE}</p>
                      <div className="aif-trip-selected__card-top">
                        <div className="aif-trip-selected__card-col">
                          <div className="aif-trip-selected__card-time-row">
                            <h3 className="aif-trip-selected__card-time">{formatTime(tripData.dep)}</h3>
                            <Divider extraClasses="aif-trip-selected__card-divider" />
                          </div>
                          <span className="aif-trip-selected__card-station">{tripData.depStation}</span>
                        </div>
                        <div className="aif-trip-selected__card-col">
                          <div className="aif-trip-selected__card-time-row">
                            <h3 className="aif-trip-selected__card-time">{formatTime(tripData.arr)}</h3>
                          </div>
                          <span className="aif-trip-selected__card-station">{tripData.arrStation}</span>
                        </div>
                      </div>
                      {returnDate && (
                        <>
                          <Divider />
                          <p className="aif-trip-selected__card-date">{formatTripDate(returnDate)}</p>
                          <div className="aif-trip-selected__card-top">
                            <div className="aif-trip-selected__card-col">
                              <div className="aif-trip-selected__card-time-row">
                                <h3 className="aif-trip-selected__card-time">{formatTime(tripData.dep)}</h3>
                                <Divider extraClasses="aif-trip-selected__card-divider" />
                              </div>
                              <span className="aif-trip-selected__card-station">{tripData.depStation}</span>
                            </div>
                            <div className="aif-trip-selected__card-col">
                              <div className="aif-trip-selected__card-time-row">
                                <h3 className="aif-trip-selected__card-time">{formatTime(tripData.arr)}</h3>
                              </div>
                              <span className="aif-trip-selected__card-station">{tripData.arrStation}</span>
                            </div>
                          </div>
                        </>
                      )}
                      {confirmedSeats.length > 0 && (
                        <>
                          <Divider />
                          <div className="aif-trip-selected__card-extra-row">
                            <Icon InlineIcon={IconSeat} aria-hidden="true" extraClasses="aif-trip-selected__card-extra-icon" />
                            <span className="aif-trip-selected__card-extra-text">
                              {confirmedSeats.length} Seat{confirmedSeats.length > 1 ? 's' : ''}: {confirmedSeats.join(', ')}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Total accordion */}
                  <div className="aif-trip-selected__total">
                    <button
                      className="aif-trip-selected__card-total-btn"
                      onClick={() => setSeatCardTotalExpanded((v) => !v)}
                      aria-expanded={seatCardTotalExpanded}
                    >
                      <span className="aif-trip-selected__card-total-label">Total</span>
                      <span className="aif-trip-selected__card-total-amount">{currSym}{totalPrice.toFixed(2)}</span>
                      <Icon
                        InlineIcon={seatCardTotalExpanded ? IconArrowUp : IconArrowDown}
                        aria-hidden="true"
                        extraClasses="aif-trip-selected__card-total-chevron"
                      />
                    </button>
                    {seatCardTotalExpanded && (
                      <div className="aif-trip-selected__card-total-breakdown">
                        {returnDate ? (
                          <>
                            <div className="aif-trip-selected__card-total-section">
                              <span className="aif-trip-selected__card-total-section-heading">Outbound</span>
                              {breakdownItems}
                            </div>
                            <Divider />
                            <div className="aif-trip-selected__card-total-section">
                              <span className="aif-trip-selected__card-total-section-heading">Return</span>
                              {breakdownItems}
                            </div>
                          </>
                        ) : breakdownItems}
                        <Divider />
                        <div className="aif-trip-selected__card-total-row aif-trip-selected__card-total-row--service">
                          <span>Service fee</span>
                          <span>{currSym}{SERVICE_FEE.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {seatActionsDone && !luggageConfirmed && !luggageChatActive && !returnTripChatActive && (
                <div className="aif-reveal aif-actions">
                  <p className="aif-actions__label">What would you like to do next?</p>
                  <div className="aif-actions__ctas">
                    <Button aria-label="Add luggage" onClick={() => startLuggageChat()}>
                      <Icon InlineIcon={IconLuggageGroup} aria-hidden="true" />Add luggage
                    </Button>
                    {!returnTripChatActive && (
                      <Button aria-label="Add return trip" onClick={() => setReturnTripChatActive(true)}>
                        <Icon InlineIcon={IconTrip} aria-hidden="true" />Add return trip
                      </Button>
                    )}
                    <Button appearance="primary" aria-label="Go to checkout">
                      Go to checkout<Icon InlineIcon={IconArrowRight} aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment key="luggage">
          {/* Luggage chat — ChoiceWrapper UI */}
          {(luggageChatActive || luggageConfirmed) && luggagePhase && (
            <div className="aif-seat-chat">
              <div className="aif-seat-chat__bubble aif-seat-chat__bubble--user">I want to add luggage</div>
              {/* Phase 1: type selection */}
              {luggagePhase === 'type' ? (
                <StreamingMessage key="luggage-type-q" text="Surely, what type of luggage would you like:" baseClass="aif-seat-chat__ai-text" onComplete={() => setLuggageTypeTextDone(true)} />
              ) : (
                <p className="aif-seat-chat__ai-text">Surely, what type of luggage would you like:</p>
              )}
              {(luggageTypeTextDone || luggagePhase !== 'type') && <ChoiceWrapper
                appearance="column"
                value={selectedLuggageType ?? undefined}
                onChoiceChange={luggagePhase === 'type' ? (value) => onLuggageTypeSelect(value as string) : undefined}
                extraClasses={`aif-choice-wrapper${luggagePhase !== 'type' ? ' aif-choice-wrapper--inactive' : ''}`}
                style={{ marginBottom: 0 }}
              >
                <ChoiceWrapperItem
                  id="luggage-additional"
                  value="additional"
                  name="luggage-type"
                  label={
                    <>
                      <strong>Additional luggage, ${LUGGAGE_OPTIONS.additional.price.toFixed(2)}</strong>
                      <br />
                      <span>{LUGGAGE_OPTIONS.additional.dims}</span>
                    </>
                  }
                />
                <ChoiceWrapperItem
                  id="luggage-special"
                  value="special"
                  name="luggage-type"
                  label={
                    <>
                      <strong>Special luggage, ${LUGGAGE_OPTIONS.special.price.toFixed(2)}</strong>
                      <br />
                      <span>{LUGGAGE_OPTIONS.special.dims}</span>
                    </>
                  }
                />
              </ChoiceWrapper>}

              {/* Phase 2: quantity */}
              {(luggagePhase === 'quantity' || luggageConfirmed) && (
                <>
                  <div className="aif-seat-chat__bubble aif-seat-chat__bubble--user">{luggageUserTypeBubble}</div>
                  {luggagePhase === 'quantity' ? (
                    <StreamingMessage
                      key="luggage-qty-q"
                      text={`How many pieces of ${selectedLuggageType === 'additional' ? 'additional' : 'special'} luggage do you need?`}
                      baseClass="aif-seat-chat__ai-text"
                      onComplete={() => setLuggageQtyTextDone(true)}
                    />
                  ) : (
                    <p className="aif-seat-chat__ai-text">{`How many pieces of ${selectedLuggageType === 'additional' ? 'additional' : 'special'} luggage do you need?`}</p>
                  )}
                  {(luggageQtyTextDone || luggageConfirmed) && <ChoiceWrapper
                    appearance="column"
                    value={luggageConfirmed ? String(luggageQuantity) : undefined}
                    onChoiceChange={!luggageConfirmed ? (value) => onLuggageQuantitySelect(Number(value)) : undefined}
                    extraClasses={`aif-choice-wrapper${luggageConfirmed ? ' aif-choice-wrapper--inactive' : ''}`}
                    style={{ marginBottom: 0 }}
                  >
                    {[1, 2].map((n) => (
                      <ChoiceWrapperItem key={n} id={`qty-${n}`} value={String(n)} name="luggage-qty" label={String(n)} />
                    ))}
                  </ChoiceWrapper>}
                  {luggageConfirmed && (
                    <div className="aif-seat-chat__bubble aif-seat-chat__bubble--user">{luggageQuantity}</div>
                  )}
                </>
              )}
            </div>
          )}
          {/* Luggage confirmation */}
          {luggageConfirmed && (
            <div className="aif-reveal">
              <LuggageSelectedBlock
                additional={confirmedLuggageAdditional}
                special={confirmedLuggageSpecial}
                tripData={tripData}
                returnDate={returnDate}
                totalPrice={totalPrice}
                seatConfirmed={seatConfirmed}
                confirmedSeats={confirmedSeats}
                ref={luggageSelectedRef}
                showSeat={!seatConfirmed}
                onSelectSeat={() => startSeatChat()}
                onAddReturnTrip={() => setReturnTripChatActive(true)}
                anyChatActive={seatChatActive || returnTripChatActive}
              />
            </div>
          )}
        </React.Fragment>
      ))}

      {/* Return trip chat */}
      {returnTripChatActive && (
        <div className="aif-seat-chat">
          <div className="aif-seat-chat__bubble aif-seat-chat__bubble--user">I want to add a return trip</div>
          <StreamingMessage
            key="return-trip-q"
            text={`I'll help you with that! When do you want to travel back to ${tripData ? tripData.depStation.split(' (')[0] : 'your departure city'}?`}
            baseClass="aif-seat-chat__ai-text"
          />
        </div>
      )}

      {/* Initial actions — only before any chat starts, after luggage section appears */}
      {luggageDone && chatOrder.length === 0 && !returnTripChatActive && (
        <div className="aif-reveal aif-actions">
          <p className="aif-actions__label">What would you like to do next?</p>
          <div className="aif-actions__ctas">
            <Button aria-label="Select seat" onClick={() => startSeatChat()}>
              <Icon InlineIcon={IconSeat} aria-hidden="true" />Select seat
            </Button>
            <Button aria-label="Add luggage" onClick={() => startLuggageChat()}>
              <Icon InlineIcon={IconLuggageBooked} aria-hidden="true" />Add luggage
            </Button>
            <Button aria-label="Add return trip" onClick={() => setReturnTripChatActive(true)}>
              <Icon InlineIcon={IconTrip} aria-hidden="true" />Add return trip
            </Button>
            <Button appearance="primary" aria-label="Go to checkout">
              Go to checkout<Icon InlineIcon={IconArrowRight} aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});
TripSelectedBlock.displayName = 'TripSelectedBlock';

const RecGroup = React.forwardRef<HTMLDivElement, {
  result: AgentResult;
  onConfirm: (trip: TripData) => void;
  onAllDone: () => void;
  onAskQuestion: (tripId: string, query: string) => void;
}>(({ result, onConfirm, onAllDone, onAskQuestion }, ref) => {
  const [step, setStep] = React.useState(-1);
  const hasMore = result.moreResults.length > 0;
  const lastRecIdx = result.recommendations.length - 1;

  return (
    <div className="aif-results-page__rec-group" ref={ref}>
      <StreamingMessage text={result.summary} onComplete={() => setStep(0)} />

      {result.recommendations.map((rec, idx) => {
        const { int: priceInt, dec: priceDec } = splitPrice(rec.trip.price);
        const currSym = { EUR: '€', USD: '$', GBP: '£' }[rec.trip.currency] ?? rec.trip.currency;
        return (
          <RecItem
            key={rec.trip.tripId}
            heading={rec.heading}
            description={rec.description}
            active={step >= idx}
            onCardRevealed={() => {
              setStep(idx + 1);
              if (idx === lastRecIdx && !hasMore) onAllDone();
            }}
          >
            <div className="aif-tc">
              <div className="aif-tc__brand-row">
                <Tag small extraClasses={rec.trip.carrier === 'FlixBus' ? 'aif-tc__brand-tag' : 'aif-tc__brand-tag--greyhound'}>{rec.trip.carrier}</Tag>
              </div>
              <div className="aif-tc__info-row">
                <div className="aif-tc__cols">
                  <div className="aif-tc__col-dep">
                    <div className="aif-tc__dep-time-row">
                      <span className="aif-tc__time">{formatTime(rec.trip.dep)}</span>
                      <span className="aif-tc__duration-line" />
                    </div>
                    <span className="aif-tc__station">{rec.trip.depStation}</span>
                  </div>
                  <div className="aif-tc__col-arr">
                    <span className="aif-tc__time">{formatTime(rec.trip.arr)}</span>
                    <span className="aif-tc__station">{rec.trip.arrStation}</span>
                  </div>
                </div>
                <div className="aif-tc__price-block">
                  <div className="aif-tc__price-amount">
                    <span className="aif-tc__price-sym">{currSym}</span>
                    <span className="aif-tc__price-int">{priceInt}</span>
                    <span className="aif-tc__price-dec">{priceDec}</span>
                  </div>
                  <p className="aif-tc__price-per">per passenger</p>
                </div>
              </div>
              <div className="aif-tc__action-row">
                <div className="aif-tc__action-left">
                  <div className="aif-tc__details">
                    <Icon InlineIcon={IconBus} aria-hidden="true" extraClasses="aif-tc__details-icon" />
                    <span className="aif-tc__details-text">
                      {rec.trip.stops}<span className="aif-tc__details-sep"> | </span>{rec.trip.duration}
                    </span>
                  </div>
                </div>
                <div className="aif-tc__action-right">
                  <div className="aif-tc__price-block-mobile">
                    <div className="aif-tc__price-amount">
                      <span className="aif-tc__price-sym">{currSym}</span>
                      <span className="aif-tc__price-int">{priceInt}</span>
                      <span className="aif-tc__price-dec">{priceDec}</span>
                    </div>
                    <p className="aif-tc__price-per">per passenger</p>
                  </div>
                </div>
              </div>
              <Divider extraClasses="aif-tc__divider" />
              <div className="aif-tc__ctas">
                <Button
                  appearance="link"
                  aria-label="Ask question about this trip"
                  extraClasses="aif-tc__cta-ask"
                  onClick={() => {
                    onAskQuestion(
                      rec.trip.tripId,
                      `I want to ask a question about this trip:\n\n${formatTime(rec.trip.dep)} - ${formatTime(rec.trip.arr)}\n${rec.trip.depStation} to ${rec.trip.arrStation}\n${formatPrice(rec.trip.price, rec.trip.currency)}`
                    );
                  }}
                >
                  <Icon InlineIcon={IconQuestion} aria-hidden="true" />
                  Ask question
                </Button>
                <Button
                  appearance="link"
                  aria-label="Select this trip"
                  extraClasses="aif-tc__cta-select"
                  onClick={() => onConfirm(rec.trip)}
                >
                  <Icon InlineIcon={IconCheckmarkStrong} aria-hidden="true" extraClasses="aif-tc__cta-select-icon" />
                  Select trip
                </Button>
              </div>
            </div>
          </RecItem>
        );
      })}

      {result.moreResults.length > 0 && step >= result.recommendations.length && (
        <div className="aif-reveal aif-more-results" onAnimationEnd={onAllDone}>
          <p className="aif-more-results__heading">More results for your search</p>
          <div className="aif-more-results__scroll">
            {result.moreResults.map((trip) => {
              const { int: priceInt, dec: priceDec } = splitPrice(trip.price);
              const currSym = { EUR: '€', USD: '$', GBP: '£' }[trip.currency] ?? trip.currency;
              return (
                <div
                  key={trip.tripId}
                  className="aif-tc aif-tc--compact"
                >
                  <div className="aif-tc__brand-row">
                    <Tag small extraClasses={trip.carrier === 'FlixBus' ? 'aif-tc__brand-tag' : 'aif-tc__brand-tag--greyhound'}>{trip.carrier}</Tag>
                  </div>
                  <div className="aif-tc__info-row">
                    <div className="aif-tc__cols">
                      <div className="aif-tc__col-dep">
                        <div className="aif-tc__dep-time-row">
                          <span className="aif-tc__time">{formatTime(trip.dep)}</span>
                          <span className="aif-tc__duration-line" />
                        </div>
                        <span className="aif-tc__station">{trip.depStation}</span>
                      </div>
                      <div className="aif-tc__col-arr">
                        <span className="aif-tc__time">{formatTime(trip.arr)}</span>
                        <span className="aif-tc__station">{trip.arrStation}</span>
                      </div>
                    </div>
                  </div>
                  <div className="aif-tc__action-row">
                    <div className="aif-tc__action-left">
                      <div className="aif-tc__details">
                        <Icon InlineIcon={IconBus} aria-hidden="true" extraClasses="aif-tc__details-icon" />
                        <span className="aif-tc__details-text">
                          {trip.stops}<span className="aif-tc__details-sep"> | </span>{trip.duration}
                        </span>
                      </div>
                    </div>
                    <div className="aif-tc__action-right">
                      <div className="aif-tc__price-block-mobile">
                        <div className="aif-tc__price-amount">
                          <span className="aif-tc__price-sym">{currSym}</span>
                          <span className="aif-tc__price-int">{priceInt}</span>
                          <span className="aif-tc__price-dec">{priceDec}</span>
                        </div>
                        <p className="aif-tc__price-per">per passenger</p>
                      </div>
                    </div>
                  </div>
                  <Divider extraClasses="aif-tc__divider" />
                  <div className="aif-tc__ctas aif-tc__ctas--stacked">
                    <Button
                      appearance="link"
                      aria-label="Ask question about this trip"
                      extraClasses="aif-tc__cta-ask"
                      onClick={() => {
                        onAskQuestion(
                          trip.tripId,
                          `I want to ask a question about this trip:\n\n${formatTime(trip.dep)} - ${formatTime(trip.arr)}\n${trip.depStation} to ${trip.arrStation}\n${formatPrice(trip.price, trip.currency)}`
                        );
                      }}
                    >
                      <Icon InlineIcon={IconQuestion} aria-hidden="true" />
                      Ask question
                    </Button>
                    <Button
                      appearance="link"
                      aria-label="Select this trip"
                      extraClasses="aif-tc__cta-select"
                      onClick={() => onConfirm(trip)}
                    >
                      <Icon InlineIcon={IconCheckmarkStrong} aria-hidden="true" extraClasses="aif-tc__cta-select-icon" />
                      Select trip
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});
RecGroup.displayName = 'RecGroup';

function RecItem({ heading, description, children, active, onCardRevealed }: {
  heading: string;
  description: string;
  children: React.ReactNode;
  active: boolean;
  onCardRevealed: () => void;
}) {
  const [cardVisible, setCardVisible] = React.useState(false);
  if (!active) return null;
  return (
    <div className="aif-results-page__recommendation">
      <div className="aif-results-page__rec-explanation">
        <StreamingText text={heading} className="aif-results-page__rec-heading" />
        <StreamingText
          text={description}
          className="aif-results-page__rec-description"
          onComplete={() => setCardVisible(true)}
        />
      </div>
      {cardVisible && (
        <div className="aif-reveal" onAnimationEnd={onCardRevealed}>
          {children}
        </div>
      )}
    </div>
  );
}

function getMatchingSeats(preferences: string[]): Seat[] {
  const wantWindow = preferences.includes('window');
  const wantAisle  = preferences.includes('aisle');
  const wantFront  = preferences.includes('front');
  const wantBack   = preferences.includes('back');

  const candidates = AVAILABLE_SEATS.filter((s) => {
    const col = s.id.slice(-1);
    const isWindow = col === 'A' || col === 'D';
    const rowNum = parseInt(s.id);
    const isFront = rowNum <= 5;
    if (wantWindow && !isWindow) return false;
    if (wantAisle  && isWindow)  return false;
    if (wantFront  && !isFront)  return false;
    if (wantBack   && isFront)   return false;
    return true;
  });

  const pool = candidates.length >= 3 ? candidates : AVAILABLE_SEATS;
  return pool.slice(0, 3);
}

const LUGGAGE_OPTIONS = {
  additional: { label: 'Additional luggage', price: 22.99, dims: '50 lb · 31×20×12 in' },
  special:    { label: 'Special luggage',    price: 33.99, dims: '75 lb · 95 in (x + y + z)' },
};


function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches);
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

export const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as { query?: string; activeFilters?: string[] } | null;

  const [inputValue, setInputValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isTranscribed, setIsTranscribed] = React.useState(false);
  const [bars, setBars] = React.useState<(number | null)[]>(() => Array(200).fill(null));
  const [isLoading, setIsLoading] = React.useState(false);
  const [agentError, setAgentError] = React.useState<string | null>(null);
  const [agentResult, setAgentResult] = React.useState<AgentResult | null>(null);
  const userQuery = routeState?.query ?? '';
  const [activePanel, setActivePanel] = React.useState<'change-date' | 'return-date' | 'add-passengers' | null>(null);
  const [tripConfirmed, setTripConfirmed] = React.useState(false);
  const [selectedReturnDate, setSelectedReturnDate] = React.useState<Date | undefined>(undefined);
  const [changeDateStart, setChangeDateStart] = React.useState<Date | undefined>(undefined);
  const [changeDateEnd, setChangeDateEnd] = React.useState<Date | undefined>(undefined);
  const [paxAdults, setPaxAdults] = React.useState(0);
  const [paxChildren, setPaxChildren] = React.useState(0);
  const [paxBikes, setPaxBikes] = React.useState(0);
  const [paxWheelchair, setPaxWheelchair] = React.useState(0);

  const [seatConfirmed, setSeatConfirmed] = React.useState(false);
  const [confirmedSeats, setConfirmedSeats] = React.useState<string[]>([]);
  const [seatPhase, setSeatPhase] = React.useState<'preference' | 'options' | null>(null);
  const [seatPreferences, setSeatPreferences] = React.useState<string[]>([]);
  const [seatOptions, setSeatOptions] = React.useState<Seat[]>([]);
  const [userPreferenceBubble, setUserPreferenceBubble] = React.useState('');
  const [luggageConfirmed, setLuggageConfirmed] = React.useState(false);
  const [confirmedLuggageAdditional, setConfirmedLuggageAdditional] = React.useState(0);
  const [confirmedLuggageSpecial, setConfirmedLuggageSpecial] = React.useState(0);
  const [askedTripId, setAskedTripId] = React.useState<string | null>(null);
  const [chatOrder, setChatOrder] = React.useState<Array<'seat' | 'luggage'>>([]);
  const [seatChatActive, setSeatChatActive] = React.useState(false);
  const [luggageChatActive, setLuggageChatActive] = React.useState(false);
  const [luggagePhase, setLuggagePhase] = React.useState<'type' | 'quantity' | null>(null);
  const [selectedLuggageType, setSelectedLuggageType] = React.useState<'additional' | 'special' | null>(null);
  const [luggageUserTypeBubble, setLuggageUserTypeBubble] = React.useState('');
  const [luggageQuantity, setLuggageQuantity] = React.useState(1);
  const [followUpMessages, setFollowUpMessages] = React.useState<Array<{ query: string; reply: string }>>([]);
  const [followUpLoading, setFollowUpLoading] = React.useState(false);
  const [recsDone, setRecsDone] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 1027px)');
  const today = React.useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const maxDate = React.useMemo(() => new Date(today.getFullYear(), today.getMonth() + 6, 0), [today]);

  const [confirmedTripData, setConfirmedTripData] = React.useState<TripData | null>(null);

  const confirmAndClose = (trip?: TripData) => {
    setTripConfirmed(true);
    if (trip) setConfirmedTripData(trip);
    setActivePanel(null);
  };

  const tripSelectedRef = React.useRef<HTMLDivElement>(null);
  const seatSelectedRef = React.useRef<HTMLDivElement>(null);
  const luggageSelectedRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const agentResultRef = React.useRef<HTMLDivElement>(null);
  const followUpEndRef = React.useRef<HTMLDivElement>(null);
  const inlineLoadingRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (agentResult) {
      agentResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [agentResult]);

  React.useEffect(() => {
    if (tripConfirmed) {
      tripSelectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [tripConfirmed]);

  React.useEffect(() => {
    if (seatConfirmed) {
      seatSelectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [seatConfirmed]);

  React.useEffect(() => {
    if (luggageConfirmed) {
      luggageSelectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [luggageConfirmed]);

  React.useEffect(() => {
    if (askedTripId) {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      inputRef.current?.focus();
    }
  }, [askedTripId]);

  React.useEffect(() => {
    if (followUpMessages.length > 0) {
      followUpEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [followUpMessages]);

  React.useEffect(() => {
    if (followUpLoading) {
      inlineLoadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [followUpLoading]);

  // Reserve space for the sticky footer so scrollIntoView doesn't place content behind it
  React.useEffect(() => {
    const prev = document.documentElement.style.scrollPaddingBottom;
    document.documentElement.style.scrollPaddingBottom = '100px';
    return () => { document.documentElement.style.scrollPaddingBottom = prev; };
  }, []);

  const startSeatChat = React.useCallback(() => {
    setChatOrder((prev) => prev.includes('seat') ? prev : [...prev, 'seat']);
    setSeatChatActive(true);
    setSeatPhase('preference');
    setSeatPreferences([]);
    setSeatOptions([]);
  }, []);

  const handlePreferenceConfirm = React.useCallback(() => {
    const prefLabels: Record<string, string> = {
      aisle: 'Aisle seat', window: 'Window seat', front: 'Front of the bus', back: 'Back of the bus',
    };
    const bubble = seatPreferences.length > 0
      ? seatPreferences.map((p) => prefLabels[p]).join(', ')
      : 'Any seat';
    setUserPreferenceBubble(bubble);
    setSeatOptions(getMatchingSeats(seatPreferences));
    setSeatPhase('options');
  }, [seatPreferences]);

  const handleSeatOptionSelect = React.useCallback((seatId: string) => {
    setConfirmedSeats([seatId]);
    setSeatConfirmed(true);
    setSeatChatActive(false);
  }, []);

  const startLuggageChat = React.useCallback(() => {
    setChatOrder((prev) => prev.includes('luggage') ? prev : [...prev, 'luggage']);
    setLuggageChatActive(true);
    setLuggagePhase('type');
    setSelectedLuggageType(null);
    setLuggageUserTypeBubble('');
    setLuggageQuantity(1);
  }, []);

  const handleLuggageTypeSelect = React.useCallback((type: string) => {
    const label = type === 'additional'
      ? `Additional luggage, $${LUGGAGE_OPTIONS.additional.price.toFixed(2)}`
      : `Special luggage, $${LUGGAGE_OPTIONS.special.price.toFixed(2)}`;
    setSelectedLuggageType(type as 'additional' | 'special');
    setLuggageUserTypeBubble(label);
    setLuggagePhase('quantity');
  }, []);

  const handleLuggageQuantitySelect = React.useCallback((qty: number) => {
    setLuggageQuantity(qty);
    if (selectedLuggageType === 'additional') {
      setConfirmedLuggageAdditional(qty);
    } else if (selectedLuggageType === 'special') {
      setConfirmedLuggageSpecial(qty);
    }
    setLuggageConfirmed(true);
    setLuggageChatActive(false);
  }, [selectedLuggageType]);

  const sendFollowUp = React.useCallback((message: string) => {
    const m = message.toLowerCase();
    const isSeatQuery = /seat|sit|sitting|place|spot|window|aisle|front|back|upper|lower deck/.test(m);
    const isLuggageQuery = /luggage|bag|baggage|suitcase|backpack/.test(m);

    if (isSeatQuery && tripConfirmed && !seatConfirmed && !seatChatActive) {
      startSeatChat();
      return;
    }
    if (isLuggageQuery && tripConfirmed && !luggageConfirmed && !luggageChatActive) {
      startLuggageChat();
      return;
    }

    setFollowUpLoading(true);
    setTimeout(() => {
      setFollowUpMessages((prev) => [...prev, {
        query: message,
        reply: 'For more details about this trip, please visit flixbus.com.',
      }]);
      setFollowUpLoading(false);
    }, 800);
  }, [tripConfirmed, seatConfirmed, seatChatActive, luggageConfirmed, luggageChatActive, startSeatChat, startLuggageChat]);

  const runAgent = React.useCallback((message: string, filters: string[] = []) => {
    setIsLoading(true);
    setAgentError(null);
    // Small timeout so the loading state renders before the synchronous work
    setTimeout(() => {
      try {
        const result = localSearch(message, filters);
        setAgentResult(result);
      } catch {
        setAgentError('Could not process your request. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  }, []);

  React.useEffect(() => {
    if (routeState?.query) {
      runAgent(routeState.query, routeState.activeFilters ?? []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleValidateAudio = () => {
    setIsRecording(false);
    setInputValue('Which is the cheapest morning trip?');
    setIsTranscribed(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleDeleteRecording = () => {
    setIsRecording(false);
  };

  React.useEffect(() => {
    if (!isRecording) return;
    setBars(Array(200).fill(null));
    let phase = 0;
    const id = setInterval(() => {
      phase += 0.18;
      const raw =
        Math.sin(phase * 1.3) * 0.35 +
        Math.sin(phase * 3.9) * 0.25 +
        (Math.random() - 0.2) * 0.4;
      const amp = Math.min(1, Math.max(0, raw));
      setBars((prev) => [...prev.slice(1), amp]);
    }, 80);
    return () => clearInterval(id);
  }, [isRecording]);

  const closePanel = () => setActivePanel(null);

  return (
    <div
      className="aif-results-page"
      style={{
        '--ai-color': '#e100e1',
        '--ai-dark-color': '#8f008f',
      } as React.CSSProperties}
    >
      <Header
        brand={
          <HeaderBrand
            alt="FlixBus logo"
            href="/ai-flow/home"
            src="https://honeycomb.flixbus.com/dist/7.2.13/img/logos/svg/flixbus-white.svg"
          />
        }
        burgerMenu={
          <BackButton
            aria-label="Go back"
            extraClasses="aif-results-page__back-btn"
            onClick={() => navigate('/ai-flow/chat')}
          />
        }
      />

      <div className="aif-results-page__content">
        <BackButton
          aria-label="Go back"
          extraClasses="aif-results-page__back-btn-desktop"
          onClick={() => navigate('/ai-flow/chat')}
        >
          Back
        </BackButton>
        {/* Intro */}
        <div className="aif-results-page__intro">
          <Icon
            InlineIcon={IconSpark}
            aria-hidden="true"
            size={6}
            extraClasses="aif-results-page__spark"
          />
          <p className="aif-results-page__title">Find your trip with AI</p>
        </div>

        {/* User message bubble */}
        {userQuery && (
          <div className="aif-results-page__bubble-row">
            <div className="aif-results-page__bubble">{userQuery}</div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="aif-results-page__loading">
            <SparkAnimatedIcon />
            <p className="aif-results-page__loading-text">Looking for trips...</p>
          </div>
        )}

        {/* Error state */}
        {agentError && !isLoading && (
          <p className="aif-results-page__agent-error">{agentError}</p>
        )}

        {/* AI response — only shown once loaded */}
        {agentResult && !isLoading && agentResult.recommendations.length === 0 && (
          <div className="aif-reveal" ref={agentResultRef} onAnimationEnd={() => setRecsDone(true)}>
            <p className="aif-results-page__summary">{agentResult.summary}</p>
          </div>
        )}

        {agentResult && !isLoading && agentResult.recommendations.length > 0 && (
          <RecGroup
            result={agentResult}
            ref={agentResultRef}
            onConfirm={confirmAndClose}
            onAllDone={() => setRecsDone(true)}
            onAskQuestion={(tripId, query) => {
              setAskedTripId(tripId);
              setRecsDone(true);
              setFollowUpMessages(prev => [...prev, {
                query,
                reply: 'Sure, what would you like to know about this trip?',
              }]);
            }}
          />
        )}

        {/* Actions suggestion — shown after all recs finish, hidden once a trip is confirmed */}

        {!tripConfirmed && recsDone && <div className="aif-reveal aif-actions">
          <p className="aif-actions__label">What would you like to do next?</p>
        </div>}

        {/* Follow-up conversation — appended below all results, never replaces them */}
        {followUpMessages.map((item, idx) => (
          <div key={idx} className="aif-follow-up">
            <div className="aif-results-page__bubble-row">
              <div className="aif-results-page__bubble">
                {item.query}
              </div>
            </div>
            <div className="aif-reveal">{renderAIText(item.reply)}</div>
          </div>
        ))}
        {followUpLoading && (
          <div ref={inlineLoadingRef} className="aif-results-page__loading">
            <SparkAnimatedIcon />
            <p className="aif-results-page__loading-text">Answering your question...</p>
          </div>
        )}

        {/* Trip Selected confirmation — always rendered after follow-up messages so it appears at the bottom */}
        {tripConfirmed && (
          <TripSelectedBlock
            tripData={confirmedTripData}
            returnDate={selectedReturnDate}
            ref={tripSelectedRef}
            seatChatActive={seatChatActive}
            seatConfirmed={seatConfirmed}
            seatPhase={seatPhase}
            seatPreferences={seatPreferences}
            seatOptions={seatOptions}
            userPreferenceBubble={userPreferenceBubble}
            onPreferencesChange={setSeatPreferences}
            onPreferenceConfirm={handlePreferenceConfirm}
            onSeatOptionSelect={handleSeatOptionSelect}
            luggageChatActive={luggageChatActive}
            luggageConfirmed={luggageConfirmed}
            startSeatChat={startSeatChat}
            startLuggageChat={startLuggageChat}
            onAddReturnTrip={() => setActivePanel('return-date')}
            confirmedSeats={confirmedSeats}
            luggagePhase={luggagePhase}
            selectedLuggageType={selectedLuggageType}
            luggageUserTypeBubble={luggageUserTypeBubble}
            luggageQuantity={luggageQuantity}
            onLuggageTypeSelect={handleLuggageTypeSelect}
            onLuggageQuantitySelect={handleLuggageQuantitySelect}
            confirmedLuggageAdditional={confirmedLuggageAdditional}
            confirmedLuggageSpecial={confirmedLuggageSpecial}
            seatSelectedRef={seatSelectedRef}
            luggageSelectedRef={luggageSelectedRef}
            chatOrder={chatOrder}
          />
        )}

        <div ref={followUpEndRef} />
      </div>

      {recsDone && (
        <div className="aif-results-page__feedback-footer">
          <div className="aif-results-page__feedback-footer__inner">
            <div className="aif-results-page__feedback">
              <Button
                appearance="link"
                display="square"
                aria-label="Thumbs down"
                extraClasses="aif-results-page__feedback-btn"
              >
                <Icon InlineIcon={IconThumbsDown} aria-hidden="true" />
              </Button>
              <Button
                appearance="link"
                display="square"
                aria-label="Thumbs up"
                extraClasses="aif-results-page__feedback-btn"
              >
                <Icon InlineIcon={IconThumbsUp} aria-hidden="true" />
              </Button>
            </div>
            <p className="aif-results-page__disclaimer">
              Answers are powered by AI and it can make mistakes. Your feedback helps us improve.
            </p>
          </div>
        </div>
      )}

      {/* Trip selection / Ask question panel */}
      <Panel
        id="trip-action-panel"
        active={activePanel !== null}
        position={isDesktop ? 'center' : 'bottom'}
        hasOverlay
        onOverlayClick={closePanel}
      >
        <PanelHeader
          closeButtonProps={{ label: 'Close', onClick: closePanel }}
        >
          {activePanel === 'return-date' && (
            <span className="aif-trip-panel__header-title">
              <span className="aif-trip-panel__header-heading">Return trip</span>
              <span className="aif-trip-panel__header-desc">Please select your date of return</span>
            </span>
          )}
          {activePanel === 'change-date' && (
            <span className="aif-trip-panel__header-title">
              <span className="aif-trip-panel__header-heading">Change date</span>
              <span className="aif-trip-panel__header-desc">Please select your trip date</span>
            </span>
          )}
          {activePanel === 'add-passengers' && (
            <span className="aif-trip-panel__header-title">
              <span className="aif-trip-panel__header-heading">Passengers selection</span>
            </span>
          )}
        </PanelHeader>
        <PanelContent>
          {activePanel === 'return-date' && (
            <Fieldset extraClasses="aif-trip-panel__calendar-fieldset">
              <Calendar
                id="return-date-picker"
                horizontal={isDesktop}
                showCurrentDate
                startDate={today}
                endDate={maxDate}
                selected={selectedReturnDate}
                calendarHeader={<CalendarHeaderSimple monthsAtATime={2} />}
                handleSelect={(date) => setSelectedReturnDate(date)}
              />
            </Fieldset>
          )}
          {activePanel === 'change-date' && (
            <Fieldset extraClasses="aif-trip-panel__calendar-fieldset">
              <Calendar
                id="change-date-picker"
                horizontal={isDesktop}
                showCurrentDate
                multiSelectable
                startDate={today}
                endDate={maxDate}
                startSelected={changeDateStart}
                endSelected={changeDateEnd}
                calendarHeader={<CalendarHeaderSimple monthsAtATime={2} />}
                handleSelect={(date) => {
                  if (changeDateStart === undefined) {
                    setChangeDateStart(date);
                    setChangeDateEnd(undefined);
                    return;
                  }
                  if (changeDateEnd === undefined) {
                    if (date < changeDateStart) {
                      setChangeDateStart(date);
                    } else {
                      setChangeDateEnd(date);
                    }
                    return;
                  }
                  setChangeDateStart(date);
                  setChangeDateEnd(undefined);
                }}
                disableDayCondition={(day) => day < today}
              />
            </Fieldset>
          )}
          {activePanel === 'add-passengers' && (
            <div className="aif-pax-panel">
              <Quantity
                id="pax-adults"
                label="Adults"
                caption="from 15 years"
                inline
                min={0}
                max={9}
                value={paxAdults}
                onChange={(e) => setPaxAdults(Number((e.target as HTMLInputElement).value))}
                minusBtnProps={{ onClick: () => setPaxAdults((v) => Math.max(0, v - 1)) }}
                plusBtnProps={{ onClick: () => setPaxAdults((v) => Math.min(9, v + 1)) }}
              />
              <Divider />
              <Quantity
                id="pax-children"
                label="Children"
                caption="0 to 14 years"
                inline
                min={0}
                max={9}
                value={paxChildren}
                onChange={(e) => setPaxChildren(Number((e.target as HTMLInputElement).value))}
                minusBtnProps={{ onClick: () => setPaxChildren((v) => Math.max(0, v - 1)) }}
                plusBtnProps={{ onClick: () => setPaxChildren((v) => Math.min(9, v + 1)) }}
              />
              <Divider />
              <Quantity
                id="pax-bikes"
                label="Bikes"
                caption="E-bikes and scooters are not allowed on buses."
                inline
                min={0}
                max={9}
                value={paxBikes}
                onChange={(e) => setPaxBikes(Number((e.target as HTMLInputElement).value))}
                minusBtnProps={{ onClick: () => setPaxBikes((v) => Math.max(0, v - 1)) }}
                plusBtnProps={{ onClick: () => setPaxBikes((v) => Math.min(9, v + 1)) }}
              />
              <Divider />
              <Quantity
                id="pax-wheelchair"
                label="Travel in your wheelchair"
                caption={paxAdults > 0 ? undefined : 'Please select passenger first.'}
                inline
                disabled={paxAdults === 0}
                min={0}
                max={paxAdults}
                value={paxWheelchair}
                onChange={(e) => setPaxWheelchair(Number((e.target as HTMLInputElement).value))}
                minusBtnProps={{ onClick: () => setPaxWheelchair((v) => Math.max(0, v - 1)) }}
                plusBtnProps={{ onClick: () => setPaxWheelchair((v) => Math.min(paxAdults, v + 1)) }}
              />
              <p className="aif-pax-panel__note">
                Do not choose this option if your wheelchair is collapsible and can be stored in the luggage compartment of the bus. Check the{' '}
                <a href="#reduced-mobility" className="aif-pax-panel__note-link">Reduced Mobility page</a>
                {' '}for more information.
              </p>
            </div>
          )}
        </PanelContent>
        <PanelFooter justify={isDesktop ? 'center' : undefined}>
          <PanelFooterColumn>
            <Button
              appearance="primary"
              display={isDesktop ? undefined : 'block'}
              size={isDesktop ? undefined : 'lg'}
              disabled={
                activePanel === 'return-date' ? !selectedReturnDate :
                activePanel === 'change-date' ? !changeDateStart :
                false
              }
              onClick={closePanel}
            >
              Confirm
            </Button>
          </PanelFooterColumn>
        </PanelFooter>
      </Panel>

      {/* Sticky footer */}
      <div className="aif-results-page__footer">
        {isRecording ? (
          <div className="aif-results-page__audio-box">
            <Button
              appearance="link"
              display="square"
              aria-label="Cancel recording"
              onClick={handleDeleteRecording}
            >
              <Icon InlineIcon={IconDelete} aria-hidden="true" />
            </Button>
            <div className="aif-results-page__waveform" aria-label="Recording in progress">
              {([...bars].reverse().filter((amp): amp is number => amp !== null)).map((amp, i) => (
                <span
                  key={i}
                  className="aif-results-page__waveform-bar"
                  style={{ height: `${Math.max(3, amp * 26)}px` }}
                />
              ))}
            </div>
            <Button
              appearance="secondary"
              display="square"
              aria-label="Confirm recording"
              onClick={handleValidateAudio}
            >
              <Icon InlineIcon={IconCheckmark} aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <div className="aif-results-page__input-row">
            <div className="aif-results-page__input">
              <textarea
                ref={inputRef}
                id="aif-results-input"
                className="aif-results-page__input-field"
                aria-label="Ask something"
                placeholder={!isFocused ? 'Ask something...' : ''}
                rows={1}
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); setIsTranscribed(false); }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (isTranscribed) {
                      setInputValue('');
                      setIsTranscribed(false);
                      return;
                    }
                    const msg = inputValue.trim();
                    if (!msg) return;
                    setInputValue('');
                    sendFollowUp(msg);
                  }
                }}
              />
            </div>
            {inputValue ? (
              <Button
                appearance="primary"
                display="square"
                aria-label="Send"
                onClick={() => {
                  if (isTranscribed) {
                    setInputValue('');
                    setIsTranscribed(false);
                    return;
                  }
                  const msg = inputValue.trim();
                  if (!msg) return;
                  setInputValue('');
                  sendFollowUp(msg);
                }}
              >
                <Icon InlineIcon={IconSend} aria-hidden="true" />
              </Button>
            ) : (
              <Button
                appearance="link"
                display="square"
                aria-label="Record audio"
                onClick={() => setIsRecording(true)}
              >
                <Icon InlineIcon={IconMicrophone} aria-hidden="true" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
