import { useTranslation } from 'react-i18next';

export const useProductTranslation = () => {
  const { t, i18n } = useTranslation();

  const translateProductName = (name: string): string => {
    const translated = t(`products.names.${name}`);
    return translated === `products.names.${name}` ? name : translated;
  };

  const translateProductDescription = (description?: string): string => {
    if (!description) return t('products.descriptions.default');
    // Pour les descriptions personnalisées, on garde le texte original
    // ou on pourrait implémenter une traduction dynamique plus tard
    return description;
  };

  const translateProductCategory = (category: string): string => {
    const translated = t(`products.categories.${category}`);
    return translated === `products.categories.${category}` 
      ? t(`catalog_page.category_list.${category}`) 
      : translated;
  };

  return {
    translateProductName,
    translateProductDescription,
    translateProductCategory
  };
};