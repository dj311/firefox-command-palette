class CommandBar {
    constructor(input_el, results_el, items) {
        this.input_el = input_el;
        this.results_el = results_el;
        this.items = items;
        this.filtered_items = items;
        this.selected_index = -1;

        this.input_el.oninput = async ev => this.onChange();
        this.input_el.onkeydown = async ev => this.handleKeyDown(ev);
        this.input_el.onkeyup = async ev => this.handleKeyUp(ev);

        this.input_el.value = "";
        this.onChange();
    }

    selectItem(index) {
        if (this.selected_index === -1) {
            this.old_value = this.input_el.value;
        }

        if (index > this.filtered_items.length - 1) {
            this.selected_index = -1;
        } else if (index < -1) {
            this.selected_index = this.filtered_items.length - 1;
        } else {
            this.selected_index = index;
        }


        if (this.selected_index === -1) {
            this.input_el.value = this.old_value;
        } else {
            this.input_el.value = this.filtered_items[this.selected_index].content;
        }

        this.renderResults();
    }

    selectNextItem() {
        this.selectItem(this.selected_index + 1);
    }
    selectPreviousItem() {
        this.selectItem(this.selected_index - 1);
    }

    async onChange() {
        this.selected_index = -1;
        this.filtered_items = await onChange(this.input_el.value);
        this.renderResults();
    }

    async handleKeyDown(ev) {
        const select_previous = (ev.key == "Tab" && ev.shiftKey) || ev.key == "ArrowUp";
        const select_next = (ev.key == "Tab" && !ev.shiftKey) || ev.key == "ArrowDown";

        if (select_previous) this.selectPreviousItem();
        if (select_next) this.selectNextItem();

        if (select_previous || select_next) {
            ev.preventDefault();
        }
    }

    async handleKeyUp(ev) {
        if (ev.key == "Enter") {
            await onEnter(this.input_el.value);
            window.close();
            ev.preventDefault();
        }
    }

    clearResults() {
        while (this.results_el.firstChild) {
            this.results_el.removeChild(this.results_el.firstChild);
        }
    }

    renderResult(item, index) {
        var text_el = document.createElement("div");
        text_el.className = "text";
        text_el.appendChild(document.createTextNode(item.content));

        var desc_el = document.createElement("div");
        desc_el.className = "text-shortcut";
        desc_el.appendChild(document.createTextNode(item.description));

        var shortcut_el = document.createElement("div");
        desc_el.className = "text-shortcut";
        desc_el.appendChild(document.createTextNode(item.shortcut || ""));

        var list_item_el = document.createElement("div");
        list_item_el.className = "panel-list-item";
        list_item_el.appendChild(text_el);
        list_item_el.appendChild(desc_el);
        list_item_el.appendChild(shortcut_el);
        list_item_el.onclick = async ev => {
            this.selectItem(index);
            this.input_el.focus();
            if (ev.detail == 2) {
                await onEnter(this.input_el.value)
                window.close();
            }
            ev.preventDefault();
        };

        if (this.selected_index === index) {
            list_item_el.className += " selected";
        }

        return list_item_el
    }
    renderResults() {
        this.clearResults();

        const item_els = this.filtered_items
            .map((item, index) => this.renderResult(item, index))
            .map(el => this.results_el.appendChild(el));

        if (this.selected_index !== -1) item_els[this.selected_index].scrollIntoView({block: "nearest"});
    }

}


const input_element = document.getElementById("search-input");
const results_element = document.getElementById("search-results");

let command_bar = new CommandBar(input_element, results_element, commands);
