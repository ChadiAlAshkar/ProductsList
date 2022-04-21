//Save and get were used because there will be only one object or instance of this class
const Language = {
  save: (language, collectionName) => {
    return new Promise((resolve, reject) => {
      Helper.db.save(language, collectionName, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  get: (collectionName) => {
    return new Promise((resolve, reject) => {
      Helper.db.get(collectionName, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
};
