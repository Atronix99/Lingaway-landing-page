// Review cards carousel functionality with improved mobile support
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.review-card');
    const prevBtn = document.getElementById('prevReviewBtn');
    const nextBtn = document.getElementById('nextReviewBtn');
    const container = document.getElementById('reviewCardsContainer');
    let currentIndex = 0;

    function getCardsPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;  // Mobile: 1 card
        if (width < 1024) return 1; // Tablet: 1 card
        return 2; // Desktop: 2 cards
    }

    function showCards() {
        const cardsPerView = getCardsPerView();

        cards.forEach((card, index) => {
            card.classList.add('hidden');
            if (index >= currentIndex && index < currentIndex + cardsPerView && index < cards.length) {
                card.classList.remove('hidden');
            }
        });

        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex + cardsPerView >= cards.length;

        // Update button opacity for better visual feedback
        if (prevBtn.disabled) {
            prevBtn.classList.add('opacity-50');
        } else {
            prevBtn.classList.remove('opacity-50');
        }

        if (nextBtn.disabled) {
            nextBtn.classList.add('opacity-50');
        } else {
            nextBtn.classList.remove('opacity-50');
        }
    }

    function goToPrev() {
        const cardsPerView = getCardsPerView();
        if (currentIndex > 0) {
            currentIndex -= cardsPerView;
            if (currentIndex < 0) currentIndex = 0;
            showCards();
        }
    }

    function goToNext() {
        const cardsPerView = getCardsPerView();
        if (currentIndex + cardsPerView < cards.length) {
            currentIndex += cardsPerView;
            showCards();
        }
    }

    // Event listeners
    prevBtn.addEventListener('click', goToPrev);
    nextBtn.addEventListener('click', goToNext);

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const difference = startX - endX;
        const minSwipeDistance = 50;

        if (Math.abs(difference) > minSwipeDistance) {
            if (difference > 0) {
                // Swipe left - go to next
                goToNext();
            } else {
                // Swipe right - go to previous
                goToPrev();
            }
        }
    }

    // Handle window resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reset to first card on significant resize to avoid layout issues
            const newCardsPerView = getCardsPerView();
            if (currentIndex + newCardsPerView > cards.length) {
                currentIndex = Math.max(0, cards.length - newCardsPerView);
            }
            showCards();
        }, 250);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToPrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goToNext();
        }
    });

    // Initialize
    showCards();
});