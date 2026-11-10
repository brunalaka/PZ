export type SeatType = 'classic' | 'front' | 'panorama' | 'premiumSingle' | 'premiumPair';
export type SeatStatus = 'available' | 'selected' | 'unavailable';
export type ColId = 'LEFT' | 'RIGHT_A' | 'RIGHT_B';

export interface SeatDef {
  id: string;
  col: ColId;
  slot: number; // row slot index (0-based), used to compute y position
  type: SeatType;
}

export type SpecialType = 'toilet' | 'stairs';

export interface SpecialElement {
  type: SpecialType;
  slot: number;
  side: 'left' | 'right';
  heightSlots?: number; // how many 64px slots tall (default 1)
  iconSide?: 'left' | 'right'; // which variant icon to use for stairs
}

export interface RowLabel {
  label: number;
  slot: number;
}

export interface DeckDef {
  id: 'lower' | 'upper';
  showDriver: boolean;
  canvasHeight: number;
  seats: SeatDef[];
  specials: SpecialElement[];
  rowLabels: RowLabel[];
  doors: Array<{ top: number }>;
  premiumZoneDividerSlot?: number; // classic seats start at this slot; divider renders before it
  premiumZoneGap?: number; // extra pixels added to all slots >= premiumZoneDividerSlot
}

export const CANVAS_WIDTH = 304;

// ─── Column X positions (304px canvas, 1 seat left + 2 seats right) ──────────
// Shifted so seat area (245px) is centred: ~30px left margin, ~29px right margin.
export const COL_X: Record<string, number> = {
  LEFT: 30,
  CENTER: 97,   // row label centre in the gap between LEFT and right pair
  RIGHT_A: 163,
  RIGHT_B: 221, // 163 + 54 + 4px gap
};

export const SEAT_SIZE = 54;

export const LOWER_START_Y = 86;
export const UPPER_START_Y = 20; // small top gap above row 1

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeSeat(deck: 'lower' | 'upper', slot: number, col: ColId, type: SeatType): SeatDef {
  return { id: `${deck}-${slot}-${col}`, col, slot, type };
}

function threeSeats(deck: 'lower' | 'upper', slot: number, type: SeatType = 'classic'): SeatDef[] {
  return (['LEFT', 'RIGHT_A', 'RIGHT_B'] as ColId[]).map((c) => makeSeat(deck, slot, c, type));
}

function premiumRow(deck: 'lower' | 'upper', slot: number): SeatDef[] {
  return [
    makeSeat(deck, slot, 'LEFT', 'premiumSingle'),
    makeSeat(deck, slot, 'RIGHT_A', 'premiumPair'),
    makeSeat(deck, slot, 'RIGHT_B', 'premiumPair'),
  ];
}

function leftOnly(deck: 'lower' | 'upper', slot: number, type: SeatType = 'classic'): SeatDef[] {
  return [makeSeat(deck, slot, 'LEFT', type)];
}

// ─── Lower deck ──────────────────────────────────────────────────────────────
// Row 1  (slot 0):      panorama — 3 seats
// Rows 2–5 (slots 1–4): front    — 3 seats each
// Row 6  (slot 5):      classic  — 3 seats
// Row 7  (slot 6):      LEFT only — toilet on right
// Row 8  (slot 7):      LEFT only — stairs on right
// Rows 9–13 (slots 8–12): classic — 3 seats each

const lowerSeats: SeatDef[] = [
  ...threeSeats('lower', 0, 'panorama'), // row 1
  ...threeSeats('lower', 1, 'front'),    // row 2
  ...threeSeats('lower', 2, 'front'),    // row 3
  ...threeSeats('lower', 3, 'front'),    // row 4
  ...threeSeats('lower', 4, 'front'),    // row 5
  ...threeSeats('lower', 5),             // row 6
  ...leftOnly('lower', 6),               // row 7 (right = toilet)
  ...leftOnly('lower', 7),               // row 8 (right = stairs)
  ...threeSeats('lower', 8),             // row 9
  ...threeSeats('lower', 9),             // row 10
  ...threeSeats('lower', 10),            // row 11
  ...threeSeats('lower', 11),            // row 12
  ...threeSeats('lower', 12),            // row 13
];

const lowerSpecials: SpecialElement[] = [
  { type: 'toilet', slot: 6, side: 'right' },
  { type: 'stairs', slot: 7, side: 'right', iconSide: 'right' },
];

const lowerRowLabels: RowLabel[] = [
  { label: 1, slot: 0 },
  { label: 2, slot: 1 },
  { label: 3, slot: 2 },
  { label: 4, slot: 3 },
  { label: 5, slot: 4 },
  { label: 6, slot: 5 },
  { label: 7, slot: 6 },
  { label: 8, slot: 7 },
  { label: 9, slot: 8 },
  { label: 10, slot: 9 },
  { label: 11, slot: 10 },
  { label: 12, slot: 11 },
  { label: 13, slot: 12 },
];

export const lowerDeck: DeckDef = {
  id: 'lower',
  showDriver: true,
  canvasHeight: 810,
  seats: lowerSeats,
  specials: lowerSpecials,
  rowLabels: lowerRowLabels,
  doors: [{ top: 41 }, { top: 467 }],
};

// ─── Upper deck ──────────────────────────────────────────────────────────────
// Slots 0–2 (rows 1–3):  premium  — 3 seats each (Premium Zone)
// Slots 3–6 (rows 4–7):  classic  — 3 seats each
// Slot  7   (row 8):     LEFT only — stairs on right
// Slots 8–12 (rows 9–13): classic — 3 seats each

const upperSeats: SeatDef[] = [
  ...premiumRow('upper', 0), // row 1 — premium zone
  ...premiumRow('upper', 1), // row 2 — premium zone
  ...premiumRow('upper', 2), // row 3 — premium zone
  ...threeSeats('upper', 3),             // row 4
  ...threeSeats('upper', 4),             // row 5
  ...threeSeats('upper', 5),             // row 6
  ...threeSeats('upper', 6),             // row 7
  ...leftOnly('upper', 7),               // row 8 (right = stairs)
  ...threeSeats('upper', 8),             // row 9
  ...threeSeats('upper', 9),             // row 10
  ...threeSeats('upper', 10),            // row 11
  ...threeSeats('upper', 11),            // row 12
  ...threeSeats('upper', 12),            // row 13
];

const upperSpecials: SpecialElement[] = [
  { type: 'stairs', slot: 7, side: 'right', iconSide: 'right' },
];

const upperRowLabels: RowLabel[] = [
  { label: 1, slot: 0 },
  { label: 2, slot: 1 },
  { label: 3, slot: 2 },
  { label: 4, slot: 3 },
  { label: 5, slot: 4 },
  { label: 6, slot: 5 },
  { label: 7, slot: 6 },
  { label: 8, slot: 7 },
  { label: 9, slot: 8 },
  { label: 10, slot: 9 },
  { label: 11, slot: 10 },
  { label: 12, slot: 11 },
  { label: 13, slot: 12 },
];

export const upperDeck: DeckDef = {
  id: 'upper',
  showDriver: false,
  canvasHeight: 760, // UPPER_START_Y(20) + 13 slots × 54px + premiumZoneGap(14) + 24px bottom padding
  seats: upperSeats,
  specials: upperSpecials,
  rowLabels: upperRowLabels,
  doors: [],
  premiumZoneDividerSlot: 3,
  premiumZoneGap: 14,
};
