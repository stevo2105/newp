'use strict';
/* eslint-env browser */

const { remote } = require('electron');
const updater = remote.require('electron-simple-updater');

var text = "Version: " + updater.version;

setText('version', text);

// attachUiHandlers();
updater.checkForUpdates();
attachUpdaterHandlers();


// function attachUiHandlers() {
//
//
//   btnUpdate.addEventListener('click', () => {
//     updater.checkForUpdates();
//     document.body.classList.add('update-downloading');
//   });
//
//   btnInstall.addEventListener('click', () => {
//     updater.downloadUpdate();
//   });
//
//
// }

function attachUpdaterHandlers() {
  updater.on('update-available', onUpdateAvailable);
  updater.on('update-downloading', onUpdateDownloading);
  updater.on('update-downloaded', onUpdateDownloaded);
  updater.setOptions('logger', {
    info(text) { log('info', text); },
    warn(text) { log('warn', text); }
  });

  function onUpdateAvailable(meta) {

    alert('New Update Available!')
    updater.downloadUpdate();
  }

  function onUpdateDownloading() {
    alert("Update is downloading... We will let you know when it has completed.")
  }

  function onUpdateDownloaded() {
    if (window.confirm('The app has been updated. Do you like to restart it now?')) {
      updater.quitAndInstall();
    }
  }

  function log(level, text) {
    console.log(`[${level}] ${text}`);

  }
}

function setText(id, text) {
  document.getElementById(id).appendChild(
    document.createTextNode(text)
  );
}
