export type Language = 'pt' | 'en'

export interface Translations {
  [key: string]: string | Translations
}
