let viewer = new buildfire.components.carousel.view(".carousel");
let productClicked = null;
const listView = new buildfire.components.listView("listViewContainer", {
  enableAddButton: false,
});

var config = {
  skipIndex: 0,
  limit: 10,
  endReached: false,
  fetchingNextPage: false,
  defaultSort: {
    creationDate: -1,
    title: 1,
  },
  lang: {},
  appTheme: {}
};

function init() {
  buildfire.appearance.getAppTheme((err, appTheme) => {
    if (err) return console.error(err);
    this.config.appTheme = appTheme.color;
    document.getElementsByClassName('icon')[0].style.setProperty('color', appTheme.colors.icons, 'important');
    document.getElementsByClassName('icon')[1].style.setProperty('color', appTheme.colors.icons, 'important');
  
  });


  this.loadData();
  this.setupHandlers();
}

function clearSubItem() {
  productClicked = null;
  itemTitle.innerHTML = "";
  itemSubTitle.innerHTML = "";
  main.classList.remove("hidden");
  subpage.classList.add("hidden");
  wysiwygItemContent.innerHTML = "";
  coverImg.src = null;
  profileImg.src = null;
  body.scrollTo(0, 0);
}

function fillSubItem(item) {
  productClicked = item;
  itemTitle.innerHTML = item.data.title;
  itemSubTitle.innerHTML = item.data.subTitle;
  main.classList.add("hidden");
  subpage.classList.remove("hidden");
  wysiwygItemContent.innerHTML = item.data.description;
  coverImg.src = item.data.coverImgUrl;
  profileImg.src = item.data.profileImgUrl;
  body.scrollTo(0, 0);
}

function sendMessageToControl(isOpeningSubItemPage, item) {
  buildfire.messaging.sendMessageToControl({
    openSubItemPage: isOpeningSubItemPage,
    itemClicked: {
      data: item.data,
      id: item.id,
    },
  });
}

function setupHandlers() {
  let timer;
  let t = this;

  listView.onItemClicked = (item) => {
    fillSubItem(item);
    sendMessageToControl(true, productClicked);
  };

  listViewContainer.onscroll = (e) => {
    if (
      (t.listViewContainer.scrollTop + t.listViewContainer.clientHeight) / t.listViewContainer.scrollHeight >
      0.8
    ) {
      this._fetchNextPage();
    }
  };

  buildfire.navigation.onBackButtonClick = () => {
    if (main.classList.contains("hidden")) {
      clearSubItem();
      sendMessageToControl(false, "");
    }
  };

  buildfire.messaging.onReceivedMessage = (message) => {
    console.log(message.id)
    if(message.id) {
      if(message.id == 1){
        if(message.data == ""){
          profileImg.src = "../../../styles/media/holder-1x1.png"
        } else {
          profileImg.src = message.data;
        }
      } else if(message.id = 2){
        if(message.data == ""){
          coverImg.src = "../../../styles/media/holder-16x9.png"
        } else {
          coverImg.src = message.data;
        }
      } else if(message.id = 3){
        itemTitle.innerHTML = message.data;
      }
    } else {
      if (message.openSubItemPage) {
        fillSubItem(message.itemClicked);
      } else {
        if (main.classList.contains("hidden")) {
          clearSubItem();
        }
      }
    }
   
  };

  buildfire.datastore.onUpdate((response) => {
    if (response.tag == Constants.Collections.PRODUCTS) {
      listView.clear();
      this.config.skipIndex = 0;
      this.config.endReached = false;
      t.searchProducts(t.config.defaultSort, "", false, () => {
        this.config.fetchingNextPage = false;
      });
    }
    if (response.tag == Constants.Collections.INTRODUCTION) {
      wysiwygContent.innerHTML = response.data.description;
      viewer.loadItems(response.data.images);
      if (listView.items.length == 0 && response.data.images.length == 0 && response.data.description == "") {
        listViewContainer.classList.add("hidden");
        emptyProds.classList.remove("hidden");
      } else {
        listViewContainer.classList.remove("hidden");
        emptyProds.classList.add("hidden");
      }
    }
    if (response.tag == Constants.Collections.LANGUAGE + "en-us") {
      t.config.lang = response;
      searchTxt.setAttribute("placeholder", t.config.lang.data.search);
    }
  });

  searchTxt.addEventListener("keyup", function (event) {
    if (searchTxt.value != "") {
      carousel.classList.add("hidden");
      wysiwygContent.classList.add("hidden");
    } else {
      carousel.classList.remove("hidden");
      wysiwygContent.classList.remove("hidden");
    }
    listView.clear();
    clearTimeout(timer);
    timer = setTimeout(() => {
      t.config.skipIndex = 0;
      t.searchProducts(t.config.defaultSort, searchTxt.value, true, () => {
        this.config.fetchingNextPage = false;
      });
    }, 500);
  });
}

function imagePreview(imageUrl) {
  buildfire.imagePreviewer.show({
    images: [imageUrl],
  });
}

function loadData() {
  var searchOptions = {
    filter: {},
    sort: {
      creationDate: -1,
      title: 1,
    },
    skip: this.config.skipIndex,
    limit: this.config.limit,
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
    if (results[1].length < this.config.limit) {
      this.config.endReached = false;
    }
    viewer.loadItems(results[0].data.images);
    wysiwygContent.innerHTML = results[0].data.description;

    this.config.lang = results[2];
    searchTxt.setAttribute("placeholder", this.config.lang.data.search);

    listView.loadListViewItems(products);

    if (results[1].length == 0 && results[0].data.images.length == 0 && results[0].data.description == "") {
      listViewContainer.classList.add("hidden");
      emptyProds.classList.remove("hidden");
    }
    main.classList.remove("hidden")
  });
}

function searchProducts(sort, searchText, overwrite, callback) {
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
    skip: this.config.skipIndex * this.config.limit,
    limit: this.config.limit,
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
    this.config.endReached = result.length < this.config.limit;
    if (carousel.classList.contains("hidden") && wysiwygContent.classList.contains("hidden")) {
      if (this.config.skipIndex == 0 && result.length == 0) {
        listViewContainer.classList.add("hidden");
        emptyProds.classList.remove("hidden");
      } else {
        listViewContainer.classList.remove("hidden");
        emptyProds.classList.add("hidden");
      }
    } else {
      if (this.config.skipIndex == 0 && result.length == 0 && viewer.items.length == 0 && wysiwygContent.innerHTML == "") {
        listViewContainer.classList.add("hidden");
        emptyProds.classList.remove("hidden");
      } else {
        listViewContainer.classList.remove("hidden");
        emptyProds.classList.add("hidden");
      }
    }
    callback();
  });
}

function _fetchNextPage() {
  if (this.config.fetchingNextPage) return;
  this.config.fetchingNextPage = true;

  if (this.config.skipIndex > 0 && this.config.endReached) return;
  this.config.skipIndex++;
  this.searchProducts(this.config.defaultSort, "", false, () => {
    this.config.fetchingNextPage = false;
  });
}

function openSortDrawer() {
  let t = this;
  buildfire.components.drawer.open({
      listItems: [{
          id: 1,
          text: this.config.lang.data.sortAsc,
        },
        {
          id: -1,
          text: this.config.lang.data.sortDesc,
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
      t.searchProducts(sort, "", true, () => {
        this.config.fetchingNextPage = false;
      });
    }
  );
}

init();