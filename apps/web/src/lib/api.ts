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
  categoryName: string;
  maskedMobile: string;
  platform: string;
  requestNumber: string;
  submittedAt: string;
}

export async function submitSupportRequest(payload: SubmitSupportRequestPayload) {
  const response = await fetch(`${API_BASE_URL}/public/support-requests`, {
    body: JSON.stringify(payload),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('SUBMIT_FAILED');
  }

  const body = (await response.json()) as { data: SubmitSupportRequestResult };

  return body.data;
}
