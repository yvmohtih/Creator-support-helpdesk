export type PreferredLanguage = 'en' | 'te';
export type SupportPlatform = 'instagram' | 'facebook' | 'youtube' | 'other';

export const screenshotUploadLimits = {
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxCombinedSizeBytes: 12 * 1024 * 1024,
  maxFileSizeBytes: 5 * 1024 * 1024,
  maxFiles: 3,
};

export const requestCategoryNameBySlug: Record<SupportPlatform, Record<string, string>> = {
  instagram: {
    'account-disabled': 'Account disabled',
    'cannot-log-in': 'Cannot log in',
    'copyright-issue': 'Copyright issue',
    'reach-reduced': 'Reach reduced',
    'monetization-problem': 'Monetization problem',
    'payment-not-received': 'Payment not received',
    'other-problem': 'Other problem',
  },
  facebook: {
    'page-disabled': 'Page disabled',
    'cannot-log-in': 'Cannot log in',
    'monetization-problem': 'Monetization problem',
    'payment-not-received': 'Payment not received',
    'copyright-issue': 'Copyright issue',
    'page-access-problem': 'Page access problem',
    'other-problem': 'Other problem',
  },
  youtube: {
    'channel-warning': 'Channel warning',
    'copyright-strike': 'Copyright strike',
    'channel-suspended': 'Channel suspended',
    'monetization-issue': 'Monetization issue',
    'adsense-issue': 'AdSense issue',
    'payment-issue': 'Payment issue',
    'other-problem': 'Other problem',
  },
  other: {
    'account-problem': 'Account problem',
    'login-problem': 'Login problem',
    'payment-problem': 'Payment problem',
    'copyright-problem': 'Copyright problem',
    'other-problem': 'Other problem',
  },
};

export interface ProblemDetailsInput {
  name: string;
  platformHandle: string;
  mobile: string;
  email: string;
  description: string;
  preferredLanguage: PreferredLanguage | '';
  consent: boolean;
  platform: SupportPlatform;
}

export interface ProblemDetailsData {
  name: string;
  platformHandle: string;
  mobile: string;
  email: string;
  description: string;
  preferredLanguage: PreferredLanguage;
  platform: SupportPlatform;
}

export type ProblemDetailsErrors = Partial<Record<keyof ProblemDetailsInput, string>>;

export interface ProblemDetailsValidationResult {
  data?: ProblemDetailsData;
  errors: ProblemDetailsErrors;
  isValid: boolean;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^[6-9]\d{9}$/;

export function validateProblemDetails(input: ProblemDetailsInput): ProblemDetailsValidationResult {
  const errors: ProblemDetailsErrors = {};
  const name = collapseSpaces(input.name);
  const platformHandle = collapseSpaces(input.platformHandle);
  const mobile = normalizeIndianMobile(input.mobile);
  const email = input.email.trim();
  const description = input.description.trim();
  const preferredLanguage =
    input.preferredLanguage === 'en' || input.preferredLanguage === 'te'
      ? input.preferredLanguage
      : undefined;

  if (name.length === 0) {
    errors.name = 'name.required';
  } else if (name.length < 2) {
    errors.name = 'name.tooShort';
  } else if (name.length > 80) {
    errors.name = 'name.tooLong';
  }

  if (input.platform !== 'other' && platformHandle.length === 0) {
    errors.platformHandle = 'platformHandle.required';
  } else if (platformHandle.length > 100) {
    errors.platformHandle = 'platformHandle.tooLong';
  }

  if (mobile.length === 0 || !mobilePattern.test(mobile)) {
    errors.mobile = 'mobile.invalid';
  }

  if (email.length > 254) {
    errors.email = 'email.tooLong';
  } else if (email.length > 0 && !emailPattern.test(email)) {
    errors.email = 'email.invalid';
  }

  if (description.length === 0) {
    errors.description = 'description.required';
  } else if (description.length < 20) {
    errors.description = 'description.tooShort';
  } else if (description.length > 2000) {
    errors.description = 'description.tooLong';
  }

  if (!preferredLanguage) {
    errors.preferredLanguage = 'preferredLanguage.required';
  }

  if (!input.consent) {
    errors.consent = 'consent.required';
  }

  const isValid = Object.keys(errors).length === 0;

  if (!isValid || !preferredLanguage) {
    return {
      errors,
      isValid: false,
    };
  }

  return {
    errors,
    isValid: true,
    data: {
      name,
      platformHandle,
      mobile,
      email,
      description,
      preferredLanguage,
      platform: input.platform,
    },
  };
}

export function normalizeIndianMobile(value: string) {
  const digits = value.replace(/[^\d]/g, '');

  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }

  return digits;
}

export function maskMobileNumber(value: string) {
  const normalized = normalizeIndianMobile(value);

  if (normalized.length < 4) {
    return '••••';
  }

  return `••••••${normalized.slice(-4)}`;
}

export function maskEmail(value: string) {
  const email = value.trim();
  const [localPart, domain] = email.split('@');

  if (!localPart || !domain) {
    return '';
  }

  const visibleStart = localPart.slice(0, 2);
  const visibleEnd = localPart.length > 4 ? localPart.slice(-1) : '';

  return `${visibleStart}${'•'.repeat(Math.max(3, localPart.length - visibleStart.length - visibleEnd.length))}${visibleEnd}@${domain}`;
}

export function getRequestCategoryName(platform: SupportPlatform, categorySlug: string) {
  return requestCategoryNameBySlug[platform]?.[categorySlug];
}

function collapseSpaces(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}
