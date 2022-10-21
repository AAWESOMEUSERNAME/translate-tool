declare namespace DTO {
  type RepositoryInfo = Omit<Model.Repository, 'articles'> & {articles?: ArticleInfo[]}
  type ArticleInfo = Omit<Model.Article, 'paragraphes'>
}
