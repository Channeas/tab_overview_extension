import Vue from "vue";
import App from "./App";

/* eslint-disable no-new */
new Vue({
    el: "#app",

    render: h => h(App),
});

// Communicate with the background script
var port = chrome.extension.connect({ name: "Databus" });
// Get the current window
chrome.windows.getCurrent(window => {
    // Request the current window's data
    port.postMessage(window.id);
});

// Listen for the background script returning the window data
port.onMessage.addListener(data => {
    console.log(data);
});
