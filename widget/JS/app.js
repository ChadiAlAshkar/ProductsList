let viewer = new buildfire.components.carousel.view(".carousel");
let productClicked = null;
const listView = new buildfire.components.listView("listViewContainer", {
  enableAddButton: false,
});
var products = [];
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
  appTheme: {},
  fillingCover: false,
  fillingProfile: false,
  skeletonItems: 4
};

function init() {
  buildSkeletonUI(true, this.config.skeletonItems);
  loadCustomCss();
  loadData();
  setupHandlers();
}

function buildSkeletonUI(showCarousel, nbOfItems) {
  if (showCarousel) {
    ui.createElement('div', skeleton, "", ["carouselLoad", "loadColor"]);
  }
  ui.createElement('div', skeleton, "", ["user-card"]);
  for (var i = 0; i < nbOfItems; i++) {
    var itemLoadClass = "item1Load";
    if (showCarousel) {
      if (i != 0) {
        itemLoadClass = "item2Load";
      }
    } else {
      itemLoadClass = "item3Load";
    }
    let listViewItemLoad = ui.createElement('div', skeleton, "", [itemLoadClass, "listViewItem"]);
    let listViewItemImg = ui.createElement('div', listViewItemLoad, "", ["listViewItemImgContainer"]);
    ui.createElement('div', listViewItemImg, "", ["listViewItemImg", "loadColor"]);
    let listViewItemCopy = ui.createElement('div', listViewItemLoad, "", ["listViewItemCopy", "ellipsis", "padded", "padded--m"]);
    ui.createElement('div', listViewItemCopy, "", ["textLoad", "loadColor"]);
  }
}

function loadCustomCss() {
  buildfire.appearance.getAppTheme((err, appTheme) => {
    if (err) return console.error(err);
    this.config.appTheme = appTheme;
    document.getElementsByClassName('icon')[0].style.setProperty('color', appTheme.colors.icons, 'important');
    document.getElementsByClassName('icon')[1].style.setProperty('color', appTheme.colors.icons, 'important');
    for (var i = 0; i < document.getElementsByClassName('loadColor').length; i++) {
      document.getElementsByClassName('loadColor')[i].style.setProperty('background', appTheme.colors.bodyText, 'important');
    }
    coverImg.style.backgroundColor = appTheme.colors.bodyText;
    profileImg.style.backgroundColor = appTheme.colors.backgroundColor;
    document.getElementById('searchTxt').style.setProperty("--c", appTheme.colors.bodyText);
    document.getElementById('itemTitle').style.setProperty('color', appTheme.colors.headerText, 'important');
    document.getElementById('itemSubTitle').style.setProperty('color', appTheme.colors.headerText, 'important');
  });

}

function clearSubItem() {
  productClicked = null;
  itemTitle.innerHTML = "";
  itemSubTitle.innerHTML = "";
  main.classList.remove("hidden");
  subpage.classList.add("hidden");
  wysiwygItemContent.innerHTML = "";
  coverImgBody.src = '';
  profileImgBody.src = '';
  body.scrollTo(0, 0);
}

function fillSubItem(item) {
  productClicked = item;
  itemTitle.innerHTML = item.data.title;
  itemSubTitle.innerHTML = item.data.subTitle;
  main.classList.add("hidden");
  subpage.classList.remove("hidden");
  wysiwygItemContent.innerHTML = item.data.description;
  if (!this.config.fillingCover) {
    this.config.fillingCover = true;
    this.animateImg(coverImgBody, item.data.coverImgUrl, 500)
  }
  if (!this.config.fillingProfile) {
    this.config.fillingProfile = true;
    this.animateImg(profileImgBody, item.data.profileImgUrl, 1000)
  }
  body.scrollTo(0, 0);
}

function animateImg(element, imgUrl, duration) {
  setTimeout(() => {
    element.src = imgUrl;
    element.animate(
      [{
          opacity: .1
        },
        {
          opacity: .5
        },
        {
          opacity: 1
        }
      ], {
        duration: 200,
        iterations: 1
      }
    )
    this.config.fillingProfile = false;
    this.config.fillingCover = false;
    checkIfItemDetailsEmpty();
  }, duration);
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

function checkIfItemDetailsEmpty() {
  if (
    itemTitle.innerHTML == "" &&
    itemSubTitle.innerHTML == "" &&
    wysiwygItemContent.innerHTML == "" &&
    coverImgBody.src.endsWith('styles/media/holder-16x9.png') &&
    profileImgBody.src.endsWith('styles/media/holder-1x1.png')
  ) {
    emptyProds2.classList.remove("hidden")
    coverImg.classList.add("hidden")
    profileImg.classList.add("hidden")
    itemTitle.classList.add("hidden")
    itemSubTitle.classList.add("hidden")
    wysiwygItemContent.classList.add("hidden")
  } else {
    emptyProds2.classList.add("hidden")
    coverImg.classList.remove("hidden")
    profileImg.classList.remove("hidden")
    itemTitle.classList.remove("hidden")
    itemSubTitle.classList.remove("hidden")
    wysiwygItemContent.classList.remove("hidden")
  }
}

function setupHandlers() {
  let timer;
  let t = this;

  listView.onItemClicked = (item) => {
    fillSubItem(item);
    sendMessageToControl(true, productClicked);
  };

  mainItems.onscroll = (e) => {
    if (
      (t.mainItems.scrollTop + t.mainItems.clientHeight) / t.mainItems.scrollHeight >
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
    if (message) {
      if (message.id) {

        switch (message.id) {
          case Enum.messageType.profileImg:
            if (message.data == "") {
              profileImgBody.src = "../../../styles/media/holder-1x1.png"
            } else {
              if (!this.config.fillingProfile) {
                this.config.fillingProfile = true;
                this.animateImg(profileImgBody, message.data, 1000)
              }
            }
            break;
          case Enum.messageType.coverImg:
            if (message.data == "") {
              coverImgBody.src = "../../../styles/media/holder-16x9.png"
            } else {
              if (!this.config.fillingCover) {
                this.config.fillingCover = true;
                this.animateImg(coverImgBody, message.data, 500)

              }
            }
            break;
          case Enum.messageType.title:
            itemTitle.innerHTML = message.data;
            break;
          case Enum.messageType.subTitle:
            itemSubTitle.innerHTML = message.data;
            break;
          case Enum.messageType.description:
            wysiwygItemContent.innerHTML = message.data;
            break;
          case Enum.messageType.newItem:
            main.classList.add("hidden");
            subpage.classList.remove("hidden");
            break;
          case Enum.messageType.editItem:
            fillSubItem(message.itemClicked);
            break;
          case Enum.messageType.closeItem:
            if (main.classList.contains("hidden")) {
              clearSubItem();
            }
            break;
        }
        checkIfItemDetailsEmpty();
      }
    }
  };

  buildfire.datastore.onUpdate((response) => {
    if (response.tag == Constants.Collections.PRODUCTS) {
      listView.clear();
      this.config.skipIndex = 0;
      this.config.endReached = false;
      t.searchProducts(t.config.defaultSort, "", false, false, () => {
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
    clearTimeout(timer);
    if (searchTxt.value != "") {
      if (!carousel.classList.contains("hidden")) {
        products = [];
        products = listView.items;
      }
      carousel.classList.add("hidden");
      wysiwygContent.classList.add("hidden");
      skeleton.innerHTML = "";
      buildSkeletonUI(false, 4);
      skeleton.classList.remove("hidden");
      for (var i = 0; i < document.getElementsByClassName('loadColor').length; i++) {
        document.getElementsByClassName('loadColor')[i].style.setProperty('background', t.config.appTheme.colors.bodyText, 'important');
      }
      listView.clear();
      timer = setTimeout(() => {
        t.config.skipIndex = 0;
        t.searchProducts(t.config.defaultSort, searchTxt.value, true, true, () => {
          t.config.fetchingNextPage = false;
        });
      }, 500);

    } else {
      skeleton.classList.add("hidden");
      carousel.classList.remove("hidden");
      wysiwygContent.classList.remove("hidden");
      listView.clear();
      listView.loadListViewItems(products);
    }
  });
}

function imagePreview(imageUrl) {
  buildfire.imagePreviewer.show({
    images: [imageUrl],
  });
}

function loadData() {
  listViewContainer.classList.remove('listViewContainer');
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
      t.description = element.data.subTitle;
      t.imageUrl = element.data.profileImgUrl;
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
    skeleton.classList.add("hidden");
    main.classList.remove("hidden");
    carousel.classList.remove("hidden");
    wysiwygContent.classList.remove("hidden");
    listViewContainer.classList.remove("hidden");
  });
}

function searchProducts(sort, searchText, overwrite, fromSearchBar, callback) {
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

  if (!fromSearchBar) {
    skeleton.innerHTML = "";
    if (this.config.skipIndex == 0) {
      buildSkeletonUI(false, 4);
    } else {
      buildSkeletonUI(false, 1);
    }

    skeleton.classList.remove("hidden");
    for (var i = 0; i < document.getElementsByClassName('loadColor').length; i++) {
      document.getElementsByClassName('loadColor')[i].style.setProperty('background', this.config.appTheme.colors.bodyText, 'important');
    }
  }
  Products.search(searchOptions).then((result) => {
    let products = [];
    result.forEach((element) => {
      var t = new ListViewItem();
      t.id = element.id;
      t.title = element.data.title;
      t.description = element.data.subTitle;
      t.imageUrl = element.data.profileImgUrl;
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
    skeleton.classList.add("hidden");
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
  this.searchProducts(this.config.defaultSort, "", false, false, () => {
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
      t.searchProducts(sort, "", true, false, () => {
        this.config.fetchingNextPage = false;
      });
    }
  );
}

init();