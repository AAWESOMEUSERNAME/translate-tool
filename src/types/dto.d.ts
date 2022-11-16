declare namespace DTO {
  type RepositoryInfo = Omit<Model.Repository, 'articles'> & {articles?: ArticleInfo[]}
  type ArticleInfo = Omit<Model.Article, 'paragraphes'>
  type ArticleExportType = 'database' | 'translated' | 'raw' | 'raw_translated'
}
