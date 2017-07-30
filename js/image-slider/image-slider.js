class ImageSlider extends HTMLElement {
    constructor() {
        super();
        const template = document.querySelector('link[rel="import"][href*="image-slider"]').import.querySelector('#image-slider').content;
        this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));
    }

    connectedCallback() {
        this.initialize();
    }

    initialize() {
        this._setupElementReferences();
        this._initializeImages();
        this._initializeArrows();
        this._initializeZoom();
    }

    slide(event) {
        const direction = event.target.dataset.direction;

        if (direction === 'to-left' && this.activeImage > 0) {
            this.activeImage--;
            this.arrowRight.classList.remove('disabled');

            if (this.activeImage === 0) {
                this.arrowLeft.classList.add('disabled');
            }
        }

        if (direction === 'to-right' && this.activeImage < this.images.length - 1) {
            this.activeImage++;
            this.arrowLeft.classList.remove('disabled');

            if (this.activeImage === this.images.length - 1) {
                this.arrowRight.classList.add('disabled');
            }
        }

        this.watermarkedImage.style.opacity = 0;
        this._slideImageTitle(this.images[this.activeImage].alt, direction);
        this._watermarkImage();

        // pretty dump fade effect
        setTimeout(() => {
            this.watermarkedImage.style.opacity = 1;
        }, 200);
    }

    _setupElementReferences() {
        const s = this.shadowRoot;
        this.container = s.querySelector('main');

        this.images = s.querySelector('[name="image"]').assignedNodes();
        this.imageTitle = s.querySelector(`.image-title`);
        this.watermarkedImage = s.querySelector('.image');
        this.WATERMARKED_IMAGE_SOURCE = './images/watermark.png';

        this.arrowLeft = s.querySelector('.arrow--left');
        this.arrowRight = s.querySelector('.arrow--right');

        this.areaToBeZoomed = s.querySelector('.area-to-be-zoomed');
        this.zoomedArea = s.querySelector('.zoomed-area');
    }

    _initializeImages() {
        // set up active image that the first one by default
        this.activeImage = 0;
        this.images[this.activeImage].classList.add('active');
        this._watermarkImage();

        // output the description text that comes from outer image [alt] attribute
        this._setImageTitle(this.images[this.activeImage].alt);
    }

    _initializeArrows() {
        this.arrowLeft.classList.add('disabled');

        this.arrowLeft.addEventListener('click', this.slide.bind(this));
        this.arrowRight.addEventListener('click', this.slide.bind(this));
    }

    _initializeZoom() {
        this._setZoomedAreaSize();
        this.container.addEventListener('mousemove', this.zoom.bind(this));
    }

    _setImageTitle(title) {
        this.imageTitle.firstChild.textContent = title;
    }

    _slideImageTitle(title, direction) {
        this.imageTitle.classList.add(`sliding-${direction}`);

        setTimeout(() => {
            this.imageTitle.classList.remove(`sliding-${direction}`);
            this.imageTitle.firstChild.textContent = title;
        }, 500)
    }

    _watermarkImage() {
        let image = new Image(),
            imageWidth = this.container.clientWidth,
            imageHeight = this.container.clientHeight;

        image.onload = () => {
            let watermark = new Image();

            watermark.onload = () => {
                let ctx = this.watermarkedImage.getContext('2d');
                ctx.drawImage(image, 0, 0, imageWidth, imageHeight);
                ctx.drawImage(watermark, 370, 10);
            };

            watermark.src = this.WATERMARKED_IMAGE_SOURCE;
        };

        image.src = this.images[this.activeImage].src;
    }

    zoom(e) {
        // controls the borders where area to be zoomed must appear
        // and updates image position inside zoomed area
        const leftBorder = this.container.clientWidth / 4 / 2,
              topBorder = this.container.clientHeight / 2 / 2,
              rightBorder = this.container.clientWidth - leftBorder,
              bottomBorder = this.container.clientHeight - topBorder;

        if (e.layerX > leftBorder && e.layerY > topBorder && e.layerX < rightBorder && e.layerY < bottomBorder) {
            this.zoomedArea.style.backgroundImage = `url("${this.images[this.activeImage].src}")`;

            this.zoomedArea.style.display = 'block';
            this.areaToBeZoomed.style.opacity = '1';

            this._setAreaToBeZoomedPosition(e.layerX, e.layerY);
            this._updateZoomedAreaPosition(e.layerX, e.layerY, leftBorder, topBorder);
        } else {
            this.zoomedArea.style.display = 'none';
            this.areaToBeZoomed.style.opacity = '0';
        }
    }

    _setZoomedAreaSize() {
        this.zoomedArea.style.setProperty('width', `${this.images[this.activeImage].naturalWidth / 4}px`);
        this.zoomedArea.style.setProperty('height', `${this.images[this.activeImage].naturalHeight / 2}px`);
    }

    _setAreaToBeZoomedPosition(offsetLeft, offsetTop) {
        this.areaToBeZoomed.style.left = `${offsetLeft - this.areaToBeZoomed.clientWidth / 2}px`;
        this.areaToBeZoomed.style.top = `${offsetTop - this.areaToBeZoomed.clientHeight / 2}px`;
    }

    _updateZoomedAreaPosition(offsetLeft, offsetTop, leftBorder, topBorder) {
        const ratio = this.images[this.activeImage].naturalWidth / this.watermarkedImage.width;
        this.zoomedArea.style.backgroundPositionX = `-${(offsetLeft - leftBorder) * ratio}px`;
        this.zoomedArea.style.backgroundPositionY = `-${(offsetTop - topBorder) * ratio}px`;
    }
}

customElements.define('image-slider', ImageSlider);