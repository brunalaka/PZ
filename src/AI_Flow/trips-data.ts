export interface StaticTrip {
  id: string;
  carrier: 'FlixBus' | 'Greyhound';
  dep: string;        // "HH:MM" 24h
  arr: string;        // "HH:MM" 24h
  depStation: string;
  arrStation: string;
  duration: string;   // "Xh Ym"
  stops: string;      // "Direct" | "1 Transfer"
  price: number;
  currency: string;
  nextDay?: boolean;
}

export const NYC_BOSTON_TRIPS: StaticTrip[] = [
  // ── Column 1 ────────────────────────────────────────────────────────────
  { id: 't01', carrier: 'Greyhound', dep: '01:00', arr: '05:30', depStation: 'New York Port Authority', arrStation: 'Boston (South Station)', duration: '4h 30m', stops: 'Direct', price: 37.98, currency: 'USD' },
  { id: 't02', carrier: 'Greyhound', dep: '01:05', arr: '05:10', depStation: 'New York (GW Bridge)', arrStation: 'Boston (South Station)', duration: '4h 05m', stops: 'Direct', price: 40.98, currency: 'USD' },
  { id: 't03', carrier: 'FlixBus',   dep: '01:30', arr: '05:40', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Brookline', duration: '4h 10m', stops: 'Direct', price: 36.98, currency: 'USD' },
  { id: 't04', carrier: 'FlixBus',   dep: '01:30', arr: '06:05', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 35m', stops: 'Direct', price: 36.98, currency: 'USD' },
  { id: 't05', carrier: 'FlixBus',   dep: '03:00', arr: '07:25', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Brookline', duration: '4h 25m', stops: 'Direct', price: 51.98, currency: 'USD' },
  { id: 't06', carrier: 'FlixBus',   dep: '03:00', arr: '07:50', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 50m', stops: 'Direct', price: 51.98, currency: 'USD' },
  { id: 't07', carrier: 'Greyhound', dep: '05:00', arr: '11:00', depStation: 'New York Port Authority', arrStation: 'Boston (South Station)', duration: '6h 00m', stops: 'Direct', price: 40.98, currency: 'USD' },
  { id: 't08', carrier: 'FlixBus',   dep: '05:15', arr: '09:45', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 30m', stops: 'Direct', price: 36.98, currency: 'USD' },
  { id: 't09', carrier: 'Greyhound', dep: '05:30', arr: '12:00', depStation: 'New York (GW Bridge)', arrStation: 'Boston (South Station)', duration: '6h 10m', stops: '1 Transfer', price: 48.97, currency: 'USD' },
  { id: 't10', carrier: 'Greyhound', dep: '06:00', arr: '11:25', depStation: 'New York Port Authority', arrStation: 'Boston (South Station)', duration: '5h 25m', stops: 'Direct', price: 37.98, currency: 'USD' },

  // ── Column 2 ────────────────────────────────────────────────────────────
  { id: 't11', carrier: 'FlixBus',   dep: '06:30', arr: '10:55', depStation: 'New York (Hudson Yards)', arrStation: 'Boston (South Station)', duration: '4h 25m', stops: 'Direct', price: 37.98, currency: 'USD' },
  { id: 't12', carrier: 'FlixBus',   dep: '07:00', arr: '11:15', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 15m', stops: 'Direct', price: 34.98, currency: 'USD' },
  { id: 't13', carrier: 'FlixBus',   dep: '07:30', arr: '11:50', depStation: 'New York (Hudson Yards)', arrStation: 'Boston (South Station)', duration: '4h 20m', stops: 'Direct', price: 37.98, currency: 'USD' },
  { id: 't14', carrier: 'FlixBus',   dep: '07:45', arr: '12:10', depStation: 'Queens Jamaica (144th Pl/Archer Ave)', arrStation: 'Boston (South Station)', duration: '4h 25m', stops: 'Direct', price: 35.98, currency: 'USD' },
  { id: 't15', carrier: 'Greyhound', dep: '07:45', arr: '14:30', depStation: 'New York Port Authority', arrStation: 'Boston (South Station)', duration: '6h 45m', stops: '1 Transfer', price: 48.47, currency: 'USD' },
  { id: 't16', carrier: 'FlixBus',   dep: '08:00', arr: '13:00', depStation: 'NYC Downtown Canal Street', arrStation: 'Boston (South Station)', duration: '5h 00m', stops: 'Direct', price: 36.98, currency: 'USD' },
  { id: 't17', carrier: 'FlixBus',   dep: '08:15', arr: '12:10', depStation: 'Queens Flushing (Kissena Blvd/Main St)', arrStation: 'Boston (South Station)', duration: '3h 55m', stops: 'Direct', price: 35.98, currency: 'USD' },
  { id: 't18', carrier: 'FlixBus',   dep: '08:15', arr: '12:55', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 40m', stops: 'Direct', price: 37.98, currency: 'USD' },
  { id: 't19', carrier: 'FlixBus',   dep: '09:00', arr: '13:25', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 25m', stops: 'Direct', price: 35.98, currency: 'USD' },
  { id: 't20', carrier: 'FlixBus',   dep: '09:30', arr: '14:30', depStation: 'NYC Downtown Canal Street', arrStation: 'Boston (South Station)', duration: '5h 00m', stops: 'Direct', price: 35.98, currency: 'USD' },
  { id: 't21', carrier: 'FlixBus',   dep: '09:30', arr: '15:10', depStation: 'New York (Hudson Yards)', arrStation: 'Boston (South Station)', duration: '5h 40m', stops: '1 Transfer', price: 48.97, currency: 'USD' },

  // ── Column 3 ────────────────────────────────────────────────────────────
  { id: 't22', carrier: 'Greyhound', dep: '09:40', arr: '14:35', depStation: 'New York Port Authority', arrStation: 'Boston (South Station)', duration: '4h 55m', stops: 'Direct', price: 37.98, currency: 'USD' },
  { id: 't23', carrier: 'FlixBus',   dep: '09:45', arr: '14:00', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 15m', stops: 'Direct', price: 35.98, currency: 'USD' },
  { id: 't24', carrier: 'FlixBus',   dep: '10:00', arr: '14:25', depStation: 'Queens Jamaica (144th Pl/Archer Ave)', arrStation: 'Boston (South Station)', duration: '4h 25m', stops: 'Direct', price: 35.98, currency: 'USD' },
  { id: 't25', carrier: 'Greyhound', dep: '10:00', arr: '16:55', depStation: 'New York Port Authority', arrStation: 'Boston (South Station)', duration: '6h 55m', stops: 'Direct', price: 37.98, currency: 'USD' },
  { id: 't26', carrier: 'Greyhound', dep: '10:20', arr: '14:35', depStation: 'New York (GW Bridge)', arrStation: 'Boston (South Station)', duration: '4h 15m', stops: 'Direct', price: 39.98, currency: 'USD' },
  { id: 't27', carrier: 'FlixBus',   dep: '10:30', arr: '14:25', depStation: 'Queens Flushing (Kissena Blvd/Main St)', arrStation: 'Boston (South Station)', duration: '3h 55m', stops: 'Direct', price: 35.98, currency: 'USD' },
  { id: 't28', carrier: 'FlixBus',   dep: '10:30', arr: '14:45', depStation: 'New York (Hudson Yards)', arrStation: 'Cambridge', duration: '4h 15m', stops: 'Direct', price: 39.98, currency: 'USD' },
  { id: 't29', carrier: 'FlixBus',   dep: '10:30', arr: '15:15', depStation: 'New York (Hudson Yards)', arrStation: 'Boston (South Station)', duration: '4h 45m', stops: 'Direct', price: 39.98, currency: 'USD' },
  { id: 't30', carrier: 'FlixBus',   dep: '11:00', arr: '16:00', depStation: 'NYC Downtown Canal Street', arrStation: 'Boston (South Station)', duration: '5h 00m', stops: 'Direct', price: 35.98, currency: 'USD' },
  { id: 't31', carrier: 'FlixBus',   dep: '11:15', arr: '15:40', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 25m', stops: 'Direct', price: 35.98, currency: 'USD' },
  { id: 't32', carrier: 'Greyhound', dep: '11:30', arr: '20:35', depStation: 'New York Port Authority', arrStation: 'Boston (South Station)', duration: '9h 05m', stops: 'Direct', price: 48.98, currency: 'USD' },

  // ── Column 4 ────────────────────────────────────────────────────────────
  { id: 't33', carrier: 'FlixBus',   dep: '12:00', arr: '16:15', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 15m', stops: 'Direct', price: 36.98, currency: 'USD' },
  { id: 't34', carrier: 'FlixBus',   dep: '12:15', arr: '17:10', depStation: 'Queens Jamaica (144th Pl/Archer Ave)', arrStation: 'Boston (South Station)', duration: '4h 55m', stops: 'Direct', price: 34.98, currency: 'USD' },
  { id: 't35', carrier: 'FlixBus',   dep: '12:30', arr: '16:55', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 25m', stops: 'Direct', price: 36.98, currency: 'USD' },
  { id: 't36', carrier: 'Greyhound', dep: '12:40', arr: '17:45', depStation: 'New York (GW Bridge)', arrStation: 'Boston (South Station)', duration: '5h 05m', stops: 'Direct', price: 42.98, currency: 'USD' },
  { id: 't37', carrier: 'FlixBus',   dep: '12:45', arr: '17:10', depStation: 'Queens Flushing (Kissena Blvd/Main St)', arrStation: 'Boston (South Station)', duration: '4h 25m', stops: 'Direct', price: 34.98, currency: 'USD' },
  { id: 't38', carrier: 'FlixBus',   dep: '13:00', arr: '18:00', depStation: 'NYC Downtown Canal Street', arrStation: 'Boston (South Station)', duration: '5h 00m', stops: 'Direct', price: 35.98, currency: 'USD' },
  { id: 't39', carrier: 'FlixBus',   dep: '13:15', arr: '17:45', depStation: 'New York (Hudson Yards)', arrStation: 'Boston (South Station)', duration: '4h 30m', stops: 'Direct', price: 36.98, currency: 'USD' },
  { id: 't40', carrier: 'Greyhound', dep: '13:45', arr: '18:50', depStation: 'New York Port Authority', arrStation: 'Boston (South Station)', duration: '5h 05m', stops: 'Direct', price: 37.98, currency: 'USD' },
  { id: 't41', carrier: 'FlixBus',   dep: '13:45', arr: '19:20', depStation: 'New York (Hudson Yards)', arrStation: 'Cambridge', duration: '5h 35m', stops: 'Direct', price: 41.98, currency: 'USD' },
  { id: 't42', carrier: 'FlixBus',   dep: '13:45', arr: '19:50', depStation: 'New York (Hudson Yards)', arrStation: 'Boston (South Station)', duration: '6h 05m', stops: 'Direct', price: 41.98, currency: 'USD' },
  { id: 't43', carrier: 'FlixBus',   dep: '14:00', arr: '18:50', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 50m', stops: 'Direct', price: 36.98, currency: 'USD' },

  // ── Column 5 ────────────────────────────────────────────────────────────
  { id: 't44', carrier: 'FlixBus',   dep: '14:30', arr: '19:10', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 40m', stops: 'Direct', price: 36.98, currency: 'USD' },
  { id: 't45', carrier: 'FlixBus',   dep: '14:45', arr: '19:40', depStation: 'Queens Jamaica (144th Pl/Archer Ave)', arrStation: 'Boston (South Station)', duration: '4h 55m', stops: 'Direct', price: 34.98, currency: 'USD' },
  { id: 't46', carrier: 'FlixBus',   dep: '15:00', arr: '20:00', depStation: 'NYC Downtown Canal Street', arrStation: 'Boston (South Station)', duration: '5h 00m', stops: 'Direct', price: 35.98, currency: 'USD' },
  { id: 't47', carrier: 'FlixBus',   dep: '15:15', arr: '19:40', depStation: 'Queens Flushing (Kissena Blvd/Main St)', arrStation: 'Boston (South Station)', duration: '4h 25m', stops: 'Direct', price: 34.98, currency: 'USD' },
  { id: 't48', carrier: 'Greyhound', dep: '15:20', arr: '22:05', depStation: 'New York Port Authority', arrStation: 'Boston (South Station)', duration: '6h 45m', stops: 'Direct', price: 40.98, currency: 'USD' },
  { id: 't49', carrier: 'Greyhound', dep: '15:25', arr: '20:00', depStation: 'New York (GW Bridge)', arrStation: 'Boston (South Station)', duration: '4h 35m', stops: 'Direct', price: 39.98, currency: 'USD' },
  { id: 't50', carrier: 'Greyhound', dep: '15:30', arr: '21:10', depStation: 'New York Port Authority', arrStation: 'Boston (South Station)', duration: '5h 40m', stops: 'Direct', price: 39.98, currency: 'USD' },
  { id: 't51', carrier: 'FlixBus',   dep: '16:45', arr: '21:15', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 30m', stops: 'Direct', price: 36.98, currency: 'USD' },
  { id: 't52', carrier: 'FlixBus',   dep: '17:00', arr: '22:00', depStation: 'NYC Downtown Canal Street', arrStation: 'Boston (South Station)', duration: '5h 00m', stops: 'Direct', price: 35.98, currency: 'USD' },
  { id: 't53', carrier: 'Greyhound', dep: '17:20', arr: '21:50', depStation: 'New York (GW Bridge)', arrStation: 'Boston (South Station)', duration: '4h 30m', stops: 'Direct', price: 40.98, currency: 'USD' },
  { id: 't54', carrier: 'FlixBus',   dep: '17:30', arr: '22:10', depStation: 'Queens Jamaica (144th Pl/Archer Ave)', arrStation: 'Boston (South Station)', duration: '4h 40m', stops: 'Direct', price: 34.98, currency: 'USD' },

  // ── Column 6 ────────────────────────────────────────────────────────────
  { id: 't55', carrier: 'FlixBus',   dep: '17:30', arr: '22:20', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 50m', stops: 'Direct', price: 39.98, currency: 'USD' },
  { id: 't56', carrier: 'Greyhound', dep: '17:45', arr: '22:40', depStation: 'New York Port Authority', arrStation: 'Boston (South Station)', duration: '4h 55m', stops: 'Direct', price: 37.98, currency: 'USD' },
  { id: 't57', carrier: 'FlixBus',   dep: '18:00', arr: '22:10', depStation: 'Queens Flushing (Kissena Blvd/Main St)', arrStation: 'Boston (South Station)', duration: '4h 10m', stops: 'Direct', price: 34.98, currency: 'USD' },
  { id: 't58', carrier: 'FlixBus',   dep: '18:15', arr: '22:50', depStation: 'New York (Hudson Yards)', arrStation: 'Boston (South Station)', duration: '4h 35m', stops: 'Direct', price: 39.98, currency: 'USD' },
  { id: 't59', carrier: 'FlixBus',   dep: '18:30', arr: '23:30', depStation: 'NYC Downtown Canal Street', arrStation: 'Boston (South Station)', duration: '5h 00m', stops: 'Direct', price: 36.98, currency: 'USD' },
  { id: 't60', carrier: 'Greyhound', dep: '18:55', arr: '23:59', depStation: 'New York Port Authority', arrStation: 'Boston (South Station)', duration: '5h 04m', stops: 'Direct', price: 37.98, currency: 'USD' },
  { id: 't61', carrier: 'FlixBus',   dep: '19:00', arr: '23:30', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 30m', stops: 'Direct', price: 37.98, currency: 'USD' },
  { id: 't62', carrier: 'FlixBus',   dep: '19:30', arr: '23:50', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 20m', stops: 'Direct', price: 36.98, currency: 'USD' },
  { id: 't63', carrier: 'FlixBus',   dep: '20:00', arr: '01:00', depStation: 'NYC Downtown Canal Street', arrStation: 'Boston (South Station)', duration: '5h 00m', stops: 'Direct', price: 36.98, currency: 'USD', nextDay: true },
  { id: 't64', carrier: 'Greyhound', dep: '20:00', arr: '01:05', depStation: 'New York Port Authority', arrStation: 'Boston (South Station)', duration: '5h 05m', stops: 'Direct', price: 37.98, currency: 'USD', nextDay: true },
  { id: 't65', carrier: 'FlixBus',   dep: '23:59', arr: '04:40', depStation: 'NYC Midtown (31st St & 8th Ave)', arrStation: 'Boston (South Station)', duration: '4h 41m', stops: 'Direct', price: 41.98, currency: 'USD', nextDay: true },
];
