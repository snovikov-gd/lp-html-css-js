class AddReview extends HTMLElement {
    constructor() {
        super();
        const template = document.querySelector('link[rel="import"][href*="add-review"]').import.querySelector('#add-review').content;
        this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));
        this.s = this.shadowRoot;
    }

    connectedCallback() {
        this.initialize();
    }

    initialize() {
        this._initName();
        this._initDate();
        this._initText();
        this._initRating();
        this._initAvatarUpload();
    }

    static submit() {
        alert('Your review has been added!');
    }

    static cancel() {
        let e = document.createEvent('HTMLEvents');
        e.initEvent('click', false, true);
        e.action = 'CANCEL';
        document.dispatchEvent(e);
    }

    _initName() {
        this.name = {
            preview: this.s.querySelector('.preview-name'),
            edit: this.s.querySelector('#name')
        };

        const self = this,
              defaultName = this.name.preview.textContent;

        this.name.edit.addEventListener('keyup', function() {
            self.name.preview.textContent = this.value ? this.value : defaultName;
        });
    }

    _initDate() {
        this.date = this.s.querySelector('.preview-date');

        const date = new Date(),
              day = date.getDate(),
              months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
              month = date.getMonth(),
              year = date.getFullYear();

        this.date.textContent = `${months[month]} ${day}, ${year}`;
    }

    _initText() {
        this.text = {
            preview: {
                value: this.s.querySelector('.preview-text'),
                defaultText: this.s.querySelector('.preview-text').innerHTML,
            },

            edit: {
                textarea: this.s.querySelector('#text'),
                bold: this.s.querySelector('#bold'),
                emphasize: this.s.querySelector('#emphasize'),
                quote: this.s.querySelector('#quote'),
                cancel: this.s.querySelector('#cancel'),
                submit: this.s.querySelector('#submit')
            }
        };

        const self = this;

        // init text area
        this.text.edit.textarea.addEventListener('keyup', function (e) {
            self._updateSubmitButtonState.bind(this)(self);
            self._updateTextInPreview.bind(this)(self);
        });

        // init format buttons
        this.text.edit.bold.addEventListener('click', () => { this._insertTag('b') });
        this.text.edit.emphasize.addEventListener('click', () => { this._insertTag('i') });
        this.text.edit.quote.addEventListener('click', () => { this._insertTag('q') });

        // init cancel and submit buttons
        this.text.edit.cancel.addEventListener('click', AddReview.cancel);
        this.text.edit.submit.addEventListener('click', AddReview.submit);
    }

    _initRating() {
        this.rating = {
            preview: this.s.querySelector('.preview-rating'),
            edit: this.s.querySelector('.rate')
        };

        const self = this,
              stars = this.rating.edit.querySelectorAll('img');

        Object.keys(stars).forEach(star => {
            stars[star].addEventListener('click', function (e) {
                const number = parseInt(this.dataset.rate.substr(5)),
                      isInactive = this.src.includes('-inactive');

                // update rating that's shown in edit area
                if (isInactive) {
                    for (let i = 1; i < number+1; i++) {
                        console.log(self.rating.edit);
                        self.rating.edit.querySelector(`img[data-rate="rate-${i}"]`).src = 'images/star-active.svg';
                    }
                } else {
                    for (let i = number+1; i <= 5; i++) {
                        self.rating.edit.querySelector(`img[data-rate="rate-${i}"]`).src = 'images/star-inactive-grey.svg';
                    }
                }

                // update rating that's shown in preview area
                const previewRates = self.rating.preview.querySelectorAll('.preview-rate');

                Object.keys(previewRates).forEach((rate) => {
                    previewRates[rate].style.display = 'none';
                });

                self.rating.preview.querySelector(`.preview-rate-${number}`).style.display = 'block';
            });
        })
    }

    _initAvatarUpload() {
        this.avatar = {
            preview: this.s.querySelector('.preview-avatar-image'),
            edit: {
                container: this.s.querySelector('.avatar'),
                input: this.s.querySelector('#input-avatar'),
                uploadPreview: this.s.querySelector('.avatar-image')
            }
        };

        const self = this;

        this.avatar.edit.container.addEventListener('click', function () {
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });

            self.avatar.edit.input.dispatchEvent(event);
        });

        this.avatar.edit.input.addEventListener('change', function () {
            if (self.avatar.edit.input.files && self.avatar.edit.input.files[0]) {
                let reader = new FileReader();

                reader.onload = function (e) {
                    self.avatar.edit.container.classList.remove('avatar--not-selected');
                    self.avatar.edit.uploadPreview.setAttribute('src', e.target.result);
                    self.avatar.preview.setAttribute('src', e.target.result);
                };

                reader.readAsDataURL(self.avatar.edit.input.files[0]);
            }
        });
    }

    _updateSubmitButtonState(self) {
        const submit = self.text.edit.submit;
        return this.value ? submit.removeAttribute('disabled') : submit.setAttribute('disabled', true);
    }

    _updateTextInPreview(self) {
        if (!this.value) {
            // reset to default placeholder
            self.text.preview.value.innerHTML = self.text.preview.defaultText;
        } else {
            // render HTML from text area value
            let template = this.value ? this.value : self.text.preview.defaultText;
            self.text.preview.value.innerHTML = AddReview._renderReview(template);
        }
    }

    _insertTag(tag) {
        const currentValue = this.text.edit.textarea.value,
            startPos = this.text.edit.textarea.selectionStart,
            endPos = this.text.edit.textarea.selectionEnd,
            selectedText = this.text.edit.textarea.value.substring(startPos, endPos),
            openingTag = `[${tag}]`,
            closingTag = `[/${tag}]`;

        this.text.edit.textarea.value = `${currentValue.substring(0, startPos)}${openingTag}${selectedText}${closingTag}${currentValue.substring(endPos)}`;

        // trigger text area change
        let e = document.createEvent('HTMLEvents');
        e.initEvent('keyup', false, true);
        this.text.edit.textarea.dispatchEvent(e);
    }

    static _renderReview(template) {
        template = template.replace('[b]', '<strong>');
        template = template.replace('[/b]', '</strong>');

        template = template.replace('[i]', '<em>');
        template = template.replace('[/i]', '</em>');

        template = template.replace('[q]', '<blockquote>');
        template = template.replace('[/q]', '</blockquote>');

        return template;
    }
}

customElements.define('add-review', AddReview);