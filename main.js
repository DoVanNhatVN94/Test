document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel");
  const totalSlides = document.querySelectorAll('.carousel .slides .slide').length;
  const slides = carousel.querySelector(".slides");
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  let isDragging = false;
  let startPosX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationId = 0;
  let currentIndex = 0;
  let currentSize = 0
  let prevSize = 0

  let width = window.innerWidth;
  console.log("🚀 ~ document.addEventListener ~ width:", width)

  function calSizeDrag (){
    if(window.innerWidth>=540)
    return window.innerWidth/3>=500?500:window.innerWidth/3
    return 120
  }

  function transformSlides(translate) {
    currentSize = translate
    slides.style.transform = `translateX(${translate}px)`;
  }

  function updateCarousel(currentIndex) {
    if (currentIndex === 0) {
      prevBtn.classList.add('hidden');
    } else {
      prevBtn.classList.remove('hidden');
    }

    if (currentIndex === totalSlides - 1) {
      nextBtn.classList.add('hidden');
    } else {
      nextBtn.classList.remove('hidden');
    }
  }

  function setPositionByIndex(index) {
    const slideWidth = carousel.querySelector(".slide").offsetWidth;
    updateCarousel(index)
    transformSlides(-index * slideWidth);
  }

  function dragStart(event) {
    event.preventDefault();
    slides.classList.add('drag')
    isDragging = true;
    prevSize = currentSize
    startPosX = getPositionX(event);
    console.log("🚀 ~ dragStart ~ startPosX:", startPosX)
    prevTranslate = currentTranslate;
    console.log("🚀 ~ dragStart ~ prevTranslate:", prevTranslate)
    cancelAnimationFrame(animationId);
  }

  function dragMove(event) {
    
    if (isDragging) {
      event.preventDefault()
      const currentPositionX = getPositionX(event);
      currentTranslate = prevTranslate + currentPositionX - startPosX;
      transformSlides(0 + currentPositionX - startPosX + prevSize);
      prevTranslate = 0
    }
  }

  function dragEnd(event) {
    if (isDragging) {
      event.preventDefault()
      isDragging = false;
      const movedBy = currentTranslate - prevTranslate;
      if (movedBy < (-calSizeDrag()) && currentIndex < slides.children.length - 1) {
        ++currentIndex;
      }
      if (movedBy > (calSizeDrag())  && currentIndex > 0) {
        --currentIndex;
      }
      slides.classList.remove('drag')
      setPositionByIndex(currentIndex);
    }
  }
  function getPositionX(event) {
    if (event.type.includes("touch")) {
      return event.touches[0].clientX;
    }
    return event.clientX;
  }
  function prevSlide() {
    slides.classList.remove('drag')
    if (currentIndex > 0) {
      currentIndex--;
      setPositionByIndex(currentIndex);
    }
  }
  function nextSlide() {
    slides.classList.remove('drag')
    if (currentIndex < slides.children.length - 1) {
      currentIndex++;
      console.log('next');
      setPositionByIndex(currentIndex);
    }
  }

  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("touchstart", dragStart);

  carousel.addEventListener("mousemove", dragMove);
  carousel.addEventListener("touchmove", dragMove);

  carousel.addEventListener("mouseup", dragEnd);
  carousel.addEventListener("touchend", dragEnd);

  carousel.addEventListener("mouseleave", dragEnd);
  carousel.addEventListener("touchcancel", dragEnd);
  
  document.getElementById('btn_prev').onclick = prevSlide
  document.getElementById('btn_next').onclick = nextSlide

  updateCarousel(currentIndex);

  window.addEventListener("resize", function () {
    width = window.innerWidth;
    setPositionByIndex(currentIndex);
  })
})