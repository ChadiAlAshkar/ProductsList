//Save and get were used because there will be only one object or instance of this class
const Settings = {
    save: (settings) => {
        return new Promise((resolve, reject) => {
            Constants.db.save(settings, Constants.Collections.SETTINGS, function (err, result) {
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
            Constants.db.get(Constants.Collections.SETTINGS, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
};