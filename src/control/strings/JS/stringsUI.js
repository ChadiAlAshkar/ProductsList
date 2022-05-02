const stringsUI = {
  container: null,
  strings: null,
  stringsConfig: null,
  _debouncers: {},

  debounce(key, fn) {
    if (this._debouncers[key]) clearTimeout(this._debouncers[key]);
    this._debouncers[key] = setTimeout(fn, 500);
  },

  init(containerId, strings, stringsConfig) {
    this.strings = strings;
    this.stringsConfig = stringsConfig;
    this.container = document.getElementById(containerId);
    this.container.innerHTML = "";
    for (let key in this.stringsConfig) {
      this.buildSection(this.container, key, this.stringsConfig[key]);
    }
    // stringsUI._setupTinyMCE();
  },

  onSave(prop, value) {
    this.strings.set(prop, value);
  },

  buildSection(container, sectionProp, sectionObj) {
    let sec = ui.createElement("section", container, "", []);

    ui.createElement("h3", sec, sectionObj.title, []);
    ui.createElement("div", sec, sectionObj.subtitle, ["subTitle"]);
    for (let key in sectionObj.labels)
      this.buildLabel(sec, sectionProp + "." + key, sectionObj.labels[key]);
    container.appendChild(sec);
  },

  buildLabel(container, prop, labelObj) {
    let div = ui.createElement("div", container, "", ["form-group", "row"]);
    let divCol1 = ui.createElement("div", div, "", ["col-md-4"]);
    let divCol2 = ui.createElement("div", div, "", ["col-md-8"]);
    ui.createElement("label", divCol1, labelObj.title, []);
    let inputElement;
    let id = prop;
    let inputType = labelObj.inputType ? labelObj.inputType.toLowerCase() : "";

    if (labelObj.inputType && ["textarea", "wysiwyg"].indexOf(inputType) >= 0)
      inputElement = ui.createElement("textarea", divCol2, "", [
        "form-control",
        "bf" + inputType,
      ]);
    else {
      inputElement = ui.createElement("input", divCol2, "", ["form-control"]);
      inputElement.type = labelObj.inputType || "text";
    }

    inputElement.id = id;

    inputElement.autocomplete = false;
    inputElement.placeholder = labelObj.placeholder || "";

    if (labelObj.maxLength > 0) inputElement.maxLength = labelObj.maxLength;

    inputElement.required = labelObj.required;

    inputElement.setAttribute("bfString", prop);

    if (inputType == "wysiwyg") {
      //handled outside by tinyMCE
    } else {
      inputElement.onkeyup = (e) => {
        stringsUI.debounce(prop, () => {
          if (inputElement.checkValidity()) {
            inputElement.classList.remove("bg-danger");
            stringsUI.onSave(
              prop,
              inputElement.value || inputElement.innerHTML
            );
          } else inputElement.classList.add("bg-danger");
        });
        e.stopPropagation();
      };
    }

    return inputElement;
  },
};