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

//A Promise was used in all of our functions in order 
//for the remaining code to wait for the response of this function 
//before moving on

//insert,update,search.. were used because there will be many objects or instances of this class
const Products = {
    insert: (product) => {
        return new Promise((resolve, reject) => {
            if (product.title == "" || product.profileImgUrl == "" || product.coverImgUrl == "") {
                reject("Please fill required fields!");
                return;
            }
            Helper.db.insert(product, "Products", function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    //Options Example:
    // var searchOptions = {
    //   "filter": {},
    //   "sort": {},
    //   "fields": [],
    //   "skip": 0,
    //   "limit": 20
    // };
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