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

	set(prop, value) {
		if (!this._data) throw "Strings not ready";

		let s = prop.split(".");
		if (s.length != 2) throw ("invalid string prop name");
		let segmentKey = s[0];
		let labelKey = s[1];

		if (!this._data[segmentKey][labelKey]) this._data[segmentKey][labelKey] = {};
		this._data[segmentKey][labelKey].value = value;
		this.save((result, err) => {
			if (err) {
				console.error(err);
			}
			buildfire.messaging.sendMessageToWidget({ cmd: "refresh" })
		});
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
				console.log(result)
				let obj = {
					data: {}
				};
				obj = result;
				this.id = obj.id;

				for (let sectionKey in this._data) {
					for (let labelKey in obj.data) {
						this._data[sectionKey][labelKey].value = obj.data[labelKey];
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
		for (let sectionKey in this._data) {
			for (let labelKey in this._data[sectionKey]) {
				language[labelKey] = this._data[sectionKey][labelKey].value
			}
		}
		Language.save(language)
			.then((result) => {
				console.log(result)
				callback();
			})
			.catch((err2) => {
				callback(err2);
			});
		// buildfire.datastore.save(this._data, this.collectionName, callback);
	}
};