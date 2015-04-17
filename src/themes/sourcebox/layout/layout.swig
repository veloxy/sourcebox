<!DOCTYPE html>
<html lang="en">
  <head>
    {% include 'elements/header.swig' %}
  </head>
  <body>
    {% include 'elements/navigation.swig' %}
    {{ body }}
    {% include 'elements/footer.swig' %}
    <script src="/js/main.min.js"></script>
  </body>
</html>