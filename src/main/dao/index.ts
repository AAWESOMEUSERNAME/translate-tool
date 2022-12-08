import { getAssetPath, uploadAssetFromLocal } from "../util"
import { RepositoryDao, ArticleDao, ParagraphDao, TranslationDao } from "./sqlite"

export interface IRepositoryDao {
  list: () => DTO.RepositoryInfo[]
  save: (info: RequestParams.RepositorySave) => void
  remove: (id: number) => void
}
export interface IArticleDao {
  list: (repoId: number) => DTO.ArticleInfo[]
  remove: (id: number) => void
  export: (params: RequestParams.ArticleExport) => void
  save: (info: RequestParams.ArticleSave) => void
  detail: (id: number) => Model.Article
}
export interface IParagraphDao {
  reOrder: (params: RequestParams.ParagraphReOrder) => void
  save: (params: RequestParams.ParagraphSave) => void
}
export interface ITranslationDao {
  saveTag: (params: RequestParams.TagSave) => void
  save: (params: Pick<Entity.TranslationRecord, 'articleId' | 'paragraphId' | 'tag' | 'content'>) => void
  listTag: (articleId: number) => string[]
}

export const repositoryDao: IRepositoryDao = new RepositoryDao()
export const articleDao: IArticleDao = new ArticleDao()
export const paragraphDao: IParagraphDao = new ParagraphDao()
export const translationDao: ITranslationDao = new TranslationDao()


enum AssetDir {
  cover = 'cover',
  other = 'other'
}
class AssetDao {
  static defaultCoverName = 'article_card_default.jpg'
  getCoverPath(name?: string) {
    return getAssetPath(AssetDir.cover, name || AssetDao.defaultCoverName)
  }
  async saveCover(originPath: string) {
    const newFileName = Math.floor(Math.random() * (10 ** 10)).toString(16) + originPath.slice(originPath.lastIndexOf('.'))
    await uploadAssetFromLocal(originPath, getAssetPath(AssetDir.cover, newFileName))
    return newFileName
  }
}
export const assetDao = new AssetDao()
