import Link from 'next/link';
import { commonText, getLanguage } from '../public-help-content';

interface TrackRequestPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const trackText = {
  title: { en: 'Track Request', te: 'రిక్వెస్ట్ చూడండి' },
  message: {
    en: 'Request tracking will be available in the next step. Please keep your request number safe.',
    te: 'రిక్వెస్ట్ చూడడం తర్వాత దశలో అందుబాటులో ఉంటుంది. దయచేసి మీ రిక్వెస్ట్ నంబర్‌ను భద్రంగా ఉంచండి.',
  },
};

export default async function TrackRequestPage({ searchParams }: TrackRequestPageProps) {
  const params = await searchParams;
  const language = getLanguage(readQueryValue(params.lang));

  return (
    <main className="public-home">
      <section className="help-shell" aria-labelledby="track-placeholder-title">
        <div className="placeholder-panel">
          <h1 id="track-placeholder-title">{trackText.title[language]}</h1>
          <p className="muted">{trackText.message[language]}</p>
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
