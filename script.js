const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelectorAll('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const slideContainer = document.querySelector('.slider');
const spinner = document.querySelector('.lds-ellipsis');

function showSpinner() {
  return (spinner?.style.display = 'block');
}

// Function to hide the spinner
function hideSpinner() {
  return (spinner?.style.display = 'none');
}

///////////////////////////////////////
// Modal window

showSpinner();

const fetchTestimonial = fetchUrl => {
  showSpinner();

  fetch(fetchUrl)
    .then(response => {
      showSpinner();
      // Check if the response status is OK (200).
      if (!response?.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }
      // Parse the JSON response
      return response?.json?.();
    })
    .then(data => {
      hideSpinner();
      // Use the data from the API
      // console.log(data);
      renderTestimonialUi(data);
    })
    .catch(error => {
      // Handle errors
      hideSpinner();
      console.error('Fetch error:', error);
    });
};

const URL = "https://script.google.com/macros/s/AKfycbzhOtNnbKc47y8EBx6CGF6lZE5Ar3Ge30svU0k5HAUF8JYFzoDxbOY8KHLtF0NWiiohTg/exec";
fetchTestimonial(URL.concat('?path=presa'));

function renderTestimonialUi(data) {
  if (!data) return;

  data.forEach(data => {
    const {
      ['dată articol']: date,
      ['tags (separate prin virgulă)']: tags,
      ['titlu Articol']: title,
      ['descriere scurtă articol']: desc,
      ['nume jurnalist']: name,
      ['nume ziar']: newspaper,
      ['link articol']: link,
      ['afisează pe website?']: visible
    } = data;

    if(visible) {
      const divEl = document.createElement('div');
      divEl.classList.add('slide');
      const slideEl = `
      <div class="testimonial">
        <div class="testimonial__details">
          <span class="testimonial__date">${new Date(date).toLocaleDateString('ro')}</span>
          <div className="testimonial__tags">
          ${tags
            .split(',')
            .map(item => `<span class="testimonial__type">${item.trim()}</span>`)
            .join(' ')}
            </div>
        </div>
        <h5 class="testimonial__header">${title}</h5>
        <blockquote class="testimonial__text">
          ${desc}
        </blockquote>
        <address class="testimonial__author">
          <h6 class="testimonial__name">${name}</h6>
          <p class="testimonial__location"><a class="location-link" href=${link} target="_blank">${newspaper}</a></p>
        </address>
    </div> 
    `;
      // console.log(divEl.className);
      divEl.innerHTML = slideEl;
      slideContainer.prepend(divEl);
    }
  });

  const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  ///////////////////////////////////////
  // Button scrolling
  btnScrollTo.forEach(btn =>
    btn.addEventListener('click', function (e) {
      section1.scrollIntoView({ behavior: 'smooth' });
    })
  );
  document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();

    // Matching strategy
    if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });

  ///////////////////////////////////////
  // Tabbed component

  tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');

    // Guard clause
    if (!clicked) return;

    // Remove active classes
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));

    // Activate tab
    clicked.classList.add('operations__tab--active');

    // Activate content area
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });

  ///////////////////////////////////////
  // Menu fade animation
  const handleHover = function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');

      siblings.forEach(el => {
        if (el !== link) el.style.opacity = this;
      });
      logo.style.opacity = this;
    }
  };

  // Passing "argument" into handler
  nav.addEventListener('mouseover', handleHover.bind(0.5));
  nav.addEventListener('mouseout', handleHover.bind(1));

  ///////////////////////////////////////
  // Sticky navigation: Intersection Observer API

  const header = document.querySelector('.header');
  const navHeight = nav.getBoundingClientRect().height;

  const stickyNav = function (entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  };

  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });

  headerObserver.observe(header);

  ///////////////////////////////////////
  // Reveal sections
  const allSections = document.querySelectorAll('.section');

  const revealSection = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });

  allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
  });

  // Lazy loading images
  const imgTargets = document.querySelectorAll('img[data-src]');

  const loadImg = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  };

  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  });

  imgTargets.forEach(img => imgObserver.observe(img));

  /////////////////////////////////////

  const slider = function () {
    const slides = slideContainer.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');

    let curSlide = 0;
    const maxSlide = slides.length;

    // Functions
    const createDots = function () {
      slides.forEach(function (_, i) {
        dotContainer.insertAdjacentHTML(
          'beforeend',
          `<button class="dots__dot" data-slide="${i}"></button>`
        );
      });
    };

    const activateDot = function (slide) {
      document
        .querySelectorAll('.dots__dot')
        .forEach(dot => dot.classList.remove('dots__dot--active'));

      document
        .querySelector(`.dots__dot[data-slide="${slide}"]`)
        .classList.add('dots__dot--active');
    };

    const goToSlide = function (slide) {
      slides.forEach(
        (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
      );
    };

    // Next slide
    const nextSlide = function () {
      if (curSlide === maxSlide - 1) {
        curSlide = 0;
      } else {
        curSlide++;
      }

      goToSlide(curSlide);
      activateDot(curSlide);
    };

    const prevSlide = function () {
      if (curSlide === 0) {
        curSlide = maxSlide - 1;
      } else {
        curSlide--;
      }
      goToSlide(curSlide);
      activateDot(curSlide);
    };

    const init = function () {
      goToSlide(0);
      createDots();

      activateDot(0);
    };
    init();

    // Event handlers
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') prevSlide();
      e.key === 'ArrowRight' && nextSlide();
    });

    dotContainer.addEventListener('click', function (e) {
      if (e.target.classList.contains('dots__dot')) {
        const { slide } = e.target.dataset;
        goToSlide(slide);
        activateDot(slide);
      }
    });
  };
  slider();
}

document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementsByClassName('toggleButton');

  const hiddenContent = document.querySelectorAll('.hidden-text');
  const [content1, content2] = [...hiddenContent];

  [...toggleButton].forEach(btn =>
    btn.addEventListener('click', function () {
      if (
        content2.classList.contains('hidden-text') ||
        content1.classList.remove('hidden-text')
      ) {
        content2.classList.remove('hidden-text');
        content1.classList.remove('hidden-text');
        btn.textContent = 'Read Less';
        dot.style.display = 'none';
      } else {
        content2.classList.add('hidden-text');
        content1.classList.add('hidden-text');
        btn.textContent = 'Read More';
        dot.style.display = 'inline';
      }
    })
  );
});

const menu = document.querySelector('.nav__links-m');
const toggleButton = document.getElementById('toggleButton-close');

// Add a click event listener to the toggle button
toggleButton.addEventListener('click', function () {
  // Toggle the visibility of the menu
  if (menu.classList.contains('nav__links-m--close')) {
    menu.classList.remove('nav__links-m--close');

    const newSVGContentClose = `
     <svg
            class="btn-close__icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            id="cancel"
          >
            <path
              d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
            />
          </svg>
    `;

    while (toggleButton.firstChild) {
      toggleButton.removeChild(toggleButton.firstChild);
    }
    // Step 4: Append the new SVG content to the parent element
    toggleButton.innerHTML = newSVGContentClose;
  } else {
    menu.classList.add('nav__links-m--close');

    // Step 1: Create or load the new SVG content
    const newSVGContentMenu = `<img class="dark" id="menu" src="./img/svgs/btn-menu.svg" alt="close button" /><img class="light" id="menu" src="./img/svgs/btn-menu-light.svg" alt="close button light" />`;

    // Step 2: Get a reference to the parent element

    // Step 3: Remove the existing children from the parent element
    while (toggleButton.firstChild) {
      toggleButton.removeChild(toggleButton.firstChild);
    }
    // Step 4: Append the new SVG content to the parent element
    toggleButton.innerHTML = newSVGContentMenu;
  }
});

// Get the current year
const currentYear = new Date().getFullYear();

// Update the copyright year in the HTML
const copyrightYearElement = document.getElementById('copyrightYear');
if (copyrightYearElement) {
  copyrightYearElement.textContent = currentYear;
}
