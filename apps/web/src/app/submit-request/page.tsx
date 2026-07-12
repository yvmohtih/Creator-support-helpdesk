import Link from 'next/link';
import { commonText, getCategory, getLanguage, getPlatform } from '../public-help-content';
import { ProblemDetailsForm } from './problem-details-form';

interface SubmitRequestPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SubmitRequestPage({ searchParams }: SubmitRequestPageProps) {
  const params = await searchParams;
  const platformSlug = readQueryValue(params.platform);
  const categorySlug = readQueryValue(params.category);
  const language = getLanguage(readQueryValue(params.lang));
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

  if (!category) {
    const paramsBack = new URLSearchParams({ platform: platform.slug, lang: language });

    return (
      <main className="public-home">
        <section className="help-shell" aria-labelledby="missing-category-title">
          <h1 id="missing-category-title">{commonText.categoryMissingTitle[language]}</h1>
          <p className="muted">{commonText.categoryMissingMessage[language]}</p>
          <Link className="button-link" href={`/get-help?${paramsBack.toString()}`}>
            {commonText.back[language]}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="public-home">
      <section className="help-shell" aria-labelledby="submit-request-title">
        <Link className="text-link" href={`/get-help?platform=${platform.slug}&lang=${language}`}>
          {commonText.back[language]}
        </Link>

        <ProblemDetailsForm category={category} initialLanguage={language} platform={platform} />
      </section>
    </main>
  );
}

function readQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
