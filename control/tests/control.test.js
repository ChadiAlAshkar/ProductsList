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
            $or: [
              {
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
          sort: { creationDate: 1, title: 1 },
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
    introduction.images = [
      {
        action: "noAction",
        iconUrl:
          "https://s3-us-west-2.amazonaws.com/imageserver.prod/1649774124364-0019321411895620644/945ae700-bcc4-11ec-a150-391c0afe6247.jpg",
        title: "image",
      },
    ];
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
      search: "SearchTTTTTTTTTt",
      sortAsc: "Sort A-ZTTTTTT",
      sortDesc: "Sort Z-ATTTTTT",
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
