const electron = require('electron');
const url = require('url');
const path = require('path');
const updater = require('electron-simple-updater');
updater.init('https://raw.githubusercontent.com/stevo2105/btctrade/master/updates.json');


const {app, BrowserWindow, Menu, ipcMain} = electron;
const Store = require('./store.js');
let mainWindow;

const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    // 800x600 is the default size of our window
    user_info: {key: "", profile_pass_downloads: ""}
  }
});
let key_code = "";

app.on('ready', function() {


  let { key, profile_pass_downloads } = store.get('user_info');
  key_code = key
  console.log("Key: " + key);
  console.log("Downloads: " + profile_pass_downloads);
  mainWindow = new BrowserWindow({width: 1200, height: 800})
  if (parseInt(key) * 9 == parseInt(profile_pass_downloads)) {
    const https = require('https');
    r_url = "https://www.tricklebid.com/check_activation_profile_pass?key=" + key
    https.get(r_url, (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        data = JSON.parse(data)
        if (data.success == "true" || data.code == 69) {


          mainWindow = new BrowserWindow({width: 1200, height: 800})
          // mainWindow.openDevTools();
          mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: 'file',
            slashes: 'true'
          }));

        } else {
          mainWindow.webContents.send('activation:add', data.message)
          app.quit()
        }


      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, "login.html"),
      protocol: 'file',
      slashes: 'true'
    }));
  }




  // const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('activation:add', function(e, activation) {

    const https = require('https');
    r_url = "https://www.tricklebid.com/check_activation_profile_pass?key=" + activation
    https.get(r_url, (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        data = JSON.parse(data)
        if (data.success == "true") {
          mainWindow.webContents.send('activation:add', data.message)
          let dw = parseInt(activation)*9;
          let key = activation.toString();
          let profile_pass_downloads = dw.toString();
          store.set('user_info', { key, profile_pass_downloads });

          mainWindow = new BrowserWindow({width: 1200, height: 800})
          mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: 'file',
            slashes: 'true'
          }));

        } else {
          mainWindow.webContents.send('activation:add', data.message)
        }
        console.log(data);

      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
});



ipcMain.on('share:new', function(e, activation) {

    const https = require('https');
    r_url = "https://www.tricklebid.com/share_profile_account?key=" + key_code
    https.get(r_url, (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        data = JSON.parse(data)
        console.log
        if (data.success == "true") {
          mainWindow.webContents.send('share:new', data.message)
        } else {
          mainWindow.webContents.send('share:new', data.message)
        }
        console.log(data);

      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
});


ipcMain.on('deactivate:new', function(e, activation) {
    let { key, profile_pass_downloads } = store.get('user_info');
    console.log("Key: " + key)
    const https = require('https');
    r_url = "https://www.tricklebid.com/deactivate_license?key=" + key
    https.get(r_url, (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        data = JSON.parse(data)

        if (data.success == "true") {
          mainWindow.webContents.send('deactivate:new', data.message)

          let key = "";
          let profile_pass_downloads = "";
          store.set('user_info', { key, profile_pass_downloads });
          app.quit();
        } else {
          mainWindow.webContents.send('deactivate:new', data.message)
          app.quit();

        }
        console.log(data);

      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
});


const mainMenuTemplate = [

  {
    label: "File"
  }
];
