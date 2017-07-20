if (!document.querySelectorAll) {
  document.querySelectorAll = selector => {
    const style = document.styleSheets[0] || document.createStyleSheet();
    style.addRule(selector, 'foo:bar');
    const all = document.all;
    const resultSet = [];
    for (let i = 0, l = all.length; i < l; i++) {
      if (all[i].currentStyle.foo === 'bar') {
        resultSet[resultSet.length] = all[i];
      }
    }
    style.removeRule(0);
    return resultSet;
  };
}

function doCollapse(event=window.event) {
  const evTarget = event.currentTarget || event.srcElement;
  const dataTarget = evTarget.getAttribute('data-target');
  const target = document.querySelector(dataTarget);
  let className = (` ${target.className} `);

  if (className.includes(' in ')) {
    // Hide the element
    className = className.replace(' in ', ' ');
    target.className = className;
    evTarget.setAttribute('aria-expanded', 'false');
  } else {
    // Show the element
    target.className += ' in ';
    evTarget.setAttribute('aria-expanded', 'true');
  }
  return false;
}

// Set event listeners for collapsible menus
const collapsibles = document.querySelectorAll('[data-toggle=collapse]');
for (let i = 0, leni = collapsibles.length; i < leni; i++) {
  collapsibles[i].onclick = doCollapse;
}
