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
