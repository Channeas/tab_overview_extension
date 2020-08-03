var windows = [];

// Function that returns a specific window
function getWindow(windowId) {
    for (var index in windows) {
        if (windows[index].id == windowId) {
            return windows[index];
        }
    }

    // Note that the window was not found
    return "Window not found, unknown windowId";
}

// Listen for the popup, and return the data of the current window
chrome.extension.onConnect.addListener(port => {
    port.onMessage.addListener(windowId => {
        port.postMessage(getWindow(windowId));
    });
});
