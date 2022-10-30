"use strict";

const modalElement = document.querySelector('.modal');
const overlayElement = document.querySelector('.overlay');
const closeModalBtn = document.querySelector('.close-modal');
const showModalBtns = document.querySelectorAll('.show-modal');

const showModal = function () {
    modalElement.classList.remove('hidden');
    overlayElement.classList.remove('hidden');
};

const closeModal = function () {
    modalElement.classList.add('hidden');
    overlayElement.classList.add('hidden');
};

showModalBtns.forEach(showBtn => {
    showBtn.addEventListener('click', showModal);
});

closeModalBtn.addEventListener('click', closeModal);
overlayElement.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modalElement.classList.contains('hidden')) {
        closeModal();
    }
});