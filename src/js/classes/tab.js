/* Custom tab class that takes a Chrome Tab object as it's parameter */
export class Tab {
    constructor(tabData) {
        this.title = tabData.title;
        this.id = tabData.id;
        this.windowId = tabData.windowId;
        this.lastUsed = Date.now();
        this.active = tabData.active;
        this.favIconUrl = tabData.favIconUrl;
        this.url = tabData.url;
    }
}
