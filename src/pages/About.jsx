import { motion } from "framer-motion";

const About = () => (
  <div className="max-w-5xl mx-auto px-4 lg:px-6 py-12 space-y-10">
    <div className="space-y-3">
      <p className="badge">About Hospital OT Scheduler</p>
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Building calm, predictable operating days</h1>
      <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-3xl">
        We design tools that keep surgical teams aligned—reducing clashes, accelerating decisions, and protecting patient safety.
        Our platform is crafted with clinicians, coordinators, and hospital leaders to ensure every theatre runs on time.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-5">
      {[
        { title: "Clinical-first", copy: "Co-created with surgeons and nurses to mirror real OT workflows." },
        { title: "Reliable", copy: "Resilient infrastructure with clear audit trails and role-based access." },
        { title: "Outcome-driven", copy: "Fewer delays, higher utilization, and better patient readiness." }
      ].map(card => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="surface-panel rounded-2xl p-5 space-y-2"
        >
          <h3 className="text-lg font-semibold">{card.title}</h3>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{card.copy}</p>
        </motion.div>
      ))}
    </div>

    <div className="surface-panel rounded-3xl p-6 grid md:grid-cols-2 gap-6 items-center">
      <div className="space-y-3">
        <p className="badge">Our mission</p>
        <h2 className="text-2xl font-semibold">Give surgical teams back their focus</h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          We believe technology should calm the chaos. By unifying scheduling, readiness checks, and communication, we help hospitals
          move faster without sacrificing safety or empathy.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-4 rounded-2xl highlight">
          <p className="text-xs uppercase text-primary font-semibold">Hospitals served</p>
          <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">25+</p>
        </div>
        <div className="p-4 rounded-2xl highlight">
          <p className="text-xs uppercase text-primary font-semibold">Avg. delay reduction</p>
          <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">-32%</p>
        </div>
        <div className="p-4 rounded-2xl highlight">
          <p className="text-xs uppercase text-primary font-semibold">User satisfaction</p>
          <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">4.8/5</p>
        </div>
        <div className="p-4 rounded-2xl highlight">
          <p className="text-xs uppercase text-primary font-semibold">Support</p>
          <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">24/7</p>
        </div>
      </div>
    </div>
  </div>
);

export default About;
