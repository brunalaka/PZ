export type TripResult = {
  departureTime: string;
  duration: string;
  arrivalTime: string;
  departureStation: string;
  arrivalStation: string;
  mode: 'Bus';
  connection: 'Direct' | '1 Transfer';
  priceMain: string;
  priceCents: string;
  premiumZone?: boolean;
  urgencyText?: string;
};

export const tripResults: TripResult[] = [
  { departureTime: '07:55', duration: '3:20 hrs', arrivalTime: '11:15', departureStation: 'Berlin Alt-Tegel', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.98', premiumZone: true },
  { departureTime: '08:15', duration: '3:15 hrs', arrivalTime: '11:30', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.48', premiumZone: true },
  { departureTime: '09:00', duration: '3:15 hrs', arrivalTime: '12:15', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.48' },
  { departureTime: '09:50', duration: '3:50 hrs', arrivalTime: '13:40', departureStation: 'Berlin Südkreuz', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.98', premiumZone: true, urgencyText: '1 seat left at this price' },
  { departureTime: '10:00', duration: '3:15 hrs', arrivalTime: '13:15', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.48' },
  { departureTime: '10:15', duration: '3:25 hrs', arrivalTime: '13:40', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.98', premiumZone: true },
];
