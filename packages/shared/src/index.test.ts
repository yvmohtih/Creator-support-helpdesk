import { describe, expect, it } from 'vitest';
import { PROJECT_NAME } from './index';

describe('shared foundation', () => {
  it('exports the project name', () => {
    expect(PROJECT_NAME).toBe('Creator Support');
  });
});
