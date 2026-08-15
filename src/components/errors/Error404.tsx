import { Search } from "lucide-react";
import ErrorBase from "./ErrorBase";
import { useLang } from "@/lib/i18n";

const Error404 = () => {
  const { tr } = useLang();
  
  return (
    <ErrorBase
      code="404"
      title={tr.errors?.notFound?.title || "Page Not Found"}
      subtitle={tr.errors?.notFound?.subtitle || "The page you're looking for has vanished into the digital void. It may have been moved or deleted."}
      icon={<Search className="w-16 h-16 text-accent" strokeWidth={1.5} />}
      themeColor="hsl(var(--primary) / 0.1)"
      accentColor="hsl(var(--accent))"
    />
  );
};

export default Error404;