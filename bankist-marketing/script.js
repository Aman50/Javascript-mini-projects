'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('header');

const learnMoreBtn = document.querySelector('.btn--scroll-to');
const section1Element = document.querySelector('#section--1');

const navLinks = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const sections = document.querySelectorAll('.section');


const lazyLoadedImgs = document.querySelectorAll('img[data-src]');

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

const smoothScroll = (e) => {
  section1Element.scrollIntoView({behavior: "smooth"});
}

learnMoreBtn.addEventListener('click', smoothScroll);

// learnMoreBtn.addEventListener('click', (e) => {
//   console.log("Another event using click");
// });

// learnMoreBtn.addEventListener('click', (e) => {
//   console.log("Another Another event using click");
//   learnMoreBtn.removeEventListener('click', smoothScroll);

// });


// learnMoreBtn.onclick = function() {
//   console.log("Clicked using onclick");
// };

// learnMoreBtn.onclick = function() {
//   console.log("Another Clicked using onclick");
// };


// document.querySelector('.nav__link').addEventListener('click', (e) => {
//   console.log("NAV LINK CLICKED", e.target);
// }, true);

// document.querySelector('.nav__links').addEventListener('click', (e) => {
//   console.log("NAV LINKs CLICKED", e.target);
// }, true);

// document.querySelector('.nav').addEventListener('click', (e) => {
//   console.log("NAV CLICKED", e.target);
// }, true);


// Event Delegation
navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    const scrollEl = document.querySelector(id);
    scrollEl.scrollIntoView({behavior: "smooth"});
  }  
});

tabsContainer.addEventListener('click', function(e) {
  const clickedTab = e.target.closest('.operations__tab');
  
  // Guard clause
  if (!clickedTab) return;

  const index = clickedTab.dataset.tab;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content => content.classList.remove('operations__content--active'));
  
  clickedTab.classList.add('operations__tab--active');
  console.log(document.querySelector(`.operations__content--${index}`));
  document.querySelector(`.operations__content--${index}`).classList.add('operations__content--active');
});

// const modifyNavOpacity = function(opacity) {
//   return function(e) {
//     if (e.target.classList.contains('nav__link')) {
//       const currentLink = e.target;
  
//       const siblings = currentLink.closest('.nav').querySelectorAll('.nav__link');
//       const logo = currentLink.closest('.nav').querySelector('img');
        
//       siblings.forEach(sibling => {
//         if (sibling !== currentLink) sibling.style.opacity = opacity;
//       });
  
//       logo.style.opacity = opacity;
//     }
//   }
// }

// Nav Hover Effect using Closure
const modifyNavOpacity = function(opacity) {
  return function(e) {
    if (e.target.classList.contains('nav__link')) {
      const currentLink = e.target;
  
      const siblings = currentLink.closest('.nav').querySelectorAll('.nav__link');
      const logo = currentLink.closest('.nav').querySelector('img');
        
      siblings.forEach(sibling => {
        if (sibling !== currentLink) sibling.style.opacity = opacity;
      });
  
      logo.style.opacity = opacity;
    }
  }
}

// Nav Hover effect
nav.addEventListener('mouseover', modifyNavOpacity(0.5));

nav.addEventListener('mouseout', modifyNavOpacity(1));

// DOM Traversal
const el = document.querySelector('h1');

// Finding the children
console.log(el.childNodes);
console.log(el.children); // HTML Collection

// Finding the parent
console.log(el.parentNode);
console.log(el.parentElement);

// Selecting a particular child
console.log(el.querySelector('a'));

// Selecting the closest ancestor or parent or element itself
console.log(el.closest('h1'));
console.log(el.closest('.header'));
// h1.querySelector is used to find the closest children based on condition
// h1.closest() is used to find the closest ancestor or the parent or the element itself

// Going sideways; siblings
console.log('----', el.nextSibling);
console.log('----', el.previousSibling);

console.log('----', el.nextElementSibling);
console.log('----', el.previousElementSibling);

// All siblings
console.log(el.parentElement.children); // HTML Collection

// Selection
// console.log(document.querySelector('.section'));
// console.log(document.querySelectorAll('.section')); // Node List

// console.log(document.getElementById('section'));
// console.log(document.getElementsByTagName('div')); // HTML Collection

// Sticky Navigation
const stickyNav = function(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: [0],
  rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);


// Appearing Sections
const sectionCallback = function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('hidden');
    observer.unobserve(entry.target);
  });

}

const sectionsObserver = new IntersectionObserver(sectionCallback, {
  root: null,
  threshold: 0.2
});

// Even though observer observes multiple elements, the first
// initial output is for the first element only, single output
sections.forEach(section => {
  sectionsObserver.observe(section);
  // Adding class here manually to hide it to support non-javascript clients
  section.classList.add('hidden');
});


// Lazy Loading Images
const lazyCallback = function(entries, observer) {
  entries.forEach(entry => {
    
    // Guard Clause
    if (!entry.isIntersecting) return;
  
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', (e) => {
      console.log(e);
      entry.target.classList.remove('lazy-img');

      observer.unobserve(entry.target);
    });
  });
};

const lazyObserver = new IntersectionObserver(lazyCallback, {
  root: null,
  threshold: 0,
  rootMargin: '100px'
});

lazyLoadedImgs.forEach(img => {
  lazyObserver.observe(img);
});

// Insertion

// document.querySelector('.s').insertAdjacentHTML('');
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

header.prepend(message);
// header.append(message);

// header.before(message);
// header.prepend(message);
// header.after(message);


// Deletion

document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();
});



// Styles
message.style.backgroundColor = 'black';
console.log(message.style.backgroundColor);
console.log(message.style.color);
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'red');
message.style.setProperty('font-size', '20px');


// Attributes
const img = document.querySelector('.nav__logo');
console.log(img.src);
console.log(img.alt);
console.log(img.getAttribute('src'));


// Non-standard property
console.log(img.zoom);
console.log(img.getAttribute('zoom'));
console.log(img.setAttribute('zoom', 20));
console.log(img.getAttribute('zoom'));

// Classes
console.log(img.classList);
console.log(img.className);
console.log(img.classList.add('lol'));
console.log(img.classList);
console.log(img.classList.contains(' lol'));
