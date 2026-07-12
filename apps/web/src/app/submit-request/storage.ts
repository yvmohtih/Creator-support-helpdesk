import { ProblemDetailsData } from '@creator-support/shared';

export interface StoredProblemDetails extends ProblemDetailsData {
  category: string;
}

export const problemDetailsDraftKey = 'creator-support:problem-details-draft';
export const problemDetailsPreviewKey = 'creator-support:problem-details-preview';

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
