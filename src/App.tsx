import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import CarDetail from './pages/CarDetail';
import CityPrice from './pages/CityPrice';
import Membership from './pages/Membership';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Community from './pages/Community';
import Admin from './pages/Admin';
import BudgetCars from './pages/BudgetCars';
import ChatBot from './components/ChatBot';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="car/:id" element={<CarDetail />} />
            <Route path="price-in/:city/car/:id" element={<CityPrice />} />
            <Route path="explore" element={<Explore />} />
            <Route path="new-cars" element={<Explore />} />
            <Route path="new-cars/:make" element={<Explore />} />
            <Route path="used-cars" element={<Explore />} />
            <Route path="budget/:range" element={<BudgetCars />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="community" element={<Community />} />
            <Route path="membership" element={<Membership />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </AuthProvider>
  );
}
