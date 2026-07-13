export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:4000/api/v1';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'support_agent';
}

export async function fetchCurrentAdmin() {
  const response = await fetch(`${API_BASE_URL}/admin/auth/me`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(response.status === 403 ? 'FORBIDDEN' : 'UNAUTHENTICATED');
  }

  const payload = (await response.json()) as { data: { admin: AdminUser } };

  return payload.data.admin;
}

export interface SubmitSupportRequestPayload {
  category: string;
  consent: boolean;
  description: string;
  email?: string;
  idempotencyKey: string;
  mobile: string;
  name: string;
  platform: string;
  platformHandle: string;
  preferredLanguage: 'en' | 'te';
}

export interface SubmitSupportRequestResult {
  attachmentCount: number;
  categoryName: string;
  maskedMobile: string;
  platform: string;
  requestNumber: string;
  submittedAt: string;
}

export async function submitSupportRequest(
  payload: SubmitSupportRequestPayload,
  screenshots: File[] = [],
) {
  const request =
    screenshots.length > 0
      ? {
          body: supportRequestFormData(payload, screenshots),
          credentials: 'include' as const,
          method: 'POST',
        }
      : {
          body: JSON.stringify(payload),
          credentials: 'include' as const,
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        };

  const response = await fetch(`${API_BASE_URL}/public/support-requests`, request);

  if (!response.ok) {
    throw new Error('SUBMIT_FAILED');
  }

  const body = (await response.json()) as { data: SubmitSupportRequestResult };

  return body.data;
}

function supportRequestFormData(payload: SubmitSupportRequestPayload, screenshots: File[]) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined) {
      formData.append(key, String(value));
    }
  }

  for (const screenshot of screenshots) {
    formData.append('screenshots', screenshot, screenshot.name);
  }

  return formData;
}
