import { useEffect, useState } from 'react';
import { iniciarI18n } from '../i18n/config';
import i18n from 'i18next';
import { IdiomaContexto } from '../contextos/idioma';

iniciarI18n();

export function IdiomaProveedor({ children }: { children: React.ReactNode }) {
  const [idioma, setIdioma] = useState(i18n.language || 'es');

  useEffect(() => {
    const onChange = (lng: string) => setIdioma(lng);
    i18n.on('languageChanged', onChange);
    return () => {
      i18n.off('languageChanged', onChange);
    };
  }, []);

  const cambiar = (lng: string) => {
    i18n.changeLanguage(lng);
    setIdioma(lng);
    try {
      localStorage.setItem('i18nextLng', lng);
    } catch (e) {
      void e;
    }
  };

  return <IdiomaContexto.Provider value={{ idioma, cambiar }}>{children}</IdiomaContexto.Provider>;
}
