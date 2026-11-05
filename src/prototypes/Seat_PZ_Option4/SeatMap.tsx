import { useEffect, useState } from 'react';
import {
  Button,
  Heading,
  NavHorizontal,
  NavItem,
  Panel,
  PanelContent,
  PanelFooter,
  PanelFooterColumn,
  PanelHeader,
  Text,
} from '@flixbus/honeycomb-react';
import { Icon, IconArrowLeft, IconClose } from '@flixbus/honeycomb-icons-react';

import './SeatMap.css';
import {
  CANVAS_WIDTH,
  COL_X,
  LOWER_START_Y,
  SEAT_SIZE,
  UPPER_START_Y,
  lowerDeck,
  upperDeck,
  type DeckDef,
  type SeatDef,
  type SeatStatus,
  type SeatType,
  type ColId,
} from './seatMapData';

import photoSeatClassic from './assets/photo-seat-classic.png';
import photoSeatFront from './assets/photo-seat-front.png';
import photoSeatPanorama from './assets/photo-seat-panorama.png';
import photoSeatPremiumZone from './assets/photo-seat-premium-zone.png';

import seatOutline from './assets/seat-outline.svg';
import seatOutlinePremium from './assets/seat-outline-premium.svg';
import iconStar from './assets/icon-star.svg';
import iconFrontArrow from './assets/icon-front-arrow.svg';
import busWindshieldLower from './assets/bus-windshield.svg';
import busWindshieldUpper from './assets/bus-windshield-upper.svg';
import busDriver from './assets/bus-driver.svg';
import doorSvg from './assets/door.svg';
import stairsIconLeft from './assets/stairs-icon-left.svg';
import stairsIconRight from './assets/stairs-icon-right.svg';
import toiletIcon from './assets/toilet.svg';
import seatSelected from './assets/seat-selected.svg';
import seatUnavailable from './assets/seat-unavailable.svg';
import iconSeatClassic from './assets/icon-seat-classic.svg';
import iconSeatFront from './assets/icon-seat-front.svg';
import iconSeatPanorama from './assets/icon-seat-panorama.svg';
import iconSeatCrown2 from './assets/New-seats-and-icons/Type=Crown2.svg'; // legend: premium single
import iconSeatCrown from './assets/New-seats-and-icons/Type=Crown.svg';   // legend: premium pair
import iconCrown2Canvas from './assets/New-seats-and-icons/Crown2_24px.svg'; // seat overlay: premium single
import iconCrownCanvas from './assets/New-seats-and-icons/Crown_24px.svg';   // seat overlay: premium pair

// ─── Tooltip data ─────────────────────────────────────────────────────────────

const SEAT_TYPE_LABEL: Record<SeatType, string> = {
  classic: 'Classic',
  front: 'Front',
  panorama: 'Panorama',
  premiumSingle: 'Premium Single',
  premiumPair: 'Premium',
};

const SEAT_TYPE_PRICE: Record<SeatType, string> = {
  classic: '2,99 €',
  front: '3,59 €',
  panorama: '5,99 €',
  premiumSingle: '10,99 €',
  premiumPair: '8,49 €',
};

const SEAT_TYPE_DESC: Partial<Record<SeatType, string>> = {
  premiumPair: 'Comfort, better wi-fi, priority boarding',
  premiumSingle: 'Privacy, comfort, better wi-fi, priority boarding',
};


// ─── Types ────────────────────────────────────────────────────────────────────

type DeckId = 'lower' | 'upper';

interface SeatMapProps {
  active: boolean;
  onClose: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : true,
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
};

const startY = (deck: DeckDef) =>
  deck.id === 'lower' ? LOWER_START_Y : UPPER_START_Y;

const slotY = (deck: DeckDef, slot: number) =>
  startY(deck) +
  slot * SEAT_SIZE +
  (deck.premiumZoneDividerSlot !== undefined && slot >= deck.premiumZoneDividerSlot
    ? (deck.premiumZoneGap ?? 0)
    : 0);

const seatY = (deck: DeckDef, seat: SeatDef) => slotY(deck, seat.slot);

// ─── Sub-components ───────────────────────────────────────────────────────────

function SeatButton({
  seat,
  deck,
  status,
  onToggle,
}: {
  seat: SeatDef;
  deck: DeckDef;
  status: SeatStatus;
  onToggle: () => void;
}) {
  const x = COL_X[seat.col];
  const y = seatY(deck, seat);
  const isSelected = status === 'selected';
  const isUnavailable = status === 'unavailable';

  const rowLabel = deck.rowLabels.find((r) => r.slot === seat.slot)?.label;
  const colLetter: Record<ColId, string> = { LEFT: 'A', RIGHT_A: 'B', RIGHT_B: 'C' };
  const seatCode = rowLabel ? `${rowLabel}${colLetter[seat.col]}` : colLetter[seat.col];

  const isPremium = seat.type === 'premiumSingle' || seat.type === 'premiumPair';

  const classNames = [
    'sm-seat',
    isPremium ? 'sm-seat--premium' : '',
    isSelected ? 'sm-seat--selected' : '',
    isUnavailable ? 'sm-seat--unavailable' : '',
    seat.col === 'LEFT' ? 'sm-seat--left-edge' : '',
    seat.col === 'RIGHT_B' ? 'sm-seat--right-edge' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classNames}
      style={{ left: x, top: y }}
      aria-label={`Row ${seat.slot + 1} seat ${seat.col}, ${seat.type}, ${status}`}
      aria-pressed={isSelected}
      disabled={isUnavailable}
      onClick={isUnavailable ? undefined : onToggle}
    >
      {/* Available state */}
      <div className="sm-seat-inner" />
      <div className="sm-seat-outline">
        <img src={isPremium ? seatOutlinePremium : seatOutline} alt="" aria-hidden="true" />
      </div>
      {seat.type === 'panorama' && (
        <div className="sm-seat-icon">
          <img src={iconStar} alt="" aria-hidden="true" />
        </div>
      )}
      {seat.type === 'front' && (
        <div className="sm-seat-icon">
          <img src={iconFrontArrow} alt="" aria-hidden="true" />
        </div>
      )}
      {seat.type === 'premiumSingle' && (
        <div className="sm-seat-icon">
          <img src={iconCrown2Canvas} alt="" aria-hidden="true" />
        </div>
      )}
      {seat.type === 'premiumPair' && (
        <div className="sm-seat-icon">
          <img src={iconCrownCanvas} alt="" aria-hidden="true" />
        </div>
      )}

      {/* Selected / unavailable state overlay */}
      <img
        className="sm-seat-state-img"
        src={isSelected ? seatSelected : seatUnavailable}
        alt=""
        aria-hidden="true"
      />

      {/* Hover tooltip */}
      {!isSelected && !isUnavailable && (
        <div className="sm-seat-tooltip" role="tooltip">
          <div className="sm-tooltip-body">
            <div className="sm-tooltip-header">
              <div className={`sm-tooltip-nr${isPremium ? ' sm-tooltip-nr--premium' : ''}`}>
                {seatCode}
              </div>
              <div className="sm-tooltip-text">
                <span className="sm-tooltip-type">{SEAT_TYPE_LABEL[seat.type]}</span>
                <span className="sm-tooltip-price">+ {SEAT_TYPE_PRICE[seat.type]}</span>
              </div>
            </div>
            {SEAT_TYPE_DESC[seat.type] && (
              <p className="sm-tooltip-description">{SEAT_TYPE_DESC[seat.type]}</p>
            )}
          </div>
        </div>
      )}
    </button>
  );
}

function BusCanvas({
  deck,
  seatStates,
  onToggleSeat,
}: {
  deck: DeckDef;
  seatStates: Record<string, SeatStatus>;
  onToggleSeat: (id: string) => void;
}) {
  const sy = startY(deck);

  return (
    <div className="sm-canvas-wrapper">
      <div className="sm-canvas" style={{ height: deck.canvasHeight }}>
        {/* Bus outline */}
        <div className="sm-bus-outline" />

        {/* Windshield */}
        <div
          className="sm-bus-windshield"
          style={{ height: deck.showDriver ? 64 : 64 }}
        >
          <img
            src={deck.showDriver ? busWindshieldLower : busWindshieldUpper}
            alt=""
            aria-hidden="true"
          />
        </div>

        {/* Driver (lower deck only) */}
        {deck.showDriver && (
          <div
            className="sm-bus-driver"
            style={{ left: 27, top: 3, width: 69 }}
          >
            <img src={busDriver} alt="" aria-hidden="true" />
          </div>
        )}

        {/* Doors */}
        {deck.doors.map((door, i) => (
          <div
            key={i}
            className="sm-bus-door"
            style={{ right: -11, top: door.top, width: 23, height: 45 }}
          >
            <img src={doorSvg} alt="" aria-hidden="true" />
          </div>
        ))}

        {/* Premium Zone grey area removed for Option 4 */}

        {/* Row number labels */}
        {deck.rowLabels.map(({ label, slot }) => (
          <div
            key={label}
            className="sm-row-label"
            style={{ left: COL_X.CENTER, top: slotY(deck, slot) }}
          >
            {label}
          </div>
        ))}

        {/* Special elements */}
        {deck.specials.map((special, i) => {
          const height = (special.heightSlots ?? 1) * SEAT_SIZE;
          const top = slotY(deck, special.slot);
          const isLeft = special.side === 'left';
          const left = isLeft ? COL_X.LEFT : COL_X.RIGHT_A;
          const width = isLeft ? SEAT_SIZE : (COL_X.RIGHT_B + SEAT_SIZE - COL_X.RIGHT_A);
          const iconSrc =
            special.type === 'toilet'
              ? toiletIcon
              : special.iconSide === 'left'
              ? stairsIconLeft
              : stairsIconRight;

          if (special.type === 'toilet') {
            return (
              <div
                key={i}
                className="sm-toilet"
                style={{ left, top, height, width }}
              >
                <img src={iconSrc} alt="Toilet" />
              </div>
            );
          }

          return (
            <div
              key={i}
              className="sm-stairs"
              style={{ left, top, height, width }}
              aria-label="Stairs"
            >
              <img src={iconSrc} alt="" aria-hidden="true" />
            </div>
          );
        })}

        {/* Seats */}
        {deck.seats.map((seat) => (
          <SeatButton
            key={seat.id}
            seat={seat}
            deck={deck}
            status={seatStates[seat.id] ?? 'available'}
            onToggle={() => onToggleSeat(seat.id)}
          />
        ))}

        {/* Column header labels (A / B / C) — space above first seat row */}
        {deck.id === 'lower' && (
          <>
            {(['LEFT', 'RIGHT_A', 'RIGHT_B'] as const).map((col, i) => (
              <div
                key={col}
                style={{
                  position: 'absolute',
                  left: COL_X[col],
                  top: sy - 24,
                  width: SEAT_SIZE,
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#646464',
                  pointerEvents: 'none',
                }}
              >
                {['A', 'B', 'C'][i]}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SeatMap({ active, onClose }: SeatMapProps) {
  const isMobile = useIsMobile();
  const [activeDeck, setActiveDeck] = useState<DeckId>('lower');
  const [seatStates, setSeatStates] = useState<Record<string, SeatStatus>>({});
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  useEffect(() => {
    if (isLegendOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (isLegendOpen) document.body.style.overflow = '';
    };
  }, [isLegendOpen]);

  const deck = activeDeck === 'lower' ? lowerDeck : upperDeck;

  const toggleSeat = (id: string) => {
    setSeatStates((prev) => {
      const current = prev[id] ?? 'available';
      return { ...prev, [id]: current === 'selected' ? 'available' : 'selected' };
    });
  };

  const selectedSeats = Object.entries(seatStates).filter(
    ([, s]) => s === 'selected',
  );
  const selectedCount = selectedSeats.length;

  const SEAT_PRICE_NUM: Record<SeatType, number> = {
    classic: 2.99,
    front: 3.59,
    panorama: 5.99,
    premiumSingle: 10.99,
    premiumPair: 8.49,
  };
  const seatTypeById = new Map(
    [...lowerDeck.seats, ...upperDeck.seats].map(s => [s.id, s.type])
  );
  const totalPrice = selectedSeats.reduce((sum, [id]) => {
    const type = seatTypeById.get(id);
    return sum + (type !== undefined ? SEAT_PRICE_NUM[type] : 0);
  }, 0);
  const formattedTotalPrice = totalPrice > 0
    ? `+ ${totalPrice.toFixed(2).replace('.', ',')} €`
    : '+ 0,00 €';

  return (
    <>
    <Panel
      id="sm-seatmap-panel"
      active={active}
      position={isMobile ? 'bottom' : undefined}
      hasOverlay
      onOverlayClick={onClose}
      disableBodyStyleModifications
      disableFocusManagement
      extraClasses="sm-panel"
    >
      <PanelHeader>
        <div className="sm-header-inner">
          <Button
            appearance="link"
            display="square"
            extraClasses="sm-back-btn"
            aria-label="Go back"
            onClick={onClose}
          >
            <Icon InlineIcon={IconArrowLeft} aria-hidden="true" size={4} />
          </Button>
          <div className="sm-header-text">
            <Heading size={4} Elem="h2" flushSpace>
              Select seats
            </Heading>
            <Text Elem="p" extraClasses="sm-header-route" small>
              Berlin – Hamburg
            </Text>
          </div>
          <Button
            appearance="link"
            display="square"
            extraClasses="sm-close-btn"
            aria-label="Close seat map"
            onClick={onClose}
          >
            <Icon InlineIcon={IconClose} aria-hidden="true" size={4} />
          </Button>
        </div>
      </PanelHeader>

      <PanelContent extraClasses="sm-panel-content">
        {/* Deck nav */}
        <NavHorizontal extraClasses="sm-deck-nav" aria-label="Deck selection">
          <NavItem
            active={activeDeck === 'lower'}
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveDeck('lower'); }}
          >
            Lower deck
          </NavItem>
          <NavItem
            active={activeDeck === 'upper'}
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveDeck('upper'); }}
          >
            Upper deck
          </NavItem>
        </NavHorizontal>

        {/* Legend — deck-specific, tap to open detail panel */}
        <button
          type="button"
          className="sm-legend"
          aria-label="Seat categories — tap to learn more"
          onClick={() => setIsLegendOpen(true)}
        >
          <div className="sm-legend-items">
            {[
              { icon: iconSeatClassic,  name: 'Classic',          price: '2,99 €'  },
              { icon: iconSeatFront,    name: 'Front',             price: '3,59 €'  },
              { icon: iconSeatPanorama, name: 'Panorama',          price: '5,99 €'  },
              { icon: iconSeatCrown,    name: 'Premium',           price: '8,49 €'  },
              { icon: iconSeatCrown2,   name: 'Premium Single',    price: '10,99 €' },
            ].map(({ icon, name, price }) => (
              <div key={name} className="sm-legend-item">
                <div className="sm-legend-icon">
                  <img src={icon} alt="" aria-hidden="true" />
                </div>
                <div className="sm-legend-label">
                  <span className="sm-legend-name">{name}</span>
                  <span className="sm-legend-price">+ {price}</span>
                </div>
              </div>
            ))}
          </div>
        </button>

        {/* Seatmap canvas */}
        <BusCanvas
          deck={deck}
          seatStates={seatStates}
          onToggleSeat={toggleSeat}
        />
      </PanelContent>

      <PanelFooter>
        <PanelFooterColumn>
          <div className="sm-footer-inner">
            <div className="sm-footer-summary">
              <span className="sm-footer-count">
                {selectedCount === 0
                  ? '0 seats reserved'
                  : `${selectedCount} seat${selectedCount > 1 ? 's' : ''} reserved`}
              </span>
              <span className="sm-footer-price">{formattedTotalPrice}</span>
            </div>
            <Button
              appearance="primary"
              disabled={selectedCount === 0}
              extraClasses="sm-confirm-btn"
              size="lg"
              onClick={onClose}
            >
              Confirm
            </Button>
          </div>
        </PanelFooterColumn>
      </PanelFooter>
    </Panel>

    {/* Seat category legend detail panel */}
    <Panel
      id="sm-legend-detail-panel"
      active={isLegendOpen}
      position="bottom"
      hasOverlay
      onOverlayClick={() => setIsLegendOpen(false)}
      disableBodyStyleModifications
      disableFocusManagement
      extraClasses="sm-legend-detail-panel"
    >
      <PanelHeader>
        <div className="sm-legend-detail-header">
          <Heading size={4} Elem="h2" flushSpace>Seat categories</Heading>
          <Button
            appearance="link"
            display="square"
            aria-label="Close seat categories"
            onClick={() => setIsLegendOpen(false)}
          >
            <Icon InlineIcon={IconClose} aria-hidden="true" size={4} />
          </Button>
        </div>
      </PanelHeader>
      <PanelContent extraClasses="sm-legend-detail-content">
        <div className="sm-cat-list">
          <div className="sm-cat-card">
            <div className="sm-cat-photo-wrap">
              <img src={photoSeatPremiumZone} alt="" aria-hidden="true" />
            </div>
            <div className="sm-cat-body">
              <div className="sm-cat-info">
                <div className="sm-cat-title-row">
                  <span className="sm-cat-name">Premium Single</span>
                  <span className="sm-cat-price">+ 10,99 €</span>
                </div>
                <p className="sm-cat-desc">More privacy, more comfortable seats, better wi-fi and priority boarding.</p>
              </div>
            </div>
          </div>
          <div className="sm-cat-card">
            <div className="sm-cat-photo-wrap">
              <img src={photoSeatPremiumZone} alt="" aria-hidden="true" />
            </div>
            <div className="sm-cat-body">
              <div className="sm-cat-info">
                <div className="sm-cat-title-row">
                  <span className="sm-cat-name">Premium</span>
                  <span className="sm-cat-price">+ 8,49 €</span>
                </div>
                <p className="sm-cat-desc">Privacy, more comfortable seats, better wi-fi and priority boarding.</p>
              </div>
            </div>
          </div>
          <div className="sm-cat-card">
            <div className="sm-cat-photo-wrap">
              <img src={photoSeatPanorama} alt="" aria-hidden="true" />
            </div>
            <div className="sm-cat-body">
              <div className="sm-cat-info">
                <div className="sm-cat-title-row">
                  <span className="sm-cat-name">Panorama</span>
                  <span className="sm-cat-price">+ 5,99 €</span>
                </div>
                <p className="sm-cat-desc">Enjoy a great view in the first row.</p>
              </div>
            </div>
          </div>
          <div className="sm-cat-card">
            <div className="sm-cat-photo-wrap">
              <img src={photoSeatFront} alt="" aria-hidden="true" />
            </div>
            <div className="sm-cat-body">
              <div className="sm-cat-info">
                <div className="sm-cat-title-row">
                  <span className="sm-cat-name">Front</span>
                  <span className="sm-cat-price">+ 3,59 €</span>
                </div>
                <p className="sm-cat-desc">Enjoy a smooth, quiet trip at the front of the bus.</p>
              </div>
            </div>
          </div>
          <div className="sm-cat-card">
            <div className="sm-cat-photo-wrap">
              <img src={photoSeatClassic} alt="" aria-hidden="true" />
            </div>
            <div className="sm-cat-body">
              <div className="sm-cat-info">
                <div className="sm-cat-title-row">
                  <span className="sm-cat-name">Classic</span>
                  <span className="sm-cat-price">+ 2,99 €</span>
                </div>
                <p className="sm-cat-desc">Decide whether you want a window or an aisle seat.</p>
              </div>
            </div>
          </div>
        </div>
      </PanelContent>
    </Panel>
    </>
  );
}
