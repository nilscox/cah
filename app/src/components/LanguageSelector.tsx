import React from 'react';
import { useTranslation } from 'react-i18next';

export const languages = ['fr', 'en'] as const;

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={e => i18n.changeLanguage(e.currentTarget.value)}
      style={{
        position: 'absolute',
        bottom: '69px',
        width: '180px',
        maxWidth: '100%',
        border: 'none',
        background: 'none',
        color: '#789',
        fontWeight: 'bold',
      }}
    >
      {languages.map(language => (
        <option key={language} value={language}>
          {t(`language.${language}`)}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
