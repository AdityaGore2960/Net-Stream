import React from 'react';
import WatchProviderCard from './WatchProviderCard';
import StreamingButton from './StreamingButton';

/**
 * Groups and displays watch providers (stream, rent, buy)
 */
const WatchOptionsSection = ({ watchData }) => {
  if (!watchData) return null;

  const { flatrate = [], rent = [], buy = [], link } = watchData;
  const hasOptions = flatrate.length > 0 || rent.length > 0 || buy.length > 0;

  if (!hasOptions) return null;

  return (
    <div className="bg-ns-dark-3/50 rounded-xl p-6 border border-ns-gray-3 backdrop-blur-sm w-full max-w-3xl mb-8 ns-fade-in">
      <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <span className="w-1 h-6 bg-ns-red rounded-full"></span>
        Available On
      </h3>
      
      <div className="flex flex-col gap-6">
        {flatrate.length > 0 && (
          <div>
            <p className="text-sm text-ns-gray-1 mb-3 font-medium uppercase tracking-wider">Stream (Subscription)</p>
            <div className="flex flex-wrap gap-4">
              {flatrate.map(p => <WatchProviderCard key={p.provider_id} provider={p} type="Stream" />)}
            </div>
          </div>
        )}

        {rent.length > 0 && (
          <div>
            <p className="text-sm text-ns-gray-1 mb-3 font-medium uppercase tracking-wider">Rent</p>
            <div className="flex flex-wrap gap-4">
              {rent.map(p => <WatchProviderCard key={p.provider_id} provider={p} type="Rent" />)}
            </div>
          </div>
        )}

        {buy.length > 0 && (
          <div>
            <p className="text-sm text-ns-gray-1 mb-3 font-medium uppercase tracking-wider">Buy</p>
            <div className="flex flex-wrap gap-4">
              {buy.map(p => <WatchProviderCard key={p.provider_id} provider={p} type="Buy" />)}
            </div>
          </div>
        )}
      </div>
      
      {link && (
        <div className="mt-6 pt-6 border-t border-ns-gray-3/50 flex justify-end">
          <StreamingButton link={link} />
        </div>
      )}
    </div>
  );
};

export default WatchOptionsSection;
