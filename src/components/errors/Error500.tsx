import { Settings } from "lucide-react";
import ErrorBase from "./ErrorBase";
import { useLang } from "@/lib/i18n";

const Error500 = () => {
  const { tr } = useLang();
  
  return (
    <ErrorBase
      code="500"
      title={tr.errors?.serverError?.title || "Server Error"}
      subtitle={tr.errors?.serverError?.subtitle || "Something went wrong on our end. Our team has been notified and we're working to fix it!"}
      icon={<Settings className="w-16 h-16 text-primary animate-spin-slow" strokeWidth={1.5} />}
      themeColor="hsl(var(--primary) / 0.1)"
      accentColor="hsl(var(--primary))"
      showRetry
    />
  );
};

export default Error500;