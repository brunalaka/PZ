export type SeatType = 'classic' | 'front' | 'panorama' | 'premium';
export type SeatStatus = 'available' | 'selected' | 'unavailable';

export interface SeatDef {
  id: string;
  col: 'A' | 'B' | 'C' | 'D' | 'CENTER';
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
  premiumZoneGap?: number; // extra pixels added to all slots >= premiumZoneDividerSlot (accommodates divider + gaps)
}

// ─── Column X positions (304px canvas, 3px intra-pair gaps for A-B and C-D) ─
export const COL_X: Record<string, number> = {
  A: 17,
  B: 74,
  CENTER: 128,
  C: 182,
  D: 239,
};

export const SEAT_SIZE = 54; // 64px Figma × 0.844 — 12px bigger than 42px legend icons

export const LOWER_START_Y = 86;
export const UPPER_START_Y = 80; // badge (24px) + 6px gap + description (18px) + 12px gap above row 1

// ─── Lower deck ──────────────────────────────────────────────────────────────
// Rows: 1–6 (slots 0–5): all 4 seats
// Slot 6 (row 7): A,B only — toilet on right
// Slot 7 (row 8): A,B only — stairs on right
// Slots 8–10 (rows 10–12): all 4 seats
// Slots 11–12 (rows 14–15): all 4 seats
// Slot 13 (unlabeled): A,B,CENTER,C,D

function makeSeat(deck: 'lower' | 'upper', slot: number, col: SeatDef['col'], type: SeatType): SeatDef {
  return { id: `${deck}-${slot}-${col}`, col, slot, type };
}

function fourSeats(deck: 'lower' | 'upper', slot: number, type: SeatType = 'classic'): SeatDef[] {
  return ['A', 'B', 'C', 'D'].map((c) => makeSeat(deck, slot, c as SeatDef['col'], type));
}

function leftPair(deck: 'lower' | 'upper', slot: number, type: SeatType = 'classic'): SeatDef[] {
  return ['A', 'B'].map((c) => makeSeat(deck, slot, c as 'A' | 'B', type));
}

function rightPair(deck: 'lower' | 'upper', slot: number, type: SeatType = 'classic'): SeatDef[] {
  return ['C', 'D'].map((c) => makeSeat(deck, slot, c as 'C' | 'D', type));
}

const lowerSeats: SeatDef[] = [
  ...fourSeats('lower', 0, 'panorama'), // row 1
  ...fourSeats('lower', 1, 'front'),    // row 2
  ...fourSeats('lower', 2, 'front'),    // row 3
  ...fourSeats('lower', 3, 'front'),    // row 4
  ...fourSeats('lower', 4, 'front'),    // row 5
  ...fourSeats('lower', 5),             // row 6
  ...leftPair('lower', 6),              // row 7 (right = toilet)
  ...leftPair('lower', 7),              // row 8 (right = stairs)
  ...fourSeats('lower', 8),             // row 10
  ...fourSeats('lower', 9),             // row 11
  ...fourSeats('lower', 10),            // row 12
  ...fourSeats('lower', 11),            // row 14
  ...fourSeats('lower', 12),            // row 15
  // last row: A, B, CENTER, C, D
  ...(['A', 'B', 'CENTER', 'C', 'D'] as SeatDef['col'][]).map((c) =>
    makeSeat('lower', 13, c, 'classic'),
  ),
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
  { label: 10, slot: 8 },
  { label: 11, slot: 9 },
  { label: 12, slot: 10 },
  { label: 14, slot: 11 },
  { label: 15, slot: 12 },
];

export const lowerDeck: DeckDef = {
  id: 'lower',
  showDriver: true,
  canvasHeight: 870,
  seats: lowerSeats,
  specials: lowerSpecials,
  rowLabels: lowerRowLabels,
  doors: [{ top: 41 }, { top: 467 }],
};

// ─── Upper deck ──────────────────────────────────────────────────────────────
// Slot 0 (row 1): 4 panorama seats
// Slots 1–2 (rows 2–3): right pair only; left has stairs spanning these 2 slots
// Slots 3–9 (rows 5–11): all 4 seats
// Slots 10–11 (row 12 + unlabeled): left pair only; right has stairs spanning 2 slots
// Slots 12–14 (rows 14–16): all 4 seats
// Slot 15 (unlabeled): A, B, CENTER, C, D

const upperSeats: SeatDef[] = [
  ...fourSeats('upper', 0, 'premium'),        // row 1 — all premium
  ...rightPair('upper', 1, 'premium'),        // row 2 — right pair premium (left = stairs)
  ...rightPair('upper', 2, 'premium'),        // row 3 — right pair premium (left = stairs)
  ...fourSeats('upper', 3),             // row 5
  ...fourSeats('upper', 4),             // row 6
  ...fourSeats('upper', 5),             // row 7
  ...fourSeats('upper', 6),             // row 8
  ...fourSeats('upper', 7),             // row 9
  ...fourSeats('upper', 8),             // row 10
  ...fourSeats('upper', 9),             // row 11
  ...leftPair('upper', 10),             // row 12 (right = stairs)
  ...leftPair('upper', 11),             // unlabeled (right = stairs continued)
  ...fourSeats('upper', 12),            // row 14
  ...fourSeats('upper', 13),            // row 15
  ...fourSeats('upper', 14),            // row 16
  // last row: A, B, CENTER, C, D
  ...(['A', 'B', 'CENTER', 'C', 'D'] as SeatDef['col'][]).map((c) =>
    makeSeat('upper', 15, c, 'classic'),
  ),
];

const upperSpecials: SpecialElement[] = [
  { type: 'stairs', slot: 1, side: 'left', heightSlots: 2, iconSide: 'left' },
  { type: 'stairs', slot: 10, side: 'right', heightSlots: 2, iconSide: 'right' },
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
  { label: 14, slot: 13 },
  { label: 15, slot: 14 },
];

export const upperDeck: DeckDef = {
  id: 'upper',
  showDriver: false,
  canvasHeight: 978, // UPPER_START_Y(80) + 16 slots × 54px + premiumZoneGap(14) + 20px bottom padding
  seats: upperSeats,
  specials: upperSpecials,
  rowLabels: upperRowLabels,
  doors: [],
  premiumZoneDividerSlot: 3, // divider between row 3 (premium) and row 5 (classic)
  premiumZoneGap: 14, // 6px gap above divider + 2px divider + 6px gap below
};
