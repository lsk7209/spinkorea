import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
}

export default function SEO({
    title,
    description,
    keywords = "룰렛, 원판돌리기, 랜덤추첨기, SpinFlow",
    image = "/og-image.png"
}: SEOProps) {
    const location = useLocation();
    const canonicalUrl = `https://spinflow.pages.dev${location.pathname}`;

    useEffect(() => {
        // Title
        document.title = title;

        // Meta Tags
        const setMetaTag = (name: string, content: string, isProperty = false) => {
            let element = document.querySelector(`meta[${isProperty ? 'property' : 'name'}="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(isProperty ? 'property' : 'name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        setMetaTag('description', description);
        setMetaTag('keywords', keywords);

        // Open Graph
        setMetaTag('og:title', title, true);
        setMetaTag('og:description', description, true);
        setMetaTag('og:image', image, true);
        setMetaTag('og:url', canonicalUrl, true);

        // Twitter
        setMetaTag('twitter:title', title, true);
        setMetaTag('twitter:description', description, true);
        setMetaTag('twitter:image', image, true);
        setMetaTag('twitter:url', canonicalUrl, true);

        // Canonical URL
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', canonicalUrl);

    }, [title, description, keywords, image, canonicalUrl]);

    return null;
}
