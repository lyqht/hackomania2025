const languageMap: Record<string, string> = {
    bg: 'Bulgarian',
    cs: 'Czech',
    da: 'Danish',
    de: 'German',
    el: 'Greek',
    en: 'English',
    es: 'Spanish',
    et: 'Estonian',
    fi: 'Finnish',
    fr: 'French',
    hu: 'Hungarian',
    id: 'Indonesian',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    lt: 'Lithuanian',
    lv: 'Latvian',
    nb: 'Norwegian Bokmål',
    nl: 'Dutch',
    pl: 'Polish',
    "pt-BR": 'Portuguese (Brazil)',
    "pt-PT": 'Portuguese (Portugal)',
    ro: 'Romanian',
    ru: 'Russian',
    sk: 'Slovak',
    sl: 'Slovenian',
    sv: 'Swedish',
    tr: 'Turkish',
    uk: 'Ukrainian',
    zh: 'Chinese (Traditional)',
    "zh-HANS": 'Chinese (Simplified)',
  }
  
export const sortedLocales = Object.keys(languageMap).sort((a, b) => {
  return languageMap[a].localeCompare(languageMap[b])
})

export const locales= sortedLocales.map((locale) => ({
  value: locale,
  label: languageMap[locale],
}))
