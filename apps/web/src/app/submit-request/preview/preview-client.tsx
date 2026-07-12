'use client';

import { maskEmail, maskMobileNumber } from '@creator-support/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { submitSupportRequest } from '../../../lib/api';
import { commonText, getCategory, getPlatform, Language } from '../../public-help-content';
import { submitText } from '../form-content';
import {
  problemDetailsDraftKey,
  problemDetailsPreviewKey,
  readStoredDetails,
  removeStoredDetails,
  StoredProblemDetails,
  writeStoredConfirmation,
} from '../storage';

interface PreviewClientProps {
  categorySlug?: string;
  language: Language;
  platformSlug?: string;
}

export function PreviewClient({ categorySlug, language, platformSlug }: PreviewClientProps) {
  const router = useRouter();
  const [details, setDetails] = useState<StoredProblemDetails>();
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setDetails(readStoredDetails(problemDetailsPreviewKey));
  }, []);

  const platform = getPlatform(platformSlug);

  if (!platform) {
    return (
      <main className="public-home">
        <section className="help-shell" aria-labelledby="invalid-platform-title">
          <h1 id="invalid-platform-title">{commonText.invalidPlatformTitle[language]}</h1>
          <p className="muted">{commonText.invalidPlatformMessage[language]}</p>
          <Link className="button-link" href="/">
            {commonText.goHome[language]}
          </Link>
        </section>
      </main>
    );
  }

  const category = getCategory(platform.slug, categorySlug);

  if (
    !category ||
    !details ||
    details.platform !== platform.slug ||
    details.category !== category.slug
  ) {
    return (
      <main className="public-home">
        <section className="help-shell" aria-labelledby="no-preview-title">
          <h1 id="no-preview-title">{submitText.noPreviewTitle[language]}</h1>
          <p className="muted">{submitText.noPreviewMessage[language]}</p>
          <Link
            className="button-link"
            href={`/submit-request?platform=${platform.slug}&category=${categorySlug ?? ''}&lang=${language}`}
          >
            {submitText.editDetails[language]}
          </Link>
        </section>
      </main>
    );
  }

  const platformLabel = language === 'te' ? platform.teluguName : platform.name;
  const categoryLabel = category.title[language];
  const editParams = new URLSearchParams({
    platform: platform.slug,
    category: category.slug,
    lang: language,
  });

  async function submitRequest() {
    if (isSubmitting) {
      return;
    }

    const currentDetails = details;

    if (!currentDetails) {
      setSubmitError(submitText.noPreviewMessage[language]);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await submitSupportRequest({
        category: currentDetails.category,
        consent: true,
        description: currentDetails.description,
        email: currentDetails.email || undefined,
        idempotencyKey: currentDetails.idempotencyKey,
        mobile: currentDetails.mobile,
        name: currentDetails.name,
        platform: currentDetails.platform,
        platformHandle: currentDetails.platformHandle,
        preferredLanguage: currentDetails.preferredLanguage,
      });

      writeStoredConfirmation({
        ...result,
        language,
      });
      removeStoredDetails(problemDetailsDraftKey);
      removeStoredDetails(problemDetailsPreviewKey);
      router.push(`/request-submitted?lang=${language}`);
    } catch {
      setSubmitError(submitText.submitError[language]);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="public-home">
      <section className="help-shell" aria-labelledby="preview-title">
        <div className="placeholder-panel">
          <p className="section-kicker">
            {platformLabel} → {categoryLabel}
          </p>
          <h1 id="preview-title">{submitText.previewTitle[language]}</h1>
          <p className="muted">{submitText.maskedNotice[language]}</p>

          <dl className="preview-list">
            <PreviewItem label={submitText.name[language]} value={details.name} />
            <PreviewItem
              label={submitText.platformHandle[language]}
              value={details.platformHandle || '-'}
            />
            <PreviewItem
              label={submitText.mobile[language]}
              value={maskMobileNumber(details.mobile)}
            />
            <PreviewItem
              label={submitText.email[language]}
              value={details.email ? maskEmail(details.email) : '-'}
            />
            <PreviewItem label={submitText.description[language]} value={details.description} />
            <PreviewItem
              label={submitText.preferredLanguage[language]}
              value={details.preferredLanguage === 'te' ? 'Telugu' : 'English'}
            />
          </dl>

          <div className="preview-actions">
            <Link
              className="button-link secondary-action"
              href={`/submit-request?${editParams.toString()}`}
            >
              {submitText.editDetails[language]}
            </Link>
            <button disabled={isSubmitting} onClick={submitRequest} type="button">
              {isSubmitting
                ? submitText.submittingRequest[language]
                : submitText.submitRequest[language]}
            </button>
          </div>
          {submitError ? (
            <p className="field-error" role="alert">
              {submitError}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
