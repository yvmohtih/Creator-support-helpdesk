import { describe, expect, it } from 'vitest';
import {
  maskEmail,
  maskMobileNumber,
  normalizeIndianMobile,
  PROJECT_NAME,
  validateProblemDetails,
} from './index';

describe('shared foundation', () => {
  it('exports the project name', () => {
    expect(PROJECT_NAME).toBe('Creator Support');
  });
});

describe('problem details validation', () => {
  const validInput = {
    name: 'Mohith Kumar',
    platformHandle: 'creator page',
    mobile: '9876543210',
    email: 'mohith@example.com',
    description: 'My account was disabled yesterday and I saw an appeal message.',
    preferredLanguage: 'en' as const,
    consent: true,
    platform: 'instagram' as const,
  };

  it('accepts valid form data', () => {
    const result = validateProblemDetails(validInput);

    expect(result.isValid).toBe(true);
    expect(result.data?.mobile).toBe('9876543210');
  });

  it('rejects empty required fields', () => {
    const result = validateProblemDetails({
      ...validInput,
      name: '',
      mobile: '',
      description: '',
      preferredLanguage: '',
      consent: false,
    });

    expect(result.errors.name).toBe('name.required');
    expect(result.errors.mobile).toBe('mobile.invalid');
    expect(result.errors.description).toBe('description.required');
    expect(result.errors.preferredLanguage).toBe('preferredLanguage.required');
    expect(result.errors.consent).toBe('consent.required');
  });

  it('rejects invalid Indian mobile numbers', () => {
    const result = validateProblemDetails({ ...validInput, mobile: '12345' });

    expect(result.errors.mobile).toBe('mobile.invalid');
  });

  it('accepts and normalizes +91 mobile numbers', () => {
    const result = validateProblemDetails({ ...validInput, mobile: '+91 98765 43210' });

    expect(result.isValid).toBe(true);
    expect(result.data?.mobile).toBe('9876543210');
    expect(normalizeIndianMobile('+91 98765 43210')).toBe('9876543210');
  });

  it('accepts optional valid email and rejects invalid email', () => {
    expect(validateProblemDetails({ ...validInput, email: '' }).isValid).toBe(true);
    expect(validateProblemDetails({ ...validInput, email: 'bad-email' }).errors.email).toBe(
      'email.invalid',
    );
  });

  it('rejects descriptions that are too short or too long', () => {
    expect(
      validateProblemDetails({ ...validInput, description: 'too short' }).errors.description,
    ).toBe('description.tooShort');
    expect(
      validateProblemDetails({ ...validInput, description: 'a'.repeat(2001) }).errors.description,
    ).toBe('description.tooLong');
  });

  it('accepts Telugu text', () => {
    const result = validateProblemDetails({
      ...validInput,
      name: 'మోహిత్',
      description: 'నా Instagram ఖాతా నిన్నటి నుంచి పనిచేయడం లేదు. దయచేసి సహాయం చేయండి.',
      preferredLanguage: 'te',
    });

    expect(result.isValid).toBe(true);
  });

  it('allows missing handle for Other platform only', () => {
    expect(
      validateProblemDetails({ ...validInput, platformHandle: '' }).errors.platformHandle,
    ).toBe('platformHandle.required');
    expect(
      validateProblemDetails({ ...validInput, platform: 'other', platformHandle: '' }).isValid,
    ).toBe(true);
  });

  it('masks mobile number and email for preview', () => {
    expect(maskMobileNumber('9876543210')).toBe('••••••3210');
    expect(maskEmail('mohith@example.com')).toBe('mo•••h@example.com');
  });
});
