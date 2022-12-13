import { RESPONSE_CODE } from "../../common/constants";

const requestIPC = <C extends IPC.Channels>(channal: C, reqArg?: IPC.MsgRouteMap[C]['req']): Promise<IPC.MsgRouteMap[C]['res']> => {
  return new Promise((resolve, reject) => {
    try {
      const reqId = channal + (Math.random() * Math.pow(10, 6)).toFixed(0)
      console.log('send request', channal, reqArg);

      window.electron.ipcRenderer.once(reqId, (res) => {
        console.log('on reply', reqId, res);
        const { code, data } = res
        if (code === RESPONSE_CODE.SUCCESS) {
          return resolve(data)
        } else {
          return reject("error response code " + code)
        }
      });
      window.electron.ipcRenderer.sendMessage(channal, [reqId, reqArg]);
    } catch (error) {
      reject(error)
    }
  })
}

const requestIPCFn = <T extends IPC.Channels>(t: T) => (params: IPC.MsgRouteMap[T]['req']) => requestIPC(t, params)

const dao = {
  assets: {
  },
  repo: {
    list: requestIPCFn('/repo/list'),
    save: requestIPCFn('/repo/save'),
    remove: requestIPCFn('/repo/remove')
  },
  article: {
    list: requestIPCFn('/article/list'),
    remove: requestIPCFn('/article/remove'),
    export: requestIPCFn('/article/export'),
    save: requestIPCFn('/article/save'),
    detail: requestIPCFn('/article/detail')
  },
  paragraph: {
    reOrder: requestIPCFn('/paragraph/reorder'),
    save: requestIPCFn('/paragraph/save'),
    delete: requestIPCFn('/paragraph/delete')
  },
  translation: {
    listTag: requestIPCFn('/translation/tag/list'),
    saveTag: requestIPCFn('/translation/tag/save'),
    save: requestIPCFn('/translation/save')
  }
}

export default dao
