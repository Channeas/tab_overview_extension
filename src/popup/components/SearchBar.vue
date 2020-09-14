<template>
    <div class="searchBar" @click="focusSearchBar">
        <svg class="searchIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px">
            <path d="M0 0h24v24H0z" fill="none" />
            <path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
        </svg>
        <input id="searchText" type="text" v-model="searchText" spellcheck="false" placeholder="Search tab" @keyup="propagateQuery" />
    </div>
</template>

<style>
.searchBar {
    background-color: #efefef;
    background-color: #eaeaea;
    width: 177px;
    padding: 6px;
    border-radius: 6px;
    border: 1px solid #eaeaea;
    transition: 0.5s ease;
    display: inline-flex;
    position: relative;
    height: 18px;
    margin-left: 9px;
    cursor: text;
}

.searchBar:focus-within {
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.05);
}

.searchIcon {
    fill: #757575;
    height: 20px;
    width: 20px;
    position: absolute;
    top: 5px;
    left: 5px;
}

#searchText {
    display: inline-block;
    background-color: transparent;
    border: none;
    margin: 0;
    margin-left: 20px;
    margin-right: 1px;
    padding: 0;
    flex: 1;
    width: 100%;
}

#searchText:focus {
    outline: none;
}
</style>

<script>
// Import the event bus
import { EventBus } from "../eventbus.js";

export default {
    data: () => {
        return {
            searchText: "",
        };
    },
    methods: {
        // Function that makes sure the input field is focused when the search bar is clicked
        focusSearchBar: event => {
            document.getElementById("searchText").focus();
        },

        // Function that propagates the search query to the main popup instance
        propagateQuery: function() {
            EventBus.$emit("search", this.searchText);
        },
    },
};
</script>
