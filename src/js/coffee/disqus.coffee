$ ->
  isInView = (elem) ->
    $elem = $(elem);
    $window = $(window);

    docViewTop = $window.scrollTop();
    docViewBottom = docViewTop + $window.height();

    elemTop = $elem.offset().top;
    elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));

  check = ->
    if isInView '#disqus_thread'
      $(window).off 'scroll', check

      disqus_config = ->
        @page.url = window.location.href
        @page.identifier = window.location.href
        return

      do ->
        d = document
        s = d.createElement('script')
        s.src = '//sourcebox.disqus.com/embed.js'
        s.setAttribute 'data-timestamp', +new Date
        (d.head or d.body).appendChild s
        return
    return

  $(window).on 'scroll', check

  return