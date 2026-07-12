import { PlatformSelector } from './platform-selector';

export default function HomePage() {
  return (
    <main className="public-home">
      <section className="home-shell" aria-labelledby="home-title">
        <div className="home-intro">
          <p className="eyebrow">Creator Support</p>
          <h1 id="home-title">Get help with your social media account</h1>
          <p className="home-subtitle">
            Instagram, Facebook, YouTube problems? Choose your app. We will guide you step by step.
          </p>
          <p className="home-telugu">మీ సమస్యకు సహాయం పొందడానికి యాప్ ఎంచుకోండి.</p>
        </div>

        <section className="platform-section" aria-labelledby="platform-title">
          <div>
            <p className="section-kicker">Step 1</p>
            <h2 id="platform-title">Which app needs help?</h2>
          </div>

          <PlatformSelector />
        </section>

        <section className="home-note" aria-labelledby="next-step-title">
          <h2 id="next-step-title">Next step</h2>
          <p>
            Problem selection and request submission will be added in the next units. No request is
            created from this screen yet.
          </p>
        </section>
      </section>
    </main>
  );
}
