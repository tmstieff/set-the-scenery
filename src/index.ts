/// <reference path="/home/taylor/.config/OpenRCT2/bin/openrct2.d.ts" />

import MainWindow from "./MainWindow";

const main = function (): void {
  console.log('SetTheScenery loading');

  function closeWindow(classification) {
    let window = ui.getWindow(classification);
    if (window) {
      window.close();
    }
  }

  let mainWindow = new MainWindow();

  ui.registerMenuItem("SetTheScenery", function () {
    mainWindow.show();
  });

  closeWindow("set-the-scenery");
  closeWindow("set-the-scenery-loc-prompt");
};


registerPlugin({
  name: 'SetTheScenery',
  version: '0.5',
  authors: ['stieffers'],
  type: 'remote',
  licence: 'MIT',
  main,
});
