// Hamburger and mobile nav
const hamburger = document.getElementById('hamburger');
const patty = document.querySelectorAll('.patty');
const navMobile = document.getElementById('nav-mobile');
const logo = document.getElementById('logo');

hamburger.addEventListener('pointerdown', () => {
  hamburger.classList.toggle('hamburger_slide');
  patty.forEach(item => {
    item.classList.toggle('patty_slide');
  });
  navMobile.classList.toggle('nav_toggle');
  logo.classList.toggle('hide');
});