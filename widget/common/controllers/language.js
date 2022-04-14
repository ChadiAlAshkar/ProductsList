//Save and get were used because there will be only one object or instance of this class
const Language = {
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