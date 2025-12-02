// Navigation Slide Effect
// $("#nav a").on("click", function () {
//     var position = $(this).parent().position();
//     var width = $(this).parent().width();
//     $("#nav .slide1").css({
//         opacity: 1,
//         left: +position.left,
//         width: width
//     });
// });

// $("#nav a").on("mouseover", function () {
//     var position = $(this).parent().position();
//     var width = $(this).parent().width();
//     $("#nav .slide2").css({
//         opacity: 1,
//         left: +position.left,
//         width: width
//     }).addClass("squeeze");
// });

// $("#nav a").on("mouseout", function () {
//     $("#nav .slide2")
//         .css({ opacity: 0 })
//         .removeClass("squeeze");
// });

// var currentWidth = $("#nav li:nth-of-type(3) a").parent("li").width();
// var current = $("#nav li:nth-of-type(3) a").position();

// $("#nav .slide1").css({
//     left: +current.left,
//     width: currentWidth
// });

const navLinks = document.querySelectorAll('#nav li a');
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 120)) {
            const id = section.getAttribute('id');
            if (id) {
                current = id;
            }
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active-link');
        }
    });
});

// Navigation opacity on scroll
window.addEventListener('scroll', function () {
    var siteHeader = document.querySelector('.site-header');
    if (window.scrollY > 100) {
        siteHeader.classList.add('nav-transparent');
    } else {
        siteHeader.classList.remove('nav-transparent');
    }
});

document.querySelectorAll('.marker').forEach(marker => {
    const rawText = marker.getAttribute('data-building');

    if (rawText) {
        const cleanText = rawText.replace(/-/g, ' ');
        marker.setAttribute('data-label', cleanText);
    }
});

const markers = document.querySelectorAll('.marker');
const modals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.close');

// Open Modal
markers.forEach(marker => {
    marker.addEventListener('click', () => {
        const id = marker.getAttribute('data-building');
        const modal = document.getElementById(id);

        if (modal) {
            modal.style.display = "block";
        } else {
            console.log("No modal found for ID: " + id);
        }
    });
});

// Close Modal (X button)
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = "none";
    });
});

// Close Modal (Click outside)
window.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
});

function switchFloor(evt, contentId, imageId) {
    document.querySelectorAll('.floor-content').forEach(c => c.classList.remove('selected'));
    document.getElementById(contentId).classList.add('selected');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('selected'));
    evt.currentTarget.classList.add('selected');
    document.getElementById('hero-stack').classList.add('active-mode');
    document.querySelectorAll('.hero-highlight').forEach(img => img.classList.remove('active'));
    const targetImg = document.getElementById(imageId);
    if (targetImg) {
        targetImg.classList.add('active');
    }
}

window.onload = function () {
    const hero = document.getElementById('hero-stack');
    const imgL1 = document.getElementById('img-L1');

    if (hero) hero.classList.add('active-mode');
    if (imgL1) imgL1.classList.add('active');
};

// Slider
class Slider {
    constructor(slider) {
        this.slider = slider;
        this.display = slider.querySelector('.image-display');
        this.navButton = Array.from(slider.querySelectorAll('.nav-button'));
        this.prevButton = slider.querySelector('.prev-button');
        this.nextButton = slider.querySelector('.next-button');
        this.sliderNavigation = slider.querySelector('.slider-navigation');

        // Get the Facility Text elements (Next to the slider)
        this.detailsContainer = slider.closest('.facility').querySelector('.facility-details');
        this.titleElement = this.detailsContainer.querySelector('#facility-title');
        this.descElement = this.detailsContainer.querySelector('#facility-desc');

        this.currentIndex = 0;
        this.preloadedImages = {};

        // AUTOMATION CONFIG
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; // Change slide every 4 seconds

        this.initialize();
    }

    initialize() {
        this.preloadImages();
        this.setupSlider();
        this.eventListeners();
        this.startAutoPlay(); // Start automation
    }

    setupSlider() {
        this.showSliderImage(this.currentIndex);
    }

    showSliderImage(index) {
        this.currentIndex = index;

        // 1. Update Image
        const navButtonImg = this.navButton[this.currentIndex].querySelector('img');
        if (navButtonImg) {
            const imgClone = navButtonImg.cloneNode(true);

            // Add fade animation class
            imgClone.classList.add('animate-fade');

            this.display.replaceChildren(imgClone);

            // Remove animation class after it finishes
            setTimeout(() => {
                imgClone.classList.remove('animate-fade');
            }, 800);
        }

        // 2. Update Text
        this.updateTextContent(index);

        // 3. Update Nav Buttons
        this.updateNavButtons();
    }

    updateTextContent(index) {
        const button = this.navButton[index];
        const newTitle = button.getAttribute('data-title');
        const newDesc = button.getAttribute('data-desc');

        // Add fade-out class to text container
        this.detailsContainer.classList.add('text-fade-out');

        // Wait 400ms (halfway through transition), swap text, then fade in
        setTimeout(() => {
            if (this.titleElement) this.titleElement.textContent = newTitle || "Facility";
            if (this.descElement) this.descElement.textContent = newDesc || "";

            this.detailsContainer.classList.remove('text-fade-out');
        }, 400);
    }

    updateNavButtons() {
        this.navButton.forEach((button, buttonIndex) => {
            const isSelected = buttonIndex === this.currentIndex;
            button.setAttribute('aria-selected', isSelected);
        });
    }

    preloadImages() {
        this.navButton.forEach(button => {
            const img = button.querySelector('img');
            if (img && img.src && !this.preloadedImages[img.src]) {
                this.preloadedImages[img.src] = new Image();
                this.preloadedImages[img.src].src = img.src;
            }
        });
    }

    /* --- AUTOMATION LOGIC --- */
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.handleAction('next');
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    eventListeners() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.resetAutoPlay();
            this.handleAction(e.key);
        });

        // Thumbnail Click
        this.sliderNavigation.addEventListener('click', (e) => {
            const targetButton = e.target.closest('.nav-button');
            const index = targetButton ? this.navButton.indexOf(targetButton) : -1;
            if (index !== -1) {
                this.resetAutoPlay();
                this.showSliderImage(index);
            }
        });

        // Arrow Clicks
        this.prevButton.addEventListener('click', () => {
            this.resetAutoPlay();
            this.handleAction('prev');
        });
        this.nextButton.addEventListener('click', () => {
            this.resetAutoPlay();
            this.handleAction('next');
        });

        // Pause on Hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    handleAction(action) {
        if (action === 'Home') this.currentIndex = 0;
        else if (action === 'End') this.currentIndex = this.navButton.length - 1;
        else if (action === 'ArrowRight' || action === 'next') {
            this.currentIndex = (this.currentIndex + 1) % this.navButton.length;
        } else if (action === 'ArrowLeft' || action === 'prev') {
            this.currentIndex = (this.currentIndex - 1 + this.navButton.length) % this.navButton.length;
        }
        this.showSliderImage(this.currentIndex);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const sliderElement = document.querySelector('.image-slider');
    if (sliderElement) {
        new Slider(sliderElement);
    }
});

// Scroll to Top Button
function scrollToTop() {
    const duration = 2000;
    const start = window.scrollY;
    const startTime = performance.now();

    function scroll(currentTime) {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        window.scrollTo(0, start * (1 - ease));

        if (timeElapsed < duration) {
            requestAnimationFrame(scroll);
        }
    }

    requestAnimationFrame(scroll);
}
window.addEventListener('scroll', function () {
    var scrollBtn = document.querySelector('.scroll-btn');
    if (window.scrollY > 200) {
        scrollBtn.classList.add('show');
    } else {
        scrollBtn.classList.remove('show');
    }
});

// why the hub card loading
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('cardTrack');
    const nextBtn = document.getElementById('nextBtn');

    let isAnimating = false;

    function getSlideWidth() {
        const firstCard = track.firstElementChild;
        const style = window.getComputedStyle(firstCard);
        return firstCard.offsetWidth + 30;
    }

    nextBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        const slideWidth = getSlideWidth();

        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${slideWidth}px)`;

        track.addEventListener('transitionend', () => {
            track.style.transition = 'none';
            track.appendChild(track.firstElementChild);
            track.style.transform = 'translateX(0)';

            setTimeout(() => {
                isAnimating = false;
            }, 50);

        }, { once: true });
    });
});

//Business Suites Tab Switching
document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');

            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
});

// Fade In Animation
// Scroll Animation Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Stop watching after it's revealed (runs once)
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-on-scroll').forEach((element) => {
    observer.observe(element);
});

// Youtube Autoplay while scrolling
document.addEventListener("DOMContentLoaded", function () {
    const videoContainer = document.querySelector('.video-container');
    const iframe = videoContainer ? videoContainer.querySelector('.video-frame') : null;

    if (videoContainer && iframe) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                } else {
                    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                }
            });
        }, {
            threshold: 0.5 
        });
        videoObserver.observe(videoContainer);
    }
});

// Menu Toggle
// Mobile Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        
        menuToggle.addEventListener('click', () => {
            // Toggles the CSS class 'menu-open' to slide the menu into view
            mainNav.classList.toggle('menu-open');
            
            // Update accessibility attribute
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Optional: Prevent the body from scrolling when the menu is open
            document.body.classList.toggle('lock-scroll');
        });
        
        // Optional: Close menu when a link is clicked (good for single-page sites)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('menu-open');
                menuToggle.setAttribute('aria-expanded', false);
                document.body.classList.remove('lock-scroll');
            });
        });
    }
});