<template>
    <div id="popup">
        <div id="header">
            <SearchBar></SearchBar>
            <DropdownButton :options="sortMethods" :initialOption="selectedSort"></DropdownButton>
        </div>
        <ul id="tabHolder">
            <Tab v-for="tab in sortTabs" :tab="tab" :key="tab.id"></Tab>
        </ul>
    </div>
</template>

<style scoped>
#popup {
    width: 350px;
}

#header {
    padding: 8px 0px;
    border: 1px solid #dadce0;
}

#tabHolder {
    margin: 0;
    padding: 0;
    list-style-type: none;
    max-height: 350px;
    overflow: auto;
}
</style>

<script>
// Import the components
import SearchBar from "./components/SearchBar";
import DropdownButton from "./components/Dropdown";
import Tab from "./components/Tab";

// Import the event bus
import { EventBus } from "./eventbus.js";

export default {
    components: {
        SearchBar,
        DropdownButton,
        Tab,
    },
    data: () => {
        return {
            tabs: [],
            filteredTabs: [],
            sortMethods: ["Domain", "Last used", "Position", "Title"],
            selectedSort: "Position",
            query: "",
        };
    },
    computed: {
        // Function that returns the filtered tabs
        filterTabs() {
            // Make sure there are tabs to filter
            if (!this.tabs) {
                this.filteredTabs = [];
                return [];
            }

            var filteredTabs = [];

            // Loop through all the tabs, seeing if they match the query
            for (var index = 0; index < this.tabs.length; index++) {
                var tab = this.tabs[index];

                // Check if the tab title contains the query
                if (tab.title.toLowerCase().indexOf(this.query) > -1) {
                    filteredTabs.push(tab);
                    continue;
                }

                // Check if the url contains the query
                if (tab.url.toLowerCase().indexOf(this.query) > -1) {
                    filteredTabs.push(tab);
                    continue;
                }
            }

            this.filteredTabs = filteredTabs;
            return filteredTabs;
        },

        // Function that sorts tabs according to the current selected sorting method
        sortTabs() {
            // Make sure there are tabs to sort
            if (!this.filterTabs) {
                return [];
            }

            var unsortedTabs = this.filterTabs;
            var sortedTabs = [];
            var sortFunction;

            // Sorting functions
            var domainSort = (tab1, tab2) => {
                // Get the lowercase clean urls (no protocol or subdomains)
                var url1 = getCleanUrl(tab1.url).toLowerCase(),
                    url2 = getCleanUrl(tab2.url).toLowerCase();

                // Check if url1 is larger (alphabetically) than url2
                if (largestString(url1, url2) == url1) {
                    // If it is, keep sorting
                    return false;
                } else {
                    // If not, place tab 1 above tab 2
                    return true;
                }
            };

            var titleSort = (tab1, tab2) => {
                // Get the lowercase titles
                var title1 = tab1.title.toLowerCase(),
                    title2 = tab2.title.toLowerCase();

                // Check if title1 is larger (alphabetically) than title2
                if (largestString(title1, title2) == title1) {
                    // If it is, keep sorting
                    return false;
                } else {
                    // If not, place tab 1 above tab 2
                    return true;
                }
            };

            var timeSort = (tab1, tab2) => {
                // Make sure the second tab is not currently active
                if (tab1.active) {
                    return true;
                }

                // Make sure the second tab is not currently active
                if (tab2.active) {
                    return false;
                }

                // Determine placement based on time
                if (tab1.lastUsed > tab2.lastUsed) {
                    return true;
                } else {
                    return false;
                }
            };

            // Subfunction for finding the largest string
            var largestString = (string1, string2) => {
                // Determine which string is the shortest
                var shortestString = string1.length < string2.length ? string1 : string2;

                // Loop through the shortest string
                for (var index = 0; index < shortestString.length; index++) {
                    // Get the charcodes at the current index
                    var charCode1 = string1.charCodeAt(index),
                        charCode2 = string2.charCodeAt(index);

                    // See if the charcode from string1 is larger than the charcode from string 2
                    if (charCode1 > charCode2) {
                        // If it is, return that string1 is the largest string
                        return string1;
                    } else if (charCode2 > charCode1) {
                        // If the inverse is true however, return that string2 is the largest string
                        return string2;
                    }

                    // Keep sorting if they are equal
                }

                // If the strings were equal for the length of the shortest string, return that string
                return shortestString;
            };

            // Subfunction for cleaning urls
            var getCleanUrl = url => {
                var res = url;

                // Remove the protocol
                if (res.indexOf("//") > -1) {
                    res = res.substring(res.indexOf("//") + 2, res.length);
                }

                // Extract the path
                var path = "";
                if (res.indexOf("/") > 0) {
                    path = res.substring(res.indexOf("/"), res.length);
                    res = res.substring(0, res.indexOf("/"));
                }

                // Split the different sections of the url
                var sections = res.split("."),
                    length = sections.length;

                // Return the last two sections (the domain) with the path
                return `${sections[length - 2]}.${sections[length - 1]}${path}`;
            };

            // Determine which sorting function to use
            switch (this.selectedSort) {
                case "Domain":
                    sortFunction = domainSort;
                    break;
                case "Last used":
                    sortFunction = timeSort;
                    break;
                case "Position":
                    return this.filterTabs;
                case "Title":
                    sortFunction = titleSort;
                    break;
                default:
                    return this.filteredTabs;
            }

            // Loop through all the unsorted tabs
            for (var unsortedIndex = 0; unsortedIndex < unsortedTabs.length; unsortedIndex++) {
                var tabPlaced = false;

                // Get the tab to be placed
                var unsortedTab = unsortedTabs[unsortedIndex];

                // Loop through the sorted tabs, looking for the correct placement
                for (var sortedIndex = 0; sortedIndex < sortedTabs.length; sortedIndex++) {
                    // Get the sorted tab
                    var sortedTab = sortedTabs[sortedIndex];

                    // Check if the unsorted tab should be placed before the sorted tab
                    if (sortFunction(unsortedTab, sortedTab)) {
                        sortedTabs.splice(sortedIndex, 0, unsortedTab);
                        tabPlaced = true;
                        break;
                    }
                }

                // If the tab has not been added to the sorted list, add it in the back
                if (!tabPlaced) {
                    sortedTabs.push(unsortedTab);
                }
            }

            return sortedTabs;
        },
    },
    created: function() {
        // Load the user's preferred sorting method
        var sortMethod = localStorage.getItem("preferredSortMethod");
        if (sortMethod && this.sortMethods.includes(sortMethod)) {
            this.selectedSort = sortMethod;
        }

        // Communicate with the background script
        var port = chrome.extension.connect({ name: "Databus" });
        // Get the current window
        chrome.windows.getCurrent(window => {
            // Request the current window's data
            port.postMessage(window.id);
        });

        // Listen for the background script returning the window data
        port.onMessage.addListener(data => {
            // Save the tabs
            this.tabs = data.tabs;
        });

        // Start listening for search queries
        EventBus.$on("search", query => {
            // Save the query
            this.query = query.toLowerCase();
        });

        // Start listening for updates to the search method
        EventBus.$on("newSortMethod", method => {
            // Save the sort method locally
            this.selectedSort = method;

            // Update the user's preferred sorting method
            localStorage.setItem("preferredSortMethod", method);
        });
    },
};
</script>
