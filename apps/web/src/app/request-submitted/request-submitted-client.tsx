'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { commonText, getPlatform, Language } from '../public-help-content';
import { submitText } from '../submit-request/form-content';
import {
  readStoredConfirmation,
  removeStoredConfirmation,
  StoredRequestConfirmation,
} from '../submit-request/storage';

interface RequestSubmittedClientProps {
  language: Language;
}

export function RequestSubmittedClient({ language }: RequestSubmittedClientProps) {
  const [confirmation, setConfirmation] = useState<StoredRequestConfirmation>();
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    setConfirmation(readStoredConfirmation());
  }, []);

  if (!confirmation) {
    return (
      <main className="public-home">
        <section className="help-shell" aria-labelledby="confirmation-missing-title">
          <div className="placeholder-panel">
            <h1 id="confirmation-missing-title">{submitText.confirmationMissingTitle[language]}</h1>
            <p className="muted">{submitText.confirmationMissingMessage[language]}</p>
            <Link className="button-link" href="/">
              {commonText.goHome[language]}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const platform = getPlatform(confirmation.platform);
  const platformLabel =
    language === 'te' && platform ? platform.teluguName : (platform?.name ?? confirmation.platform);

  async function copyRequestNumber() {
    if (!confirmation) {
      return;
    }

    try {
      await navigator.clipboard.writeText(confirmation.requestNumber);
      setCopyMessage(submitText.copiedRequestNumber[language]);
    } catch {
      setCopyMessage(submitText.copyUnavailable[language]);
    }
  }

  function submitAnother() {
    removeStoredConfirmation();
  }

  return (
    <main className="public-home">
      <section className="help-shell" aria-labelledby="submitted-title">
        <div className="placeholder-panel submitted-panel">
          <p className="section-kicker">{platformLabel}</p>
          <h1 id="submitted-title">{submitText.submittedTitle[language]}</h1>
          <p className="muted">{submitText.submittedMessage[language]}</p>

          <div className="request-number-box">
            <span>{submitText.requestNumber[language]}</span>
            <strong>{confirmation.requestNumber}</strong>
          </div>

          <dl className="preview-list">
            <PreviewItem label={submitText.platform[language]} value={platformLabel} />
            <PreviewItem
              label={submitText.summaryTitle[language]}
              value={confirmation.categoryName}
            />
            <PreviewItem label={submitText.mobile[language]} value={confirmation.maskedMobile} />
            <PreviewItem
              label={submitText.submittedOn[language]}
              value={formatSubmittedDate(confirmation.submittedAt, language)}
            />
            <PreviewItem
              label={submitText.screenshotsSaved[language]}
              value={String(confirmation.attachmentCount ?? 0)}
            />
          </dl>

          {copyMessage ? (
            <p className="success-message" role="status">
              {copyMessage}
            </p>
          ) : null}

          <div className="preview-actions">
            <button onClick={copyRequestNumber} type="button">
              {submitText.copyRequestNumber[language]}
            </button>
            <Link className="button-link secondary-action" href="/track-request">
              {submitText.trackRequest[language]}
            </Link>
            <Link className="button-link secondary-action" href="/">
              {commonText.goHome[language]}
            </Link>
            <Link className="button-link" href="/" onClick={submitAnother}>
              {submitText.submitAnother[language]}
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

function formatSubmittedDate(value: string, language: Language) {
  try {
    return new Intl.DateTimeFormat(language === 'te' ? 'te-IN' : 'en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}
