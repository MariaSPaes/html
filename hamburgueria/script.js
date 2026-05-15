const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const nextSlideBtn = document.getElementById("nextSlide");
const prevSlideBtn = document.getElementById("prevSlide");
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

let slideAtual = 0;

function mostrarSlide(index){
  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  slideAtual = index;

  if(slideAtual >= slides.length){
    slideAtual = 0;
  }

  if(slideAtual < 0){
    slideAtual = slides.length - 1;
  }

  slides[slideAtual].classList.add("active");
  dots[slideAtual].classList.add("active");
}

function proximoSlide(){
  mostrarSlide(slideAtual + 1);
}

function slideAnterior(){
  mostrarSlide(slideAtual - 1);
}

nextSlideBtn.addEventListener("click", proximoSlide);
prevSlideBtn.addEventListener("click", slideAnterior);

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    mostrarSlide(index);
  });
});

setInterval(proximoSlide, 6000);

menuBtn.addEventListener("click", () => {
  menu.classList.toggle("active");

  if(menu.classList.contains("active")){
    menuBtn.innerText = "×";
  }else{
    menuBtn.innerText = "☰";
  }
});

document.querySelectorAll(".menu a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");
    menuBtn.innerText = "☰";
  });
});