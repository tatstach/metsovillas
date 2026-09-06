(function(window, document){
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal(){
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function(el){ el.classList.add('in-view'); });
      return;
    }
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); } });
    }, { threshold: 0.15 });
    reveals.forEach(function(el){ obs.observe(el); });
  }

  function initStack(containerId, arrowId, counterId, total){
    var container = document.getElementById(containerId);
    var arrowEl = document.getElementById(arrowId);
    if (!container || !arrowEl) return;
    var counterEl = counterId ? document.getElementById(counterId) : null;
    var imgs = container.querySelectorAll('.stack-img');
    var order = [];
    for (var i = 0; i < total; i++) order.push(i);
    function render(){
      imgs.forEach(function(img, i){
        img.classList.remove('pos-0','pos-1','pos-hidden');
        var slot = order.indexOf(i);
        if (slot === 0) img.classList.add('pos-0');
        else if (slot === 1) img.classList.add('pos-1');
        else img.classList.add('pos-hidden');
      });
      if (counterEl) counterEl.textContent = order[0] + 1;
    }
    container.addEventListener('click', function(){ order.push(order.shift()); render(); });
    var isTouch = window.matchMedia('(hover: none)').matches;
    if (!isTouch) {
      container.addEventListener('mousemove', function(e){
        var rect = container.getBoundingClientRect();
        arrowEl.style.transform = 'translate(' + (e.clientX - rect.left) + 'px,' + (e.clientY - rect.top) + 'px)';
      });
      container.addEventListener('mouseenter', function(){ arrowEl.classList.add('visible'); });
      container.addEventListener('mouseleave', function(){ arrowEl.classList.remove('visible'); });
    }
    render();
  }

  function initHeaderScroll(){
    var siteHeader = document.querySelector('header');
    if (!siteHeader) return;
    var ticking = false;
    function update(){
      siteHeader.classList.toggle('scrolled', window.scrollY > 60);
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  function initMobileMenu(trackedSectionIds){
    var burgerBtn = document.querySelector('.burger');
    var mobileMenu = document.getElementById('mobileMenu');
    var menuCloseBtn = document.getElementById('menuClose');
    if (!burgerBtn || !mobileMenu || !menuCloseBtn) return;
    var navLinks = mobileMenu.querySelectorAll('.mobile-menu-nav a');

    var currentSection = null;
    if (trackedSectionIds && trackedSectionIds.length && 'IntersectionObserver' in window) {
      var trackedEls = trackedSectionIds.map(function(id){ return document.getElementById(id); }).filter(Boolean);
      if (trackedEls.length) {
        var sectionObs = new IntersectionObserver(function(entries){
          entries.forEach(function(e){ if (e.isIntersecting) { currentSection = e.target.id; } });
        }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });
        trackedEls.forEach(function(el){ sectionObs.observe(el); });
      }
    }

    burgerBtn.addEventListener('click', function(){
      navLinks.forEach(function(a){
        var target = a.getAttribute('href').replace('#', '');
        a.classList.toggle('active', target === currentSection);
      });
      mobileMenu.classList.add('open');
    });
    menuCloseBtn.addEventListener('click', function(){ mobileMenu.classList.remove('open'); });
    mobileMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ mobileMenu.classList.remove('open'); });
    });
  }

  function initLangSwitch(){
    var langSwitch = document.getElementById('langSwitch');
    var langBtn = document.getElementById('langBtn');
    if (!langSwitch || !langBtn) return;
    langBtn.addEventListener('click', function(e){
      e.stopPropagation();
      var isOpen = langSwitch.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', function(){
      langSwitch.classList.remove('open');
      langBtn.setAttribute('aria-expanded', 'false');
    });
  }

  function initParallax(elId){
    var el = document.getElementById(elId);
    if (!el || reduceMotion) return;
    var ticking = false;
    function update(){
      var rect = el.parentElement.getBoundingClientRect();
      var offset = rect.top * 0.15;
      el.style.transform = 'translateY(' + offset + 'px)';
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  function initSuiteTabs(){
    var tabBtns = document.querySelectorAll('.tab-btn');
    var panels = document.querySelectorAll('.suite-panel');
    var tabsBar = document.getElementById('suiteTabs');
    if (!tabBtns.length || !tabsBar) return;
    var validTabs = Array.prototype.map.call(tabBtns, function(b){ return b.dataset.tab; });

    function activateTab(tab, scroll){
      var btn = document.querySelector('.tab-btn[data-tab="' + tab + '"]');
      var panel = document.getElementById('panel-' + tab);
      if (!btn || !panel) return;
      tabBtns.forEach(function(b){ b.classList.remove('active'); });
      panels.forEach(function(p){ p.classList.remove('active'); });
      btn.classList.add('active');
      panel.classList.add('active');
      if (scroll) {
        var y = tabsBar.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }

    tabBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        activateTab(btn.dataset.tab, true);
        history.replaceState(null, '', '#' + btn.dataset.tab);
      });
    });

    var initialTab = (location.hash || '').replace('#', '');
    if (validTabs.indexOf(initialTab) !== -1) {
      activateTab(initialTab, false);
      window.scrollTo(0, tabsBar.getBoundingClientRect().top + window.scrollY - 90);
    }
  }

  window.MV = {
    initReveal: initReveal,
    initStack: initStack,
    initHeaderScroll: initHeaderScroll,
    initMobileMenu: initMobileMenu,
    initLangSwitch: initLangSwitch,
    initParallax: initParallax,
    initSuiteTabs: initSuiteTabs
  };
})(window, document);
