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
};

export const tripResults: TripResult[] = [
  { departureTime: '00:10', duration: '4:05 hrs', arrivalTime: '04:15', departureStation: 'Berlin Alexanderplatz', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '19', priceCents: '.48' },
  { departureTime: '00:40', duration: '3:35 hrs', arrivalTime: '04:15', departureStation: 'Berlin Südkreuz', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '19', priceCents: '.48' },
  { departureTime: '01:00', duration: '3:15 hrs', arrivalTime: '04:15', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '19', priceCents: '.48' },
  { departureTime: '02:05', duration: '5:45 hrs', arrivalTime: '07:50', departureStation: 'Berlin Südkreuz', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: '1 Transfer', priceMain: '38', priceCents: '.48' },
  { departureTime: '02:25', duration: '4:20 hrs', arrivalTime: '06:45', departureStation: 'Berlin S-Treptower Park', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '17', priceCents: '.98' },
  { departureTime: '02:40', duration: '3:10 hrs', arrivalTime: '05:50', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '18', priceCents: '.48' },
  { departureTime: '02:45', duration: '4:00 hrs', arrivalTime: '06:45', departureStation: 'Berlin Alexanderplatz', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '17', priceCents: '.98' },
  { departureTime: '03:30', duration: '3:15 hrs', arrivalTime: '06:45', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '17', priceCents: '.98' },
  { departureTime: '03:35', duration: '3:40 hrs', arrivalTime: '07:15', departureStation: 'Berlin Alexanderplatz', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '25', priceCents: '.98' },
  { departureTime: '04:00', duration: '3:15 hrs', arrivalTime: '07:15', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '25', priceCents: '.98' },
  { departureTime: '07:05', duration: '4:10 hrs', arrivalTime: '11:15', departureStation: 'Berlin Südkreuz', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.98' },
  { departureTime: '07:30', duration: '3:45 hrs', arrivalTime: '11:15', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.98' },
  { departureTime: '07:46', duration: '4:48 hrs', arrivalTime: '12:34', departureStation: 'Berlin Ostbahnhof', arrivalStation: 'Hamburg Central Station', mode: 'Train', connection: '1 Transfer', priceMain: '43', priceCents: '.98' },
  { departureTime: '07:55', duration: '3:20 hrs', arrivalTime: '11:15', departureStation: 'Berlin Alt-Tegel', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.98' },
  { departureTime: '07:57', duration: '2:37 hrs', arrivalTime: '10:34', departureStation: 'Berlin Central Station', arrivalStation: 'Hamburg Central Station', mode: 'Train', connection: 'Direct', priceMain: '23', priceCents: '.98' },
  { departureTime: '08:15', duration: '2:19 hrs', arrivalTime: '10:34', departureStation: 'Berlin-Spandau', arrivalStation: 'Hamburg Central Station', mode: 'Train', connection: 'Direct', priceMain: '23', priceCents: '.98' },
  { departureTime: '08:15', duration: '3:15 hrs', arrivalTime: '11:30', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.48' },
  { departureTime: '09:00', duration: '3:15 hrs', arrivalTime: '12:15', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.48' },
  { departureTime: '09:50', duration: '3:50 hrs', arrivalTime: '13:40', departureStation: 'Berlin Südkreuz', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.98' },
  { departureTime: '09:55', duration: '2:39 hrs', arrivalTime: '12:34', departureStation: 'Berlin Südkreuz', arrivalStation: 'Hamburg Central Station', mode: 'Train', connection: 'Direct', priceMain: '24', priceCents: '.98' },
  { departureTime: '10:00', duration: '3:15 hrs', arrivalTime: '13:15', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.48' },
  { departureTime: '10:06', duration: '2:28 hrs', arrivalTime: '12:34', departureStation: 'Berlin Central Station', arrivalStation: 'Hamburg Central Station', mode: 'Train', connection: 'Direct', priceMain: '24', priceCents: '.98' },
  { departureTime: '10:15', duration: '3:25 hrs', arrivalTime: '13:40', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.98' },
  { departureTime: '10:30', duration: '5:30 hrs', arrivalTime: '16:00', departureStation: 'Berlin Alexanderplatz', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: '1 Transfer', priceMain: '37', priceCents: '.48' },
  { departureTime: '10:35', duration: '3:05 hrs', arrivalTime: '13:40', departureStation: 'Berlin Alt-Tegel', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.98' },
  { departureTime: '11:30', duration: '3:15 hrs', arrivalTime: '14:45', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.48' },
  { departureTime: '13:00', duration: '5:15 hrs', arrivalTime: '18:15', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: '1 Transfer', priceMain: '36', priceCents: '.48' },
  { departureTime: '13:55', duration: '2:39 hrs', arrivalTime: '16:34', departureStation: 'Berlin Südkreuz', arrivalStation: 'Hamburg Central Station', mode: 'Train', connection: 'Direct', priceMain: '24', priceCents: '.98' },
  { departureTime: '14:08', duration: '2:26 hrs', arrivalTime: '16:34', departureStation: 'Berlin Central Station', arrivalStation: 'Hamburg Central Station', mode: 'Train', connection: 'Direct', priceMain: '24', priceCents: '.98' },
  { departureTime: '15:00', duration: '3:15 hrs', arrivalTime: '18:15', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.48' },
  { departureTime: '16:00', duration: '3:15 hrs', arrivalTime: '19:15', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.48' },
  { departureTime: '16:35', duration: '3:45 hrs', arrivalTime: '20:20', departureStation: 'Berlin Südkreuz', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '14', priceCents: '.98' },
  { departureTime: '16:40', duration: '3:20 hrs', arrivalTime: '20:00', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '13', priceCents: '.98' },
  { departureTime: '16:50', duration: '3:10 hrs', arrivalTime: '20:00', departureStation: 'Berlin Alt-Tegel', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '13', priceCents: '.98' },
  { departureTime: '17:00', duration: '3:15 hrs', arrivalTime: '20:15', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '16', priceCents: '.48' },
  { departureTime: '17:00', duration: '3:20 hrs', arrivalTime: '20:20', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '14', priceCents: '.98' },
  { departureTime: '17:55', duration: '2:39 hrs', arrivalTime: '20:34', departureStation: 'Berlin Südkreuz', arrivalStation: 'Hamburg Central Station', mode: 'Train', connection: 'Direct', priceMain: '23', priceCents: '.98' },
  { departureTime: '18:06', duration: '4:28 hrs', arrivalTime: '22:34', departureStation: 'Berlin Central Station', arrivalStation: 'Hamburg Central Station', mode: 'Train', connection: '1 Transfer', priceMain: '43', priceCents: '.98' },
  { departureTime: '18:15', duration: '3:15 hrs', arrivalTime: '21:30', departureStation: 'Berlin central bus station', arrivalStation: 'Hamburg ZOB', mode: 'Bus', connection: 'Direct', priceMain: '13', priceCents: '.48' },
  { departureTime: '19:55', duration: '2:38 hrs', arrivalTime: '22:33', departureStation: 'Berlin Südkreuz', arrivalStation: 'Hamburg Central Station', mode: 'Train', connection: 'Direct', priceMain: '16', priceCents: '.98' },
];
