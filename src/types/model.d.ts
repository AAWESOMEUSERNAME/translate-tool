declare namespace Model {
  interface ModelObject {
    id: number
    createdTime: string
    updatedTime: string
  }

  interface Repository extends ModelObject {
    name: string
    description: string
    articles: Article[]
  }

  interface Article extends ModelObject {
    name: string
    paragraphes: Paragraph[]
    description: string
    progress: number
    translationTags: string[]
    coverPath?: string
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
