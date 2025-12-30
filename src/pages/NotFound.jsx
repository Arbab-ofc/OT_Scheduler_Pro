import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="max-w-3xl mx-auto text-center px-4 lg:px-6 py-16">
    <h1 className="text-5xl font-bold mb-4">404</h1>
    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">The page you are looking for could not be found.</p>
    <Link to="/" className="px-5 py-3 rounded-lg bg-primary text-white font-semibold">Go home</Link>
  </div>
);

export default NotFound;
