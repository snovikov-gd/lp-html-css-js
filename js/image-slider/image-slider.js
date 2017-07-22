class ImageSlider extends HTMLElement {
    constructor() {
        super();
        const template = document.querySelector('link[rel=import]').import.querySelector('#image-slider').content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));

        this.arrowLeftSelector = 'arrow--left';
        this.arrowRightSelector = 'arrow--right';

        console.log('my-element was created!');
    }

    connectedCallback() {
        this.initialize();
    }

    initialize() {
        // initialize images
        this.images = this.shadowRoot.querySelector('[name="image"]').assignedNodes();
        this.activeImage = 0;
        this.images[this.activeImage].classList.add('active');

        // initialize arrow navigation
        this.arrowLeft = this.shadowRoot.querySelector(`.${this.arrowLeftSelector}`);
        this.arrowRight = this.shadowRoot.querySelector(`.${this.arrowRightSelector}`);

        const arrows = [this.arrowLeft, this.arrowRight];

        Object.keys(arrows).forEach(arrow => {
            arrows[arrow].addEventListener('click', this.slide.bind(this));
        });
    }

    slide(event) {
        const slideLeft = event.target.classList.contains(this.arrowLeftSelector),
              slideRight = event.target.classList.contains(this.arrowRightSelector);

        this.images[this.activeImage].classList.remove('active');

        if (slideLeft && this.activeImage > 0) {
            this.activeImage--;

            if (this.activeImage === 0) {
                this.arrowLeft.classList.add('disabled');
            }
        }

        if (slideRight && this.activeImage < this.images.length - 1) {
            this.activeImage++;

            if (this.activeImage === this.images.length - 1) {
                this.arrowRight.classList.add('disabled');
            }
        }

        this.images[this.activeImage].classList.add('active');
    }
}

customElements.define('image-slider', ImageSlider);