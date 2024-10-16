"use client"

import { useCallback } from 'react';
import { Combobox } from "@/components/ui/combobox";
import { locales } from "@/lib/locale";
import useTranslate from '@/hooks/useTranslate';

export function LocaleSelector() {
  const { changeLocale, locale } = useTranslate();

  const handleLocaleChange = useCallback((newLocale: string) => {
    changeLocale(newLocale);
  }, [changeLocale]);

  return (
    <Combobox 
        items={locales}
        buttonLabel="Select language..."
        onValueChange={handleLocaleChange} 
        value={locale || ''}
    />
  );
}
