let viewer = new buildfire.components.carousel.view(".carousel");
let description = document.getElementById("my_container_div");

const listView = new buildfire.components.listView("listViewContainer", {
  enableAddButton: false,
});

function init() {
  this.getData();

  let timer;
  let t = this;
  searchTxt.addEventListener("keyup", function (event) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log(1)
      t.skipIndex = 0;
      t.search(searchTxt.value, true, () => {

      });
    }, 500);
  });

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
    sort: {
      creationDate: -1,
      title: 1
    },
    skip: this.skipIndex,
    limit: this.limit,
  };
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
      endReached = false;
    }
    viewer.loadItems(results[0].data.images);
    description.innerHTML = results[0].data.description;

    listView.loadListViewItems(products);
  });
  let t = this;
  listViewContainer.onscroll = (e) => {
    if (
      t.listViewContainer.scrollTop / t.listViewContainer.scrollHeight >
      0.2
    ) {
      this._fetchNextPage();
    }
  };
}
var endReached = false;
var fetchingNextPage = false;

function _fetchNextPage() {
  if (this.fetchingNextPage) return;
  this.fetchingNextPage = true;

  getNextData(() => {
    this.fetchingNextPage = false;
  });
}

function getNextData(callback) {
  if (this.skipIndex > 0 && this.endReached) return;
  skipIndex++;

  this.search("", false, () => {
    callback();
  });
}

function search(searchText, overwrite, callback) {
  console.log(2)
  console.log(searchText)
  var searchOptions = {
    filter: {
      $or: [{
          "$json.title": {
            $regex: searchText,
            $options: "-i",
          },
        },
        {
          "$json.subTitle": {
            $regex: searchText,
            $options: "-i",
          },
        },
      ],
    },
    sort: {
      creationDate: -1,
      title: 1
    },
    skip: this.skipIndex * this.limit,
    limit: this.limit
  };

  Products.search(searchOptions).then((result) => {
    let products = [];
    result.forEach((element) => {
      var t = new ListViewItem();
      t.id = element.id;
      t.title = element.data.title;
      t.description = element.data.description;
      t.imageUrl = element.data.profileImgUrl;
      t.subTitle = element.data.subTitle;
      t.data = element.data;
      if (!overwrite) {
        listView.addItem(t);
      } else {
        products.push(t);
      }
    });
    console.log(listView)
    if (overwrite) {
      listView.loadListViewItems(products);
    }
    this.endReached = result.length < this.limit;
    callback();
  });
}
init();