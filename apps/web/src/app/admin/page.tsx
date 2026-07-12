'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL, AdminUser, fetchCurrentAdmin } from '../../lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchCurrentAdmin()
      .then((currentAdmin) => {
        if (isMounted) {
          setAdmin(currentAdmin);
        }
      })
      .catch((error: Error) => {
        router.replace(error.message === 'FORBIDDEN' ? '/admin/unauthorized' : '/admin/login');
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function logout() {
    await fetch(`${API_BASE_URL}/admin/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    router.replace('/admin/login');
  }

  if (isLoading) {
    return (
      <main className="auth-page">
        <section className="auth-panel">
          <p className="eyebrow">Checking Access</p>
          <h1>Loading...</h1>
          <p className="muted">Please wait while we verify your admin session.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="admin-placeholder-title">
        <p className="eyebrow">Admin Area</p>
        <h1 id="admin-placeholder-title">Access Verified</h1>
        <p className="muted">
          Signed in as {admin?.fullName} ({admin?.role}).
        </p>
        <p className="muted">The admin dashboard will be implemented in a later unit.</p>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </section>
    </main>
  );
}
