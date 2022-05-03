//A Promise was used in all of our functions in order 
//for the remaining code to wait for the response of this function 
//before moving on
import  Constants  from "../helper/constants";
//insert,update,search.. were used because there will be many objects or instances of this class
export const Products = {
    insert: (product) => {
        return new Promise((resolve, reject) => {
            if (product.title == "" || product.profileImgUrl == "" || product.coverImgUrl == "") {
                reject("Please fill required fields!");
                return;
            }
            Constants.db.insert(product, Constants.Collections.PRODUCTS, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    bulkInsert: (products) => {
        return new Promise((resolve, reject) => {
            Constants.db.bulkInsert(products, Constants.Collections.PRODUCTS, function (err, result) {
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
            Constants.db.search(options, Constants.Collections.PRODUCTS, function (err, result) {
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
            Constants.db.getById(productId, Constants.Collections.PRODUCTS, function (err, result) {
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
            Constants.db.update(prodId, product, Constants.Collections.PRODUCTS, function (err, result) {
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
            Constants.db.delete(productId, Constants.Collections.PRODUCTS, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}