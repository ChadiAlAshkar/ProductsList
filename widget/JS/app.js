let viewer = new buildfire.components.carousel.view(".carousel");
let productClicked = null;
var isSelectedProductBookmarked = false;
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
  sortAsc: {
    title: 1,
    creationDate: -1,
  },
  sortDesc: {
    title: -1,
    creationDate: -1,
  },
  lang: {},
  appTheme: {},
  fillingCover: false,
  fillingProfile: false,
  skeletonItems: 4,
  bookmarksEnabled: false,
  notesEnabled: false,
  sharingEnabled: false,
  currentPage: 0,
  Design: {},
  style: {
    listLayout: "",
    detailsLayout: "",
  },
};

function init() {
  buildSkeletonUI(true, config.skeletonItems);
  loadCustomCss();
  loadData();
  setupHandlers();
}

function buildSkeletonUI(showCarousel, nbOfItems) {
  if (showCarousel) {
    ui.createElement("div", skeleton, "", ["carouselLoad", "loadColor"]);
  }
  ui.createElement("div", skeleton, "", ["user-card"]);
  for (var i = 0; i < nbOfItems; i++) {
    var itemLoadClass = "item1Load";
    if (showCarousel) {
      if (i != 0) {
        itemLoadClass = "item2Load";
      }
    } else {
      itemLoadClass = "item3Load";
    }
    let listViewItemLoad = ui.createElement("div", skeleton, "", [
      itemLoadClass,
      "listViewItem",
    ]);
    let listViewItemImg = ui.createElement("div", listViewItemLoad, "", [
      "listViewItemImgContainer",
    ]);
    ui.createElement("div", listViewItemImg, "", [
      "listViewItemImg",
      "loadColor",
    ]);
    let listViewItemCopy = ui.createElement("div", listViewItemLoad, "", [
      "listViewItemCopy",
      "ellipsis",
      "padded",
      "padded--m",
    ]);
    ui.createElement("div", listViewItemCopy, "", ["textLoad", "loadColor"]);
  }
}

function loadCustomCss() {
  buildfire.appearance.getAppTheme((err, appTheme) => {
    if (err) return console.error(err);
    config.appTheme = appTheme;
    document
      .getElementsByClassName("icon")[0]
      .style.setProperty("color", appTheme.colors.icons, "important");
    document
      .getElementsByClassName("icon")[1]
      .style.setProperty("color", appTheme.colors.icons, "important");
    document
      .getElementsByClassName("icon")[2]
      .style.setProperty("color", appTheme.colors.icons, "important");
    for (
      var i = 0;
      i < document.getElementsByClassName("loadColor").length;
      i++
    ) {
      document
        .getElementsByClassName("loadColor")
        [i].style.setProperty(
          "background",
          appTheme.colors.bodyText,
          "important"
        );
    }
    coverImg.style.backgroundColor = appTheme.colors.bodyText;
    profileImg.style.backgroundColor = appTheme.colors.backgroundColor;
    document
      .getElementById("searchTxt")
      .style.setProperty("--c", appTheme.colors.bodyText);
    document
      .getElementById("itemTitle")
      .style.setProperty("color", appTheme.colors.headerText, "important");
    document
      .getElementById("itemSubTitle")
      .style.setProperty("color", appTheme.colors.headerText, "important");
  });
}

function clearSubItem() {
  let productIndex = listView.items.indexOf(productClicked);
  if (Config.bookmarksEnabled) {
    if (productIndex != -1) {
      listView.items[productIndex].action = {
        icon: isSelectedProductBookmarked
          ? "material-icons material-inject--star"
          : "material-icons material-inject--empty_star",
      };
      listView.items[productIndex].update();
    }
  }

  iconsContainer.innerHTML = "";
  productClicked = null;
  itemTitle.innerHTML = "";
  itemSubTitle.innerHTML = "";
  main.classList.remove("hidden");
  subpage.classList.add("hidden");
  wysiwygItemContent.innerHTML = "";
  coverImgBody.src = "";
  profileImgBody.src = "";
  body.scrollTo(0, 0);
}

function fillSubItem(item) {
  loadActionItems(item);
  buildfire.history.push("ProductDetails");
  productClicked = item;
  itemTitle.innerHTML = item.data.title;
  itemSubTitle.innerHTML = item.data.subTitle;
  main.classList.add("hidden");
  subpage.classList.remove("hidden");
  wysiwygItemContent.innerHTML = item.data.description;
  if (!config.fillingCover) {
    config.fillingCover = true;
    animateImg(coverImgBody, item.data.coverImgUrl, 500);
  }
  if (!config.fillingProfile) {
    config.fillingProfile = true;
    animateImg(profileImgBody, item.data.profileImgUrl, 1000);
  }
  body.scrollTo(0, 0);
}

function animateImg(element, imgUrl, duration) {
  setTimeout(() => {
    element.src = imgUrl;
    element.animate(
      [
        {
          opacity: 0.1,
        },
        {
          opacity: 0.5,
        },
        {
          opacity: 1,
        },
      ],
      {
        duration: 200,
        iterations: 1,
      }
    );
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
    coverImgBody.src.endsWith("styles/media/holder-16x9.png") &&
    profileImgBody.src.endsWith("styles/media/holder-1x1.png")
  ) {
    emptyProds2.classList.remove("hidden");
    coverImg.classList.add("hidden");
    profileImg.classList.add("hidden");
    itemTitle.classList.add("hidden");
    itemSubTitle.classList.add("hidden");
    wysiwygItemContent.classList.add("hidden");
  } else {
    emptyProds2.classList.add("hidden");
    coverImg.classList.remove("hidden");
    profileImg.classList.remove("hidden");
    itemTitle.classList.remove("hidden");
    itemSubTitle.classList.remove("hidden");
    wysiwygItemContent.classList.remove("hidden");
  }
}

function setupHandlers() {
  let timer;

  listView.onItemActionClicked = (item) => {
    updateProductBookmard(item);
  };

  buildfire.history.onPop((breadcrumb) => {
    if (main.classList.contains("hidden")) {
      clearSubItem();
      sendMessageToControl(false, "");
    }
  });
  sortIcon.addEventListener("click", openSortDrawer);
  coverImgBody.addEventListener("click", () => {
    imagePreview(coverImgBody.src);
  });
  profileImgBody.addEventListener("click", () => {
    imagePreview(profileImgBody.src);
  });
  listView.onItemClicked = (item) => {
    fillSubItem(item);
    Analytics.trackAction(item.id);
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
              profileImgBody.src = "../../../styles/media/holder-1x1.png";
            } else {
              if (!config.fillingProfile) {
                config.fillingProfile = true;
                animateImg(profileImgBody, message.data, 1000);
              }
            }
            break;
          case Enum.messageType.coverImg:
            if (message.data == "") {
              coverImgBody.src = "../../../styles/media/holder-16x9.png";
            } else {
              if (!config.fillingCover) {
                config.fillingCover = true;
                animateImg(coverImgBody, message.data, 500);
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
    switch (response.tag) {
      case Constants.Collections.PRODUCTS:
        _onProductUpdate(response);
        break;
      case Constants.Collections.INTRODUCTION:
        _onIntroductionUpdate(response);
        break;
      case Constants.Collections.LANGUAGE + "en-us":
        _onLanguageUpdate(response);
        break;
      case Constants.Collections.CONFIG:
        _onConfigUpdate(response);
      case Constants.Collections.DESIGN:
        _onDesignUpdate(response);
        break;
    }
  });

  function searchInputHandler() {
    clearTimeout(timer);
    if (searchTxt.value != "") {
      if (!carousel.classList.contains("hidden")) {
        products = [];
        products = listView.items;
      }
      clearIcon.classList.remove("hidden");
      sortIcon.classList.add("hidden");
      carousel.classList.add("hidden");
      wysiwygContent.classList.add("hidden");
      skeleton.innerHTML = "";
      emptyProds.classList.add("hidden");
      buildSkeletonUI(false, 4);
      skeleton.classList.remove("hidden");
      for (
        var i = 0;
        i < document.getElementsByClassName("loadColor").length;
        i++
      ) {
        document
          .getElementsByClassName("loadColor")
          [i].style.setProperty(
            "background",
            config.appTheme.colors.bodyText,
            "important"
          );
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
      clearIcon.classList.add("hidden");
      sortIcon.classList.remove("hidden");
      skeleton.classList.add("hidden");
      carousel.classList.remove("hidden");
      wysiwygContent.classList.remove("hidden");
      config.skipIndex = config.oldSkipIndex;
      config.endReached = config.oldEndReached;
      config.fetchingNextPage = false;
      mainItems.scrollTo(0, 0);
      listView.clear();
      listView.loadListViewItems(products);
    }
  }
  clearIcon.addEventListener("click", (event) => {
    searchTxt.value = "";
    searchInputHandler();
  });
  searchTxt.addEventListener("keyup", function (event) {
    searchInputHandler();
  });
}

function _onProductUpdate(response) {
  listView.clear();
  config.skipIndex = 0;
  config.endReached = false;
  searchProducts(config.defaultSort, "", false, false, () => {
    config.fetchingNextPage = false;
  });
}

function _onConfigUpdate(response) {
  if (response.data.bookmarks) {
    buildfire.bookmarks.getAll((err, bookmarks) => {
      listView.items.forEach((item) => {
        let isProductBookmarked = false;
        for (let i = 0; i < bookmarks.length; i++) {
          if (bookmarks[i].id == item.id) {
            isProductBookmarked = true;
            break;
          }
        }
        if (isProductBookmarked) {
          item.action = {
            icon: "material-icons material-inject--star",
          };
        } else {
          item.action = {
            icon: "material-icons material-inject--empty_star",
          };
        }
      });

      var products = listView.items;
      listView.clear();
      listView.loadListViewItems(products);

      if (productClicked) {
        let isProductClickedBookmarked = false;
        for (let i = 0; i < bookmarks.length; i++) {
          if (bookmarks[i].id == productClicked.id) {
            isProductClickedBookmarked = true;
            break;
          }
        }
        if (isProductClickedBookmarked) {
          starId.innerHTML = "star";
          starId.classList.remove("hidden");
        } else {
          starId.innerHTML = "star_outline";
          starId.classList.remove("hidden");
        }
      }
    });
    Config.bookmarksEnabled = true;
  } else if (!response.data.bookmarks) {
    if (productClicked) {
      console.log("i");
      starId.innerHTML = "";
      starId.classList.add("hidden");
    }
    listView.items.forEach((item) => {
      item.action = null;
    });
    var productsList = listView.items;
    listView.clear();
    listView.loadListViewItems(productsList);
    Config.bookmarksEnabled = false;
  }

  if (!response.data.notes) {
    if (productClicked) {
      if (noteId) {
        noteId.innerHTML = "";
        noteId.classList.add("hidden");
      }
    }
    Config.notesEnabled = false;
  } else if (response.data.notes) {
    if (productClicked) {
      if (noteId) {
        noteId.innerHTML = "note";
        noteId.classList.remove("hidden");
      }
    }
    Config.notesEnabled = true;
  }

  if (!response.data.sharings) {
    if (productClicked) {
      if (shareId) {
        shareId.innerHTML = "";
        shareId.classList.add("hidden");
      }
    }
    Config.sharingEnabled = false;
  } else if (response.data.sharings) {
    if (productClicked) {
      if (shareId) {
        shareId.innerHTML = "share";
        shareId.classList.remove("hidden");
      }
    }
    Config.sharingEnabled = true;
  }
}

function _onIntroductionUpdate(response) {
  wysiwygContent.innerHTML = response.data.description;
  viewer.loadItems(response.data.images);
  if (
    listView.items.length == 0 &&
    response.data.images.length == 0 &&
    response.data.description == ""
  ) {
    listViewContainer.classList.add("hidden");
    emptyProds.classList.remove("hidden");
  } else {
    listViewContainer.classList.remove("hidden");
    emptyProds.classList.add("hidden");
  }
}

function _onLanguageUpdate(response) {
  config.lang = response;
  searchTxt.setAttribute(
    "placeholder",
    config.lang.data.search.value != ""
      ? config.lang.data.search.value
      : config.lang.data.search.defaultValue
  );
}

function _onDesignUpdate(response) {
  config.Design = response.data;
  updateDesign();
}

function updateProductBookmard(item) {
  if (Config.bookmarksEnabled) {
    if (JSON.stringify(item.action.icon).includes("empty")) {
      Bookmark.add(
        { id: item.id, title: item.data.title, icon: item.action.icon },
        () => {
          item.action.icon = "material-icons material-inject--star";
          item.update();
          let bookmarkAddedValue =
            config.lang.data.bookmarkAdded.value == ""
              ? config.lang.data.bookmarkAdded.defaultValue
              : config.lang.data.bookmarkAdded.value;
          buildfire.components.toast.showToastMessage({
            text: bookmarkAddedValue,
          });
        }
      );
    } else {
      Bookmark.delete(item.id, () => {
        item.action.icon = "material-icons material-inject--empty_star";
        item.update();
        let bookmarkRemovedValue =
          config.lang.data.bookmarkAdded.value == ""
            ? config.lang.data.bookmarkRemoved.defaultValue
            : config.lang.data.bookmarkRemoved.value;
        buildfire.components.toast.showToastMessage({
          text: bookmarkRemovedValue,
        });
      });
    }
  }
}

function imagePreview(imageUrl) {
  buildfire.imagePreviewer.show({
    images: [imageUrl],
  });
}

function updateDesign() {

  body.classList.add("hidden");
  if (config.style.listLayout != "" && config.style.detailsLayout != "") {
    document
      .getElementsByTagName("head")[0]
      .removeChild(config.style.listLayout);
    document
      .getElementsByTagName("head")[0]
      .removeChild(config.style.detailsLayout);
  }
  config.style.listLayout = document.createElement("link");
  config.style.detailsLayout = document.createElement("link");

  config.style.listLayout.rel = "stylesheet";
  config.style.listLayout.type = "text/css";

  config.style.detailsLayout.rel = "stylesheet";
  config.style.detailsLayout.type = "text/css";

  if (config.Design.listLayout == 1) {
    config.style.listLayout.setAttribute("href", "./styles/listLayout1.css");
  } else {
    config.style.listLayout.setAttribute("href", "./styles/listLayout2.css");
  }
  if (config.Design.detailsLayout == 1) {
    config.style.detailsLayout.setAttribute(
      "href",
      "./styles/detailsLayout1.css"
    );
  } else {
    config.style.detailsLayout.setAttribute(
      "href",
      "./styles/detailsLayout2.css"
    );
  }
  document.getElementsByTagName("head")[0].appendChild(config.style.listLayout);
  document
    .getElementsByTagName("head")[0]
    .appendChild(config.style.detailsLayout);

    setTimeout(()=>{
      body.classList.remove("hidden");
    },100);
}

function loadData() {
  listViewContainer.classList.remove("listViewContainer");
  var searchOptions = {
    filter: {},
    sort: config.defaultSort,
    skip: config.skipIndex,
    limit: config.limit,
  };
  var promise1 = Introduction.get();
  var promise2 = Products.search(searchOptions);
  var promise3 = Language.get(Constants.Collections.LANGUAGE + "en-us");
  var promise4 = Config.get();
  var promise5 = Design.get();
  Promise.all([promise1, promise2, promise3, promise4, promise5]).then(
    (results) => {
      products = [];

      //let notesEnabled = results[3].data.boo
      if (results && results.length > 3) {
        Config.bookmarksEnabled = results[3].data.bookmarks;
        Config.notesEnabled = results[3].data.notes;
        Config.sharingEnabled = results[3].data.sharings;

        config.Design = results[4].data;

        updateDesign();
        if (results[1] && results[1].length > 0) {
          buildfire.bookmarks.getAll((err, bookmarks) => {
            if (err) return console.error(err);
            results[1].forEach((element) => {
              var t = new ListViewItem();
              t.id = element.id;
              t.title = element.data.title;
              t.description = element.data.subTitle;
              t.imageUrl = element.data.profileImgUrl;
              t.data = element.data;
              let isProductBookmardExist = false;
              if (Config.bookmarksEnabled) {
                for (let i = 0; i < bookmarks.length; i++) {
                  if (bookmarks[i].id == element.id) {
                    isProductBookmardExist = true;
                    break;
                  }
                }
                if (isProductBookmardExist) {
                  t.action = {
                    icon: "material-icons material-inject--star",
                  };
                } else {
                  t.action = {
                    icon: "material-icons material-inject--empty_star",
                  };
                }
              }

              products.push(t);
            });
            if (results[1].length < config.limit) {
              config.endReached = false;
            }
            listView.loadListViewItems(products);
          });
        }
        if (results[0] && results[0].data) {
          if (results[0].data.images) viewer.loadItems(results[0].data.images);
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
                defaultValue:
                  stringsConfig[sectionKey].labels[labelKey].defaultValue,
                required: stringsConfig[sectionKey].labels[labelKey].required,
              };
            }
          }

          var language = new LanguageItem();
          for (let sectionKey in obj) {
            for (let labelKey in obj[sectionKey]) {
              language[labelKey].value = "";
              language[labelKey].defaultValue =
                obj[sectionKey][labelKey].defaultValue;
            }
          }

          config.lang = {
            data: language,
          };
        }

        searchTxt.setAttribute(
          "placeholder",
          config.lang.data.search.value != ""
            ? config.lang.data.search.value
            : config.lang.data.search.defaultValue
        );

        if (
          (!results[0] ||
            results[0].data ||
            results[0].data.images.length == 0) &&
          (!results[1] || results[1].length == 0) &&
          (!results[2] || isEmpty(results[2].data))
        ) {
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
    }
  );
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
      $or: [
        {
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
    for (
      var i = 0;
      i < document.getElementsByClassName("loadColor").length;
      i++
    ) {
      document
        .getElementsByClassName("loadColor")
        [i].style.setProperty(
          "background",
          config.appTheme.colors.bodyText,
          "important"
        );
    }
  }
  Products.search(searchOptions).then((result) => {
    let products = [];
    result.forEach((element) => {
      buildfire.bookmarks.getAll((err, bookmarks) => {
        if (err) return console.error(err);
        var t = new ListViewItem();
        t.id = element.id;
        t.title = element.data.title;
        t.description = element.data.subTitle;
        t.imageUrl = element.data.profileImgUrl;
        t.data = element.data;
        let isProductBookmardExist = false;
        if (Config.bookmarksEnabled) {
          for (let i = 0; i < bookmarks.length; i++) {
            if (bookmarks[i].id == element.id) {
              isProductBookmardExist = true;
              break;
            }
          }
          if (isProductBookmardExist) {
            t.action = {
              icon: "material-icons material-inject--star",
            };
          } else {
            t.action = {
              icon: "material-icons material-inject--empty_star",
            };
          }
        }
        if (!overwrite) {
          listView.addItem(t);
        } else {
          products.push(t);
        }

        if (overwrite) {
          listView.loadListViewItems(products);
        }
        config.endReached = result.length < config.limit;
        skeleton.classList.add("hidden");
        if (
          carousel.classList.contains("hidden") &&
          wysiwygContent.classList.contains("hidden")
        ) {
          if (config.skipIndex == 0 && result.length == 0) {
            listViewContainer.classList.add("hidden");
            emptyProds.classList.remove("hidden");
          } else {
            listViewContainer.classList.remove("hidden");
            emptyProds.classList.add("hidden");
          }
        } else {
          if (
            config.skipIndex == 0 &&
            result.length == 0 &&
            viewer.items.length == 0 &&
            wysiwygContent.innerHTML == ""
          ) {
            listViewContainer.classList.add("hidden");
            emptyProds.classList.remove("hidden");
          } else {
            listViewContainer.classList.remove("hidden");
            emptyProds.classList.add("hidden");
          }
        }
        callback();
      });
    });
    if (result.length === 0 && carousel.classList.contains("hidden")
    &&wysiwygContent.classList.contains("hidden")) {
      console.log(products.length);
      skeleton.classList.add("hidden");
      emptyProds.classList.remove("hidden");
    }
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
  buildfire.components.drawer.open(
    {
      listItems: [
        {
          sort: config.sortAsc,
          text:
            config.lang.data.sortAsc.value != ""
              ? config.lang.data.sortAsc.value
              : config.lang.data.sortAsc.defaultValue,
        },
        {
          sort: config.sortDesc,
          text:
            config.lang.data.sortDesc.value != ""
              ? config.lang.data.sortDesc.value
              : config.lang.data.sortDesc.defaultValue,
        },
      ],
    },
    (err, result) => {
      if (err) return console.error(err);
      buildfire.components.drawer.closeDrawer();
      listView.clear();
      config.skipIndex = 0;
      searchProducts(result.sort, searchTxt.value, true, false, () => {
        config.fetchingNextPage = false;
      });
    }
  );
}

function loadActionItems(item) {
  buildfire.bookmarks.getAll((err, bookmarks) => {
    let isProductBookmardExist = false,
      bookmarkElement;
    if (err) return console.error(err);

    ui.createElement(
      "span",
      iconsContainer,
      "share",
      ["material-icons", "icon"],
      "shareId"
    );

    ui.createElement(
      "span",
      iconsContainer,
      "note",
      ["material-icons", "icon"],
      "noteId"
    );
    document.getElementById("noteId").addEventListener("click", () => {
      buildfire.notes.openDialog(
        {
          itemId: productClicked.id,
          title: productClicked.data.title,
          imageUrl: productClicked.data.profileImgUrl,
        },
        (err, data) => {
          if (err) return console.error(err);

          const { hasNotes, noteCount, itemId } = data;

          if (hasNotes) {
            console.log(`Video with id ${itemId} has ${noteCount} notes!`);
          } else {
            console.log(`No notes yet!`);
          }
        }
      );
    });
    document.getElementById("shareId").addEventListener("click", () => {
      buildfire.deeplink.generateUrl(
        {
          data: { productId: productClicked.id },
        },
        (err, result) => {
          if (err) {
            console.error(err);
          } else {
            buildfire.device.share(
              {
                subject: productClicked.data.title,
                text: productClicked.data.description,
                image: productClicked.data.profileImgUrl,
                link: result.url,
              },
              function (err, result) {
                if (err) alert(err);
                else alert("sharing invoked");
              }
            );
          }
        }
      );
    });

    for (let i = 0; i < bookmarks.length; i++) {
      if (bookmarks[i].id == item.id) {
        isProductBookmardExist = true;
        break;
      }
    }
    if (isProductBookmardExist) {
      bookmarkElement = ui.createElement(
        "span",
        iconsContainer,
        "star",
        ["material-icons", "icon", "bookmarkActive"],
        "starId"
      );
    } else {
      bookmarkElement = ui.createElement(
        "span",
        iconsContainer,
        "star_outline",
        ["material-icons", "icon"],
        "starId"
      );
    }
    bookmarkElement.addEventListener("click", () => {
      if (bookmarkElement.classList.contains("bookmarkActive")) {
        bookmarkElement.classList.remove("bookmarkActive");
        Bookmark.delete(item.id, () => {
          bookmarkElement.innerHTML = "star_outline";
        });
        isSelectedProductBookmarked = false;
        buildfire.components.toast.showToastMessage({
          text: config.lang.data.bookmarkRemoved.value,
        });
      } else {
        isSelectedProductBookmarked = true;
        bookmarkElement.classList.add("bookmarkActive");
        Bookmark.add({ id: item.id, title: item.data.title }, () => {
          bookmarkElement.innerHTML = "star";
          buildfire.components.toast.showToastMessage({
            text: config.lang.data.bookmarkAdded.value,
          });
        });
      }
    });
    if (!Config.sharingEnabled) {
      shareId.innerHTML = "";
    }
    if (!Config.notesEnabled) {
      noteId.innerHTML = "";
    }
    if (!Config.bookmarksEnabled) {
      starId.innerHTML = "";
    }
  });
}
init();
