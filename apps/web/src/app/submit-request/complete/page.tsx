import Link from 'next/link';
import { commonText, getCategory, getLanguage, getPlatform } from '../../public-help-content';
import { submitText } from '../form-content';

interface CompletePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CompletePage({ searchParams }: CompletePageProps) {
  const params = await searchParams;
  const language = getLanguage(readQueryValue(params.lang));
  const platform = getPlatform(readQueryValue(params.platform));

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

  const category = getCategory(platform.slug, readQueryValue(params.category));
  const platformLabel = language === 'te' ? platform.teluguName : platform.name;

  return (
    <main className="public-home">
      <section className="help-shell" aria-labelledby="complete-placeholder-title">
        <div className="placeholder-panel">
          <p className="section-kicker">
            {platformLabel}
            {category ? ` → ${category.title[language]}` : ''}
          </p>
          <h1 id="complete-placeholder-title">{submitText.finalPlaceholderTitle[language]}</h1>
          <p className="muted">{submitText.finalPlaceholderMessage[language]}</p>
          <Link className="button-link" href="/">
            {commonText.goHome[language]}
          </Link>
        </div>
      </section>
    </main>
  );
}

function readQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
