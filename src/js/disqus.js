let isInView = function(elem, margin) {
  let $elem = document.getElementById(elem);

  if ($elem === null) {
    return;
  }

  let docViewTop = window.scrollY;
  let docViewBottom = docViewTop + window.innerHeight;

  let elemTop = $elem.offsetTop - margin;
  let elemBottom = elemTop + $elem.offsetHeight;

  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
};

let check = function() {
  if (isInView('disqus_thread', 500)) {
    document.removeEventListener('scroll', check);
    
    let url = 'https://sourcebox.be' + location.pathname;

    let disqus_config = function() {
      this.page.url = url;
      this.page.identifier = url;
    };

    (function() {
      let d = document;
      let s = d.createElement('script');
      s.src = '//sourcebox.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
  }
};

document.addEventListener('scroll', check);
