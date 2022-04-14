class LanguageItem {
    constructor() {
        this.search = "";
        this.sortAZ = "";
        this.sortZA = "";
    }
}

//Save and get were used because there will be only one object or instance of this class
const Language = {
    //Save and update the Language object in datastore
    save: (language) => {
        return new Promise((resolve, reject) => {
            Helper.db.save(language, "Language", function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    //Get the Language object from datastore
    get: () => {
        return new Promise((resolve, reject) => {
            Helper.db.get("Language", function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

}