import moment from 'moment'
import { dateToStr } from './convert'

const nowStr = dateToStr(moment())
const _dao = {
  repo: {
    list: async (): Promise<DTO.RepositoryInfo[]> => {
      const repos: DTO.RepositoryInfo[] = Array.from({ length: 3 }, (_, i) => {
        return {
          id: i,
          name: 'mockRepo' + i + (i === 0 ? '长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长' : ''),
          createdTime: nowStr,
          updatedTime: nowStr,
          articles: Array.from({ length: 5 }, (_, j) => {
            return {
              id: j,
              name: 'mockArticle' + i + j,
              createdTime: nowStr,
              updatedTime: nowStr,
              language: 'en',
              status: j === 0 ? 'translating' : 'confirmed'
            }
          })
        }
      })
      return repos
    }
  },
  article: {
    detail: async (articleId: number): Promise<Model.Article> => {
      return {
        id: articleId,
        name: 'mockArticle' + articleId,
        createdTime: nowStr,
        updatedTime: nowStr,
        language: 'en',
        status: articleId === 0 ? 'translating' : 'confirmed',
        paragraphes: Array.from({ length: 10 }, (_, i) => {
          return {
            id: i,
            content: 'texttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt' + i,
            createdTime: nowStr,
            updatedTime: nowStr,
            translation: [
              {
                id: 1,
                tag: '默认翻译',
                content: '1',
                createdTime: nowStr,
                updatedTime: nowStr,
              },
              {
                id: 2,
                tag: '其他人',
                content: '2',
                createdTime: nowStr,
                updatedTime: nowStr,
              },
            ]
          }
        })
      }
    }
  },
}

export default _dao
