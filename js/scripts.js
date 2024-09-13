function checkAllImagesLoaded(selector, callback, timeout = 5000) {
    var images = document.querySelectorAll(selector);
    var loadedImagesCount = 0;
    var timeoutReached = false;

    function imageLoaded() {
        loadedImagesCount++;
        if (!timeoutReached && loadedImagesCount === images.length) {
            // All images have loaded, call the callback
            callback();
        }
    }

    function imageError() {
        if (!timeoutReached) {
            timeoutReached = true;
            // Handle error (optional)
            console.error('Error loading image');
            // Call the callback if timeout is reached
            callback();
        }
    }

    // Loop through each image and attach load and error event listeners
    images.forEach(function (image) {
        if (image.complete) {
            // Image is already loaded
            imageLoaded();
        } else {
            // Image is not loaded, attach load event listener
            image.addEventListener('load', imageLoaded);
            // Attach error event listener
            image.addEventListener('error', imageError);
        }
    });

    // Timeout mechanism
    setTimeout(function () {
        if (loadedImagesCount < images.length) {
            timeoutReached = true;
            // Handle timeout (optional)
            console.error('Image loading timeout reached');
            // Call the callback if timeout is reached
            callback();
        }
    }, timeout);
};

/* document.ondblclick = function(e) {
	e.preventDefault();
} */


const elementIsVisibleInViewport = (ele) => {
	const { top, bottom } = ele.getBoundingClientRect();
	const vHeight = (window.innerHeight || document.documentElement.clientHeight);

	return (
		(top > 0 || bottom > 0) &&
		top < vHeight
	);
}

var FilterButtonManager = {
	checkboxId: "reveal-filter-btn",
	filterOpenClass: "filter-open",
	scrollThresholdNav: .75 * window.innerHeight,
	filterWrapperID: "filter-wrapper",
	portfolioID: "portfolio",

	handleScroll: function () {
		var checkbox = document.getElementById(this.checkboxId);
		var filterWrapper = document.getElementById(this.filterWrapperID);
		var label = document.querySelector('label[for="' + this.checkboxId + '"]');
		var portfolioElement = document.getElementById(this.portfolioID);

		if (checkbox && filterWrapper && label && portfolioElement) {
			var isPortfolioVisible = elementIsVisibleInViewport(portfolioElement);

			if (isPortfolioVisible) {
				label.classList.add('visible');
				filterWrapper.classList.add('visible');
			} else {
				label.classList.remove('visible');
				filterWrapper.classList.remove('visible');
			}
		}
	},

	close: function () {
		checkbox.checked = false;
		document.body.classList.remove(this.filterOpenClass);
	},


	handleCheckboxClick: function () {

		var checkbox = document.getElementById(this.checkboxId);


		console.log(this.filterOpenClass);
		if (checkbox && checkbox.checked) {
			document.body.classList.add(this.filterOpenClass);
		} else {
			document.body.classList.remove(this.filterOpenClass);
		}
	},


	init: function () {
		var checkbox = document.getElementById(this.checkboxId);
		if (checkbox) {
			window.addEventListener('scroll', this.handleScroll.bind(this));
			checkbox.addEventListener("click", this.handleCheckboxClick.bind(this));
			document.body.addEventListener("touchstart", this.handleCheckboxClick.bind(this));
		}
	}
};

var NavManager = {

	navCheck: document.getElementById('nav-check'),
	openNavClass: 'nav-open',
	scrollTopClass: 'scrolled-past-top',
	menuLinkSelector: '.layout > .header > .nav > .nav-links > a',
	scrollThresholdNav: .75 * window.innerHeight,
	scrollToTopBtn: document.getElementById("scroll-btn"),

	scrollToTop: function () {
		// Scroll to top logic
		document.documentElement.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	},

	determineIfMobile: function () {
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;
		var classesToAdd;

		if (/windows phone|Mobile/i.test(userAgent)) {
			classesToAdd = 'windows mobile';
		} else if (/android|Mobile/i.test(userAgent)) {
			classesToAdd = 'android mobile';
		} else if (/iPad|iPhone|iPod|Mobile/.test(userAgent) && !window.MSStream) {
			classesToAdd = 'ios mobile';
		} else {
			classesToAdd = 'desktop';
		}

		document.body.classList.add(...classesToAdd.split(' '));
	},


	handleMenuScroll: function () {
		var scrollPosition = window.scrollY;
		if (scrollPosition > this.scrollThresholdNav) {
			document.body.classList.add(this.scrollTopClass);
		} else {
			document.body.classList.remove(this.scrollTopClass);
		}

	},

	handleTopButtonScroll: function () {
		var scrollPosition = window.scrollY;
		if (scrollPosition > this.scrollThresholdNav) {
			this.scrollToTopBtn.classList.add('visible');
		} else {
			this.scrollToTopBtn.classList.remove('visible');
		}
	},

	handleCheckboxChange: function () {
		if (this.navCheck.checked) {
			document.body.classList.add(this.openNavClass);
			//this.addEventListenersForMenu();
		} else {
			document.body.classList.remove(this.openNavClass);
			//this.removeEventListenersForMenu();
		}
	},

	handleResize: function () {
		this.closeMenu();
	},

	addEventListenersForMenu: function () {
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
		// document.addEventListener('click', this.handleDocumentClick.bind(this));
	},

	removeEventListenersForMenu: function () {
		document.removeEventListener('keydown', this.handleKeyDown.bind(this));
		// document.removeEventListener('click', this.handleDocumentClick.bind(this));
	},

	handleKeyDown: function (event) {
		if (this.isMenuActive() && event.key === 'Escape') {
			this.closeMenu();
		}
	},

	isMenuActive: function () {
		return this.navCheck.checked;
	},

	handleDocumentClick: function (event) {
		var target = event.target;

		if (this.isMenuActive() == true) {

			if (target == this.navCheck) {
				event.stopPropagation();
			}

			// Check if the menu is open and the clicked element is not within the menu links
			if (!target.closest(this.menuLinkSelector)) {
				this.closeMenu();
			}
		}
	},

	closeMenu: function () {
		this.navCheck.checked = false;
		document.body.classList.remove(this.openNavClass);
		// this.removeEventListenersForMenu();
	},

	init: function () {


		// menu

		window.addEventListener('scroll', this.handleMenuScroll.bind(this));

		this.navCheck.addEventListener('change', this.handleCheckboxChange.bind(this));
		window.addEventListener('resize', this.handleResize.bind(this));
		this.addEventListenersForMenu();

		// mobile
		this.determineIfMobile();

		// scroll button
		if (this.scrollToTopBtn) {
			this.scrollToTopBtn.addEventListener("click", this.scrollToTop);
			this.scrollToTopBtn.addEventListener("touchstart", this.scrollToTop);
			window.addEventListener('scroll', this.handleTopButtonScroll.bind(this));
		}

	}
};

var MarqueeManager = {
	resizeTimeout: null,

	// vars
	defaultDirection: "left",
	defaultSpeed: 1,
	defaultRepeat: false,
	defaultPause: false,

	init: function () {
		checkAllImagesLoaded('.marquee img', () => {
			console.log('marquees loaded')
			this.addClasses();
			this.repeatMarqueeContent();
		});
	},

	// general functions
	toBoolean: function (myValue) {
		return String(myValue).toLowerCase() === 'true';
	},

	debounce: function (func, delay) {
		clearTimeout(this.resizeTimeout);
		this.resizeTimeout = setTimeout(func, delay);
	},


	// vars
	isRepeat: function (element) {
		return this.toBoolean(element.getAttribute('data-repeat') || this.defaultRepeat);
	},

	isPause: function (element) {
		return this.toBoolean(element.getAttribute('data-pause') || this.defaultPause);
	},

	isHorizontal: function (element) {
		const direction = element.getAttribute('data-direction') || this.defaultDirection;
		return this.toBoolean(direction === 'left' || direction === 'right');
	},

	getDirection: function (element) {
		return element.getAttribute('data-direction') || this.defaultDirection;
	},

	getSpeed: function (element) {
		return parseFloat(element.getAttribute('data-speed')) || this.defaultSpeed;
	},

	addClasses: function () {
		const elements = document.querySelectorAll('.marquee');
		elements.forEach((element) => {
			if (this.isPause(element)) {
				element.classList.add("hover-pause");
			}
			if (this.isRepeat(element)) {
				element.classList.add("repeat");
			}
			const direction = this.getDirection(element);
			if (direction) {
				element.classList.add(direction);
			}
		});
	},

	resizeMarquee: function () {
		this.resetMarquee();
		this.repeatMarqueeContent();
	},

	/*
	repeatContent: function (element, repetitions) {
		const originalContent = element.innerHTML;
		const repeatedContent = originalContent.repeat(repetitions);
		element.innerHTML = repeatedContent;
	},
	*/

	repeatContent: function (element, repetitions) {
		const originalContent = element.innerHTML;
		const repeatedContent = originalContent.repeat(repetitions - 1);

		// Create a temporary element to hold the repeated content
		const tempElement = document.createElement('div');
		tempElement.innerHTML = repeatedContent;

		// Get all .slide elements in the temporary element
		const slideElements = tempElement.querySelectorAll('.slide');

		// Add the class .dupe to each .slide element
		slideElements.forEach(slide => {
			slide.classList.add('duplicate');
		});

		// Add aria-hidden to the top-level repeated elements
		const topLevelElements = tempElement.children;
		for (let i = 0; i < topLevelElements.length; i++) {
			topLevelElements[i].setAttribute('aria-hidden', 'true');
		}

		// Set the element's innerHTML to the updated content
		element.innerHTML += tempElement.innerHTML;
	},

	calculateRepetitions: function (element) {
		const elementWidth = element.offsetWidth;
		const childElementWidth = element.children[0].offsetWidth;
		return Math.ceil(elementWidth / childElementWidth) + 1;
	},

	repeatMarqueeContent: function () {
		const elements = document.querySelectorAll('.marquee');
		elements.forEach((element) => {
			const repetitions = this.calculateRepetitions(element);
			const speed = this.isRepeat(element) ? this.getSpeed(element) * 2 : this.getSpeed(element);


			const contentWidth = element.children[0].offsetWidth * repetitions;
			const distance = contentWidth + document.body.scrollWidth;
			const animationDuration = speed * distance;


			element.querySelector('.marquee_content').style.animationDuration = animationDuration + 'ms';

			if (this.isRepeat(element) && this.isHorizontal(element)) {
				this.repeatContent(element, repetitions);
			}
		});
	},

	resetMarquee: function () {
		const elements = document.querySelectorAll('.marquee');
		elements.forEach((element) => {
			const children = element.children;
			for (let i = children.length - 1; i > 0; i--) {
				element.removeChild(children[i]);
			}
		});
	}
};

var HeroVideoManager = {
	init: function () {
		this.iframeWrapper = document.getElementById('heroVideo');
		if (this.iframeWrapper) {
			this.iframe = this.iframeWrapper.querySelector('iframe');
			if (this.iframe) {
				this.initializePlayer();
			}
		}
	},

	initializePlayer: function () {
		var self = this;
		var player = new Vimeo.Player(self.iframe);

		// Play the video
		player.play().then(function () {
			console.log('Video is playing');

			// Set an interval to check if the video has started
			var interval = setInterval(function () {
				player.getCurrentTime().then(function (currentTime) {
					// Check if the video has started (reached 0:00)
					if (currentTime >= 0) {
						// Pause the video
						player.pause().then(function () {
							console.log('Video paused at 0:00');
							self.iframeWrapper.classList.add('active');
							player.play();
							// Perform any additional actions here
							clearInterval(interval); // Stop the interval
						}).catch(function (error) {
							console.error('Unable to pause the video:', error);
						});
					}
				});
			}, 50); // Check every 50 milliseconds
		}).catch(function (error) {
			console.error('Unable to play the video:', error);
		});
	}
};

var MasonryManager = {
	gridSelector: '.masonry.grid',
	itemSelector: '.grid-item:not(.hidden)',
	columnWidthSelector: '.grid-sizer',
	gutterSelector: '.grid-gutter',

	// filter
	filterViewAllID: 'viewAllCheckbox',
	filterID: 'filter',
	filterCheckboxSelector: '#filter .checkbox',
	filterSlidesSelector: '#portfolio .slide',
	filterTagAttribute: 'data-tag',
	filterSlideTagsAttribute: 'data-tags',


	portfolioID: 'portfolio',
	headerID: 'header',
	filterTotalID: 'filter_total',

	init: function () {
		this.grid = document.querySelector(this.gridSelector);
		if (this.grid && typeof Masonry !== 'undefined') {

			this.msnry = new Masonry(this.grid, {
				itemSelector: this.itemSelector,
				columnWidth: this.columnWidthSelector,
				gutter: this.gutterSelector,
				stagger: 30
			});


			checkAllImagesLoaded('#portfolio img', () => {
				console.log('masonry loaded')
				MasonryManager.msnry.layout();
			});



			// filter
			this.initFilter();
			this.checkFilterURLParameters();
		}

	},

	initFilter: function () {
		const checkboxes = document.querySelectorAll(this.filterCheckboxSelector);

		checkboxes.forEach(checkbox => {
			checkbox.addEventListener('change', this.handleCheckboxChange.bind(this, checkbox));
		});
	},

	handleCheckboxChange: function (checkbox, event) {
		const viewAllCheckbox = document.getElementById(this.filterViewAllID);
		const checkboxes = document.querySelectorAll(this.filterCheckboxSelector);

		if (viewAllCheckbox.checked) {
			// If "View All" is checked, uncheck all other checkboxes
			checkboxes.forEach(otherCheckbox => {
				if (otherCheckbox !== checkbox) {
					otherCheckbox.checked = false;
				}
			});
		} else {
			// If "View All" is not checked, check it if all other checkboxes are unchecked
			const allUnchecked = Array.from(checkboxes).every(otherCheckbox => !otherCheckbox.checked);
			viewAllCheckbox.checked = allUnchecked;
		}

		// Set the data-count attribute of #filter_total
		var filterTotalElement = document.getElementById(this.filterTotalID);
		var checkedCount = this.countCheckedCheckboxes();
		if (filterTotalElement) {
			filterTotalElement.setAttribute('data-count', checkedCount);
		}

		MasonryManager.toggleSlides();

		this.scrollToTopOfPortfolio();


	},

	countCheckedCheckboxes: function () {
		// Assuming you have a reference to the #filter element
		var filterElement = document.getElementById(this.filterID);

		// Get all checkboxes inside #filter that do not have the id #viewAllCheckbox
		var checkboxes = filterElement.querySelectorAll(this.filterCheckboxSelector + ':not(#' + this.filterViewAllID + ')');

		// Count the checked checkboxes
		var checkedCount = 0;
		checkboxes.forEach(function (checkbox) {
			if (checkbox.checked) {
				checkedCount++;
			}
		});

		return checkedCount; // You can return the count if needed
	},

	scrollToTopOfPortfolio: function () {
		// Smooth scroll to the top of the #portfolio element
		const portfolioElement = document.getElementById(this.portfolioID);
		if (portfolioElement) {
			// Get the scroll-padding-top value from the HTML tag

			window.scrollTo({
				top: portfolioElement.offsetTop - document.getElementById(this.headerID).offsetHeight,
				behavior: 'smooth'
			});
		}
	},

	checkFilterURLParameters: function () {
		// Get the URL query parameter 'filter'
		const urlParams = new URLSearchParams(window.location.search);
		var filterParam = urlParams.get('filter');

		if (!filterParam) {
			const regexFilter = /filter\/([^\/\\#]+)/;
			const decodedUrl = decodeURI(window.location.href).replace('-', ' ');
			const match = decodedUrl.match(regexFilter);

			filterParam = match ? match[1] : null;
		}


		var count = 0;

		if (filterParam) {
			// Split the comma-separated values
			const filterValues = filterParam.split(',');

			// Loop through checkboxes and check those with matching data-tag
			const checkboxes = document.querySelectorAll(this.filterCheckboxSelector);
			checkboxes.forEach(checkbox => {
				const dataTag = checkbox.getAttribute(this.filterTagAttribute);
				//if (filterValues.includes(dataTag)) {
				if (filterValues.map(value => value.toLowerCase()).includes(dataTag.toLowerCase())) {
					checkbox.checked = true;
					count++;
				}
			});

			// if we changed something
			if (count) {
				const viewAllCheckbox = document.getElementById(this.filterViewAllID);
				viewAllCheckbox.checked = false;

				this.toggleSlides();

			}

		}
	},

	toggleSlides: function () {
		const viewAllCheckbox = document.getElementById(this.filterViewAllID);
		const slides = document.querySelectorAll(this.filterSlidesSelector);
		const selectedTags = Array.from(document.querySelectorAll(this.filterCheckboxSelector + ':checked')).map(checkbox => checkbox.getAttribute(this.filterTagAttribute));

		slides.forEach(slide => {
			const tagsAttribute = slide.getAttribute(this.filterSlideTagsAttribute);
			const tags = tagsAttribute ? tagsAttribute.split(',').map(tag => tag.trim().toLowerCase()) : [];

			if (viewAllCheckbox.checked || selectedTags.length === 0 || selectedTags.some(tag => tags.includes(tag.trim().toLowerCase()))) {
				slide.classList.remove('hidden');
			} else {
				slide.classList.add('hidden');
			}
		});

		// reset layout
		MasonryManager.msnry.layout();
	}
};

document.addEventListener("DOMContentLoaded", function () {
	NavManager.init();
	MarqueeManager.init();
	HeroVideoManager.init();
	MasonryManager.init();
	RyanLightbox.init();
	FilterButtonManager.init();
});