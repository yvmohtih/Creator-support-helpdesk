'use client';

import { maskEmail, maskMobileNumber, screenshotUploadLimits } from '@creator-support/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
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

interface SelectedScreenshot {
  file: File;
  id: string;
  previewUrl: string;
}

export function PreviewClient({ categorySlug, language, platformSlug }: PreviewClientProps) {
  const router = useRouter();
  const [details, setDetails] = useState<StoredProblemDetails>();
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshots, setScreenshots] = useState<SelectedScreenshot[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const screenshotsRef = useRef<SelectedScreenshot[]>([]);

  useEffect(() => {
    setDetails(readStoredDetails(problemDetailsPreviewKey));
  }, []);

  useEffect(() => {
    return () => {
      screenshotsRef.current.forEach((screenshot) => URL.revokeObjectURL(screenshot.previewUrl));
    };
  }, []);

  useEffect(() => {
    screenshotsRef.current = screenshots;
  }, [screenshots]);

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
      const result = await submitSupportRequest(
        {
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
        },
        screenshots.map((screenshot) => screenshot.file),
      );

      writeStoredConfirmation({
        ...result,
        language,
      });
      screenshots.forEach((screenshot) => URL.revokeObjectURL(screenshot.previewUrl));
      setScreenshots([]);
      removeStoredDetails(problemDetailsDraftKey);
      removeStoredDetails(problemDetailsPreviewKey);
      router.push(`/request-submitted?lang=${language}`);
    } catch {
      setSubmitError(submitText.submitError[language]);
      setIsSubmitting(false);
    }
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    addScreenshots(Array.from(event.target.files ?? []));
    event.target.value = '';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    addScreenshots(Array.from(event.dataTransfer.files ?? []));
  }

  function addScreenshots(files: File[]) {
    setUploadError('');
    setUploadStatus(submitText.processingScreenshots[language]);

    const nextScreenshots = [...screenshots];

    for (const file of files) {
      const validationError = validateScreenshot(file, nextScreenshots);

      if (validationError) {
        setUploadError(validationError);
        setUploadStatus('');
        return;
      }

      nextScreenshots.push({
        file,
        id: `${file.name}-${file.size}-${file.lastModified}`,
        previewUrl: URL.createObjectURL(file),
      });
    }

    setScreenshots(nextScreenshots);
    setUploadStatus(files.length > 0 ? submitText.screenshotAdded[language] : '');
  }

  function removeScreenshot(id: string) {
    setScreenshots((currentScreenshots) => {
      const removed = currentScreenshots.find((screenshot) => screenshot.id === id);

      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }

      return currentScreenshots.filter((screenshot) => screenshot.id !== id);
    });
    setUploadError('');
    setUploadStatus(submitText.screenshotRemoved[language]);
  }

  function validateScreenshot(file: File, currentScreenshots: SelectedScreenshot[]) {
    if (currentScreenshots.length >= screenshotUploadLimits.maxFiles) {
      return submitText.screenshotTooMany[language];
    }

    if (
      currentScreenshots.some(
        (screenshot) => screenshot.id === `${file.name}-${file.size}-${file.lastModified}`,
      )
    ) {
      return submitText.screenshotDuplicate[language];
    }

    if (!screenshotUploadLimits.allowedMimeTypes.includes(file.type)) {
      return submitText.screenshotUnsupported[language];
    }

    if (file.size > screenshotUploadLimits.maxFileSizeBytes) {
      return submitText.screenshotTooLarge[language];
    }

    const combinedSize =
      currentScreenshots.reduce((total, screenshot) => total + screenshot.file.size, 0) + file.size;

    if (combinedSize > screenshotUploadLimits.maxCombinedSizeBytes) {
      return submitText.screenshotCombinedTooLarge[language];
    }

    return '';
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

          <section className="upload-panel" aria-labelledby="screenshot-upload-title">
            <div>
              <h2 id="screenshot-upload-title">{submitText.uploadTitle[language]}</h2>
              <p className="muted">{submitText.uploadHelp[language]}</p>
              <p className="field-help">{submitText.uploadPrivacy[language]}</p>
              <p className="field-help">{submitText.uploadGuidance[language]}</p>
            </div>

            <div
              className="upload-drop-zone"
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                accept="image/jpeg,image/png,image/webp"
                aria-describedby="screenshot-upload-help screenshot-upload-error screenshot-upload-status"
                className="visually-hidden"
                id="screenshots"
                multiple
                onChange={handleFileInput}
                ref={fileInputRef}
                type="file"
              />
              <button onClick={() => fileInputRef.current?.click()} type="button">
                {submitText.selectPhotos[language]}
              </button>
              <span>{submitText.dropScreenshots[language]}</span>
            </div>

            <p className="field-help" id="screenshot-upload-help">
              {screenshots.length}/{screenshotUploadLimits.maxFiles}
            </p>

            {uploadError ? (
              <p className="field-error" id="screenshot-upload-error" role="alert">
                {uploadError}
              </p>
            ) : null}

            {uploadStatus ? (
              <p className="success-message" id="screenshot-upload-status" role="status">
                {uploadStatus}
              </p>
            ) : null}

            {screenshots.length > 0 ? (
              <div className="screenshot-list" aria-label={submitText.selectedFiles[language]}>
                {screenshots.map((screenshot) => (
                  <div className="screenshot-item" key={screenshot.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- Blob previews are local client files and should not go through Next image optimization. */}
                    <img
                      alt={screenshot.file.name}
                      onError={(event) => {
                        event.currentTarget.alt = submitText.screenshotBroken[language];
                      }}
                      src={screenshot.previewUrl}
                    />
                    <div>
                      <strong>{screenshot.file.name}</strong>
                      <span>{formatFileSize(screenshot.file.size)}</span>
                    </div>
                    <button
                      className="secondary-action"
                      onClick={() => removeScreenshot(screenshot.id)}
                      type="button"
                    >
                      {submitText.removeScreenshot[language]}
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

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

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
