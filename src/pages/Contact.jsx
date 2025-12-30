import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Contact = () => (
  <div className="max-w-4xl mx-auto px-4 lg:px-6 py-12 space-y-8">
    <div className="space-y-3">
      <p className="badge">Contact us</p>
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">We’re here to help</h1>
      <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-3xl">
        Whether you’re rolling out OT Scheduler across your hospital or need quick support, reach out and we’ll respond promptly.
      </p>
    </div>

    <div className="surface-panel rounded-3xl p-6 grid md:grid-cols-3 gap-4">
      <div className="rounded-2xl bg-white/70 dark:bg-surface-dark/70 border border-border-light/60 dark:border-border-dark/60 p-4">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <FiMail /> Email
        </div>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">arbabprvt@gmail.com</p>
      </div>
      <div className="rounded-2xl bg-white/70 dark:bg-surface-dark/70 border border-border-light/60 dark:border-border-dark/60 p-4">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <FiPhone /> Phone
        </div>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">+1 (800) 555-2345</p>
      </div>
      <div className="rounded-2xl bg-white/70 dark:bg-surface-dark/70 border border-border-light/60 dark:border-border-dark/60 p-4">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <FiMapPin /> HQ
        </div>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Remote-first, global team</p>
      </div>
    </div>

    <div className="surface-panel rounded-3xl p-6 space-y-4">
      <h2 className="text-xl font-semibold">Send us a note</h2>
      <form className="grid gap-4 md:grid-cols-2">
        <input className="input col-span-1" placeholder="Your name" />
        <input className="input col-span-1" type="email" placeholder="Your email" />
        <input className="input md:col-span-2" placeholder="Subject" />
        <textarea className="input md:col-span-2 h-32 resize-none" placeholder="How can we help?" />
        <button
          type="button"
          className="md:col-span-2 h-12 rounded-lg bg-primary text-white font-semibold hover:shadow-md transition"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
);

export default Contact;
