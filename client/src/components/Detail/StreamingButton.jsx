import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

/**
 * CTA Button linking to JustWatch/TMDB provider page
 */
const StreamingButton = ({ link }) => {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-ns-red text-white px-6 py-3 rounded font-bold hover:bg-ns-red-hover transition-colors shadow-lg shadow-ns-red/20"
    >
      Watch Now <FaExternalLinkAlt className="text-sm ml-1" />
    </a>
  );
};

export default StreamingButton;
