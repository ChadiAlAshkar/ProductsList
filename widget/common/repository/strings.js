if (typeof buildfire == "undefined")
  throw "please add buildfire.js first to use BuildFire services";
if (typeof buildfire.services == "undefined") buildfire.services = {};

buildfire.services.Strings = class {
  constructor(language, stringsConfig) {
    this.language = language || "en-US";
    this._data = null;

    let obj = {};
    for (let sectionKey in stringsConfig) {
      let section = (obj[sectionKey] = {});
      for (let labelKey in stringsConfig[sectionKey].labels) {
        section[labelKey] = {
          defaultValue: stringsConfig[sectionKey].labels[labelKey].defaultValue,
          required: stringsConfig[sectionKey].labels[labelKey].required,
        };
      }
    }
    this._data = obj;
  }
  get collectionName() {
    return Constants.Collections.LANGUAGE + this.language.toLowerCase();
  }

  set(prop, value) {
    if (!this._data) throw "Strings not ready";
    //prop For Example: ScreenOne.Search
    let props = prop.split(".");
    if (props.length != 2) throw "invalid string prop name";
    let segmentKey = props[0];
    let labelKey = props[1];

    if (!this._data[segmentKey][labelKey])
      this._data[segmentKey][labelKey] = {};
    this._data[segmentKey][labelKey].value = value;
    this.save((result, err) => {
      if (err) {
        console.error(err);
      }
      // buildfire.messaging.sendMessageToWidget({
      //   cmd: "refresh",
      // });
    });
  }

  //Check After Inject
  get(prop, enableVariables, context) {
    if (!this._data) throw "Strings not ready";

    let props = prop.split(".");
    if (props.length != 2) throw "invalid string prop name";
    let segmentKey = props[0];
    let labelKey = props[1];

    let v;
    let l = this._data[segmentKey][labelKey];
    if (l.value || (l.value === "" && !l.required)) v = l.value;
    else v = l.defaultValue || "";

    /// use ${context.XXX} or global variables
    if (enableVariables) v = eval("`" + v + "`");
    return v;
  }

  refresh(callback) {
    Language.get(this.collectionName)
      .then((result) => {
        let obj = {
          data: {},
        };
        obj = result;
        this.id = obj.id;
        for (let sectionKey in this._data) {
          for (let labelKey in obj.data) {
            this._data[sectionKey][labelKey].value = obj.data[labelKey].value;
          }
        }

        if (callback) callback();
      })
      .catch((err) => {
        callback(err);
      });
  }

  init() {
    let t = this;
    return new Promise((resolve, reject) => {
      t.refresh((e) => {
        if (e) {
          reject(e);
        } else resolve();
      });
    });
  }

  inject(element, enableVariables) {
    if (!element) element = document;
    element.querySelectorAll("*[bfString]").forEach((e) => {
      let v = this.get(e.getAttribute("bfString"), enableVariables) || "";
      if (e.nodeName == "TEXTAREA") {
        if (e.classList.contains("bfwysiwyg")) tinymce.get(e.id).setContent(v);
        else e.innerHTML = v;
      } else if (e.nodeName == "INPUT") e.value = v;
      else e.innerHTML = v;
    });
  }

  save(callback) {
    var language = new LanguageItem();
    for (let sectionKey in this._data) {
      for (let labelKey in this._data[sectionKey]) {
        language[labelKey].value = this._data[sectionKey][labelKey].value;
        language[labelKey].defaultValue = this._data[sectionKey][labelKey].defaultValue;
      }
    }
    Language.save(language, this.collectionName)
      .then((result) => {
        callback();
      })
      .catch((err2) => {
        callback(err2);
      });
  }
};