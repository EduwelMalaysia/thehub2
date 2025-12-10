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

// document.querySelectorAll('.marker').forEach(marker => {
//     const rawText = marker.getAttribute('data-building');

//     if (rawText) {
//         const cleanText = rawText.replace(/-/g, ' ');
//         marker.setAttribute('data-label', cleanText);
//     }
// });

// const markers = document.querySelectorAll('.marker');
// const modals = document.querySelectorAll('.modal');
// const closeBtns = document.querySelectorAll('.close');

// // Open Modal
// markers.forEach(marker => {
//     marker.addEventListener('click', () => {
//         const id = marker.getAttribute('data-building');
//         const modal = document.getElementById(id);

//         if (modal) {
//             modal.style.display = "block";
//         } else {
//             console.log("No modal found for ID: " + id);
//         }
//     });
// });

// // Close Modal (X button)
// closeBtns.forEach(btn => {
//     btn.addEventListener('click', () => {
//         btn.closest('.modal').style.display = "none";
//     });
// });

// // Close Modal (Click outside)
// window.addEventListener('click', function (event) {
//     if (event.target.classList.contains('modal')) {
//         event.target.style.display = "none";
//     }
// });

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

        // updated for dot navigation
        this.navButton = Array.from(slider.querySelectorAll('.nav-dot'));
        this.prevButton = slider.querySelector('.prev-button');
        this.nextButton = slider.querySelector('.next-button');
        this.sliderNavigation = slider.querySelector('.slider-navigation');

        // this.detailsContainer = slider.closest('.facility').querySelector('.facility-details');
        // this.titleElement = this.detailsContainer.querySelector('#facility-title');
        // this.descElement = this.detailsContainer.querySelector('#facility-desc');

        this.currentIndex = 0;
        this.preloadedImages = {};

        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000;

        this.initialize();
    }

    initialize() {
        this.preloadImages();
        this.setupSlider();
        this.eventListeners();
        this.startAutoPlay();
    }

    setupSlider() {
        this.showSliderImage(this.currentIndex);
    }

    showSliderImage(index) {
        this.currentIndex = index;

        // load image from the dot's dataset
        const button = this.navButton[this.currentIndex];
        const imgSrc = button.getAttribute('data-img');

        if (imgSrc) {
            const img = new Image();
            img.src = imgSrc;
            img.classList.add('animate-fade');

            this.display.replaceChildren(img);

            setTimeout(() => img.classList.remove('animate-fade'), 800);
        }

        // this.updateTextContent(index);
        this.updateNavButtons();
    }

    // updateTextContent(index) {
    //     const button = this.navButton[index];
    //     const newTitle = button.getAttribute('data-title');
    //     const newDesc = button.getAttribute('data-desc');

    //     this.detailsContainer.classList.add('text-fade-out');
    //     setTimeout(() => {
    //         this.titleElement.textContent = newTitle || "Facility";
    //         this.descElement.textContent = newDesc || "";
    //         this.detailsContainer.classList.remove('text-fade-out');
    //     }, 400);
    // }

    updateNavButtons() {
        this.navButton.forEach((button, buttonIndex) => {
            button.setAttribute('aria-selected', buttonIndex === this.currentIndex);
        });
    }

    preloadImages() {
        this.navButton.forEach(button => {
            const src = button.getAttribute('data-img');
            if (src && !this.preloadedImages[src]) {
                this.preloadedImages[src] = new Image();
                this.preloadedImages[src].src = src;
            }
        });
    }

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
        // keyboard support
        document.addEventListener('keydown', (e) => {
            this.resetAutoPlay();
            this.handleAction(e.key);
        });

        // dot click
        this.sliderNavigation.addEventListener('click', (e) => {
            const dot = e.target.closest('.nav-dot');
            const index = this.navButton.indexOf(dot);
            if (index !== -1) {
                this.resetAutoPlay();
                this.showSliderImage(index);
            }
        });

        // prev / next
        this.prevButton.addEventListener('click', () => {
            this.resetAutoPlay();
            this.handleAction('prev');
        });
        this.nextButton.addEventListener('click', () => {
            this.resetAutoPlay();
            this.handleAction('next');
        });

        // stop autoplay on hover
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

    function moveNext() {
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
    }

    nextBtn.addEventListener('click', moveNext);
    setInterval(moveNext, 1000);
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

// Youtube Autoplay while scrolling (Updated for local MP4)
document.addEventListener("DOMContentLoaded", function () {
    const videoContainer = document.querySelector('.video-container');
    const videoElement = document.getElementById('localVideoPlayer'); // Targeting the new video ID

    // Check if the video element and its container exist
    if (videoContainer && videoElement) {
        
        // Use Intersection Observer to control video playback
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Check if the video is ready and attempt to play
                    const playPromise = videoElement.play();
                    
                    // Handle potential promise rejection (common if video isn't ready or browser blocks autoplay)
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            // Autoplay was prevented. Muting is already set, but this catch handles other issues.
                            console.log("Autoplay was prevented or failed:", error);
                        });
                    }
                    
                } else {
                    // Pause when the video is out of view
                    videoElement.pause();
                }
            });
        }, {
            // Video plays when 50% of it is visible
            threshold: 0.5 
        });

        // Start observing the video container
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
            mainNav.classList.toggle('menu-open');
            
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            
            document.body.classList.toggle('lock-scroll');
        });
        
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('menu-open');
                menuToggle.setAttribute('aria-expanded', false);
                document.body.classList.remove('lock-scroll');
            });
        });
    }
});
/*************************************************
 * UNIVERSAL ANIMATION ENGINE (ONE OBSERVER)
 *************************************************/
const animate = (selector, options = {}) => {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                // Stagger child animations
                if (options.stagger) {
                    const children = entry.target.querySelectorAll(options.stagger);
                    children.forEach((el, i) => {
                        setTimeout(() => el.classList.add("reveal"), i * (options.delay || 100));
                    });
                }

                entry.target.classList.add("reveal");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: options.threshold || 0.2 });

    elements.forEach(el => observer.observe(el));
};


// Apply universal animations
animate(".fade-on-scroll");

animate(".location-map-visual");
animate(".location-details-wrapper");

animate(".why-hub-card");

animate(".register-card", {
    stagger: ".grid-2, .form-group, label, .submit-btn",
    delay: 120
});

animate(".philosophy-header");
animate(".philosophy-section", {
    stagger: ".pillar-card",
    delay: 150
});

animate(".suite-header");

animate(".business-suites-section", {
    stagger: ".tabs-nav .tab-btn",
    delay: 80
});

// --- 3. ROI Form Dynamic Unit Selection ---

const unitData = {
    "prime-square": {
        "Block A [5-Storey Shop Lot]": [
            "Level 1 (1,400 – 1850 sqft)",
            "Level 2 (1,400 – 3080 sqft)",
            "Level 3 (1,400 – 3080 sqft)",
            "Level 4 (1,400 – 3080 sqft)",
            "Level 5 (6,900 sqft)"
        ],
        "Block B [3-Storey Shop Lot]": [
            "Level 1 (1,640 – 7560 sqft)",
            "Level 2 (2,070 – 3,770 sqft)",
            "Level 3 (2,700 – 3,770 sqft)"
        ]
    },
    "merchant-bay": {
        "Block I [3-Storey Shop Lot]": [
            "Level 1 (2,200 – 4360 sqft)",
            "Level 2 (2,215 – 2550 sqft)",
            "Level 3 (2247 – 2550 sqft)"
        ]
    },
    "central-walk": {
        "Block A7 [3-Storey Shop Lot]": ["Level 1 (1440 – 1690 sqft)", "Level 2 (1440 – 1915 sqft)", "Level 3 (1440 – 1915 sqft)"],
        "Block D [3-Storey Shop Lot]": ["Level 1 (1320 – 1530 sqft)", "Level 2 (1320 – 1530 sqft)", "Level 3 (5465 sqft)"],
        "Block E [3-Storey Shop Lot]": ["Level 1 (1320 – 1530 sqft)", "Level 2 (1320 – 1530 sqft)", "Level 3 (5465 sqft)"],
        "Block F [3-Storey Shop Lot]": ["Level 1 (1440 – 1690 sqft)", "Level 2 (1440 – 1915 sqft)", "Level 3 (1440 – 1915 sqft)"],
        "Block G [3-Storey Shop Lot]": ["Level 1 (1320 – 1530 sqft)", "Level 2 (1320 – 1530 sqft)", "Level 3 (5465 sqft)"],
        "Block H [3-Storey Shop Lot]": ["Level 1 (1320 – 1530 sqft)", "Level 2 (1320 – 1530 sqft)", "Level 3 (5465 sqft)"]
    },
    "parkfront-avenue": {
        "Drive Thru": ["F&B 1 (sqft)", "F&B 2 (sqft)"]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const selectZone = document.getElementById('select-zone');
    const selectBlock = document.getElementById('select-block');
    const selectLevel = document.getElementById('select-level');

    if (!selectZone || !selectBlock || !selectLevel) return;

    // Helper function to reset and disable subsequent dropdowns
    const resetDropdown = (dropdown, defaultText) => {
        dropdown.innerHTML = `<option value="" disabled selected>${defaultText}</option>`;
        dropdown.disabled = true;
        dropdown.value = "";
    };

    // 1. Zone Change Handler (Zone -> Block)
    selectZone.addEventListener('change', () => {
        const selectedZoneKey = selectZone.value;

        // Reset Block and Level
        resetDropdown(selectBlock, 'Select Block *');
        resetDropdown(selectLevel, 'Select Level/Unit *');

        if (selectedZoneKey && unitData[selectedZoneKey]) {
            const blocks = unitData[selectedZoneKey];
            
            // Populate Block dropdown
            for (const blockName in blocks) {
                const option = document.createElement('option');
                option.value = blockName;
                option.textContent = blockName;
                selectBlock.appendChild(option);
            }
            selectBlock.disabled = false;
        }
    });

    // 2. Block Change Handler (Block -> Level)
    selectBlock.addEventListener('change', () => {
        const selectedZoneKey = selectZone.value;
        const selectedBlockName = selectBlock.value;

        // Reset Level
        resetDropdown(selectLevel, 'Select Level/Unit *');

        if (selectedZoneKey && selectedBlockName && unitData[selectedZoneKey] && unitData[selectedZoneKey][selectedBlockName]) {
            const levels = unitData[selectedZoneKey][selectedBlockName];
            
            // Populate Level dropdown
            levels.forEach(levelText => {
                const option = document.createElement('option');
                option.value = levelText;
                option.textContent = levelText;
                selectLevel.appendChild(option);
            });
            selectLevel.disabled = false;
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const banner = document.querySelector(".main-banner");

        const targetY = banner.offsetHeight - window.innerHeight;

        if (targetY <= 0) return;

        smoothScrollTo(targetY, 1500); // 1.5 sec scroll
    }, 3000);
});

// Custom premium smooth scroll
function smoothScrollTo(target, duration) {
    const start = window.scrollY;
    const distance = target - start;
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;

        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Ease-in-out curve (smooth like iPhone animations)
        const ease = progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;

        window.scrollTo(0, start + distance * ease);

        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

document.addEventListener('DOMContentLoaded', () => {
    
    const mapTrigger = document.getElementById('open-full-map');
    const mapModal = document.getElementById('location-map-modal');
    const closeBtnMap = document.querySelector('.close-map-btn');
    const closeBtns = document.querySelectorAll('.close');

    if (mapModal) {
        mapModal.style.display = 'none';
    }

    if (mapTrigger && mapModal) {
        mapTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            mapModal.style.display = 'flex';
        });

        if (closeBtnMap) {
            closeBtnMap.addEventListener('click', () => {
                mapModal.style.display = 'none';
            });
        }
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = "none";
        });
    });

    window.addEventListener('click', function (event) {
        const target = event.target;
        
        if (target === mapModal) {
            target.style.display = "none";
        }
        
        else if (target.classList.contains('modal') && target.id !== 'location-map-modal') {
             target.style.display = "none";
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    
    // --- Floor Plan Tabs Logic (Layered) ---
    const zoneBtns = document.querySelectorAll('.fp-zone-btn');
    const blockGroups = document.querySelectorAll('.fp-block-group');
    const blockBtns = document.querySelectorAll('.fp-block-btn');
    const contentPanes = document.querySelectorAll('.fp-tab-pane');
    const visualPanes = document.querySelectorAll('.fp-visual-pane'); 

    // Helper function to handle active class toggling
    const activateItem = (items, targetId, attribute = 'data-zone') => {
        items.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute(attribute) === targetId || item.id === targetId) {
                 item.classList.add('active');
            }
        });
    };

    // 1. Layer 1 Click Handler (Zone -> Shows Blocks)
    zoneBtns.forEach(zoneBtn => {
        zoneBtn.addEventListener('click', () => {
            const zoneKey = zoneBtn.getAttribute('data-zone');
            
            // 1a. Set Layer 1 Active State
            activateItem(zoneBtns, zoneKey);

            // 1b. Show the corresponding Layer 2 block group and hide others
            blockGroups.forEach(group => {
                group.classList.remove('active');
                group.style.display = 'none';
            }); 
            
            const targetGroup = document.querySelector(`[data-zone-group="${zoneKey}"]`);
            if (targetGroup) {
                targetGroup.classList.add('active');
                targetGroup.style.display = 'flex';
                
                // 1c. Automatically trigger a click on the first block in the new group
                const firstBlockBtn = targetGroup.querySelector('.fp-block-btn');
                if (firstBlockBtn) {
                    firstBlockBtn.click();
                }
            }
        });
    });

    // 2. Layer 2 Click Handler (Block -> Shows Content and Visual)
    blockBtns.forEach(blockBtn => {
        blockBtn.addEventListener('click', () => {
            const blockId = blockBtn.getAttribute('data-block');
            
            // 2a. Set Layer 2 Active State
            activateItem(blockBtns, blockId, 'data-block');

            // 2b. Show Content Pane (if applicable)
            activateItem(contentPanes, blockId, 'id'); 

            // 2c. Show the corresponding Visual Pane
            const visualId = blockId + '-visual';
            visualPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === visualId) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // 3. Initial Load: Ensure the first block/pane is active on load
    const initialBlockBtn = document.querySelector('.fp-block-group.active .fp-block-btn');
    if (initialBlockBtn) {
        initialBlockBtn.click(); 
    }

});


document.querySelectorAll(".marker").forEach(marker => {

    // Set correct preview variable name
    marker.style.setProperty("--preview-img", `url(${marker.dataset.img})`);

    marker.addEventListener("click", () => {

        const zone = marker.dataset.zone;
        const block = marker.dataset.block;

        // highlight zone tab
        document.querySelectorAll(".fp-zone-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.zone === zone);
        });

        // show block group
        document.querySelectorAll(".fp-block-group").forEach(group => {
            group.style.display = group.dataset.zoneGroup === zone ? "flex" : "none";
        });

        // highlight block button
        document.querySelectorAll(".fp-block-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.block === block);
        });

        // show correct floorplan pane
        document.querySelectorAll(".fp-visual-pane").forEach(pane => {
            pane.classList.toggle("active", pane.id === `${block}-visual`);
        });

        // change background color
        updateFloorplanBackground(zone);

        // scroll into view
        document.querySelector("#floorplan").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });
});

/* ==========================================================
   FLOOR PLAN DATA MODEL
   Each Block → Levels → Image → Info
========================================================== */

const FLOORPLAN_DATA = {
    "block-a": {
        title: "Block A",
        info: {
            type: "5-Storey Shop Lot",
            size: "1,400 – 1,850 sqft",
            levels: 5
        },
        levels: {
            "Level 1": "templates/images/blockA-L1.png",
            "Level 2": "templates/images/blockA-L2.png",
            "Level 3": "templates/images/blockA-L3.png",
            "Level 4": "templates/images/blockA-L4.png",
            "Level 5": "templates/images/blockA-L5.png"
        }
    },

    "block-b": {
        title: "Block B",
        info: {
            type: "4-Storey Shop Lot",
            size: "1,300 – 1,900 sqft",
            levels: 4
        },
        levels: {
            "Level 1": "templates/images/blockB-L1.png",
            "Level 2": "templates/images/blockB-L2.png",
            "Level 3": "templates/images/blockB-L3.png",
            "Level 4": "templates/images/blockB-L4.png"
        }
    },

    "block-a7": {
        title: "Block A7",
        info: {
            type: "3-Storey Retail Block",
            size: "1,200 – 1,600 sqft",
            levels: 3
        },
        levels: {
            "Level 1": "templates/images/blockA7-L1.png",
            "Level 2": "templates/images/blockA7-L2.png",
            "Level 3": "templates/images/blockA7-L3.png"
        }
    },

    "block-f": {
        title: "Block F",
        info: {
            type: "Lifestyle Block",
            size: "Retail + F&B Concept",
            levels: 3
        },
        levels: {
            "Level 1": "templates/images/blockF-L1.png",
            "Level 2": "templates/images/blockF-L2.png",
            "Level 3": "templates/images/blockF-L3.png"
        }
    },

    "block-i": {
        title: "Block I (Merchant Bay)",
        info: {
            type: "Retail & Dining Hub",
            size: "Flexible Layout",
            levels: 2
        },
        levels: {
            "Ground Floor": "templates/images/blockI-GF.png",
            "First Floor": "templates/images/blockI-1F.png"
        }
    }
};

/* ==========================================================
    DOM ELEMENTS
========================================================== */

const zoneButtons = document.querySelectorAll(".fp-zone-btn");
const blockSidebar = document.querySelector(".fp-block-list");
const levelTabsContainer = document.querySelector(".fp-level-tabs");
const infoPanel = document.querySelector(".fp-info-panel");
const infoTitle = document.querySelector(".fp-info-title");
const infoDetails = document.querySelector(".fp-info-details");
const visualWrapper = document.querySelector(".fp-visual-pane img");
const ZONE_COLORS = {
    "prime-square": { primary: "#20A2DC", secondary: "#1880AA" }, // Blue
    "central-walk": { primary: "#83BC41", secondary: "#6AA035" }, // Green
    "merchant-bay": { primary: "#E11F27", secondary: "#B5191F" }, // Red
    "cineplex":     { primary: "#662E86", secondary: "#50246A" }, // Purple (Adding a button for this later)
    "parkfront":    { primary: "#E22C7C", secondary: "#C12469" }  // Pink (Adding a button for this later)
};

/* ==========================================================
    STATE MANAGER
========================================================== */

let currentZone = "prime-square";
let currentBlock = null;
let currentLevel = null;


/* ==========================================================
    LOAD BLOCK LIST WHEN ZONE CHANGES
========================================================== */
function setZoneTheme(zone) {
    const color = ZONE_COLORS[zone];
    // 设置 CSS 变量，供 CSS 使用
    document.documentElement.style.setProperty('--zone-color-primary', color.primary);
    document.documentElement.style.setProperty('--zone-color-secondary', color.secondary);
}

function loadBlocksForZone(zone) {

    setZoneTheme(zone);
    blockSidebar.innerHTML = "";

    const zoneBlocks = {
        "prime-square": ["block-a", "block-b"],
        "central-walk": ["block-a7", "block-f", "block-d", "block-e", "block-g", "block-h"],
        "merchant-bay": ["block-i"]
    }[zone];

    zoneBlocks.forEach(blockId => {
        const btn = document.createElement("button");
        btn.textContent = FLOORPLAN_DATA[blockId]?.title || blockId.toUpperCase();
        btn.dataset.block = blockId;

        btn.addEventListener("click", () => selectBlock(blockId));

        blockSidebar.appendChild(btn);
    });

    // Auto select first block
    selectBlock(zoneBlocks[0]);
}


/* ==========================================================
   WHEN A BLOCK IS SELECTED
========================================================== */
function selectBlock(blockId) {
    currentBlock = blockId;

    // Update active button
    document.querySelectorAll(".fp-block-list button").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.block === blockId);
    });

    loadLevelTabs(blockId);
    updateInfoPanel(blockId);

    // Auto-select first level
    const firstLevel = Object.keys(FLOORPLAN_DATA[blockId].levels)[0];
    selectLevel(firstLevel);
}


/* ==========================================================
   LOAD LEVEL TABS FOR BLOCK
========================================================== */
function loadLevelTabs(blockId) {
    levelTabsContainer.innerHTML = "";

    const levels = FLOORPLAN_DATA[blockId].levels;

    Object.keys(levels).forEach(levelName => {
        const btn = document.createElement("button");
        btn.textContent = levelName;
        btn.dataset.level = levelName;

        btn.addEventListener("click", () => selectLevel(levelName));

        levelTabsContainer.appendChild(btn);
    });
}


/* ==========================================================
   SELECT LEVEL → SHOW FLOORPLAN IMAGE
========================================================== */
function selectLevel(levelName) {
    currentLevel = levelName;

    // Update active tab
    document.querySelectorAll(".fp-level-tabs button").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.level === levelName);
    });

    // Load image
    const imgSrc = FLOORPLAN_DATA[currentBlock].levels[levelName];
    visualWrapper.src = imgSrc;
}


/* ==========================================================
   UPDATE BLOCK INFO PANEL
========================================================== */
function updateInfoPanel(blockId) {
    const data = FLOORPLAN_DATA[blockId];
    infoTitle.textContent = data.title;

    infoDetails.innerHTML = `
        <div class="fp-info-item">
            <span class="fp-info-label">Type</span>
            <span class="fp-info-value">${data.info.type}</span>
        </div>

        <div class="fp-info-item">
            <span class="fp-info-label">Level 1 Size</span>
            <span class="fp-info-value">${data.info.size}</span>
        </div>

        <div class="fp-info-item">
            <span class="fp-info-label">Total Levels</span>
            <span class="fp-info-value">${data.info.levels} Floors</span>
        </div>
    `;
}


/* ==========================================================
   ZONE BUTTON CLICK
========================================================== */
zoneButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        zoneButtons.forEach(z => z.classList.remove("active"));
        btn.classList.add("active");

        currentZone = btn.dataset.zone;
        loadBlocksForZone(currentZone);
    });
});


/* ==========================================================
   SITE PLAN MARKER → SYNCHRONIZE WITH FLOORPLAN
========================================================== */
document.querySelectorAll(".marker").forEach(marker => {
    marker.addEventListener("click", () => {
        const block = marker.dataset.block;
        const zone = marker.dataset.zone;

        // Activate correct zone
        document.querySelector(`.fp-zone-btn[data-zone="${zone}"]`)?.click();

        // Select block
        setTimeout(() => selectBlock(block), 200);

        // Scroll into view
        document.querySelector("#floorplan").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});


// function updateFloorplanBackground(zone) {
//     const fp = document.querySelector(".fp-section");

//     fp.classList.remove(
//         "zone-prime-square",
//         "zone-central-walk",
//         "zone-merchant-bay",
//         "zone-cineplex",
//         "zone-parkfront"
//     );

//     fp.classList.add(`zone-${zone}`);
// }
