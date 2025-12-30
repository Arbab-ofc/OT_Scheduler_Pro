const Terms = () => (
  <div className="max-w-4xl mx-auto px-4 lg:px-6 py-12 space-y-6">
    <div className="space-y-2">
      <p className="badge">Terms</p>
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="text-text-secondary-light dark:text-text-secondary-dark">
        By using Hospital OT Scheduler, you agree to the responsibilities and acceptable use described here.
      </p>
    </div>

    <div className="surface-panel rounded-3xl p-6 space-y-4 text-sm leading-6 text-text-secondary-light dark:text-text-secondary-dark">
      <section>
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Use of service</h2>
        <p>Provide accurate information, respect role-based access, and use the platform for lawful, clinical operations.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Accounts</h2>
        <p>You’re responsible for safeguarding credentials and ensuring only authorized staff access your account.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Content</h2>
        <p>You retain ownership of data you submit. You grant us permission to process it to deliver the service.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Availability</h2>
        <p>We strive for high uptime but may perform maintenance or experience outages. Critical incidents are communicated promptly.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Liability</h2>
        <p>Service is provided as-is to support clinical workflows. Users must follow hospital policy and clinical governance.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Changes</h2>
        <p>We may update these terms. Continued use after changes means you accept the updated terms.</p>
      </section>
    </div>
  </div>
);

export default Terms;
