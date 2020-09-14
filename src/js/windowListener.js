// Import the Window class
import { Window } from "./classes/window.js";

/* Class that listens for window events, and acts upon them */
export class WindowListener {
    constructor(windowList) {
        this.windows = windowList;
        // Listen for new windows
        chrome.windows.onCreated.addListener(windowData => {
            // Push the new window to the array of open windows
            this.windows.push(new Window(windowData));
        });

        // Listen for window closes
        chrome.windows.onRemoved.addListener(windowId => {
            // Remove the window from the array of open windows
            this.removeWindow(windowId, this.windows);
        });

        // Load the windows that are open when the extension starts
        this.loadWindows();
    }

    loadWindows() {
        // Loop through all the windows, converting them to the custom Window class
        chrome.windows.getAll(windowList => {
            for (var index = 0; index < windowList.length; index++) {
                this.windows.push(new Window(windowList[index]));
            }
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
