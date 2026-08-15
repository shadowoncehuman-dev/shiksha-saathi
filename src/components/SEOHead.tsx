import { Helmet } from "react-helmet-async";

const SITE_URL = "https://shiksha-suvidha-portal.lovable.app";
const OG_IMAGE = "https://shiksha-suvidha-portal.lovable.app/og-image.png";

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  type?: string;
}

const SEOHead = ({
  title = "BBDBASS 2027 — Empowering Education Through Excellence",
  description = "Official 2027 examination portal of Bharat Ratan Baba Sahib Dr. Bhimrao Ambedkar Ji Shiksha Sudhar Samiti. Register for exams, download admit cards, and check results online.",
  path = "/",
  type = "website",
}: SEOHeadProps) => {
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
};

export default SEOHead;
