// Import the Tab class
import { Tab } from "./classes/tab.js";

/* Class that listens for tab events, and acts upon them */
export class TabListener {
    constructor(windowList) {
        this.windows = windowList;
        this.detatchedTab = null;

        // Listen for new tabs
        chrome.tabs.onCreated.addListener(tabData => {
            // Create the new tab
            var tab = new Tab(tabData);

            // Get the current window
            var currentWindow = this.getWindow(tabData.windowId);

            // Add the new tab to it
            currentWindow.tabs.splice(tabData.index, 0, tab);
        });

        // Listen for tab removal
        chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
            // Remove the current tab
            this.removeTab(removeInfo.windowId, tabId);
        });

        // Listen to tab attatchments
        chrome.tabs.onAttached.addListener((tabId, attatchInfo) => {
            // Update the window id of the detatched tab
            this.detatchedTab.windowId = attatchInfo.newWindowId;

            // Get the current window
            var currentWindow = this.getWindow(attatchInfo.newWindowId);

            // Add the detatched tab to the new window, at the right position
            currentWindow.tabs.splice(attatchInfo.newPosition, 0, this.detatchedTab);
            this.detatchedTab = null;
        });

        // Listen to tab detatchments
        chrome.tabs.onDetached.addListener((tabId, detatchInfo) => {
            // Remove the detatched tab
            this.detatchedTab = this.removeTab(detatchInfo.oldWindowId, tabId)[0];
        });

        // Listen to tab activation changes
        chrome.tabs.onActivated.addListener(activeInfo => {
            // Find the correct window
            var currentWindow = this.getWindow(activeInfo.windowId);

            // Update the last used time of the previously active tab
            currentWindow.activeTab.lastUsed = Date.now();
            currentWindow.activeTab.active = false;

            // Save the tab that is now active
            currentWindow.activeTab = this.findTab(activeInfo.windowId, activeInfo.tabId);
            currentWindow.activeTab.active = true;
        });

        // Listen to tab updates
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabData) => {
            // Find the updated tab
            var tab = this.findTab(tabData.windowId, tabId);

            // Update the tab title
            if (tabData.title) {
                tab.title = tabData.title;
            }

            // Update the favicon url
            if (tabData.favIconUrl) {
                tab.favIconUrl = tabData.favIconUrl;
            }

            // Update the url
            if (tabData.url) {
                tab.url = tabData.url;
            }
        });

        // Listen to tab moves (really jsut so the tabs can be shown in their position)
        chrome.tabs.onMoved.addListener((tabId, moveInfo) => {
            // Get the current window
            var currentWindow = this.getWindow(moveInfo.windowId);

            // Remove the tab from the old position
            var tab = currentWindow.tabs.splice(moveInfo.fromIndex, 1)[0];

            // Add the tab to the new position
            currentWindow.tabs.splice(moveInfo.toIndex, 0, tab);
        });
    }

    // Function that returns a specific window
    getWindow(windowId) {
        for (var index in this.windows) {
            if (this.windows[index].id == windowId) {
                return this.windows[index];
            }
        }

        // Return that the window was not found
        return null;
    }

    // Function that finds a tab given the window and tab id's
    findTab(windowId, tabId) {
        // Get the window
        var window = this.getWindow(windowId);

        // Look for the tab from the window
        for (var index in window.tabs) {
            if (window.tabs[index].id == tabId) {
                return window.tabs[index];
            }
        }

        return null;
    }

    // Function that removes a tab from a window
    removeTab(windowId, tabId) {
        // Get the window
        var window = this.getWindow(windowId);

        // Remove the tab from the window
        for (var index in window.tabs) {
            if (window.tabs[index].id == tabId) {
                return window.tabs.splice(index, 1);
            }
        }

        return null;
    }
}
