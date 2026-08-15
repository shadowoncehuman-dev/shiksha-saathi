import { Construction } from "lucide-react";
import ErrorBase from "./ErrorBase";
import { useLang } from "@/lib/i18n";

const Error503 = () => {
  const { tr } = useLang();
  
  return (
    <ErrorBase
      code="503"
      title={tr.errors?.serviceUnavailable?.title || "Under Maintenance"}
      subtitle={tr.errors?.serviceUnavailable?.subtitle || "Our servers are temporarily down for maintenance. Please try again in a few minutes."}
      icon={<Construction className="w-16 h-16 text-accent" strokeWidth={1.5} />}
      themeColor="hsl(var(--accent) / 0.1)"
      accentColor="hsl(var(--accent))"
      showRetry
    />
  );
};

export default Error503;