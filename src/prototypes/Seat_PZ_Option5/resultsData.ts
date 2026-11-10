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
  { departureTime: '07:55', duration: '4:00 hrs', arrivalTime: '11:55', departureStation: 'Berlin Alt-Tegel', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.48' },
  { departureTime: '08:15', duration: '3:15 hrs', arrivalTime: '11:30', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '18', priceCents: '.98' },
  { departureTime: '09:00', duration: '3:40 hrs', arrivalTime: '12:40', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '17', priceCents: '.48', premiumZone: true },
  { departureTime: '09:50', duration: '3:15 hrs', arrivalTime: '13:05', departureStation: 'Berlin Südkreuz', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '14', priceCents: '.98', urgencyText: '1 seat left at this price' },
  { departureTime: '10:00', duration: '4:10 hrs', arrivalTime: '14:10', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '12', priceCents: '.48' },
  { departureTime: '10:15', duration: '3:35 hrs', arrivalTime: '13:50', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '14', priceCents: '.48', premiumZone: true },
];
