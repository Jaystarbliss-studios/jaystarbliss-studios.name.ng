import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  type?: string;
  structuredData?: object;
  noindex?: boolean;
}

const BRAND_NAME = 'Jaystarbliss Studios';

const formatPageTitle = (pageTitle: string): string => {
  if (!pageTitle) {
    return `${BRAND_NAME} | Learn. Build. Create. Grow.`;
  }
  
  // If already prefixed properly
  if (pageTitle.startsWith(`${BRAND_NAME} |`)) {
    return pageTitle;
  }
  
  // If it's formatted as "Page | Brand", invert it to "Brand | Page"
  if (pageTitle.includes(`| ${BRAND_NAME}`)) {
    const stripped = pageTitle.replace(`| ${BRAND_NAME}`, '').trim();
    return `${BRAND_NAME} | ${stripped}`;
  }
  
  // If title is just the brand name
  if (pageTitle.trim() === BRAND_NAME) {
    return `${BRAND_NAME} | Learn. Build. Create. Grow.`;
  }

  // Format as 'Jaystarbliss Studios | [Page Name]'
  return `${BRAND_NAME} | ${pageTitle.trim()}`;
};

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = 'Jaystarbliss Studios is a technology, creative and educational hub in Lagos, Nigeria offering tech programs for kids and digital solutions for modern businesses.', 
  keywords = 'Jaystarbliss Studios, tech education Lagos, coding for kids Nigeria, web development, software engineering, robotics STEM',
  image = 'https://jaystarbliss-studios.name.ng/favicon.png',
  canonical,
  type = 'website',
  structuredData,
  noindex = false
}) => {
  useEffect(() => {
    const formattedTitle = formatPageTitle(title);
    
    document.title = formattedTitle;

    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }

    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:image', image);
    setMetaTag('name', 'twitter:image', image);

    if (noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    }

    const currentUrl = canonical || window.location.href;
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('name', 'twitter:url', currentUrl);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // Page-Specific Structured Data
    let scriptTag: HTMLScriptElement | null = null;
    if (structuredData) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.id = 'page-structured-data';
      scriptTag.text = JSON.stringify(structuredData);
      document.head.appendChild(scriptTag);
    }

    return () => {
      document.title = `${BRAND_NAME} | Learn. Build. Create. Grow.`;
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [title, description, keywords, image, canonical, type, structuredData, noindex]);

  return null;
};

export default SEO;
