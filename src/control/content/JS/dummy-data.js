import {
  Products
} from '../../../widget/common/controllers/product.js'
export const dummyData = {
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
            let profImg = buildfire.imageLib.cropImage(
              row.image, {
                size: "full_width",
                aspect: "1:1"
              }
            );
            let coverImg = buildfire.imageLib.cropImage(
              row.image, {
                size: "full_width",
                aspect: "16:9"
              }
            );
            let prod = {
              title: row.title,
              subTitle: row.description,
              description: row.description,
              creationDate: new Date(),
              profileImgUrl: profImg,
              coverImgUrl: coverImg,
            };
            records.push(prod);
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