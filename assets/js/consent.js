(function(window, document){
  'use strict';

  var GA_MEASUREMENT_ID = 'G-5Z6539DCMF';

  var STORAGE_KEY = 'mv_consent';

  var TEXT = {
    en: {
      message: 'We use cookies to understand how visitors use this site. We only turn on analytics if you say yes.',
      privacyLabel: 'Privacy Policy',
      accept: 'Accept',
      decline: 'Decline'
    },
    el: {
      message: 'Χρησιμοποιούμε cookies για να κατανοήσουμε πώς οι επισκέπτες χρησιμοποιούν αυτόν τον ιστότοπο. Ενεργοποιούμε το analytics μόνο αν συμφωνήσετε.',
      privacyLabel: 'Πολιτική Απορρήτου',
      accept: 'Αποδοχή',
      decline: 'Απόρριψη'
    }
  };

  function loadGA(){
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf('XXXX') !== -1) return;
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  function init(){
    var lang = (document.documentElement.lang || 'en').slice(0, 2) === 'el' ? 'el' : 'en';
    var t = TEXT[lang];
    var privacyUrl = window.MV_PRIVACY_URL || 'privacy.html';

    var consent = null;
    try { consent = window.localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }

    if (consent === 'granted') { loadGA(); return; }
    if (consent === 'denied') { return; }

    var banner = document.createElement('div');
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<div class="consent-inner">' +
        '<p class="consent-text">' + t.message + ' <a href="' + privacyUrl + '">' + t.privacyLabel + '</a></p>' +
        '<div class="consent-actions">' +
          '<button type="button" class="consent-btn consent-btn-decline" data-consent="decline">' + t.decline + '</button>' +
          '<button type="button" class="consent-btn consent-btn-accept" data-consent="accept">' + t.accept + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ banner.classList.add('visible'); });
    });

    banner.addEventListener('click', function(e){
      var action = e.target.getAttribute('data-consent');
      if (!action) return;
      try { window.localStorage.setItem(STORAGE_KEY, action === 'accept' ? 'granted' : 'denied'); } catch (err) { /* storage unavailable */ }
      banner.classList.remove('visible');
      if (action === 'accept') loadGA();
      setTimeout(function(){ banner.remove(); }, 450);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window, document);
