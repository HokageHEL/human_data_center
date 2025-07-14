const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // you can expose backend functions here
});
