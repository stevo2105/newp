var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: '/my-app-64',
    outputDirectory: '/Installers',
    authors: 'Profile Pass',
    exe: 'ProfilePass.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
