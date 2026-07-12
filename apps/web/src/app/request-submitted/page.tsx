import { getLanguage } from '../public-help-content';
import { RequestSubmittedClient } from './request-submitted-client';

interface RequestSubmittedPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RequestSubmittedPage({ searchParams }: RequestSubmittedPageProps) {
  const params = await searchParams;

  return <RequestSubmittedClient language={getLanguage(readQueryValue(params.lang))} />;
}

function readQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
