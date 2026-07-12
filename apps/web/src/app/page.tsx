export default function HomePage() {
  return (
    <main
      style={{
        display: 'grid',
        minHeight: '100vh',
        placeItems: 'center',
        padding: '24px',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '420px',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          background: '#ffffff',
          padding: '24px',
        }}
      >
        <p style={{ margin: '0 0 8px', color: 'var(--primary)', fontWeight: 700 }}>
          Creator Support
        </p>
        <h1 style={{ margin: '0 0 12px', fontSize: '24px', lineHeight: 1.2 }}>
          Project foundation is running.
        </h1>
        <p style={{ margin: 0, color: '#4b5563', fontSize: '16px', lineHeight: 1.5 }}>
          U01 includes only the app shell and infrastructure configuration. Product flows begin in
          later units.
        </p>
      </section>
    </main>
  );
}
