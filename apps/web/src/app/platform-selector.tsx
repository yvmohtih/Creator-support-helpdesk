'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supportPlatforms } from './public-help-content';

export function PlatformSelector() {
  const [selectedPlatform, setSelectedPlatform] = useState<(typeof supportPlatforms)[number]>();

  return (
    <>
      <div className="platform-list">
        {supportPlatforms.map((platform) => (
          <Link
            className="platform-option"
            href={`/get-help?platform=${platform.slug}`}
            key={platform.name}
            onClick={() => setSelectedPlatform(platform)}
          >
            <span className="platform-icon" aria-hidden="true">
              {platform.shortName}
            </span>
            <span>
              <span className="platform-name">{platform.name}</span>
              <span className="platform-telugu">{platform.teluguName}</span>
              <span className="platform-help">{platform.helpText}</span>
            </span>
          </Link>
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
