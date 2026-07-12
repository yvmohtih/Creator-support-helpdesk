'use client';

import { validateProblemDetails, ProblemDetailsErrors } from '@creator-support/shared';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Language, PlatformSlug, ProblemCategory, SupportPlatform } from '../public-help-content';
import { submitText, validationMessages } from './form-content';
import {
  problemDetailsDraftKey,
  problemDetailsPreviewKey,
  readStoredDetails,
  writeStoredDetails,
} from './storage';

interface ProblemDetailsFormProps {
  category: ProblemCategory;
  initialLanguage: Language;
  platform: SupportPlatform;
}

interface FormState {
  name: string;
  platformHandle: string;
  mobile: string;
  email: string;
  description: string;
  preferredLanguage: Language | '';
  consent: boolean;
}

const initialState: FormState = {
  name: '',
  platformHandle: '',
  mobile: '',
  email: '',
  description: '',
  preferredLanguage: '',
  consent: false,
};

const fieldOrder: Array<keyof FormState> = [
  'name',
  'platformHandle',
  'mobile',
  'email',
  'description',
  'preferredLanguage',
  'consent',
];

export function ProblemDetailsForm({
  category,
  initialLanguage,
  platform,
}: ProblemDetailsFormProps) {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [form, setForm] = useState<FormState>({
    ...initialState,
    preferredLanguage: initialLanguage,
  });
  const [errors, setErrors] = useState<ProblemDetailsErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const fieldRefs = useRef<Partial<Record<keyof FormState, HTMLElement | null>>>({});

  const selectedSummary = useMemo(
    () =>
      language === 'te'
        ? `${platform.teluguName} → ${category.title.te}`
        : `${platform.name} → ${category.title.en}`,
    [category, language, platform],
  );

  useEffect(() => {
    const stored = readStoredDetails(problemDetailsDraftKey);

    if (stored && stored.platform === platform.slug && stored.category === category.slug) {
      setForm({
        name: stored.name,
        platformHandle: stored.platformHandle,
        mobile: stored.mobile,
        email: stored.email,
        description: stored.description,
        preferredLanguage: stored.preferredLanguage,
        consent: true,
      });
    }
  }, [category.slug, platform.slug]);

  function updateField(field: keyof FormState, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function handleTextChange(field: keyof FormState) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateField(field, event.target.value);
    };
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');

    const result = validateProblemDetails({
      ...form,
      platform: platform.slug as PlatformSlug,
    });

    if (!result.isValid || !result.data) {
      setErrors(result.errors);
      setIsSubmitting(false);
      focusFirstInvalidField(result.errors);
      return;
    }

    const storedDetails = {
      ...result.data,
      category: category.slug,
      idempotencyKey: existingIdempotencyKey() ?? createIdempotencyKey(),
    };
    setErrors({});
    writeStoredDetails(problemDetailsDraftKey, storedDetails);
    writeStoredDetails(problemDetailsPreviewKey, storedDetails);
    setStatusMessage(submitText.validationSuccess[language]);

    const params = new URLSearchParams({
      platform: platform.slug,
      category: category.slug,
      lang: language,
    });
    router.push(`/submit-request/preview?${params.toString()}`);
  }

  function focusFirstInvalidField(nextErrors: ProblemDetailsErrors) {
    const firstInvalidField = fieldOrder.find((field) => nextErrors[field]);

    if (firstInvalidField) {
      fieldRefs.current[firstInvalidField]?.focus();
    }
  }

  function existingIdempotencyKey() {
    const draft = readStoredDetails(problemDetailsDraftKey);

    if (draft?.platform === platform.slug && draft.category === category.slug) {
      return draft.idempotencyKey;
    }

    return undefined;
  }

  function errorText(field: keyof FormState) {
    const errorKey = errors[field];
    return errorKey ? validationMessages[errorKey]?.[language] : undefined;
  }

  return (
    <form className="problem-form" onSubmit={submitForm} noValidate>
      <section className="selected-problem-panel" aria-labelledby="selected-problem-title">
        <p id="selected-problem-title" className="section-kicker">
          {submitText.summaryTitle[language]}
        </p>
        <p className="selected-summary">{selectedSummary}</p>
        <a className="text-link" href={`/get-help?platform=${platform.slug}&lang=${language}`}>
          {submitText.editProblem[language]}
        </a>
      </section>

      <div className="language-switcher" aria-label={submitText.preferredLanguage[language]}>
        <button
          aria-pressed={language === 'en'}
          className="language-choice"
          onClick={() => setLanguage('en')}
          type="button"
        >
          English
        </button>
        <button
          aria-pressed={language === 'te'}
          className="language-choice"
          onClick={() => setLanguage('te')}
          type="button"
        >
          తెలుగు
        </button>
      </div>

      <h1 id="submit-request-title">{submitText.formTitle[language]}</h1>

      {Object.keys(errors).length > 0 ? (
        <div className="error-summary" role="alert" tabIndex={-1}>
          <strong>{submitText.errorSummary[language]}</strong>
        </div>
      ) : null}

      <div className="form-field">
        <label htmlFor="name">{submitText.name[language]}</label>
        <input
          aria-describedby={errorText('name') ? 'name-error' : undefined}
          aria-invalid={Boolean(errorText('name'))}
          autoComplete="name"
          id="name"
          maxLength={80}
          onChange={handleTextChange('name')}
          ref={(element) => {
            fieldRefs.current.name = element;
          }}
          type="text"
          value={form.name}
        />
        <FieldError id="name-error" message={errorText('name')} />
      </div>

      <div className="form-field">
        <label htmlFor="platformHandle">{submitText.platformHandle[language]}</label>
        <input
          aria-describedby={errorText('platformHandle') ? 'platformHandle-error' : undefined}
          aria-invalid={Boolean(errorText('platformHandle'))}
          autoCapitalize="none"
          id="platformHandle"
          maxLength={100}
          onChange={handleTextChange('platformHandle')}
          ref={(element) => {
            fieldRefs.current.platformHandle = element;
          }}
          type="text"
          value={form.platformHandle}
        />
        <FieldError id="platformHandle-error" message={errorText('platformHandle')} />
      </div>

      <div className="form-field">
        <label htmlFor="mobile">{submitText.mobile[language]}</label>
        <input
          aria-describedby={`mobile-help${errorText('mobile') ? ' mobile-error' : ''}`}
          aria-invalid={Boolean(errorText('mobile'))}
          autoComplete="tel"
          id="mobile"
          inputMode="tel"
          onChange={handleTextChange('mobile')}
          ref={(element) => {
            fieldRefs.current.mobile = element;
          }}
          type="tel"
          value={form.mobile}
        />
        <p className="field-help" id="mobile-help">
          {submitText.mobileHelp[language]}
        </p>
        <FieldError id="mobile-error" message={errorText('mobile')} />
      </div>

      <div className="form-field">
        <label htmlFor="email">{submitText.email[language]}</label>
        <input
          aria-describedby={errorText('email') ? 'email-error' : undefined}
          aria-invalid={Boolean(errorText('email'))}
          autoComplete="email"
          id="email"
          inputMode="email"
          maxLength={254}
          onChange={handleTextChange('email')}
          ref={(element) => {
            fieldRefs.current.email = element;
          }}
          type="email"
          value={form.email}
        />
        <FieldError id="email-error" message={errorText('email')} />
      </div>

      <div className="form-field">
        <label htmlFor="description">{submitText.description[language]}</label>
        <textarea
          aria-describedby={`description-help description-counter${
            errorText('description') ? ' description-error' : ''
          }`}
          aria-invalid={Boolean(errorText('description'))}
          id="description"
          maxLength={2000}
          onChange={handleTextChange('description')}
          ref={(element) => {
            fieldRefs.current.description = element;
          }}
          rows={6}
          value={form.description}
        />
        <p className="field-help" id="description-help">
          {submitText.descriptionHelp[language]}
        </p>
        <p className="field-counter" id="description-counter">
          {form.description.length}/2000
        </p>
        <FieldError id="description-error" message={errorText('description')} />
      </div>

      <fieldset className="language-field">
        <legend>{submitText.preferredLanguage[language]}</legend>
        <div className="language-switcher">
          <button
            aria-pressed={form.preferredLanguage === 'te'}
            aria-describedby={
              errorText('preferredLanguage') ? 'preferredLanguage-error' : undefined
            }
            className="language-choice"
            onClick={() => updateField('preferredLanguage', 'te')}
            ref={(element) => {
              fieldRefs.current.preferredLanguage = element;
            }}
            type="button"
          >
            Telugu
          </button>
          <button
            aria-pressed={form.preferredLanguage === 'en'}
            className="language-choice"
            onClick={() => updateField('preferredLanguage', 'en')}
            type="button"
          >
            English
          </button>
        </div>
        <FieldError id="preferredLanguage-error" message={errorText('preferredLanguage')} />
      </fieldset>

      <label className="consent-row">
        <input
          aria-describedby={errorText('consent') ? 'consent-error' : undefined}
          aria-invalid={Boolean(errorText('consent'))}
          checked={form.consent}
          onChange={(event) => updateField('consent', event.target.checked)}
          ref={(element) => {
            fieldRefs.current.consent = element;
          }}
          type="checkbox"
        />
        <span>{submitText.consent[language]}</span>
      </label>
      <FieldError id="consent-error" message={errorText('consent')} />

      {statusMessage ? (
        <p className="success-message" role="status">
          {statusMessage}
        </p>
      ) : null}

      <div className="sticky-submit">
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? submitText.loading[language] : submitText.continue[language]}
        </button>
      </div>
    </form>
  );
}

function createIdempotencyKey() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p className="field-error" id={id}>
      {message}
    </p>
  ) : null;
}
