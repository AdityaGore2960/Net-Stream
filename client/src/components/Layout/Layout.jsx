import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SearchBar from '../Search/SearchBar';
import DetailModal from '../Detail/DetailModal';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-ns-black text-white font-sans selection:bg-ns-red selection:text-white flex flex-col">
      <Navbar />
      <SearchBar />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />

      {/* Global Detail Modal — rendered outside content flow */}
      <DetailModal />
    </div>
  );
};

export default Layout;

