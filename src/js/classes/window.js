// Import the tab class
import { Tab } from "./tab.js";

/* Custom window class that takes a Chrome Window object as it's parameter */
/* Note that it loads the open tabs (if there are any) */
export class Window {
    constructor(windowData, newWindow) {
        this.id = windowData.id;
        this.activeTab = {};

        // Load the tabs
        this.tabs = [];

        // If this window isn't newly created, load the already existing tabs
        if (!newWindow) {
            chrome.tabs.getAllInWindow(windowData.id, tabs => {
                // Loop through all the tabs
                for (var index = 0; index < tabs.length; index++) {
                    // Create the Tab object
                    var tabData = tabs[index];
                    var tab = new Tab(tabData);

                    // Add the tab to the list of tabs
                    this.tabs.push(tab);

                    // Check if this tab is active
                    if (tabData.active) {
                        this.activeTab = tab;
                    }
                }
            });
        }
    }
}
