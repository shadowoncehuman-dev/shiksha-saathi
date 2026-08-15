import { Helmet } from "react-helmet-async";
import { ORG_NAME } from "@/lib/constants";

const SITE_URL = "https://shiksha-suvidha-portal.lovable.app";
const OG_IMAGE = "https://shiksha-suvidha-portal.lovable.app/og-image.png";

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  type?: string;
  faq?: { q: string; a: string }[];
  howTo?: { name: string; text: string; image?: string }[];
}

const SEOHead = ({
  title = "BBDBASS 2027 — Empowering Education Through Excellence",
  description = "Official 2027 examination portal of Bharat Ratan Baba Sahib Dr. Bhimrao Ambedkar Ji Shiksha Sudhar Samiti. Register for exams, download admit cards, and check results online.",
  path = "/",
  type = "website",
  faq,
  howTo,
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
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content={ORG_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Nayagaon" />

      {faq && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faq.map(item => ({
              "@type": "Question",
              "name": item.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
              }
            }))
          })}
        </script>
      )}

      {howTo && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": `How to Register for BBDBASS Exam`,
            "step": howTo.map((step, index) => ({
              "@type": "HowToStep",
              "position": index + 1,
              "name": step.name,
              "itemListElement": [{
                "@type": "HowToDirection",
                "text": step.text
              }]
            }))
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;