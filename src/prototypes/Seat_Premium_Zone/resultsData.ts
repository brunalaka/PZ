export type TripResult = {
  departureTime: string;
  duration: string;
  arrivalTime: string;
  departureStation: string;
  arrivalStation: string;
  mode: 'Bus' | 'Train';
  connection: 'Direct' | '1 Transfer';
  priceMain: string;
  priceCents: string;
  premiumZone?: boolean;
  urgencyText?: string;
};

export const tripResults: TripResult[] = [
  { departureTime: '07:55', duration: '3:20 hrs', arrivalTime: '11:15', departureStation: 'Berlin Alt-Tegel', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.98', premiumZone: true },
  { departureTime: '07:57', duration: '2:37 hrs', arrivalTime: '10:34', departureStation: 'Berlin Central Station', arrivalStation: 'Hamburg Central Station', mode: 'Train', connection: 'Direct', priceMain: '23', priceCents: '.98' },
  { departureTime: '08:15', duration: '2:19 hrs', arrivalTime: '10:34', departureStation: 'Berlin-Spandau', arrivalStation: 'Hamburg Central Station', mode: 'Train', connection: 'Direct', priceMain: '23', priceCents: '.98' },
  { departureTime: '08:15', duration: '3:15 hrs', arrivalTime: '11:30', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.48', premiumZone: true },
  { departureTime: '09:00', duration: '3:15 hrs', arrivalTime: '12:15', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.48' },
  { departureTime: '09:50', duration: '3:50 hrs', arrivalTime: '13:40', departureStation: 'Berlin Südkreuz', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.98', premiumZone: true, urgencyText: '1 seat left at this price' },
  { departureTime: '09:55', duration: '2:39 hrs', arrivalTime: '12:34', departureStation: 'Berlin Südkreuz', arrivalStation: 'Hamburg Central Station', mode: 'Train', connection: 'Direct', priceMain: '24', priceCents: '.98' },
  { departureTime: '10:00', duration: '3:15 hrs', arrivalTime: '13:15', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.48' },
  { departureTime: '10:06', duration: '2:28 hrs', arrivalTime: '12:34', departureStation: 'Berlin Central Station', arrivalStation: 'Hamburg Central Station', mode: 'Train', connection: 'Direct', priceMain: '24', priceCents: '.98' },
  { departureTime: '10:15', duration: '3:25 hrs', arrivalTime: '13:40', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.98', premiumZone: true },
];
