import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import sitePages from "@/data/site-pages.json";

const SITE_ORIGIN = "https://www.spinkorea.kr";
const SITE_NAME = "SpinFlow";
const JSON_LD_ID = "spinflow-json-ld";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  structuredData?: Record<string, unknown>;
}

export default function SEO({
  title,
  description,
  keywords = "룰렛, 원판돌리기, 랜덤추첨기, SpinFlow",
  image = "/og-image.png",
  structuredData,
}: SEOProps) {
  const location = useLocation();
  const canonicalUrl = `${SITE_ORIGIN}${location.pathname}`;
  const routeMeta = sitePages.find((page) => page.path === location.pathname);
  const pageTitle = title ?? routeMeta?.title ?? "SpinFlow - 무료 온라인 룰렛과 웹 유틸리티";
  const pageDescription =
    description ??
    routeMeta?.description ??
    "SpinFlow는 온라인 룰렛, 랜덤 추첨, 계산기, 변환기 등 다양한 무료 웹 유틸리티를 제공합니다.";
  const imageUrl = image.startsWith("http") ? image : `${SITE_ORIGIN}${image}`;

  useEffect(() => {
    document.title = pageTitle;

    const setMetaTag = (attribute: "name" | "property", value: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${value}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMetaTag("name", "description", pageDescription);
    setMetaTag("name", "keywords", keywords);

    setMetaTag("property", "og:title", pageTitle);
    setMetaTag("property", "og:description", pageDescription);
    setMetaTag("property", "og:image", imageUrl);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:locale", "ko_KR");
    setMetaTag("property", "og:site_name", SITE_NAME);

    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", pageTitle);
    setMetaTag("name", "twitter:description", pageDescription);
    setMetaTag("name", "twitter:image", imageUrl);
    setMetaTag("name", "twitter:url", canonicalUrl);

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", canonicalUrl);

    const staleJsonLd = document.querySelector(
      `script[type="application/ld+json"]:not(#${JSON_LD_ID})`,
    );
    staleJsonLd?.remove();

    let scriptJSONLD = document.getElementById(JSON_LD_ID);
    if (structuredData) {
      if (!scriptJSONLD) {
        scriptJSONLD = document.createElement("script");
        scriptJSONLD.setAttribute("id", JSON_LD_ID);
        scriptJSONLD.setAttribute("type", "application/ld+json");
        document.head.appendChild(scriptJSONLD);
      }
      scriptJSONLD.textContent = JSON.stringify(structuredData);
    } else {
      scriptJSONLD?.remove();
    }
  }, [pageTitle, pageDescription, keywords, imageUrl, canonicalUrl, structuredData]);

  return null;
}
