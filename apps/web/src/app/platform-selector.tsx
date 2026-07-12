'use client';

import { useState } from 'react';
import { supportPlatforms } from './home-content';

export function PlatformSelector() {
  const [selectedPlatform, setSelectedPlatform] = useState<(typeof supportPlatforms)[number]>();

  return (
    <>
      <div className="platform-list">
        {supportPlatforms.map((platform) => (
          <button
            aria-pressed={selectedPlatform?.name === platform.name}
            className="platform-option"
            key={platform.name}
            onClick={() => setSelectedPlatform(platform)}
            type="button"
          >
            <span className="platform-icon" aria-hidden="true">
              {platform.shortName}
            </span>
            <span>
              <span className="platform-name">{platform.name}</span>
              <span className="platform-telugu">{platform.teluguName}</span>
              <span className="platform-help">{platform.helpText}</span>
            </span>
          </button>
        ))}
      </div>

      <p className="selection-status" role="status">
        {selectedPlatform
          ? `${selectedPlatform.name} selected. Problem choices will come in the next step.`
          : 'Tap one app to start.'}
      </p>
    </>
  );
}
