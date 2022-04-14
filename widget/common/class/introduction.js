class IntroductionItem {
    constructor() {
        this.description = "";
        this.images = [];
    }
}

//Save and get were used because there will be only one object or instance of this class
const Introduction = {
    //Save and update the Introduction object in datastore
    save: (introduction) => {
        return new Promise((resolve, reject) => {
            Helper.db.save(introduction, "Introduction", function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    //Get the Introduction object from datastore
    get: () => {
        return new Promise((resolve, reject) => {
            Helper.db.get("Introduction", function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}