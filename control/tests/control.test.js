describe("Content", function () {
    describe("ProductDetails", function () {
        describe("#insert()", function () {
            var product = new Product();
            product.title = "Testdasdsa";
            product.description = "Test dsadad";
            product.profileImgUrl = "http://lorempixel.com/400/200/";
            product.coverImgUrl = "http://lorempixel.com/400/200/";
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
                            products[0].title = "Updated";
                            products[0].description = "UpdatedDesc";
                            products[0].profileImgUrl =
                                "http://UpdatedDesc.com/400/200/";
                            products[0].coverImgUrl = "http://UpdatedDesc.com/400/200/";
                            products[0].subTitle = "UpdatedTitle";
                            Products.update(products[0].id, products[0])
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
    });

    describe("ProductsList", function () {
        describe("#delete()", function () {
            it("should delete product", (done) => {
                var searchOptions = {
                    filter: {},
                    sort: {},
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
        introduction.description = "";
        introduction.images = [{
                id: 1,
                url: "http://UpdatedDesc.com/400/200/",
            },
            {
                id: 2,
                url: "http://UpdatedDesc.com/400/200/",
            },
        ];
        it("Should save introduction", (done) => {
            Introduction.save(introduction)
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
                })
                .catch((err) => {
                    done(err);
                });
        });
    });
});

describe("Language", function () {
    describe("#Save", function () {
        var language = new LanguageItem();
        language.search = "Search";
        language.sortAsc = "Sort A-Z";
        language.sortDesc = "Sort Z-A";

        it("Should save language", (done) => {
            Language.save(language)
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