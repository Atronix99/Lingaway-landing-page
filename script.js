const reviewCardsContainer = document.getElementById('reviewCardsContainer');
const prevReviewBtn = document.getElementById('prevReviewBtn');
const nextReviewBtn = document.getElementById('nextReviewBtn');
const reviewCards = Array.from(reviewCardsContainer.children);

let currentIndex = 0;
const visibleCards = 1; // przesuwaj o jeden komentarz

function updateReviews() {
    const cardWidth = reviewCards[0].offsetWidth;
    const gap = 30; // taki jak w CSS .review-cards
    const moveX = (cardWidth + gap) * currentIndex;
    reviewCardsContainer.style.transition = 'transform 0.6s cubic-bezier(.77,0,.18,1)';
    reviewCardsContainer.style.transform = `translateX(-${moveX}px)`;
}

// Zapętlenie
prevReviewBtn.addEventListener('click', () => {
    currentIndex -= 1;
    if (currentIndex < 0) {
        currentIndex = reviewCards.length - 2; // zostaw dwa na końcu
    }
    updateReviews();
});

nextReviewBtn.addEventListener('click', () => {
    currentIndex += 1;
    if (currentIndex > reviewCards.length - 2) {
        currentIndex = 0;
    }
    updateReviews();
});

window.addEventListener('load', updateReviews);
window.addEventListener('resize', updateReviews);