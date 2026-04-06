import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const Error404 = lazy(() => import("@/components/errors/Error404"));
const Error403 = lazy(() => import("@/components/errors/Error403"));
const Error500 = lazy(() => import("@/components/errors/Error500"));
const Error503 = lazy(() => import("@/components/errors/Error503"));

interface ErrorPageProps {
  code?: number;
}

const Fallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <Loader2 className="animate-spin text-primary" size={32} />
  </div>
);

const ErrorPage = ({ code = 404 }: ErrorPageProps) => {
  return (
    <Suspense fallback={<Fallback />}>
      {code === 403 ? <Error403 /> :
       code === 500 ? <Error500 /> :
       code === 503 ? <Error503 /> :
       <Error404 />}
    </Suspense>
  );
};

export default ErrorPage;
