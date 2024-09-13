const RyanLightbox = {
	slideClassName: '.slide',
	currentSlideIndex: 0,
	slides: [],
	lightbox: [],
	lightboxImage: [],

	activeClass: 'lightbox-open',

	open(clickedSlide) {
		this.currentSlideIndex = Array.from(this.slides).indexOf(clickedSlide);

		// if there are slides
		if (this.currentSlideIndex != -1) {
			this.update();
			//this.lightbox.classList.add('visible');
			document.body.classList.add(this.activeClass);
		}
	},

	close() {
		//this.lightbox.classList.remove('visible');
		document.body.classList.remove(this.activeClass);
	},

	changeSlide(direction) {
		this.currentSlideIndex += direction;

		if (this.currentSlideIndex < 0) {
			this.currentSlideIndex = this.slides.length - 1;
		} else if (this.currentSlideIndex >= this.slides.length) {
			this.currentSlideIndex = 0;
		}

		this.update();
	},

	setDescription() {

		const currentSlide = this.slides[this.currentSlideIndex];
		const info = currentSlide.querySelector('.meta');
		const description = this.lightbox.querySelector('.description');
		description.innerHTML = info ? info.innerHTML : '';
	},

	setImage() {
		const currentSlide = this.slides[this.currentSlideIndex];
		const imgSrc = currentSlide.querySelector('img').src;
		this.lightboxImage.src = imgSrc;
	},

	updateStatus() {
		const currentSpan = this.lightbox.querySelector('.status .current');
		const totalSpan = this.lightbox.querySelector('.status .total');
		const totalSlides = this.slides.length;

		currentSpan.textContent = this.currentSlideIndex + 1; // Adding 1 to display human-readable index
		totalSpan.textContent = totalSlides;
	},

	update() {
		this.setDescription();
		this.setImage();
		this.updateStatus();
	},

	addClickEventToSlides() {
		const slideElements = document.querySelectorAll(this.slideClassName);
		slideElements.forEach(slide => {
			if (slide.classList.contains('duplicate')) {
				// this is a duplicated marquee element
				var index = Array.prototype.indexOf.call(slide.parentNode.children, slide);
				var original = slide.parentNode.parentNode.children[0].children[index];
				slide.addEventListener('click', () => this.open(original));
			} else {
				slide.addEventListener('click', () => this.open(slide));
			}
		});
	},

	addClickEventsToControls() {
		const closeBtn = this.lightbox.querySelector('.lightbox-close');
		const prevBtn = this.lightbox.querySelector('.lightbox-prev');
		const nextBtn = this.lightbox.querySelector('.lightbox-next');

		closeBtn.addEventListener('click', () => this.close());
		prevBtn.addEventListener('click', () => this.changeSlide(-1));
		nextBtn.addEventListener('click', () => this.changeSlide(1));
	},


	handleKeyDown: function (event) {
		if (this.isActive()) {
			if (event.key === 'Escape') {
				this.close();
			} else if (event.key === 'ArrowLeft') {
				this.changeSlide(-1);
			} else if (event.key === 'ArrowRight') {
				this.changeSlide(1);
			}
		}
	},

	isActive: function () {
		return document.body.classList.contains(this.activeClass);
	},

	handleResize: function () {
		this.slides = this.getSlides();
	},

	getSlides: function(){

		const slides = document.querySelectorAll(`${this.slideClassName}:not(.duplicate)`);
		
		// dont return it if it has a click through
		const filteredSlides = Array.from(slides).filter(slide => !slide.querySelector('a.wrapper'));

		return filteredSlides;

		//return document.querySelectorAll(`${this.slideClassName}:not(.duplicate)`);
	},

	init() {

		if(document.getElementById('lightbox')){
			this.slides = this.getSlides();
			this.lightbox = document.querySelector('.lightbox');
			this.lightboxImage = document.getElementById('lightbox-image');
	
			this.addClickEventToSlides();
			this.addClickEventsToControls();
	
			// Add keydown event listener to the document
			document.addEventListener('keydown', this.handleKeyDown.bind(this));
	
			//resize
			window.addEventListener('resize', this.handleResize.bind(this));
	
			// click content to close
			// this.lightboxImage.addEventListener('click', () => this.close());
		}


	}
};