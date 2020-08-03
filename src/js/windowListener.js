// Class that listens for window events, and acts upon them
export class WindowListener {
    constructor(windowList) {
        this.windows = windowList;
        // Listen for new windows
        chrome.windows.onCreated.addListener(window => {
            // Push the new window to the array of open windows
            this.windows.push({
                id: window.id,
                tabs: [],
            });
        });

        // Listen for window closes
        chrome.windows.onRemoved.addListener(windowId => {
            // Remove the window from the array of open windows
            this.removeWindow(windowId, this.windows);
        });
    }

    // Function that removes a window
    removeWindow(windowId) {
        for (var index in this.windows) {
            if (this.windows[index].id == windowId) {
                this.windows.splice(index, 1);
                return;
            }
        }
    }
}
