import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { strings, type Lang, type StringKey } from './strings'

type LanguageValue = {
  lang: Lang
  toggle: () => void
  t: (key: StringKey) => string
}

const LanguageContext = createContext<LanguageValue | null>(null)
const storageKey = 'wedding-language'

function readStoredLanguage(): Lang {
  try {
    return localStorage.getItem(storageKey) === 'te' ? 'te' : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readStoredLanguage)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(storageKey, lang)
    } catch {
      // The choice simply won't be remembered next visit.
    }
  }, [lang])

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      toggle: () => setLang((current) => (current === 'en' ? 'te' : 'en')),
      t: (key) => strings[lang][key],
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider')
  return value
}
