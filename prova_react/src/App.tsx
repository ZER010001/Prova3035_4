import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Search from './components/Search';
import UserDetails from './components/UserDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Search} />
        <Route path="/user-details/:username" Component={UserDetails} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
