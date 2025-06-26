const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnScrollTo = document.querySelectorAll('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const slideContainer = document.querySelector('.slider');
const spinner = document.querySelector('.lds-ellipsis');

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

document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel__track');
  let cards = Array.from(track.children);
  const btnNext = document.querySelector('.carousel__btn--right');
  const btnPrev = document.querySelector('.carousel__btn--left');

  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[cards.length - 1].cloneNode(true);

  firstClone.classList.add('clone');
  lastClone.classList.add('clone');

  track.appendChild(firstClone);
  track.insertBefore(lastClone, cards[0]);

  cards = Array.from(track.children);
  let currentIndex = 1;
  let cardWidth = cards[0].offsetWidth;

  const setPosition = () => {
    track.style.transition = 'none';
    track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
  };

  const moveToIndex = index => {
    track.style.transition = 'transform 0.4s ease-in-out';
    track.style.transform = `translateX(-${cardWidth * index}px)`;
  };

  const updateWidth = () => {
    cardWidth = cards[0].offsetWidth;
    setPosition();
  };

  setPosition();

  btnNext.addEventListener('click', () => {
    if (currentIndex >= cards.length - 1) return;
    currentIndex++;
    moveToIndex(currentIndex);
  });

  btnPrev.addEventListener('click', () => {
    if (currentIndex <= 0) return;
    currentIndex--;
    moveToIndex(currentIndex);
  });

  track.addEventListener('transitionend', () => {
    if (cards[currentIndex].classList.contains('clone')) {
      track.style.transition = 'none';
      if (currentIndex === cards.length - 1) {
        currentIndex = 1;
      } else if (currentIndex === 0) {
        currentIndex = cards.length - 2;
      }
      setPosition();
    }
  });

  // ✅ Autoplay
  let autoSlide = setInterval(() => {
    currentIndex++;
    moveToIndex(currentIndex);
  }, 5000);

  const stopAutoplay = () => clearInterval(autoSlide);
  const restartAutoplay = () => {
    stopAutoplay();
    autoSlide = setInterval(() => {
      currentIndex++;
      moveToIndex(currentIndex);
    }, 3000);
  };

  btnNext.addEventListener('click', restartAutoplay);
  btnPrev.addEventListener('click', restartAutoplay);

  // ✅ Touch / swipe support
  let startX = 0;
  let endX = 0;

  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener('touchend', e => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  const handleSwipe = () => {
    const deltaX = startX - endX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        currentIndex++;
      } else {
        currentIndex--;
      }
      moveToIndex(currentIndex);
      restartAutoplay();
    }
  };

  window.addEventListener('resize', updateWidth);
});

document.addEventListener('DOMContentLoaded', () => {
  const slideContainer = document.querySelector('.slider');
  const spinner = document.querySelector('.lds-ellipsis');

  const showSpinner = () => (spinner.style.display = 'block');
  const hideSpinner = () => (spinner.style.display = 'none');

  const URL =
    'https://script.google.com/macros/s/AKfycbzhOtNnbKc47y8EBx6CGF6lZE5Ar3Ge30svU0k5HAUF8JYFzoDxbOY8KHLtF0NWiiohTg/exec';

  fetchTestimonial(URL + '?path=presa');

  function fetchTestimonial(fetchUrl) {
    showSpinner();

    fetch(fetchUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        hideSpinner();
        renderTestimonialUi(data);
      })
      .catch(err => {
        hideSpinner();
        console.error('Fetch error:', err);
      });
  }

  function renderTestimonialUi(data) {
    if (!data) return;

    data.forEach(item => {
      const {
        ['dată articol']: date,
        ['tags (separate prin virgulă)']: tags,
        ['titlu Articol']: title,
        ['descriere scurtă articol']: desc,
        ['nume jurnalist']: name,
        ['nume ziar']: newspaper,
        ['link articol']: link,
        ['afisează pe website?']: visible
      } = item;

      if (!visible) return;

      const divEl = document.createElement('div');
      divEl.classList.add('slide');
      divEl.innerHTML = `
        <div class="testimonial">
          <div class="testimonial__details">
            <span class="testimonial__date">${new Date(date).toLocaleDateString('ro')}</span>
            <div class="testimonial__tags">
              ${tags
                .split(',')
                .map(tag => `<span class="testimonial__type">${tag.trim()}</span>`)
                .join(' ')}
            </div>
          </div>
          <h5 class="testimonial__header">${title}</h5>
          <blockquote class="testimonial__text">${desc}</blockquote>
          <address class="testimonial__author">
            <h6 class="testimonial__name">${name}</h6>
            <p class="testimonial__location"><a class="location-link" href="${link}" target="_blank">${newspaper}</a></p>
          </address>
        </div>
      `;
      slideContainer.prepend(divEl);
    });

    slider(); // initialize slider after adding slides
  }

  function slider() {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');

    let curSlide = 0;
    const maxSlide = slides.length;

    const goToSlide = slide =>
      slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));

    const nextSlide = () => {
      curSlide = curSlide === maxSlide - 1 ? 0 : curSlide + 1;
      goToSlide(curSlide);
      activateDot(curSlide);
    };

    const prevSlide = () => {
      curSlide = curSlide === 0 ? maxSlide - 1 : curSlide - 1;
      goToSlide(curSlide);
      activateDot(curSlide);
    };

    const createDots = () => {
      slides.forEach((_, i) => {
        dotContainer.insertAdjacentHTML(
          'beforeend',
          `<button class="dots__dot" data-slide="${i}"></button>`
        );
      });
    };

    const activateDot = slide => {
      document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
      document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
    };

    const init = () => {
      goToSlide(0);
      createDots();
      activateDot(0);
    };
    init();

    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });

    dotContainer.addEventListener('click', e => {
      if (e.target.classList.contains('dots__dot')) {
        const { slide } = e.target.dataset;
        goToSlide(+slide);
        activateDot(+slide);
      }
    });
  }
});
