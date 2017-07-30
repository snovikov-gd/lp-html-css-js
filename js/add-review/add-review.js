class AddReview extends HTMLElement {
    constructor() {
        super();
        const template = document.querySelector('link[rel="import"][href*="add-review"]').import.querySelector('#add-review').content;
        this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));
    }

    connectedCallback() {
        this.initialize();
    }

    initialize() {

    }

}

customElements.define('add-review', AddReview);