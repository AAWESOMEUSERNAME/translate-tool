declare namespace DTO {
  type Response<T> = {
    code: number
    data: T
  }

  type RepositoryInfo = Omit<Model.Repository, 'articles'> & { totalNum: number, uncompleted: number }
  type ArticleInfo = Omit<Model.Article, 'paragraphes'>
  type ArticleExportType = 'database' | 'translated' | 'raw' | 'raw_translated'
}

declare namespace RequestParams {
  type RepositorySave = Partial<DTO.RepositoryInfo>

  type TagSave = {
    articleId: number
    oldTag: string
    newTag: string
  }

  type ArticleExport = {
    id: number
    tag: string
    type: DTO.ArticleExportType
  }

  type ArticleSave = Partial<DTO.ArticleInfo> & {
    repoId?: string
    paragraphes?: string[]
  }

  type ParagraphSave = {
    id?: number
    articleId?: number
    text: string
  }

  type ParagraphReOrder = {
    id:number
    newOrderNo:number
  }[]

  type TranslationSave = {
    articleId: number
    paragraphId: number
    tag: string
    content: string
  }
}

declare namespace Entity {
  type RepositoryRecord = Omit<Model.Repository, 'articles'>
  type ArticleRecord = Omit<Model.Article, 'paragraphes' | 'translationTags'> & { repositoryId: number }
  type ParagraphRecord = Omit<Model.Paragraph, 'translation'> & { articleId: number }
  type TranslationRecord = Model.Translation & { paragraphId: number, articleId: number }
}
