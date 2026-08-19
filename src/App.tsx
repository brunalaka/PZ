import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeWrapper } from '@flixbus/honeycomb-react';
import { HomePage } from './AI_Flow/home-page';
import { ChatPage } from './AI_Flow/chat-page';
import { ResultsPage } from './AI_Flow/results-page';

import '@flixbus/honeycomb/dist/css/honeycomb-fonts.css';
import './App.css';

const App = () => (
  <ThemeWrapper theme="flix">
    <BrowserRouter>
      <Routes>
        <Route path="/ai-flow/home" element={<HomePage />} />
        <Route path="/ai-flow/chat" element={<ChatPage />} />
        <Route path="/ai-flow/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  </ThemeWrapper>
);

export default App;
