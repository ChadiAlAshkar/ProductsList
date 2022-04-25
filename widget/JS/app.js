let viewer = new buildfire.components.carousel.view(".carousel");
let description = document.getElementById("my_container_div");

const listView = new buildfire.components.listView("listViewContainer", {
  enableAddButton: false,
});
function init() {
  this.getData();

  buildfire.datastore.onUpdate((response) => {
    if (response.tag == Constants.Collections.PRODUCTS) {
      console.log("Products updated");
    }
    if (response.tag == Constants.Collections.INTRODUCTION) {
      description.innerHTML = response.data.description;
      viewer.loadItems(response.data.images);
    }
  });
}
function getData() {
  var searchOptions = {
    filter: {},
    sort: {},
    skip: 0,
    limit: 20,
    fields: ["id", "title", "profileImgUrl", "subtitle", "description"],
  };

  var promise1 = Introduction.get();
  var promise2 = Products.search(searchOptions);
  Promise.all([promise1, promise2]).then((results) => {
    products = [];
    results[1].forEach((element) => {
      var t = new ListViewItem();
      t.id = element.id;
      t.title = element.data.title;
      t.description = element.data.description;
      t.imageUrl = element.data.profileImgUrl;
      t.subTitle = element.data.subTitle;
      t.data = element.data;
      products.push(t);
    });
    console.log(listView.items);
    viewer.loadItems(results[0].data.images);
    description.innerHTML = results[0].data.description;

    listView
      .loadListViewItems(products)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {});
  });
}

init();
