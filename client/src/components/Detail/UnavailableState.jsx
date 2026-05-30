import React from 'react';
import { FaPlay, FaGlobe } from 'react-icons/fa';
import { useUIStore } from '../../store/uiStore';

/**
 * Fallback when content is not available in the user's region
 */
const UnavailableState = ({ regionName = "India" }) => {
  const { openTrailer } = useUIStore();

  return (
    <div className="bg-ns-dark-3/50 rounded-xl p-6 md:p-8 border border-ns-gray-3 backdrop-blur-sm w-full max-w-3xl mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left ns-fade-in">
      <div className="w-16 h-16 rounded-full bg-ns-dark-2 flex items-center justify-center flex-shrink-0 border border-ns-gray-3">
        <FaGlobe className="text-2xl text-ns-gray-1" />
      </div>
      
      <div className="flex-grow">
        <h3 className="text-xl font-bold mb-2 text-white">Not available in {regionName}</h3>
        <p className="text-ns-gray-1 text-sm md:text-base leading-relaxed mb-6">
          This title is currently not available to stream, rent, or buy in your region. 
          Availability changes frequently, so check back later or use a VPN to explore other regions.
        </p>
        
        <button 
          onClick={() => openTrailer(null)}
          className="flex items-center justify-center md:justify-start gap-2 bg-white text-black px-6 py-3 rounded font-bold hover:bg-gray-200 transition-colors w-full md:w-auto mx-auto md:mx-0"
        >
          <FaPlay className="text-sm" /> Watch Trailer Instead
        </button>
      </div>
    </div>
  );
};

export default UnavailableState;
