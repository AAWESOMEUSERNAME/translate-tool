import moment from 'moment'
import { dateToStr } from './convert'

const nowStr = dateToStr(moment())
const _dao = {
  assets: {
  },
  repo: {
    list: async (): Promise<DTO.RepositoryInfo[]> => {
      const repos: DTO.RepositoryInfo[] = Array.from({ length: 3 }, (_, i) => {
        return {
          id: i,
          name: 'mockRepo' + i + (i === 0 ? '长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长' : ''),
          createdTime: nowStr,
          updatedTime: nowStr,
          description: '描述长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长',
          articles: Array.from({ length: 5 }, (_, j) => {
            return {
              id: j,
              name: 'mockArticle' + i + j,
              description: '原始链接：www.baidu.com',
              translationTags: ['默认', 'cyy'],
              createdTime: nowStr,
              updatedTime: nowStr,
              progress: 40,
              status: j === 0 ? 'translating' : 'confirmed'
            }
          })
        }
      })
      return repos
    },
    save: async (repo: Partial<DTO.RepositoryInfo>) => {
      console.log('save repo', repo)
    },
    remove: async (id: number) => {
      console.log('remove repo', id);
    }
  },
  article: {
    remove: async (id: number) => {
      console.log('remove article', id);
    },
    export: async (id: number, type: DTO.ArticleExportType) => {
      console.log('export', id, type);
    },
    save: async (article: Partial<DTO.ArticleInfo>) => {
      console.log('save article', article)
    },
    addTranslateTag: async (articleId: number) => {
      console.log('add tag', articleId);
    },
    renameTranslateTag: async (origin: string, newTag: string) => {
      console.log('rename tag', origin, newTag);
    },
    removeTranslateTag: async (articleId: number, tag: string) => {
      console.log('remove tag', articleId, tag);
    },
    detail: async (articleId: number): Promise<Model.Article> => {
      return {
        id: articleId,
        name: 'mockArticle' + articleId,
        createdTime: nowStr,
        updatedTime: nowStr,
        translationTags: ['默认', 'cyy'],
        description: '原始链接：www.baidu.com',
        progress: 40,
        status: articleId === 0 ? 'translating' : 'confirmed',
        paragraphes: Array.from({ length: 10 }, (_, i) => {
          return {
            id: i,
            content: Array.from({ length: 20 }, (_, j) => 'text' + i).join(' '),
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
  paragraph: {
    saveTranslation: async (id: number, text: string) => {
      console.log('save', id, text);
    }
  }
}

export default _dao
