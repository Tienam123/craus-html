(() => {
  const menuBtn = document.querySelector('.icon-menu');
  const mobileMenu = document.querySelector('.header__menu');

  const toggleMenu = () => {
    menuBtn.classList.toggle('active');
    if (menuBtn.classList.contains('active')) {
      menuBtn.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.remove('is-hidden');
      mobileMenu.setAttribute('aria-hidden', 'false');
    } else {
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.add('is-hidden');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  };

  menuBtn.addEventListener('click',toggleMenu);


})();