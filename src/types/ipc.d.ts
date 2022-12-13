declare namespace IPC {
  interface Msg<Request, Response> {
    req: Request
    res: Response
  }

  interface MsgRouteMap {
    '/repo/list': Msg<void, DTO.RepositoryInfo[]>
    '/repo/save': Msg<RequestParams.RepositorySave, void>
    '/repo/remove': Msg<number, void>
    '/article/list': Msg<number, DTO.ArticleInfo[]>
    '/article/remove': Msg<number, void>
    '/article/export': Msg<RequestParams.ArticleExport, void>
    '/article/save': Msg<RequestParams.ArticleSave, void>
    '/article/detail': Msg<number, Model.Article>
    '/paragraph/save': Msg<RequestParams.ParagraphSave, number>
    '/paragraph/delete': Msg<number, void>
    '/paragraph/reorder': Msg<RequestParams.ParagraphReOrder, void>
    '/translation/tag/save': Msg<RequestParams.TagSave, void>
    '/translation/tag/list': Msg<number, string[]>
    '/translation/save': Msg<RequestParams.TranslationSave, void>
    '/common/upload/cover': Msg<string, void>
  }

  type Channels = keyof MsgRouteMap
}
