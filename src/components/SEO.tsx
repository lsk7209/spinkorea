import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    structuredData?: Record<string, any>;
}

export default function SEO({
    title,
    description,
    keywords = "룰렛, 원판돌리기, 랜덤추첨기, SpinFlow",
    image = "/og-image.png",
    structuredData
}: SEOProps) {
    const location = useLocation();
    const canonicalUrl = `https://spinflow.vercel.app${location.pathname}`;

    useEffect(() => {
        // Title
        document.title = title;

        // Helper to set meta tags
        const setMetaTag = (selector: string, content: string, attrName: string = 'name') => {
            let element = document.querySelector(`meta[${selector}]`);
            if (!element) {
                element = document.createElement('meta');
                // Handle property vs name attributes
                const [key, value] = selector.replace(/"/g, '').split('=');
                element.setAttribute(key || attrName, value || '');
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Standard Meta Tags
        setMetaTag('name="description"', description);
        setMetaTag('name="keywords"', keywords);

        // Open Graph
        setMetaTag('property="og:title"', title);
        setMetaTag('property="og:description"', description);
        setMetaTag('property="og:image"', image);
        setMetaTag('property="og:url"', canonicalUrl);
        setMetaTag('property="og:type"', 'website');

        // Twitter Card
        setMetaTag('name="twitter:card"', 'summary_large_image');
        setMetaTag('name="twitter:title"', title);
        setMetaTag('name="twitter:description"', description);
        setMetaTag('name="twitter:image"', image);
        setMetaTag('name="twitter:url"', canonicalUrl);

        // Canonical Link
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (!linkCanonical) {
            linkCanonical = document.createElement('link');
            linkCanonical.setAttribute('rel', 'canonical');
            document.head.appendChild(linkCanonical);
        }
        linkCanonical.setAttribute('href', canonicalUrl);

        // Structured Data (JSON-LD)
        if (structuredData) {
            let scriptJSONLD = document.querySelector('script[type="application/ld+json"]');
            if (!scriptJSONLD) {
                scriptJSONLD = document.createElement('script');
                scriptJSONLD.setAttribute('type', 'application/ld+json');
                document.head.appendChild(scriptJSONLD);
            }
            scriptJSONLD.textContent = JSON.stringify(structuredData);
        }

    }, [title, description, keywords, image, canonicalUrl, structuredData]);

    return null;
}
