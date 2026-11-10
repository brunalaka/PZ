import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeWrapper } from '@flixbus/honeycomb-react';
import { HomePage } from './AI_Flow/home-page';
import { ChatPage } from './AI_Flow/chat-page';
import { ResultsPage } from './AI_Flow/results-page';
import { MyTripsPage } from './prototypes/customer-account/my-trips';
import { CheckoutPage } from './prototypes/checkout/checkout-page';
import { FlixbusHomeScreen } from './prototypes/flixbus-home/HomeScreen';
import { TravelDayPage } from './prototypes/travel-day/travel-day';
import { TravelDayV2Page } from './prototypes/travel-day/travel-day-v2';
import { CheckoutExplorationBase } from './prototypes/CheckoutExploration/base';
import { CheckoutExplorationAirbnb } from './prototypes/CheckoutExploration/airbnb';
import { SeatsBasePrototype } from './prototypes/Seats base/SeatsBasePrototype';
import { SeatPremiumZone } from './prototypes/Seat_Premium_Zone/SeatPremiumZone';
import { SeatPremiumZone as SeatPZOption1 } from './prototypes/Seat_PZ_Option1/SeatPremiumZone';
import { SeatPremiumZone as SeatPZOption2 } from './prototypes/Seat_PZ_Option2/SeatPremiumZone';
import { SeatPremiumZone as SeatPZOption4 } from './prototypes/Seat_PZ_Option4/SeatPremiumZone';
import { SeatPremiumZone as SeatPZOption5 } from './prototypes/Seat_PZ_Option5/SeatPremiumZone';

import '@flixbus/honeycomb/dist/css/honeycomb-fonts.css';
import './App.css';

const App = () => (
  <ThemeWrapper theme="flix">
    <BrowserRouter>
      <Routes>
        <Route path="/ai-flow/home" element={<HomePage />} />
        <Route path="/ai-flow/chat" element={<ChatPage />} />
        <Route path="/ai-flow/results" element={<ResultsPage />} />
        <Route path="/customer-account/my-trips" element={<MyTripsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/flixbus-home" element={<FlixbusHomeScreen />} />
        <Route path="/travel-day" element={<TravelDayPage />} />
        <Route path="/travel-day-v2" element={<TravelDayV2Page />} />
        <Route path="/checkout-exploration/base" element={<CheckoutExplorationBase />} />
        <Route path="/checkout-exploration/airbnb" element={<CheckoutExplorationAirbnb />} />
        <Route path="/seats-base" element={<SeatsBasePrototype />} />
        <Route path="/seat-premium-zone" element={<SeatPremiumZone />} />
        <Route path="/seat-premium-zone/seatmap" element={<SeatPremiumZone defaultSeatMapOpen />} />
        <Route path="/seat-pz-1" element={<SeatPZOption1 />} />
        <Route path="/seat-pz-1/seatmap" element={<SeatPZOption1 defaultSeatMapOpen />} />
        <Route path="/seat-pz-2" element={<SeatPZOption2 />} />
        <Route path="/seat-pz-2/seatmap" element={<SeatPZOption2 defaultSeatMapOpen />} />
        <Route path="/seat-pz-4" element={<SeatPZOption4 />} />
        <Route path="/seat-pz-4/seatmap" element={<SeatPZOption4 defaultSeatMapOpen />} />
        <Route path="/seat-pz-5" element={<SeatPZOption5 />} />
        <Route path="/seat-pz-5/seatmap" element={<SeatPZOption5 defaultSeatMapOpen />} />
      </Routes>
    </BrowserRouter>
  </ThemeWrapper>
);

export default App;
