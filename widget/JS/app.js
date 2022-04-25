let viewer = new buildfire.components.carousel.view(".carousel");
let description = document.getElementById("my_container_div");
let productClicked = null;
const listView = new buildfire.components.listView("listViewContainer", {
  enableAddButton: false,
});

buildfire.navigation.onBackButtonClick = () => {
  if (main.classList.contains("hidden")) {
    productClicked = null;
    itemTitle.innerHTML = "";
    itemSubTitle.innerHTML = "";
    main.classList.remove("hidden");
    subpage.classList.add("hidden");
    my_sub_container_div.innerHTML = "";
    coverImg.src = null;
    profileImg.src = null;
    body.scrollTo(0, 0);
  }
};

buildfire.messaging.onReceivedMessage = (message) => {
  console.log("Message received", message);
  if (message.openSub) {
    productClicked = message.itemClicked;
    itemTitle.innerHTML = message.itemClicked.data.title;
    itemSubTitle.innerHTML = message.itemClicked.data.subTitle;
    main.classList.add("hidden");
    subpage.classList.remove("hidden");
    my_sub_container_div.innerHTML = message.itemClicked.data.description;
    coverImg.src = message.itemClicked.data.coverImgUrl;
    profileImg.src = message.itemClicked.data.profileImgUrl;

    body.scrollTo(0, 0);
  } else {
    if (main.classList.contains("hidden")) {
      productClicked = null;
      itemTitle.innerHTML = "";
      itemSubTitle.innerHTML = "";
      main.classList.remove("hidden");
      subpage.classList.add("hidden");
      my_sub_container_div.innerHTML = "";
      coverImg.src = null;
      profileImg.src = null;
      body.scrollTo(0, 0);
    }
  }
};

listView.onItemClicked = (item) => {
  productClicked = item;
  itemTitle.innerHTML = item.data.title;
  itemSubTitle.innerHTML = item.data.subTitle;
  main.classList.add("hidden");
  subpage.classList.remove("hidden");
  my_sub_container_div.innerHTML = item.data.description;
  coverImg.src = item.data.coverImgUrl;
  profileImg.src = item.data.profileImgUrl;

  body.scrollTo(0, 0);
};
let lang = {};

function init() {
  this.getData();

  let timer;
  let t = this;
  searchTxt.addEventListener("keyup", function (event) {
    if (searchTxt.value != "") {
      carousel.classList.add("hidden");
      my_container_div.classList.add("hidden");
    } else {
      carousel.classList.remove("hidden");
      my_container_div.classList.remove("hidden");
    }
    listView.clear();
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log(1);
      t.skipIndex = 0;
      let sort = {
        creationDate: -1,
        title: 1,
      };
      t.search(sort, searchTxt.value, true, () => {});
    }, 500);
  });

  buildfire.datastore.onUpdate((response) => {
    if (response.tag == Constants.Collections.PRODUCTS) {
      listView.clear();
      let sort = {
        creationDate: -1,
        title: 1,
      };
      this.search(sort, "", false, () => {});
    }
    if (response.tag == Constants.Collections.INTRODUCTION) {
      description.innerHTML = response.data.description;
      viewer.loadItems(response.data.images);
    }
    if (response.tag == Constants.Collections.LANGUAGE + "en-us") {
      this.lang = response;
      searchTxt.setAttribute("placeholder", this.lang.data.search);
    }
  });
}

function imagePreview(img) {
  if (img == 1) {
    buildfire.imagePreviewer.show({
        images: [productClicked.data.coverImgUrl],
      },
      () => {
        console.log("Image previewer closed");
      }
    );
  } else {

    buildfire.imagePreviewer.show({
        images: [productClicked.data.profileImgUrl],
      },
      () => {
        console.log("Image previewer closed");
      }
    );
  }
}

skipIndex = 0;
limit = 10;

function getData() {
  var searchOptions = {
    filter: {},
    sort: {
      creationDate: -1,
      title: 1,
    },
    skip: this.skipIndex,
    limit: this.limit,
  };
  var promise1 = Introduction.get();
  var promise2 = Products.search(searchOptions);
  var promise3 = Language.get(Constants.Collections.LANGUAGE + "en-us");
  Promise.all([promise1, promise2, promise3]).then((results) => {
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

    this.lang = results[2];
    searchTxt.setAttribute("placeholder", this.lang.data.search);

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

  let sort = {
    creationDate: -1,
    title: 1,
  };
  this.search(sort, "", false, () => {
    callback();
  });
}

function search(sort, searchText, overwrite, callback) {
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
    sort: sort,
    skip: this.skipIndex * this.limit,
    limit: this.limit,
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
    if (overwrite) {
      listView.loadListViewItems(products);
    }
    this.endReached = result.length < this.limit;
    callback();
  });
}

function openSort() {
  let t = this;
  buildfire.components.drawer.open({
      listItems: [{
          id: 1,
          text: this.lang.data.sortAsc,
        },
        {
          id: -1,
          text: this.lang.data.sortDesc,
        },
      ],
    },
    (err, result) => {
      if (err) return console.error(err);
      buildfire.components.drawer.closeDrawer();
      listView.clear();
      let sort = {
        title: result.id,
        creationDate: -1,
      };
      t.search(sort, "", true, () => {});
    }
  );
}

init();