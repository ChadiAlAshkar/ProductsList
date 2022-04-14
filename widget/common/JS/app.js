// import IntroductionItem from "../class/Introduction.js";
// import Introduction from "../controllers/introduction.js";



function init() {
    // TestIntroduction();
    // TestProducts();
    // TestLanguage();
}

function TestIntroduction() {
    var introduction = new IntroductionItem();
    introduction.description = "";
    introduction.images = [{
            id: 1,
            url: "http://UpdatedDesc.com/400/200/"
        },
        {
            id: 2,
            url: "http://UpdatedDesc.com/400/200/"
        }
    ]
    Introduction.save(introduction).then((result) => {
        Introduction.get().then((result) => {
            console.log("Get Introduction::: ", result);
        }).catch((err) => {
            console.error("Error in getting Introduction::: ", err);
        });
    }).catch((err2) => {
        console.error("Error in saving Introduction::: ", err2);
    });
}

function TestProducts() {
    var product = new Product();
    product.title = "Item 2";
    product.description = "Test";
    product.profileImgUrl = "http://lorempixel.com/400/200/";
    product.coverImgUrl = "http://lorempixel.com/400/200/";
    product.subTitle = "Substitle";
    Products.insert(product).then(product => {
        console.log("Insert::: ", product);
    }).catch(err => {
        console.error(err);
    });

    var searchOptions = {
        "filter": {},
        "sort": {},
        "fields": [],
        "skip": 0,
        "limit": 20
    };
    Products.search(searchOptions).then(products => {
        console.log("Search::: ", products)
    }).catch(err => {
        console.error(err);
    });

    var id = "62582f13d633a0037f9da042";
    Products.getById(id).then(product => {
        console.log("GetByID::: ", product);
    }).catch(err => {
        console.error(err);
    });

    var product = new Product();
    product.title = "Updated";
    product.description = "UpdatedDesc";
    product.profileImgUrl = "http://UpdatedDesc.com/400/200/";
    product.coverImgUrl = "http://UpdatedDesc.com/400/200/";
    product.subTitle = "UpdatedTitle";
    Products.update(id, product).then(product => {
        console.log("update::: ", product)
    }).catch(err => {
        console.error(err);
    });

    Products.delete(id).then(result => {
        console.log("delete::: ", result)
    }).catch(err => {
        console.error(err);
    });
}

function TestLanguage() {
    var language = new LanguageItem();
    language.search = "Search";
    language.sortAZ = "Sort A-Z";
    language.sortZA = "Sort Z-A";

    Language.save(language).then((result) => {
        Language.get().then((result) => {
            console.log("Get Language::: ", result);
        }).catch((err) => {
            console.error("Error in getting Language::: ", err);
        });
    }).catch((err2) => {
        console.error("Error in saving Language::: ", err2);
    });
}

function registerEvents() {
    buildfire.analytics.registerEvent({
      title: "ProductsOpened",
      key: "PRODUCT_OPENED",
      description: "Occurs when a user gets a product ID"
    }, { silentNotifications: false });
  }

init();