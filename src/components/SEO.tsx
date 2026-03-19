import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEO = ({ 
  title, 
  description, 
  image = 'https://picsum.photos/seed/aftras/1200/630', 
  url = window.location.href, 
  type = 'website' 
}: SEOProps) => {
  const { t } = useTranslation();
  
  const siteTitle = 'AFTRAS CI - Africa Trading Solutions';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || t('footer.company_desc');

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
