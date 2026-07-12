export default function UnauthorizedPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="unauthorized-title">
        <p className="eyebrow">Admin Area</p>
        <h1 id="unauthorized-title">Unauthorized</h1>
        <p className="muted">You do not have permission to access this page.</p>
        <a className="button-link" href="/admin/login">
          Back to Sign In
        </a>
      </section>
    </main>
  );
}
