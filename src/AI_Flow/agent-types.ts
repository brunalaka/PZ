export interface TripData {
  tripId: string;
  dep: string;
  arr: string;
  depStation: string;
  arrStation: string;
  duration: string;
  stops: string;
  price: number;
  currency: string;
  carrier: string;
}

export interface Recommendation {
  heading: string;
  description: string;
  trip: TripData;
}

export interface AgentResult {
  summary: string;
  recommendations: Recommendation[];
  moreResults: TripData[];
}
