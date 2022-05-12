//Save and get were used because there will be only one object or instance of this class
const Config = {
    save: (config) => {
        return new Promise((resolve, reject) => {
            Constants.db.save(config, Constants.Collections.CONFIG, function (err, result) {
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
            Constants.db.get(Constants.Collections.CONFIG, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
};