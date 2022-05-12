const ui = {
  createElement: (elementType, appendTo, innerHTML, classNameArray, id) => {
    let e = document.createElement(elementType);
    if (innerHTML) e.innerHTML = innerHTML;
    if (Array.isArray(classNameArray))
      classNameArray.forEach((c) => e.classList.add(c));
    if (appendTo) appendTo.appendChild(e);
    if (id) e.setAttribute('id', id);
    return e;
  },
};
