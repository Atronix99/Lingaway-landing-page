AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: "ease-in-out",
      });

      function updateOverlayPosition() {
        const heroSection = document.getElementById("hero-section");
        const overlay = document.querySelector(".hero-overlay");
        if (heroSection && overlay) {
          const heroRect = heroSection.getBoundingClientRect();
          const heroBottom = heroRect.bottom + window.scrollY;
          overlay.style.top = heroBottom + "px";
        }
      }

      window.addEventListener("load", updateOverlayPosition);
      window.addEventListener("resize", updateOverlayPosition);

      document.addEventListener("DOMContentLoaded", () => {
        const carouselStatus = document.getElementById("carousel-status");
        const prevBtn = document.querySelector(".swiper-button-prev-custom");
        const nextBtn = document.querySelector(".swiper-button-next-custom");

        let swiper = new Swiper(".reviewSwiper", {
          slidesPerView: 1,
          spaceBetween: 16,
          centeredSlides: true,
          loop: false,
          navigation: {
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          },
          breakpoints: {
            640: {
              slidesPerView: 'auto',
              spaceBetween: 24,
              centeredSlides: false, 
            },
            768: {
              slidesPerView: 'auto',
              spaceBetween: 24,
              centeredSlides: false,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 32,
              centeredSlides: false,
            },
          },
          on: {
            init: function () {
              updateCarouselStatus();
              updateButtonStates();
            },
            slideChange: function () {
              updateCarouselStatus();
              updateButtonStates();
            },
            resize: function () {
              updateCarouselStatus();
              updateButtonStates();
            },
          },
        });

        function updateCarouselStatus() {
          const activeIndex = swiper.activeIndex;
          const totalSlides = swiper.slides.length;
          const slidesPerView =
            swiper.params.slidesPerView === "auto"
              ? 1
              : Math.floor(swiper.params.slidesPerView);
          let statusText = "";
          if (slidesPerView === 1) {
            statusText = `Review ${activeIndex + 1} of ${totalSlides}`;
          } else {
            const lastVisibleIndex = Math.min(
              activeIndex + slidesPerView,
              totalSlides
            );
            statusText = `Reviews ${
              activeIndex + 1
            } to ${lastVisibleIndex} of ${totalSlides}`;
          }
          if (carouselStatus) {
            carouselStatus.textContent = statusText;
          }
        }

        function updateButtonStates() {
          const isBeginning = swiper.isBeginning;
          const isEnd = swiper.isEnd;
          if (prevBtn) {
            prevBtn.disabled = isBeginning;
            prevBtn.classList.toggle("opacity-50", isBeginning);
          }
          if (nextBtn) {
            nextBtn.disabled = isEnd;
            nextBtn.classList.toggle("opacity-50", isEnd);
          }
        }

        document.addEventListener("keydown", (e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            swiper.slidePrev();
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            swiper.slideNext();
          }
        });
      });