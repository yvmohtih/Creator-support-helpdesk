import { describe, expect, it } from 'vitest';
import { supportPlatforms } from './home-content';

describe('public homepage content', () => {
  it('shows the supported social media platforms', () => {
    expect(supportPlatforms.map((platform) => platform.name)).toEqual([
      'Instagram',
      'Facebook',
      'YouTube',
    ]);
  });

  it('includes bilingual labels for first-time users', () => {
    expect(supportPlatforms.every((platform) => platform.teluguName.length > 0)).toBe(true);
  });
});
