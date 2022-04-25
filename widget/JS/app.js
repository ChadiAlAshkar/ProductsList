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

skipIndex = 0;
limit = 10;
function getData() {
  var searchOptions = {
    filter: {},
    sort: {},
    skip: this.skipIndex,
    limit: this.limit,
  };
  console.log(this.limit);
  var promise1 = Introduction.get();
  var promise2 = Products.search(searchOptions);
  Promise.all([promise1, promise2]).then((results) => {
    console.log(results[1]);
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
    if (results[1].length < this.limit) {
      isLoadingProductsDone = false;
    }
    viewer.loadItems(results[0].data.images);
    description.innerHTML = results[0].data.description;

    listView
      .loadListViewItems(products)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {});
  });
  let t = this;
  listViewContainer.onscroll = (e) => {
    if (
      t.listViewContainer.scrollTop / t.listViewContainer.scrollHeight >
      0.8
    ) {
      this._fetchNextPage();
    }
  };
}
var endReached = false;
var fetchingNextPage = false;

function _fetchNextPage() {
  console.log(this.fetchingNextPage);
  if (this.fetchingNextPage) return;
  this.fetchingNextPage = true;

  getNextData(() => {
    console.log("HIIII");
    this.fetchingNextPage = false;
  });
}

function getNextData(callback) {
  console.log(endReached);
  if (this.skipIndex > 0 && this.endReached) return;
  skipIndex++;
  console.log(skipIndex);

  var searchOptions = {
    filter: {},
    sort: {},
    skip: this.skipIndex * this.limit,
    limit: this.limit,
    fields: ["id", "title", "profileImgUrl", "subtitle", "description"],
  };

  Products.search(searchOptions).then((result) => {
    result.forEach((element) => {
      var t = new ListViewItem();
      t.id = element.id;
      t.title = element.data.title;
      t.description = element.data.description;
      t.imageUrl = element.data.profileImgUrl;
      t.subTitle = element.data.subTitle;
      t.data = element.data;
      listView.addItem(t);
    });
    console.log(result.length);
    this.endReached = result.length < this.limit;
    callback();
  });
}
init();
