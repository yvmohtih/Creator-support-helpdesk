import { getLanguage } from '../../public-help-content';
import { PreviewClient } from './preview-client';

interface PreviewPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const params = await searchParams;

  return (
    <PreviewClient
      categorySlug={readQueryValue(params.category)}
      language={getLanguage(readQueryValue(params.lang))}
      platformSlug={readQueryValue(params.platform)}
    />
  );
}

function readQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
