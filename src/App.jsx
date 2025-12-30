import { Suspense } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import routes from "./routes";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ErrorBoundary from "./components/common/ErrorBoundary";

const App = () => {
  const element = useRoutes(routes);

  return (
    <ErrorBoundary>
      <div className="app-shell min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark">
        <Header />
        <main id="main" className="flex-1">
          <Suspense fallback={<LoadingSpinner fullScreen />}>
            {element || <Navigate to="/" />}
          </Suspense>
        </main>
        <Footer />
      </div>
      <ToastContainer position="top-right" theme="colored" />
    </ErrorBoundary>
  );
};

export default App;
