<template>
    <div class="dropButton">
        <button class="dropHead" :class="{ dropHeadActive: dropOpen }" @click="dropOpen = !dropOpen">
            <p class="currentSort">
                <span>Sort by </span>
                {{ active }}
            </p>
            <svg class="dropIcon" :class="{ a: dropOpen }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M7 10l5 5 5-5z" />
            </svg>
        </button>
        <div class="dropBody" :class="{ dropVisible: dropOpen }">
            <div
                v-for="(option, index) in options"
                :key="index"
                class="dropOption"
                :class="{ dropActive: option == active }"
                @click="
                    active = option;
                    dropOpen = false;
                    propagateMethod();
                "
                @keydown.enter="
                    active = option;
                    dropOpen = false;
                    propagateMethod();
                "
                @keydown.space="
                    active = option;
                    dropOpen = false;
                    propagateMethod();
                "
                :tabindex="dropOpen ? 0 : -1"
            >
                {{ option }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.dropButton {
    margin-left: 6px;
    display: inline-block;
    cursor: pointer;
    user-select: none;
    position: relative;
}

.dropHead {
    padding: 6px;
    background-color: #fff;
    border-radius: 6px;
    border: 1px solid #cccccc;
    position: relative;
    z-index: 100;
    cursor: pointer;
    transition: 0.3s ease;
}

.dropHead:hover {
    background-color: #fbfbfb;
    background-color: #ececec;
}

.dropHead:focus {
    outline: none;
}

.dropHeadActive {
    background-color: #f3f3f3 !important;
    background-color: #ececec !important;
}

.currentSort {
    display: inline-block;
    margin: 0;
    vertical-align: middle;
    width: 94px;
    text-align: left;
    font-size: 12px;
}

.currentSort > span {
    color: #737373;
}

.dropIcon {
    height: 16px;
    width: 16px;
    vertical-align: middle;
    transition: 0.3s ease;
}

.a {
    transform: rotateX(180deg);
}

/* Dropdown body */
.dropBody {
    position: absolute;
    background-color: #fff;
    width: 125.3px;
    z-index: 99;
    height: 0;
    transition: 0.3s ease;
    overflow: hidden;
    border: 1px solid #cccccc;
    border-radius: 6px;
    margin-top: -30px;
    padding-top: 20px;
}

.dropVisible {
    height: 97px;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.05);
}

.dropOption {
    padding: 3px 6px;
    transition: 0.3s ease;
}

.dropOption:first-of-type {
    margin-top: 5px;
    padding-top: 7px;
}

.dropOption:hover {
    background-color: #ececec;
}

.dropActive {
    background-color: #f3f3f3;
    background-color: #ececec;
    cursor: auto;
}
</style>

<script>
// Import the event bus
import { EventBus } from "../eventbus.js";

export default {
    props: {
        options: Array,
        initialOption: String,
    },
    data: () => {
        return {
            dropOpen: false,
            active: "",
        };
    },
    created: function() {
        // Save which sort method is active initially
        this.active = this.initialOption;

        window.addEventListener("click", event => {
            // If the dropbutton is open and the user clicked outside of the
            // dropbutton, close it
            if (this.dropOpen && !hasParentClass(event.target, "dropButton")) {
                this.dropOpen = false;
            }
        });
    },
    methods: {
        // Function that propagates the selected sort method upon change
        propagateMethod() {
            EventBus.$emit("newSortMethod", this.active);
        },
    },
};

// Function that checks if any parent of an element contains a certain class
function hasParentClass(element, targetClass) {
    // Make sure the current element is not the body (to stop infinite loops)
    if (element == document.body) {
        return false;
    } else if (element.classList.contains(targetClass)) {
        // If the current element contains the target class, return true
        return true;
    }

    // If neither of the above cases are true, keep looking recursively
    return hasParentClass(element.parentElement, targetClass);
}
</script>
