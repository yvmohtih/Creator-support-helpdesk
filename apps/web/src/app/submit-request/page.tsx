import Link from 'next/link';
import { commonText, getCategory, getLanguage, getPlatform } from '../public-help-content';

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
  const platformLabel = language === 'te' ? platform.teluguName : platform.name;

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
      <section className="help-shell" aria-labelledby="next-step-title">
        <Link className="text-link" href={`/get-help?platform=${platform.slug}&lang=${language}`}>
          {commonText.back[language]}
        </Link>

        <div className="placeholder-panel">
          <p className="section-kicker">{platformLabel}</p>
          <h1 id="next-step-title">{commonText.nextStepTitle[language]}</h1>
          <p className="selected-summary">
            {category.icon} {category.title[language]}
          </p>
          <p className="muted">{commonText.nextStepMessage[language]}</p>
        </div>
      </section>
    </main>
  );
}

function readQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
