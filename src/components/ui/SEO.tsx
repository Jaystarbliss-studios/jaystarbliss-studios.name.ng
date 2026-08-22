import React, { useEffect } from 'react';
import { useMetaTags } from '../../contexts/MetaTagsContext';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'profile';
  structuredData?: object;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords,
  image,
  canonical,
  type = 'website',
  structuredData,
  noindex = false
}) => {
  const { setMeta } = useMetaTags();

  useEffect(() => {
    setMeta({
      title,
      description,
      keywords,
      image,
      canonical,
      type,
      structuredData,
      noindex
    });
  }, [title, description, keywords, image, canonical, type, structuredData, noindex, setMeta]);

  return null;
};

export default SEO;

