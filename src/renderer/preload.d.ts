import { IPCRenderer } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: IPCRenderer;
    };
  }
}

export {};
