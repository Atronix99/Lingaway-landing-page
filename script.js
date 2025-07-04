document.addEventListener('DOMContentLoaded', () => {
    const reviewCardsContainer = document.getElementById('reviewCardsContainer');
    const prevReviewBtn = document.getElementById('prevReviewBtn');
    const nextReviewBtn = document.getElementById('nextReviewBtn');
    const reviewCards = Array.from(reviewCardsContainer.children);

    let currentIndex = 0;

    function getVisibleCardsPerPage() {
        if (!reviewCards.length) {
            prevReviewBtn.disabled = true;
            nextReviewBtn.disabled = true;
            return 0;
        }
        return window.innerWidth <= 768 ? 1 : 2;
    }

    function updateReviews() {
        const currentCardsPerPage = getVisibleCardsPerPage();
        if (currentCardsPerPage === 0) return;

        const cardWidth = reviewCards[0].offsetWidth;
        const gap = window.innerWidth <= 768 ? 20 : 30;
        const containerWidth = reviewCardsContainer.parentElement.offsetWidth;
        const totalCardWidth = cardWidth + gap;
        const moveX = currentIndex * totalCardWidth;

        reviewCardsContainer.style.transition = 'transform 0.6s cubic-bezier(.77,0,.18,1)';
        if (window.innerWidth <= 768) {
            reviewCardsContainer.style.transform = `translateX(calc(-${moveX}px + ((${containerWidth}px - ${cardWidth}px) / 2)))`;
        } else {
            reviewCardsContainer.style.transform = `translateX(-${moveX}px)`;
        }

        prevReviewBtn.disabled = currentIndex === 0;
        nextReviewBtn.disabled = currentIndex >= reviewCards.length - currentCardsPerPage;
    }

    prevReviewBtn.addEventListener('click', () => {
        const currentCardsPerPage = getVisibleCardsPerPage();
        if (currentCardsPerPage === 0) return;

        currentIndex = Math.max(0, currentIndex - 1);
        updateReviews();
    });

    nextReviewBtn.addEventListener('click', () => {
        const currentCardsPerPage = getVisibleCardsPerPage();
        if (currentCardsPerPage === 0) return;

        currentIndex = Math.min(reviewCards.length - currentCardsPerPage, currentIndex + 1);
        if (currentIndex >= reviewCards.length - currentCardsPerPage) {
            currentIndex = 0;
        }
        updateReviews();
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            currentIndex = 0;
            updateReviews();
        }, 100);
    });

    window.addEventListener('load', () => {
        currentIndex = 0;
        updateReviews();
    });
});