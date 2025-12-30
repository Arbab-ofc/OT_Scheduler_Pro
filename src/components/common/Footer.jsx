import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-surface-light dark:bg-surface-dark border-t border-border-light/60 dark:border-border-dark/60 mt-10">
    <div className="max-w-6xl mx-auto grid gap-8 px-4 lg:px-6 py-12 md:grid-cols-3">
      <div>
        <h3 className="font-semibold text-lg">Hospital OT Scheduler Pro</h3>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-3">
          Modern, real-time operation theatre scheduling platform for hospitals and surgical teams.
        </p>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Quick Links</h4>
        <div className="flex flex-col gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Connect</h4>
        <div className="flex gap-4 text-xl">
          <a href="https://www.linkedin.com/in/arbab-ofc/" aria-label="LinkedIn" className="hover:text-primary"><FiLinkedin /></a>
          <a href="https://github.com/Arbab-ofc" aria-label="GitHub" className="hover:text-primary"><FiGithub /></a>
          <a href="mailto:arbabprvt@gmail.com" aria-label="Email" className="hover:text-primary"><FiMail /></a>
        </div>
      </div>
    </div>
    <div className="text-center text-xs text-text-secondary-light dark:text-text-secondary-dark pb-6">
      © {new Date().getFullYear()} Hospital OT Scheduler Pro. All rights reserved.
    </div>
  </footer>
);

export default Footer;
