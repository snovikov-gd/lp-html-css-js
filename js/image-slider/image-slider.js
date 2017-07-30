class ImageSlider extends HTMLElement {
    constructor() {
        super();
        const template = document.querySelector('link[rel=import]').import.querySelector('#image-slider').content;
        this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));

        this.arrowLeftSelector = 'arrow--left';
        this.arrowRightSelector = 'arrow--right';
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
        const slideLeft = event.target.classList.contains(this.arrowLeftSelector),
            slideRight = event.target.classList.contains(this.arrowRightSelector);

        this.watermarkedImage.style.opacity = 0;
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

        this._watermarkImage();
        setTimeout(() => {
            this.watermarkedImage.style.opacity = 1;
        }, 200);

        this.images[this.activeImage].classList.add('active');
    }

    _setupElementReferences() {
        const s = this.shadowRoot;
        this.container = s.querySelector('main');

        this.images = s.querySelector('[name="image"]').assignedNodes();
        this.imageTitle = s.querySelector(`.image-title`);
        this.watermarkedImage = s.querySelector('.image');
        this.WATERMARKED_IMAGE_SOURCE = './images/watermark.png';

        this.arrowLeft = s.querySelector(`.${this.arrowLeftSelector}`);
        this.arrowRight = s.querySelector(`.${this.arrowRightSelector}`);

        this.zoomArea = s.querySelector('.zoom-area');
        this.zoomedImageArea = s.querySelector('.zoomed-image-area');
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

        const arrows = [this.arrowLeft, this.arrowRight];

        Object.keys(arrows).forEach(arrow => {
            arrows[arrow].addEventListener('click', this.slide.bind(this));
        });
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

    _initializeZoom() {
        this._setZoomedImageAreaSize();

        this.container.addEventListener('mousemove', e => {
            const leftBorder = this.container.clientWidth / 4 / 2,
                topBorder = this.container.clientHeight / 2 / 2,
                rightBorder = this.container.clientWidth - leftBorder,
                bottomBorder = this.container.clientHeight - topBorder;

            if (e.layerX > leftBorder && e.layerY > topBorder && e.layerX < rightBorder && e.layerY < bottomBorder) {
                this.zoomedImageArea.style.backgroundImage = `url("${this.images[this.activeImage].src}")`;

                this.zoomedImageArea.style.display = 'block';
                this.zoomArea.style.opacity = '1';

                this._setZoomAreaPosition(e.layerX, e.layerY);
                this._updateZoomedImagePosition(e.layerX, e.layerY, leftBorder, topBorder);
            } else {
                this.zoomedImageArea.style.display = 'none';
                this.zoomArea.style.opacity = '0';
            }
        });
    }

    _setZoomedImageAreaSize() {
        const activeImage = this.images[this.activeImage];

        this.zoomedImageArea.style.width = activeImage.naturalWidth / 4;
        this.zoomedImageArea.style.height = activeImage.naturalHeight / 2;
    }

    _setZoomAreaPosition(offsetLeft, offsetTop) {
        this.zoomArea.style.left = `${offsetLeft - this.zoomArea.clientWidth / 2}px`;
        this.zoomArea.style.top = `${offsetTop - this.zoomArea.clientHeight / 2}px`;
    }

    _updateZoomedImagePosition(offsetLeft, offsetTop, leftBorder, topBorder) {
        const ratio = this.images[this.activeImage].naturalWidth / this.watermarkedImage.width;

        this.zoomedImageArea.style.backgroundPositionX = `-${(offsetLeft - leftBorder) * ratio}px`;
        this.zoomedImageArea.style.backgroundPositionY = `-${(offsetTop - topBorder) * ratio}px`;
    }

    _watermarkImage() {
        let originalImage = this.images[this.activeImage],
            image = new Image(),
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

        image.src = originalImage.src;
    }
}

customElements.define('image-slider', ImageSlider);