const dummyData = {
  fetchDummyRecords: () => {
    var r = new XMLHttpRequest();
    r.open("GET", `https://fakestoreapi.com/products?limit=5`, true);
    r.send();

    return r;
  },
  insertDummyRecords() {
    return new Promise((resolve, reject) => {
      let records = [];
      let results = this.fetchDummyRecords();
      results.onreadystatechange = function () {
        if (results.readyState == 4 && results.status == 200) {
          let data = JSON.parse(results.responseText);
          data.forEach((row) => {
            let r = {
              title: row.title,
              subTitle: row.description,
              description: row.description,
              creationDate: new Date(),
              profileImgUrl: row.image,
              coverImgUrl: row.image,
            };
            records.push(r);
          });
          Products.bulkInsert(records)
            .then((result) => {
              resolve(result);
            })
            .catch((err) => {
              reject(err);
            });
        }
      };
    });
  },
};
