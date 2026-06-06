import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Home from './home.jsx';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

