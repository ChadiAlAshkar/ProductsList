class Product {
    constructor() {
        this.title = "";
        this.subTitle = "";
        this.description = "";
        this.profileImgUrl = "";
        this.coverImgUrl = "";
        this.creationDate = new Date();
    }
}

const db = buildfire.datastore;

const Products = {
    insert: (product) => {
        return new Promise((resolve, reject) => {
            if (product.title == "" || product.profileImgUrl == "" || product.coverImgUrl == "") {
                reject("Please fill required fields!");
                return;
            }
            db.insert(product, "Products", function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    search: (options) => {
        return new Promise((resolve, reject) => {
            db.search(options, "Products", function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    getById: (productId) => {
        return new Promise((resolve, reject) => {
            buildfire.datastore.getById(productId, "Products", function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

    },
    update: (prodId, product) => {
        return new Promise((resolve, reject) => {
            buildfire.datastore.update(prodId, product, "Products", function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    delete: (productId) => {
        return new Promise((resolve, reject) => {
            buildfire.datastore.delete(productId, "Products", function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}