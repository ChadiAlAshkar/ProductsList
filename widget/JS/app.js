let viewer = new buildfire.components.carousel.view(".carousel");
let productClicked = null;
const listView = new buildfire.components.listView("listViewContainer", {
  enableAddButton: false,
});
var products = [];
var config = {
  skipIndex: 0,
  oldSkipIndex: 0,
  limit: 10,
  endReached: false,
  oldEndReached: false,
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
  buildSkeletonUI(true, config.skeletonItems);
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
    config.appTheme = appTheme;
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
  buildfire.history.push("ProductDetails");
  productClicked = item;
  itemTitle.innerHTML = item.data.title;
  itemSubTitle.innerHTML = item.data.subTitle;
  main.classList.add("hidden");
  subpage.classList.remove("hidden");
  wysiwygItemContent.innerHTML = item.data.description;
  if (!config.fillingCover) {
    config.fillingCover = true;
    animateImg(coverImgBody, item.data.coverImgUrl, 500)
  }
  if (!config.fillingProfile) {
    config.fillingProfile = true;
    animateImg(profileImgBody, item.data.profileImgUrl, 1000)
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
    config.fillingProfile = false;
    config.fillingCover = false;
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
  buildfire.history.onPop((breadcrumb) => {
    if (main.classList.contains("hidden")) {
      clearSubItem();
      sendMessageToControl(false, "");
    }
  });
  sortIcon.addEventListener('click', openSortDrawer);
  coverImgBody.addEventListener('click', () => {
    imagePreview(coverImgBody.src);
  });
  profileImgBody.addEventListener('click', () => {
    imagePreview(profileImgBody.src);
  });
  listView.onItemClicked = (item) => {
    fillSubItem(item);
    Analytics.trackAction(Analytics.events.PRODUCT_VIEWED);
    sendMessageToControl(true, productClicked);
  };

  mainItems.onscroll = (e) => {
    if (
      (mainItems.scrollTop + mainItems.clientHeight) / mainItems.scrollHeight >
      0.8
    ) {
      _fetchNextPage();
    }
  };

  buildfire.navigation.onBackButtonClick = () => {
    buildfire.history.pop();

  };

  buildfire.messaging.onReceivedMessage = (message) => {
    if (message) {
      if (message.id) {

        switch (message.id) {
          case Enum.messageType.profileImg:
            if (message.data == "") {
              profileImgBody.src = "../../../styles/media/holder-1x1.png"
            } else {
              if (!config.fillingProfile) {
                config.fillingProfile = true;
                animateImg(profileImgBody, message.data, 1000)
              }
            }
            break;
          case Enum.messageType.coverImg:
            if (message.data == "") {
              coverImgBody.src = "../../../styles/media/holder-16x9.png"
            } else {
              if (!config.fillingCover) {
                config.fillingCover = true;
                animateImg(coverImgBody, message.data, 500)

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
      config.skipIndex = 0;
      config.endReached = false;
      searchProducts(config.defaultSort, "", false, false, () => {
        config.fetchingNextPage = false;
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
      config.lang = response;
      searchTxt.setAttribute("placeholder", (config.lang.data.search.value != "" ? config.lang.data.search.value : config.lang.data.search.defaultValue));
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
      emptyProds.classList.add("hidden");
      buildSkeletonUI(false, 4);
      skeleton.classList.remove("hidden");
      for (var i = 0; i < document.getElementsByClassName('loadColor').length; i++) {
        document.getElementsByClassName('loadColor')[i].style.setProperty('background', config.appTheme.colors.bodyText, 'important');
      }
      listView.clear();
      timer = setTimeout(() => {
        config.oldSkipIndex = config.skipIndex;
        config.oldEndReached = config.endReached;
        config.skipIndex = 0;
        config.endReached = false;
        searchProducts(config.defaultSort, searchTxt.value, true, true, () => {
          config.fetchingNextPage = false;
        });
      }, 500);

    } else {
      if (products.length > 0) {

        listViewContainer.classList.remove("hidden");
        emptyProds.classList.add("hidden");
      } else {
        listViewContainer.classList.add("hidden");
        emptyProds.classList.remove("hidden");
      }
      skeleton.classList.add("hidden");
      carousel.classList.remove("hidden");
      wysiwygContent.classList.remove("hidden");
      config.skipIndex = config.oldSkipIndex;
      config.endReached = config.oldEndReached;
      config.fetchingNextPage = false;
      config.defaultSort = {
        creationDate: -1,
        title: 1,
      };
      mainItems.scrollTo(0, 0);
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
    skip: config.skipIndex,
    limit: config.limit,
  };
  var promise1 = Introduction.get();
  var promise2 = Products.search(searchOptions);
  var promise3 = Language.get(Constants.Collections.LANGUAGE + "en-us");
  Promise.all([promise1, promise2, promise3]).then((results) => {
    products = [];
    if (results && results.length > 2) {
      if (results[1] && results[1].length > 0) {
        results[1].forEach((element) => {
          var t = new ListViewItem();
          t.id = element.id;
          t.title = element.data.title;
          t.description = element.data.subTitle;
          t.imageUrl = element.data.profileImgUrl;
          t.data = element.data;
          products.push(t);
        });
        if (results[1].length < config.limit) {
          config.endReached = false;
        }
        listView.loadListViewItems(products);
      }

      if (results[0] && results[0].data) {
        if (results[0].data.images)
          viewer.loadItems(results[0].data.images);
        if (results[0].data.description)
          wysiwygContent.innerHTML = results[0].data.description;
      }

      if (results[2] && !isEmpty(results[2].data)) {
        config.lang = results[2];
      } else {

        let obj = {};
        for (let sectionKey in stringsConfig) {
          let section = (obj[sectionKey] = {});
          for (let labelKey in stringsConfig[sectionKey].labels) {
            section[labelKey] = {
              defaultValue: stringsConfig[sectionKey].labels[labelKey].defaultValue,
              required: stringsConfig[sectionKey].labels[labelKey].required,
            };
          }
        }

        var language = new LanguageItem();
        for (let sectionKey in obj) {
          for (let labelKey in obj[sectionKey]) {
            language[labelKey].value = "";
            language[labelKey].defaultValue = obj[sectionKey][labelKey].defaultValue;
          }
        }

        config.lang = {
          data: language
        }
      }

      searchTxt.setAttribute("placeholder", (config.lang.data.search.value != "" ? config.lang.data.search.value : config.lang.data.search.defaultValue));

      if (
        (!results[0] || results[0].data || results[0].data.images.length == 0) &&
        (!results[1] || results[1].length == 0) &&
        (!results[2] || isEmpty(results[2].data))) {
        listViewContainer.classList.add("hidden");
        emptyProds.classList.remove("hidden");
      }

    } else {
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

function isEmpty(obj) {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
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
    skip: config.skipIndex * config.limit,
    limit: config.limit,
  };

  if (!fromSearchBar) {
    skeleton.innerHTML = "";
    if (config.skipIndex == 0) {
      buildSkeletonUI(false, 4);
    } else {
      buildSkeletonUI(false, 1);
    }

    skeleton.classList.remove("hidden");
    for (var i = 0; i < document.getElementsByClassName('loadColor').length; i++) {
      document.getElementsByClassName('loadColor')[i].style.setProperty('background', config.appTheme.colors.bodyText, 'important');
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
    config.endReached = result.length < config.limit;
    skeleton.classList.add("hidden");
    if (carousel.classList.contains("hidden") && wysiwygContent.classList.contains("hidden")) {
      if (config.skipIndex == 0 && result.length == 0) {
        listViewContainer.classList.add("hidden");
        emptyProds.classList.remove("hidden");
      } else {
        listViewContainer.classList.remove("hidden");
        emptyProds.classList.add("hidden");
      }
    } else {
      if (config.skipIndex == 0 && result.length == 0 && viewer.items.length == 0 && wysiwygContent.innerHTML == "") {
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
  if (config.fetchingNextPage) return;
  config.fetchingNextPage = true;
  if (config.skipIndex > 0 && config.endReached) return;
  config.skipIndex++;
  searchProducts(config.defaultSort, "", false, false, () => {
    config.fetchingNextPage = false;
  });
}

function openSortDrawer() {
  let t = this;
  buildfire.components.drawer.open({
      listItems: [{
          id: 1,
          text: (config.lang.data.sortAsc.value != "" ? config.lang.data.sortAsc.value : config.lang.data.sortAsc.defaultValue),
        },
        {
          id: -1,
          text: (config.lang.data.sortDesc.value != "" ? config.lang.data.sortDesc.value : config.lang.data.sortDesc.defaultValue),
        },
      ],
    },
    (err, result) => {
      if (err) return console.error(err);
      buildfire.components.drawer.closeDrawer();
      listView.clear();
      config.defaultSort = {
        title: result.id,
        creationDate: -1,
      };
      config.skipIndex = 0;
      searchProducts(config.defaultSort, searchTxt.value, true, false, () => {
        config.fetchingNextPage = false;
      });
    }
  );
}

init();