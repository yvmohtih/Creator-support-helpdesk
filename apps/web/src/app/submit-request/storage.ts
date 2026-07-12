import { ProblemDetailsData } from '@creator-support/shared';

export interface StoredProblemDetails extends ProblemDetailsData {
  category: string;
  idempotencyKey: string;
}

export const problemDetailsDraftKey = 'creator-support:problem-details-draft';
export const problemDetailsPreviewKey = 'creator-support:problem-details-preview';
export const requestConfirmationKey = 'creator-support:request-confirmation';

export interface StoredRequestConfirmation {
  categoryName: string;
  language: 'en' | 'te';
  maskedMobile: string;
  platform: string;
  requestNumber: string;
  submittedAt: string;
}

export function readStoredDetails(key: string): StoredProblemDetails | undefined {
  try {
    const rawValue = window.sessionStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as StoredProblemDetails) : undefined;
  } catch {
    return undefined;
  }
}

export function writeStoredDetails(key: string, value: StoredProblemDetails) {
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

export function removeStoredDetails(key: string) {
  window.sessionStorage.removeItem(key);
}

export function readStoredConfirmation(): StoredRequestConfirmation | undefined {
  try {
    const rawValue = window.sessionStorage.getItem(requestConfirmationKey);
    return rawValue ? (JSON.parse(rawValue) as StoredRequestConfirmation) : undefined;
  } catch {
    return undefined;
  }
}

export function writeStoredConfirmation(value: StoredRequestConfirmation) {
  window.sessionStorage.setItem(requestConfirmationKey, JSON.stringify(value));
}

export function removeStoredConfirmation() {
  window.sessionStorage.removeItem(requestConfirmationKey);
}
