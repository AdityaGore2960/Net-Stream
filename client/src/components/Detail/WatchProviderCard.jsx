import React from 'react';
import { getImageURL } from '../../services/tmdb';

/**
 * Displays a single watch provider (Netflix, Prime, etc.)
 */
const WatchProviderCard = ({ provider, type }) => {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer w-20">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-lg border border-transparent group-hover:border-white transition-all transform group-hover:scale-105 group-hover:shadow-ns-red/20">
        <img 
          src={getImageURL(provider.logo_path, 'w200')} 
          alt={provider.provider_name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center">
        <p className="text-xs text-white font-medium truncate w-full px-1">{provider.provider_name}</p>
        <p className="text-[10px] text-ns-gray-1 uppercase tracking-wider">{type}</p>
      </div>
    </div>
  );
};

export default WatchProviderCard;
