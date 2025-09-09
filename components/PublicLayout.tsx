
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from './Toast';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  );
};

export default PublicLayout;
