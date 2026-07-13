export const PROJECT_NAME = 'Creator Support';

export {
  maskEmail,
  maskMobileNumber,
  normalizeIndianMobile,
  getRequestCategoryName,
  requestCategoryNameBySlug,
  screenshotUploadLimits,
  validateProblemDetails,
} from './problem-details';
export type {
  PreferredLanguage,
  ProblemDetailsData,
  ProblemDetailsErrors,
  ProblemDetailsInput,
  ProblemDetailsValidationResult,
  SupportPlatform,
} from './problem-details';
