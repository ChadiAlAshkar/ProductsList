class IntroductionItem {
    constructor() {
        this.description = "";
        this.images=[];
    }
}

const Introduction = {
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