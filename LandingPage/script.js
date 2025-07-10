document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.review-card');
    const prevBtn = document.getElementById('prevReviewBtn');
    const nextBtn = document.getElementById('nextReviewBtn');
    const reviewCardsContainer = document.getElementById('reviewCardsContainer');
    const carouselStatus = document.getElementById('carousel-status');
    let currentIndex = 0;

    if (!reviewCardsContainer || !prevBtn || !nextBtn || cards.length === 0 || !carouselStatus) {
        return;
    }

    function getCardsPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1024) return 1;
        return 2;
    }

    function showCards(focusOnCard = false) {
        const cardsPerView = getCardsPerView();
        const totalCards = cards.length;

        cards.forEach((card, index) => {
            const isVisible = index >= currentIndex && index < currentIndex + cardsPerView;
            card.classList.toggle('hidden', !isVisible);
            card.setAttribute('aria-hidden', !isVisible);
            card.tabIndex = isVisible ? 0 : -1;
        });

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex + cardsPerView >= totalCards;

        prevBtn.classList.toggle('opacity-50', prevBtn.disabled);
        nextBtn.classList.toggle('opacity-50', nextBtn.disabled);

        let statusText = '';
        if (cardsPerView === 1) {
            statusText = `Review ${currentIndex + 1} of ${totalCards}`;
        } else {
            const lastVisibleIndex = Math.min(currentIndex + cardsPerView, totalCards);
            statusText = `Reviews ${currentIndex + 1} to ${lastVisibleIndex} of ${totalCards}`;
        }
        carouselStatus.textContent = statusText;

        if (focusOnCard) {
            const firstVisibleCard = document.querySelector('.review-card:not(.hidden)');
            if (firstVisibleCard) {
                firstVisibleCard.focus();
            }
        }
    }

    function goToPrev(event = null) {
        const cardsPerView = getCardsPerView();
        currentIndex = Math.max(0, currentIndex - cardsPerView);
        showCards(event !== null);
    }

    function goToNext(event = null) {
        const cardsPerView = getCardsPerView();
        if (currentIndex + cardsPerView < cards.length) {
            currentIndex += cardsPerView;
            if (currentIndex + cardsPerView > cards.length) {
                currentIndex = cards.length - cardsPerView;
            }
        }
        showCards(event !== null);
    }

    prevBtn.addEventListener('click', goToPrev);
    nextBtn.addEventListener('click', goToNext);

    let startX = 0;
    let endX = 0;

    reviewCardsContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    reviewCardsContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const difference = startX - endX;
        const minSwipeDistance = 50;

        if (Math.abs(difference) > minSwipeDistance) {
            if (difference > 0) {
                goToNext();
            } else {
                goToPrev();
            }
        }
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newCardsPerView = getCardsPerView();
            if (currentIndex + newCardsPerView > cards.length) {
                currentIndex = Math.max(0, cards.length - newCardsPerView);
            }
            showCards();
        }, 250);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToPrev(e);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goToNext(e);
        }
    });

    showCards();
});