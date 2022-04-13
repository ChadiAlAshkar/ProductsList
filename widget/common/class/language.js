class LanguageItem {
    constructor() {
        this.search = "";
        this.sortAZ = "";
        this.sortZA = "";
    }
}

const Languages = {
    save: (language) => {
        return new Promise((resolve, reject) => {
            db.save(language, "Language", function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    get: () => {
        return new Promise((resolve, reject) => {
            db.get("Language", function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

}