import buildfire from 'buildfire';
import IntroductionItem from "../../widget/common/models/introduction";
import {
  Introduction
} from "../../widget/common/controllers/introduction";
import Product from "../../widget/common/models/product";
import {
  Products
} from "../../widget/common/controllers/product";
import LanguageItem from '../../widget/common/models/language';
import Constants from '../../widget/common/helper/constants';
import {
  Language
} from '../../widget/common/controllers/language';
import {
  dummyData
} from '../content/JS/dummy-data';

import Enum from '../../widget/common/helper/enum';

buildfire.messaging.sendMessageToWidget({
  id: Enum.messageType.closeItem,
  openSubItemPage: false,
});
mocha.setup("bdd");
mocha.checkLeaks();
mocha.run().globals(["FastClick"]);


describe("Models", function () {
  let expect = chai.expect;
  describe("Products", function () {
    it("expect Product to be an object", function () {
      expect(Product).to.be.an("function");
    });
    var p = new Product();
    it("expect Product Have a title", function () {
      expect(p).to.have.property("title");
    });
    it("expect Product Have a profileImgUrl", function () {
      expect(p).to.have.property("profileImgUrl");
    });
    it("expect Product Have a coverImgUrl", function () {
      expect(p).to.have.property("coverImgUrl");
    });
  });
  describe("Introduction", function () {
    it("expect IntroductionItem to be an object", function () {
      expect(IntroductionItem).to.be.an("function");
    });
    var i = new IntroductionItem();
    it("expect IntroductionItem Have a description", function () {
      expect(i).to.have.property("description");
    });
    it("expect Product Have images", function () {
      expect(i).to.have.property("images");
    });
  });
  describe("Language", function () {
    it("expect LanguageItem to be an object", function () {
      expect(LanguageItem).to.be.an("function");
    });
    var l = new LanguageItem();
    it("expect LanguageItem Have a search", function () {
      expect(l).to.have.property("search");
    });
    it("expect Product Have a sortAsc", function () {
      expect(l).to.have.property("sortAsc");
    });
    it("expect Product Have a sortDesc", function () {
      expect(l).to.have.property("sortDesc");
    });
  });
});


describe("Content", function () {
  describe("ProductDetails", function () {
    describe("#insert()", function () {
      var product = new Product();
      product.title = "Test 1";
      product.description = "Test 1";
      product.profileImgUrl =
        "https://alnnibitpo.cloudimg.io/v7/https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg?func=crop&width=1080&height=1080";
      product.coverImgUrl =
        "https://alnnibitpo.cloudimg.io/v7/https://alnnibitpo.cloudimg.io/v7/https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg?func=crop&width=1080&height=607&func=crop&width=1215&height=683";
      product.subTitle = "Test Subtitle";

      it("should add new product", (done) => {
        Products.insert(product)
          .then((product) => {
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe("#bulkInsert()", function () {
      this.timeout(100000);
      it("should insert dummy data", (done) => {
        dummyData
          .insertDummyRecords()
          .then((result) => {
            console.log(result);
            done();
          })
          .catch((err) => {
            done(err);
          });
      })
    });

    describe("#insert Long Name()", function () {
      var product = new Product();
      product.title =
        "Tet asdas dasdddddddddddsa dasdd adasdadadadst 1 Tet asdas dasdddddddddddsa dasdd adasdadadadst 1 Tet asdas dasdddddddddddsa dasdd adasdadadadst 1";
      product.description =
        "Tet asdas dasdddddddddddsa dasdd adasdadadadst 1Tet asdas dasdddddddddddsa dasdd adasdadadadst 1Tet asdas dasdddddddddddsa dasdd adasdadadadst 1Tet asdas dasdddddddddddsa dasdd adasdadadadst 1Tet asdas dasdddddddddddsa dasdd adasdadadadst 1";
      product.profileImgUrl =
        "https://alnnibitpo.cloudimg.io/v7/https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg?func=crop&width=1080&height=1080";
      product.coverImgUrl =
        "https://alnnibitpo.cloudimg.io/v7/https://alnnibitpo.cloudimg.io/v7/https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg?func=crop&width=1080&height=607&func=crop&width=1215&height=683";
      product.subTitle =
        "Tet asdas dasdddddddddddsa dasdd adasdadadadst 1Tet asdas dasdddddddddddsa dasdd adasdadadadst 1Tet asdas dasdddddddddddsa dasdd adasdadadadst 1Tet asdas dasdddddddddddsa dasdd adasdadadadst 1Tet asdas dasdddddddddddsa dasdd adasdadadadst 1Tet asdas dasdddddddddddsa dasdd adasdadadadst 1Tet asdas dasdddddddddddsa dasdd adasdadadadst 1Tet asdas dasdddddddddddsa dasdd adasdadadadst 1Tet asdas dasdddddddddddsa dasdd adasdadadadst 1";

      it("should add new product", (done) => {
        Products.insert(product)
          .then((product) => {
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe("#update()", function () {
      it("should update product", (done) => {
        var searchOptions = {
          filter: {},
          sort: {},
          skip: 0,
          limit: 1,
        };
        Products.search(searchOptions)
          .then((products) => {
            if (products.length >= 0) {
              var editedProduct = products[0].data;

              editedProduct.title = "Updated";
              editedProduct.description = "UpdatedDesc";
              editedProduct.profileImgUrl =
                "https://alnnibitpo.cloudimg.io/v7/https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg?func=crop&width=1080&height=1080";
              editedProduct.coverImgUrl =
                "https://alnnibitpo.cloudimg.io/v7/https://alnnibitpo.cloudimg.io/v7/https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg?func=crop&width=1080&height=607&func=crop&width=1215&height=683";
              editedProduct.subTitle = "UpdatedTitle";

              Products.update(products[0].id, {
                  title: editedProduct.title,
                  description: editedProduct.description,
                  profileImgUrl: editedProduct.profileImgUrl,
                  coverImgUrl: editedProduct.coverImgUrl,
                  subTitle: editedProduct.subTitle,
                  creationDate: new Date(),
                })
                .then((result) => {
                  done();
                })
                .catch((err) => {
                  done(err);
                });
            } else {
              done("There are no products to update!");
            }
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });

  describe("ProductsList", function () {
    describe("#search()", function () {
      it("should search products with value Test 1", (done) => {
        var searchOptions = {
          filter: {
            $or: [{
                "$json.title": {
                  $regex: "Test 1",
                  $options: "-i",
                },
              },
              {
                "$json.subTitle": {
                  $regex: "Test 1",
                  $options: "-i",
                },
              },
            ],
          },
          sort: {
            creationDate: -1,
            title: 1,
          },
          skip: 0,
          limit: 1,
        };
        Products.search(searchOptions)
          .then((result) => {
            console.log(result);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });

  describe("ProductsList", function () {
    describe("#delete()", function () {
      it("should delete product", (done) => {
        var searchOptions = {
          filter: {},
          sort: {
            creationDate: 1,
            title: 1
          },
          skip: 0,
          limit: 1,
        };
        Products.search(searchOptions)
          .then((products) => {
            if (products.length >= 0) {
              Products.delete(products[0].id)
                .then((result) => {
                  done();
                })
                .catch((err) => {
                  done(err);
                });
            } else {
              done("There are no products to delete!");
            }
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe("#getProdByID()", function () {
      it("should Get product by ID", (done) => {
        var searchOptions = {
          filter: {},
          sort: {},
          skip: 0,
          limit: 1,
        };
        Products.search(searchOptions)
          .then((products) => {
            if (products.length >= 0) {
              Products.getById(products[0].id)
                .then((result) => {
                  console.log(result);
                  done();
                })
                .catch((err) => {
                  done(err);
                });
            } else {
              done("There are no products to Get!");
            }
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });
});

describe("Introduction", function () {
  describe("#Save", function () {
    var introduction = new IntroductionItem();
    introduction.description = "<h5>Test asdasdsa</h5>";
    introduction.images = [{
      action: "noAction",
      iconUrl: "https://s3-us-west-2.amazonaws.com/imageserver.prod/1649774124364-0019321411895620644/945ae700-bcc4-11ec-a150-391c0afe6247.jpg",
      title: "image",
    }, ];
    it("Should save introduction", (done) => {
      Introduction.save({
          description: introduction.description,
          images: introduction.images,
        })
        .then((result) => {
          done();
        })
        .catch((err2) => {
          done(err2);
        });
    });
  });

  describe("#Get", function () {
    it("Should get introductions", (done) => {
      Introduction.get()
        .then((result) => {
          done();
          console.log(result);
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});

describe("Language", function () {
  describe("#Save", function () {
    var data = {
      search: {
        value: "SearchTTTTTTTTTt",
        defaultValue: "Search"
      },
      sortAsc: {
        value: "Sort A-ZTTTTTT",
        defaultValue: "Sort A - Z"
      },
      sortDesc: {
        value: "Sort Z-ATTTTTT",
        defaultValue: "Sort Z - A"
      },
    };
    var language = new LanguageItem(data);

    it("Should save language", (done) => {
      Language.save(language, Constants.Collections.LANGUAGE + "en-us")
        .then((result) => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("#Get", function () {
    it("Should get language", (done) => {
      Language.get()
        .then((result) => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});


describe("Widget", function () {
  describe("ProductsList", function () {
    describe("#search()", function () {
      it("should get all products", (done) => {
        var searchOptions = {
          filter: {},
          sort: {},
          skip: 0,
        };
        Products.search(searchOptions)
          .then((products) => {
            console.log(products)
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe("#searchWithFilter()", function () {
      it("should get all products with title 'Item 2'", (done) => {
        var searchOptions = {
          filter: {
            $or: [
              {
                "$json.title": "Item 2",
              },
              {
                "$json.subTitle": "Item 2",
              },
            ],
          },
          sort: {},
          skip: 0,
        };
        Products.search(searchOptions)
          .then((products) => {
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe("#searchWithLargeFilter()", function () {
      it("should get all products with this filter", (done) => {
        var searchOptions = {
          filter: {
            $or: [
              {
                "$json.title": "Item 2Item 2Item 2Item 2Item 2Item 2Item 2",
              },
              {
                "$json.subTitle": "Item 2Item 2Item 2Item 2Item 2Item 2Item 2",
              },
            ],
          },
          sort: {},
          skip: 0,
        };
        Products.search(searchOptions)
          .then((products) => {
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe("#searchWithSortTitle()", function () {
      it("should get all products with Titles sorted Desc", (done) => {
        var searchOptions = {
          filter: {},
          sort: {
            title: -1,
          },
          skip: 0,
        };
        Products.search(searchOptions)
          .then((products) => {
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe("#searchWithSortSubTitle()", function () {
      it("should get all products with SubTitles sorted Asc", (done) => {
        var searchOptions = {
          filter: {},
          sort: {
            subTitle: 1,
          },
          skip: 0,
        };
        Products.search(searchOptions)
          .then((products) => {
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });
});


