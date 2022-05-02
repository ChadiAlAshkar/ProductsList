//Save and get were used because there will be only one object or instance of this class
const Introduction = {
    save: (introduction) => {
        return new Promise((resolve, reject) => {
            Constants.db.save(introduction, Constants.Collections.INTRODUCTION, function (err, result) {
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
            Constants.db.get(Constants.Collections.INTRODUCTION, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}