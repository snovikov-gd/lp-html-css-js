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
        this._initializeImages();
        this._initializeArrows();
        this._initializeZoom();
    }

    slide(event) {
        const slideLeft = event.target.classList.contains(this.arrowLeftSelector),
              slideRight = event.target.classList.contains(this.arrowRightSelector);

        this.images[this.activeImage].classList.remove('active');

        if (slideLeft && this.activeImage > 0) {
            this.activeImage--;
            this._slideImageTitle(this.images[this.activeImage].alt, 'left');
            this.arrowRight.classList.remove('disabled');

            if (this.activeImage === 0) {
                this.arrowLeft.classList.add('disabled');
            }
        }

        if (slideRight && this.activeImage < this.images.length - 1) {
            this.activeImage++;
            this._slideImageTitle(this.images[this.activeImage].alt, 'right');
            this.arrowLeft.classList.remove('disabled');

            if (this.activeImage === this.images.length - 1) {
                this.arrowRight.classList.add('disabled');
            }
        }

        this.images[this.activeImage].classList.add('active');
    }

    _initializeImages() {
        this.images = this.shadowRoot.querySelector('[name="image"]').assignedNodes();
        this.activeImage = 0;
        this.images[this.activeImage].classList.add('active');
        this._setImageTitle(this.images[this.activeImage].alt);
    }

    _setImageTitle(title) {
        const imageTitle = this.shadowRoot.querySelector(`.image-title`);
        imageTitle.firstChild.textContent = title;
    }

    _slideImageTitle(title, direction) {
        const imageTitle = this.shadowRoot.querySelector(`.image-title`);

        imageTitle.classList.add(`sliding-${direction}`);

        setTimeout(() => {
            imageTitle.classList.remove(`sliding-${direction}`);
            imageTitle.firstChild.textContent = title;
        }, 500)
    }

    _initializeArrows() {
        const main = this.shadowRoot.querySelector('main');
        this.arrowLeft = this.shadowRoot.querySelector(`.${this.arrowLeftSelector}`);
        this.arrowLeft.classList.add('disabled');
        this.arrowRight = this.shadowRoot.querySelector(`.${this.arrowRightSelector}`);

        const arrows = [this.arrowLeft, this.arrowRight];

        Object.keys(arrows).forEach(arrow => {
            arrows[arrow].addEventListener('click', this.slide.bind(this));
        });
    }

    _initializeZoom() {
        const main = this.shadowRoot.querySelector('main');

        this._setZoomedImageAreaSize();

        main.addEventListener('mousemove', e => {
            const main = this.shadowRoot.querySelector('main'),
                  zoomArea = this.shadowRoot.querySelector('.zoom-area'),
                  zoomedImageArea = this.shadowRoot.querySelector('.zoomed-image-area'),
                  leftBorder = main.clientWidth/4/2,
                  topBorder = main.clientHeight/2/2,
                  rightBorder = main.clientWidth - leftBorder,
                  bottomBorder = main.clientHeight - topBorder;

            if (e.layerX > leftBorder && e.layerY > topBorder && e.layerX < rightBorder && e.layerY < bottomBorder) {
                zoomedImageArea.style.backgroundImage = `url("${this.images[this.activeImage].src}")`;

                zoomedImageArea.style.display = 'block';
                zoomArea.style.opacity = '1';

                this._setZoomAreaPosition(e.layerX, e.layerY);
                this._updateZoomedImagePosition(e.layerX, e.layerY, leftBorder, topBorder);
            } else {
                zoomedImageArea.style.display = 'none';
                zoomArea.style.opacity = '0';
            }
        });
    }

    _setZoomedImageAreaSize() {
        const activeImage = this.images[this.activeImage],
            zoomedImageArea = this.shadowRoot.querySelector('.zoomed-image-area');

        zoomedImageArea.style.width = activeImage.naturalWidth/4;
        zoomedImageArea.style.height = activeImage.naturalHeight/2;
    }

    _setZoomAreaPosition(offsetLeft, offsetTop) {
        const main = this.shadowRoot.querySelector('main'),
              zoomArea = this.shadowRoot.querySelector('.zoom-area');

        zoomArea.style.left = `${offsetLeft-zoomArea.clientWidth/2}px`;
        zoomArea.style.top = `${offsetTop-zoomArea.clientHeight/2}px`;
    }

    _updateZoomedImagePosition(offsetLeft, offsetTop, leftBorder, topBorder) {
        const zoomedImageArea = this.shadowRoot.querySelector('.zoomed-image-area'),
              ratio = this.images[this.activeImage].naturalWidth/this.images[this.activeImage].width;

        zoomedImageArea.style.backgroundPositionX = `-${(offsetLeft-leftBorder)*ratio}px`;
        zoomedImageArea.style.backgroundPositionY = `-${(offsetTop-topBorder)*ratio}px`;
    }
}

customElements.define('image-slider', ImageSlider);