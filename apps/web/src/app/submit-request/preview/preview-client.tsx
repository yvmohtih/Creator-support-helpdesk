'use client';

import { maskEmail, maskMobileNumber } from '@creator-support/shared';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { commonText, getCategory, getPlatform, Language } from '../../public-help-content';
import { submitText } from '../form-content';
import { problemDetailsPreviewKey, readStoredDetails, StoredProblemDetails } from '../storage';

interface PreviewClientProps {
  categorySlug?: string;
  language: Language;
  platformSlug?: string;
}

export function PreviewClient({ categorySlug, language, platformSlug }: PreviewClientProps) {
  const [details, setDetails] = useState<StoredProblemDetails>();

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
            <Link
              className="button-link"
              href={`/submit-request/complete?platform=${platform.slug}&category=${category.slug}&lang=${language}`}
            >
              {submitText.continueNext[language]}
            </Link>
          </div>
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
