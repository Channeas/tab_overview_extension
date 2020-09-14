<template>
    <li class="tab" @click="switchTab" :class="{ tabActive: tab.active }">
        <img class="tabIcon" :src="tab.favIconUrl" />
        <div class="tabContent">
            <p class="tabTitle">{{ tab.title }}</p>
            <p class="tabUsed">{{ timeMessage }}</p>
        </div>
    </li>
</template>

<style>
.tab {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: 0.3s ease;
}

.tab:hover {
    background-color: #ececec;
}

.tabActive {
    cursor: default;
    background-color: #f8f8f8;
    background-color: #ececec;
}

.tabIcon {
    height: 16px;
    width: 16px;
    margin-right: 5px;
}

.tabContent {
    flex: 1;
}

.tabTitle {
    margin: 0;
    word-break: break-word;
}

.tabUsed {
    margin: 0;
    font-size: 10px;
    color: #6f6f6f;
}
</style>

<script>
export default {
    created: function() {
        // Determine if this tab should display time or not
        if (this.tab.active) {
            this.timeMessage = "Active now";
        } else {
            // Set the initial time message
            this.setTime(true);

            // Initialize the timer at the next time switch
            window.setTimeout(this.initializeTimer, this.timeToNext());
        }
    },
    data: () => {
        return {
            timeMessage: "Used 0 seconds ago",
            timeInterval: null,
            timeUnit: "seconds",
        };
    },
    methods: {
        // Function that starts the timer of updating the last used message
        initializeTimer() {
            // Start the timer
            this.timeInterval = window.setInterval(this.setTime, 1000);

            // Update the time as of right now
            this.setTime(true);
        },

        // Function that switches to the currently selected tab
        switchTab() {
            chrome.tabs.update(this.tab.id, { active: true, highlighted: true });
        },

        // Function that sets the correct time
        setTime(initialRun) {
            var minInMilliseconds = 60000;
            var hourInMilliseconds = 3600000;

            // Get how long ago the tab was last used (in milliseconds)
            var timeDiff = Date.now() - this.tab.lastUsed;

            // Check if the tab has not been used in at least 1 hour
            if (timeDiff >= hourInMilliseconds) {
                // Calculate how many hours have passed since the tab was in use
                var hourDiff = timeDiff / hourInMilliseconds;

                // Update the time message
                this.timeMessage = `Used ${Math.floor(hourDiff)} hour${hourDiff < 2 ? "" : "s"} ago`;

                // Potentially set a new interval
                if (this.timeUnit != "hours" && !initialRun) {
                    // Clear the old interval
                    window.clearInterval(this.timeInterval);

                    // Set the new (1 hour) interval
                    this.timeInterval = window.setInterval(this.setTime, hourInMilliseconds);
                    this.timeUnit = "hours";
                }
            } else if (timeDiff >= minInMilliseconds) {
                // Calculate how many minutes have passed since the tab was in use
                var minuteDiff = timeDiff / minInMilliseconds;

                // Update the time message
                this.timeMessage = `Used ${Math.floor(minuteDiff)} minute${minuteDiff < 2 ? "" : "s"} ago`;

                // Potentially set a new interval
                if (this.timeUnit == "seconds" && !initialRun) {
                    // Clear the old (1 second) interval
                    window.clearInterval(this.timeInterval);

                    // Set the new (1 minute) interval
                    this.timeInterval = window.setInterval(this.setTime, minInMilliseconds);
                    this.timeUnit = "minutes";
                }
            } else {
                // Calculate how many seconds have passed since the tab was in use
                var secondDiff = timeDiff / 1000;

                // Update the time message
                this.timeMessage = `Used ${Math.floor(secondDiff)} second${secondDiff < 2 ? "" : "s"} ago`;
            }
        },

        // Function that determines how long is left before the next timing update
        timeToNext() {
            var minInMilliseconds = 60000;
            var hourInMilliseconds = 3600000;

            // Get how long ago the tab was last used (in milliseconds)
            var timeDiff = Date.now() - this.tab.lastUsed;

            // Return how long it is until the next time update
            if (timeDiff >= hourInMilliseconds) {
                return hourInMilliseconds - (timeDiff % hourInMilliseconds);
            } else if (timeDiff >= minInMilliseconds) {
                return minInMilliseconds - (timeDiff % minInMilliseconds);
            } else {
                return 1000 - (timeDiff % 1000);
            }
        },
    },
    props: {
        tab: Object,
    },
};
</script>
