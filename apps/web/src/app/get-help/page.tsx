import Link from 'next/link';
import { CategorySelector } from './category-selector';
import {
  commonText,
  getLanguage,
  getPlatform,
  languages,
  problemCategories,
} from '../public-help-content';

interface GetHelpPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function GetHelpPage({ searchParams }: GetHelpPageProps) {
  const params = await searchParams;
  const platformSlug = readQueryValue(params.platform);
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

  const categories = problemCategories[platform.slug];
  const platformLabel = language === 'te' ? platform.teluguName : platform.name;
  const languageLinks = languages.map((item) => {
    const nextParams = new URLSearchParams({ platform: platform.slug, lang: item.code });
    return {
      ...item,
      href: `/get-help?${nextParams.toString()}`,
    };
  });

  return (
    <main className="public-home">
      <section className="help-shell" aria-labelledby="problem-title">
        <header className="help-header">
          <Link className="text-link" href="/">
            {commonText.back[language]}
          </Link>
          <strong>{platformLabel}</strong>
          <Link className="text-link" href="/track-request">
            {commonText.trackRequest[language]}
          </Link>
        </header>

        <nav className="language-switcher" aria-label="Language">
          {languageLinks.map((item) => (
            <Link
              aria-current={language === item.code ? 'page' : undefined}
              className="language-option"
              href={item.href}
              key={item.code}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="help-question">
          <p className="section-kicker">
            {language === 'te' ? `${platformLabel} సమస్య` : `${platformLabel} problem`}
          </p>
          <h1 id="problem-title">{commonText.chooseProblem[language]}</h1>
          <p>{commonText.instruction[language]}</p>
        </div>

        <CategorySelector categories={categories} language={language} platform={platform.slug} />
      </section>
    </main>
  );
}

function readQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
