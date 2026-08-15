import { ShieldAlert } from "lucide-react";
import ErrorBase from "./ErrorBase";
import { useLang } from "@/lib/i18n";

const Error403 = () => {
  const { tr } = useLang();
  
  return (
    <ErrorBase
      code="403"
      title={tr.errors?.forbidden?.title || "Access Denied"}
      subtitle={tr.errors?.forbidden?.subtitle || "You don't have permission to access this page. Please contact the administrator if you think this is a mistake."}
      icon={<ShieldAlert className="w-16 h-16 text-destructive" strokeWidth={1.5} />}
      themeColor="hsl(var(--destructive) / 0.1)"
      accentColor="hsl(var(--destructive))"
    />
  );
};

export default Error403;