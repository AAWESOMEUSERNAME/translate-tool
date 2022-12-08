import { RESPONSE_CODE } from "../../common/constants"
import { IpcMain, IpcMainEvent } from "electron"
import { articleDao, assetDao, paragraphDao, repositoryDao, translationDao } from "../dao"

type MsgHandler<Req, Res> = (arg: Req) => Promise<Res>

const routeMap: { [T in keyof IPC.MsgRouteMap]: MsgHandler<IPC.MsgRouteMap[T]['req'], IPC.MsgRouteMap[T]['res']> } = {
  '/repo/list': async () => repositoryDao.list(),
  '/repo/save': async (info) => repositoryDao.save(info),
  '/repo/remove': async (id) => repositoryDao.remove(id),
  '/article/list': async (repoId) => articleDao.list(repoId).map(a => ({ ...a, coverPath: assetDao.getCoverPath(a.coverPath) })),
  '/article/remove': async (id) => articleDao.remove(id),
  '/article/export': async (params) => articleDao.export(params),
  '/article/save': async (info) => {
    if (info.coverPath) {
      const newName = await assetDao.saveCover(info.coverPath)
      articleDao.save({ ...info, coverPath: newName })
    } else {
      articleDao.save(info)
    }
  },
  '/article/detail': async (id) => articleDao.detail(id),
  '/paragraph/save': async (params) => paragraphDao.save(params),
  '/paragraph/reorder': async (params) => paragraphDao.reOrder(params),
  '/translation/tag/save': async (params) => translationDao.saveTag(params),
  '/translation/tag/list': async (params) => translationDao.listTag(params),
  '/translation/save': async (params) => translationDao.save(params),
  '/common/upload/cover': async (params) => { await assetDao.saveCover(params) }
}

const registerListener = (ipcMain: IpcMain) => {
  Object.entries(routeMap).forEach(([path, handler]) => {
    console.log('register', path, handler);

    ipcMain.on(path, (ev, args) => {
      console.log('receive', path, args);

      const reqId = args[0]
      const reqArg = args[1]
      // @ts-ignore
      handler(reqArg).then((res: any) => {
        console.log('reply', path, res);
        ev.reply(reqId, {
          code: RESPONSE_CODE.SUCCESS,
          data: res
        })
      }).catch(e => {
        console.error(e)
        ev.reply(reqId, { code: RESPONSE_CODE.ERROR })
      })
    })
  })
}


export default registerListener


