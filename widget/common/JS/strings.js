if (typeof (buildfire) == "undefined") throw ("please add buildfire.js first to use BuildFire services");
if (typeof (buildfire.services) == "undefined") buildfire.services = {};

buildfire.services.Strings = class {

	constructor(stringsConfig) {
		this._data = null;

		let obj = {};
		for (let sectionKey in stringsConfig) {
			let section = obj[sectionKey] = {};
			for (let labelKey in stringsConfig[sectionKey].labels) {
				section[labelKey] = {
					defaultValue: stringsConfig[sectionKey].labels[labelKey].defaultValue,
					required: stringsConfig[sectionKey].labels[labelKey].required
				};
			}
		}
		this._data = obj;

	}

	get collectionName() {
		return Helper.Collections.LANGUAGE;
	}

	set(prop, value) {
		if (!this._data) throw "Strings not ready";

		let s = prop.split(".");
		if (s.length != 2) throw ("invalid string prop name");
		let segmentKey = s[0];
		let labelKey = s[1];

		if (!this._data[segmentKey][labelKey]) this._data[segmentKey][labelKey] = {};
		this._data[segmentKey][labelKey].value = value;
	}

	get(prop, enableVariables, context) {
		if (!this._data) throw "Strings not ready";

		let s = prop.split(".");
		if (s.length != 2) throw ("invalid string prop name");
		let segmentKey = s[0];
		let labelKey = s[1];

		let v;
		let l = this._data[segmentKey][labelKey];
		if (l.value || (l.value === "" && !l.required))
			v = l.value;
		else
			v = l.defaultValue || "";

		/// use ${context.XXX} or global variables
		if (enableVariables) v = eval("`" + v + "`");
		return v;

	}

	refresh(callback) {
		Language.get()
			.then((result) => {
				let obj = {
					data: {}
				};
				obj = result;
				this.id = obj.id;

				for (let sectionKey in obj.data) {
					if (!this._data[sectionKey]) this._data[sectionKey] = this._data[sectionKey] = {};
					for (let labelKey in obj.data[sectionKey]) {
						if (!this._data[sectionKey][labelKey]) this._data[sectionKey][labelKey] = {};
						let v = obj.data[sectionKey][labelKey];
						let i = this._data[sectionKey][labelKey];
						i.value = v.value;
					}
				}

				if (callback) callback();
			})
			.catch((err) => {
				callback(e);
			});
	}

	init(callback) {
		let t = this;
		return new Promise((resolve, reject) => {

			t.refresh(e => {
				if (e) {
					if (callback) callback(e);
					reject(e);
				} else
					resolve();
			});
		});
	}

	inject(element, enableVariables) {
		if (!element) element = document;
		element.querySelectorAll("*[bfString]").forEach(e => {
			let v = this.get(e.getAttribute("bfString"), enableVariables) || "";

			if (e.nodeName == "TEXTAREA") {
				if (e.classList.contains("bfwysiwyg"))
					tinymce.get(e.id).setContent(v);
				else
					e.innerHTML = v;
			} else if (e.nodeName == "INPUT")
				e.value = v;
			else
				e.innerHTML = v;
		});
	}

	save(callback) {
		var language = new LanguageItem();
		language.search = this._data.search;
		language.sortAsc = this._data.sortAsc;
		language.sortDesc = this._data.sortDesc;

		Language.save(language)
			.then((result) => {
				callback();
			})
			.catch((err2) => {
				callback(err2);
			});
		buildfire.datastore.save(this._data, this.collectionName, callback);
	}
};