import { describe, expect, it } from 'vitest';
import {
  getCategory,
  getLanguage,
  getPlatform,
  problemCategories,
  supportPlatforms,
} from './public-help-content';

describe('public homepage content', () => {
  it('shows the supported social media platforms', () => {
    expect(supportPlatforms.map((platform) => platform.name)).toEqual([
      'Instagram',
      'Facebook',
      'YouTube',
      'Other',
    ]);
  });

  it('includes bilingual labels for first-time users', () => {
    expect(supportPlatforms.every((platform) => platform.teluguName.length > 0)).toBe(true);
  });

  it('validates platforms and language safely', () => {
    expect(getPlatform('instagram')?.name).toBe('Instagram');
    expect(getPlatform('bad-platform')).toBeUndefined();
    expect(getLanguage('te')).toBe('te');
    expect(getLanguage('bad-language')).toBe('en');
  });

  it('has category choices for each supported platform', () => {
    expect(problemCategories.instagram.map((category) => category.slug)).toContain(
      'account-disabled',
    );
    expect(problemCategories.facebook.map((category) => category.slug)).toContain(
      'page-access-problem',
    );
    expect(problemCategories.youtube.map((category) => category.slug)).toContain(
      'channel-suspended',
    );
    expect(problemCategories.other.map((category) => category.slug)).toContain('payment-problem');
    expect(getCategory('instagram', 'account-disabled')?.title.en).toBe('Account disabled');
  });
});
