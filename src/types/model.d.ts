declare namespace Model {
  type Language = 'en' | 'cn'
  interface ModelObject {
    id: number
    createdTime: string
    updatedTime: string
  }

  interface Repository extends ModelObject {
    name: string
    articles: Article[]
  }

  interface Article extends ModelObject {
    name: string
    language: Language
    paragraphes: Paragraph[]
    status: 'translating' | 'confirmed' // 翻译中 | 已定稿
  }

  interface Paragraph extends ModelObject {
    content: string
    finalTranslation?: string
    translation: Translation[]
  }

  interface Translation extends ModelObject {
    tag: string
    content: string
  }
}
