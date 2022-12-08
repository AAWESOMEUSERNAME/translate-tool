/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { app, dialog } from 'electron';
import fs from 'fs'

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

export const uploadAssetFromLocal = (path: string, target: string) => {
  return new Promise((res, rej) => {
    fs.cp(path, target, (err) => {
      if (err) {
        rej(err)
      } else {
        res(undefined)
      }
    })
  })
}

export const saveTxtFile = async (content: string, name: string) => {
  return dialog.showSaveDialog({
    title: '保存',
    defaultPath: path.join(__dirname, name + '.txt'),
    buttonLabel: 'Save',
    // Restricting the user to only Text Files.
    filters: [
      {
        name: 'Text Files',
        extensions: ['txt']
      }
    ],
    properties: []
  }).then(file => {
    if (!file.canceled && file?.filePath) {
      // Creating and Writing to the sample.txt file
      fs.writeFile(file.filePath.toString(),
        content, function (err) {
          if (err) throw err;
        });
    }
  })
}
