import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const ipcRendererObj = {
  sendMessage(channel: IPC.Channels, args: unknown[]) {
    ipcRenderer.send(channel, args);
  },
  on<C extends IPC.Channels>(channel: C, func: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      func(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  once<C extends IPC.Channels>(reqId: string, func: (arg: DTO.Response<IPC.MsgRouteMap[C]['res']>) => void) {
    ipcRenderer.once(reqId, (_event, ...args) => {
      func(args[0])
    });
  },
}

export type IPCRenderer = typeof ipcRendererObj

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRendererObj,
});
