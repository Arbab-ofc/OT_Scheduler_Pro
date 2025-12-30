const PrivacyPolicy = () => (
  <div className="max-w-4xl mx-auto px-4 lg:px-6 py-12 space-y-6">
    <div className="space-y-2">
      <p className="badge">Privacy</p>
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="text-text-secondary-light dark:text-text-secondary-dark">
        We handle patient and operational data with care. This policy outlines how we collect, use, and protect your information.
      </p>
    </div>

    <div className="surface-panel rounded-3xl p-6 space-y-4 text-sm leading-6 text-text-secondary-light dark:text-text-secondary-dark">
      <section>
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Data we collect</h2>
        <p>Account data (name, email, role), operational records (schedules, documents you upload), and usage metadata.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">How we use data</h2>
        <p>To deliver scheduling features, send notifications, improve reliability, and meet security/audit requirements.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Storage & security</h2>
        <p>Data is encrypted in transit and at rest. Access is role-based, logged, and limited to authorized personnel.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Your choices</h2>
        <p>You can request access, correction, or deletion of your data where permitted. Contact support for requests.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Retention</h2>
        <p>We retain records as required for clinical governance and legal obligations, then securely delete them.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Contact</h2>
        <p>Questions about privacy? Reach us at support@otscheduler.com.</p>
      </section>
    </div>
  </div>
);

export default PrivacyPolicy;
