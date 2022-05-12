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
  sortAsc: {
    title: 1,
    creationDate: -1,
  },
  sortDesc: {
    title: -1,
    creationDate: -1,
  },
  lang: {},
  settings: new SettingsItem({
    bookmarks: false,
    notes: false,
    sharing: false,
  }),
  appTheme: {},
  fillingCover: false,
  fillingProfile: false,
  skeletonItems: 4,
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
    for (
      var i = 0; i < document.getElementsByClassName("loadColor").length; i++
    ) {
      document
        .getElementsByClassName("loadColor")[i].style.setProperty(
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
  if (listView.items.indexOf(productClicked) != -1) {
    listView.items[listView.items.indexOf(productClicked)].action = {
      icon: finalStarState,
    };
  }

  var products = listView.items;
  listView.clear();
  listView.loadListViewItems(products);
  setStarColor();

  productClicked = null;
  itemTitle.innerHTML = "";
  itemSubTitle.innerHTML = "";
  finalStarState = "";

  main.classList.remove("hidden");
  subpage.classList.add("hidden");
  wysiwygItemContent.innerHTML = "";
  coverImgBody.src = "";
  profileImgBody.src = "";
  body.scrollTo(0, 0);
}

function setStarColor() {
  for (
    var i = 0; i < document.getElementsByClassName("starIcnCol").length; i++
  ) {
    document
      .getElementsByClassName("starIcnCol")[i].style.setProperty("color", config.appTheme.colors.icons, "important");
  }
}

function fillSubItem(item) {
  action.innerHTML = "";
  buildfire.bookmarks.getAll((err, bookmarks) => {
    if (err) console.error(err);
    buildfire.history.push("ProductDetails");
    productClicked = item;
    itemTitle.innerHTML = item.data.title;
    itemSubTitle.innerHTML = item.data.subTitle;

    if (config.settings.sharing) {
      let shareIcon = ui.createElement("span", action, "share", [
        "material-icons",
        "icon",
        "iconsDet",
      ]);
      shareIcon.addEventListener("click", () => {
        buildfire.deeplink.generateUrl({
            data: {
              ItemId: item.id,
            },
          },
          (err, result) => {
            if (err) {
              console.error(err);
            } else {
              buildfire.device.share({
                subject: "Share Product",
                text: item.data.title,
                image: item.data.profileImg,
                link: result.url
              }, function (err, result) {
                if (err)
                  alert(err);
                else
                  alert('sharing invoked');
              });
            }
          }
        );

      });
      shareIcon.setAttribute("id", "shareIcn");
    } else {
      let shareIcon = ui.createElement("span", action, "", [
        "material-icons",
        "icon",
        "iconsDet",
      ]);
      shareIcon.setAttribute("id", "shareIcn");
      shareIcon.addEventListener("click", () => {
        buildfire.deeplink.generateUrl({
            data: {
              ItemId: item.id,
            },
          },
          (err, result) => {
            if (err) {
              console.error(err);
            } else {
              buildfire.device.share({
                subject: "Share Product",
                text: item.data.title,
                image: item.data.profileImg,
                link: result.url
              }, function (err, result) {
                if (err)
                  alert(err);
                else
                  alert('sharing invoked');
              });
            }
          }
        );

      });
    }

    if (config.settings.notes) {
      let notes = ui.createElement("span", action, "note", [
        "material-icons",
        "icon",
        "iconsDet",
      ]);
      notes.setAttribute("id", "noteIcn");
      notes.addEventListener("click", () => {
        buildfire.auth.getCurrentUser((err, user) => {
          if (err) return console.error(err);
          if (!user) {
            buildfire.auth.login({}, (err, user) => {
              console.log(err, user);
            });
          } else {
            buildfire.notes.openDialog({
                itemId: item.id,
                title: item.data.title,
                imageUrl: item.data.profileImgUrl,
              },
              (err, data) => {
                if (err) return console.error(err);
                const {
                  hasNotes,
                  noteCount,
                  itemId
                } = data;
                if (hasNotes) {
                  console.log(
                    `Product with id ${itemId} has ${noteCount} notes!`
                  );
                } else {
                  console.log(`No notes yet!`);
                }
              }
            );
          }
        });
      });
    } else {
      let notes = ui.createElement("span", action, "", [
        "material-icons",
        "icon",
        "iconsDet",
      ]);
      notes.setAttribute("id", "noteIcn");
    }

    if (config.settings.bookmarks) {
      let found = false;
      for (let i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].id == item.id) {
          found = true;
          break;
        }
      }
      let bookmrk;
      if (found) {
        bookmrk = ui.createElement("span", action, "star", [
          "material-icons",
          "icon",
          "iconsDet",
        ]);
        finalStarState = "material-icons material-inject--star starIcnCol";
      } else {
        bookmrk = ui.createElement("span", action, "star_outline", [
          "material-icons",
          "icon",
          "iconsDet",
        ]);
        finalStarState = "material-icons material-inject--star_outline starIcnCol";
      }

      bookmrk.setAttribute("id", "starIcon");

      bookmrk.addEventListener("click", () => {
        addBookmark(item, bookmrk);
      });
    } else {
      bookmrk = ui.createElement("span", action, "", [
        "material-icons",
        "icon",
        "iconsDet",
      ]);
      bookmrk.setAttribute("id", "starIcon");
    }

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
  });
}

finalStarState = "";

function addBookmark(item, element) {
  buildfire.auth.getCurrentUser((err, user) => {
    if (err) return console.error(err);

    if (!user) {
      buildfire.auth.login({}, (err, user) => {
        console.log(err, user);
      });
    } else {
      if (element.innerHTML == "star_outline") {
        buildfire.bookmarks.add({
            id: item.id,
            title: item.data.title,
            icon: item.data.profileImgUrl,
          },
          (err, bookmark) => {
            if (err) return console.error(err);
            element.innerHTML = "star";
            finalStarState = "material-icons material-inject--star starIcnCol";
            showToastMessage(1);
          }
        );
      } else {
        buildfire.bookmarks.delete(item.id, () => {
          element.innerHTML = "star_outline";
          finalStarState = "material-icons material-inject--star_outline starIcnCol";
          showToastMessage(2);
        });
      }
    }
  });
}

function showToastMessage(id) {
  let message = "";
  if (id == 1) {
    message = config.lang.data.bookAdd.value != "" ?
      config.lang.data.bookAdd.value :
      config.lang.data.bookAdd.defaultValue
  } else {
    message = config.lang.data.bookRemove.value != "" ?
      config.lang.data.bookRemove.value :
      config.lang.data.bookRemove.defaultValue
  }
  buildfire.dialog.toast({
    message: message,
    duration: 4000,
    hideDismissButton: true
  });
}

function animateImg(element, imgUrl, duration) {
  setTimeout(() => {
    element.src = imgUrl;
    element.animate(
      [{
          opacity: 0.1,
        },
        {
          opacity: 0.5,
        },
        {
          opacity: 1,
        },
      ], {
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
  console.log(item);
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
  buildfire.history.onPop((breadcrumb) => {
    if (main.classList.contains("hidden")) {
      clearSubItem();
      sendMessageToControl(false, "");
    }
  });

  sortIcon.addEventListener("click", openSortDrawer);
  gradientDiv.addEventListener("click", () => {
    imagePreview(coverImgBody.src);
  });

  profileImgBody.addEventListener("click", () => {
    imagePreview(profileImgBody.src);
  });

  listView.onItemClicked = (item) => {
    fillSubItem(item);
    Analytics.trackAction(item.id);
    sendMessageToControl(true, item);
  };

  listView.onItemActionClicked = (item) => {
    buildfire.auth.getCurrentUser((err, user) => {
      if (err) return console.error(err);

      if (!user) {
        buildfire.auth.login({}, (err, user) => {
          console.log(err, user);
        });
      } else {
        if (item.action.icon == "material-icons material-inject--star starIcnCol") {
          buildfire.bookmarks.delete(item.id, () => {
            item.action.icon = "material-icons material-inject--star_outline starIcnCol";
            item.update();
            setStarColor();
            showToastMessage(2);
          });
        } else {
          console.log(item);
          buildfire.bookmarks.add({
              id: item.id,
              title: item.data.title,
              icon: item.data.profileImgUrl,
              // payload: {
              //   data: {
              //     myData: "Hello World"
              //   },
              // },
            },
            (err, bookmark) => {
              if (err) return console.error(err);

              item.action.icon = "material-icons material-inject--star starIcnCol";
              item.update();
              setStarColor();
              showToastMessage(1);
            }
          );
        }
      }
    });
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
    if (response.tag == Constants.Collections.LANGUAGE + "en-us") {
      config.lang = response;
      searchTxt.setAttribute(
        "placeholder",
        config.lang.data.search.value != "" ?
        config.lang.data.search.value :
        config.lang.data.search.defaultValue
      );
    }
    if (response.tag == Constants.Collections.SETTINGS) {
      if (config.settings.bookmarks && !response.data.bookmarks) {
        listView.items.forEach((itm) => {
          itm.action = null;
        });
        var products = listView.items;
        listView.clear();
        listView.loadListViewItems(products);

        if (productClicked) {
          if (starIcon) {
            starIcon.innerHTML = "";
          }
        }
      } else if (!config.settings.bookmarks && response.data.bookmarks) {
        buildfire.auth.getCurrentUser((err, user) => {
          if (err) return console.error(err);

          if (!user) {
            listView.items.forEach((itm) => {
              itm.action = {
                icon: "material-icons material-inject--star_outline starIcnCol",
              };
            });
            var products = listView.items;
            listView.clear();
            listView.loadListViewItems(products);
            setStarColor();

            if (productClicked) {
              starIcon.innerHTML = "star_outline";
              finalStarState = "material-icons material-inject--star_outline starIcnCol";
            }
          } else {
            buildfire.bookmarks.getAll((err, bookmarks) => {
              if (err) return console.error(err);

              listView.items.forEach((item) => {
                let found = false;
                for (let i = 0; i < bookmarks.length; i++) {
                  if (bookmarks[i].id == item.id) {
                    found = true;
                    break;
                  }
                }
                if (found) {
                  item.action = {
                    icon: "material-icons material-inject--star starIcnCol",
                  };
                } else {
                  item.action = {
                    icon: "material-icons material-inject--star_outline starIcnCol",
                  };
                }
              });

              var products = listView.items;
              listView.clear();
              listView.loadListViewItems(products);
              setStarColor();

              if (productClicked) {
                let found1 = false;
                for (let i = 0; i < bookmarks.length; i++) {
                  if (bookmarks[i].id == productClicked.id) {
                    found1 = true;
                    break;
                  }
                }

                if (found1) {
                  starIcon.innerHTML = "star";
                  finalStarState = "material-icons material-inject--star starIcnCol";
                } else {
                  starIcon.innerHTML = "star_outline";
                  finalStarState = "material-icons material-inject--star_outline starIcnCol";
                }
              }
            });
          }
        });
      }

      if (config.settings.notes && !response.data.notes) {
        if (productClicked) {
          if (noteIcn) {
            noteIcn.innerHTML = "";
          }
        }
      } else if (!config.settings.notes && response.data.notes) {
        if (productClicked) {
          if (noteIcn) {
            noteIcn.innerHTML = "note";
          }
        }
      }

      if (config.settings.sharing && !response.data.sharing) {
        if (productClicked) {
          if (shareIcn) {
            shareIcn.innerHTML = "";
          }
        }
      } else if (!config.settings.sharing && response.data.sharing) {
        if (productClicked) {
          if (shareIcn) {
            shareIcn.innerHTML = "share";
          }
        }
      }
      config.settings = response.data;
    }
    if(response.tag == Constants.Collections.DESIGN){
      document.getElementsByTagName("head")[0].removeChild(config.style.sheetDesign);
      document.getElementsByTagName("head")[0].removeChild(config.style.sheetList);
        console.log("design data -=> ", response.data);
        config.style.sheetList = document.createElement('link');
        config.style.sheetList.setAttribute('rel', "stylesheet");
        
        config.style.sheetDesign = document.createElement('link');
        config.style.sheetDesign.setAttribute('rel', "stylesheet");

        if(response.data.list == 2){
          config.style.sheetList.setAttribute('href', "./styleList2.css")
        }else{
          config.style.sheetList.setAttribute('href', "./styleList1.css")
        }

        if(response.data.details == 2){
          config.style.sheetDesign.setAttribute('href', "./styleDetails2.css")
          // console.log("change design" , sheetDesign);
        }else{
          config.style.sheetDesign.setAttribute('href', "./styleDetails1.css")
        }

        document.getElementsByTagName("head")[0].appendChild(config.style.sheetDesign);
        document.getElementsByTagName("head")[0].appendChild(config.style.sheetList);
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
      for (
        var i = 0; i < document.getElementsByClassName("loadColor").length; i++
      ) {
        document
          .getElementsByClassName("loadColor")[i].style.setProperty(
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
      skeleton.classList.add("hidden");
      carousel.classList.remove("hidden");
      wysiwygContent.classList.remove("hidden");
      config.skipIndex = config.oldSkipIndex;
      config.endReached = config.oldEndReached;
      config.fetchingNextPage = false;
      mainItems.scrollTo(0, 0);
      listView.clear();
      listView.loadListViewItems(products);
      setStarColor();
    }
  });

  buildfire.auth.onLogin((user) => {
    buildfire.bookmarks.getAll((err, bookmarks) => {
      if (err) return console.error(err);

      listView.items.forEach((item) => {
        let found = false;
        for (let i = 0; i < bookmarks.length; i++) {
          if (bookmarks[i].id == item.id) {
            found = true;
            break;
          }
        }
        if (found) {
          item.action = {
            icon: "material-icons material-inject--star starIcnCol",
          };
        } else {
          item.action = {
            icon: "material-icons material-inject--star_outline starIcnCol",
          };
        }
      });

      var products = listView.items;
      listView.clear();
      listView.loadListViewItems(products);
      setStarColor();

      if (productClicked) {
        let found1 = false;
        for (let i = 0; i < bookmarks.length; i++) {
          if (bookmarks[i].id == productClicked.id) {
            found1 = true;
            break;
          }
        }

        if (found1) {
          starIcon.innerHTML = "star";
          finalStarState = "material-icons material-inject--star starIcnCol";
        } else {
          starIcon.innerHTML = "star_outline";
          finalStarState = "material-icons material-inject--star_outline starIcnCol";
        }
      }
    });
  }, true);

  buildfire.auth.onLogout(() => {
    listView.items.forEach((item) => {
      item.action = {
        icon: "material-icons material-inject--star_outline starIcnCol",
      };
    });

    var products = listView.items;
    listView.clear();
    listView.loadListViewItems(products);
    setStarColor();

    if (productClicked) {
      starIcon.innerHTML = "star_outline";
      finalStarState = "material-icons material-inject--star_outline starIcnCol";
    }
  }, false);
}

function imagePreview(imageUrl) {
  buildfire.imagePreviewer.show({
    images: [imageUrl],
  });
}

function loadData() {
  // listViewContainer.classList.remove("listViewContainer");
  var searchOptions = {
    filter: {},
    sort: config.defaultSort,
    skip: config.skipIndex,
    limit: config.limit,
  };
  var promise1 = Introduction.get();
  var promise2 = Products.search(searchOptions);
  var promise3 = Language.get(Constants.Collections.LANGUAGE + "en-us");
  var promise4 = Settings.get();
  var promise5 = Design.get();
  Promise.all([promise1, promise2, promise3, promise4, promise5]).then((results) => {
    products = [];
    if (results && results.length > 4) {
      if (results[4] && results[4].data) {
        console.log("design data -=> ", results[4].data);
        var sheetList = document.createElement('link');
        sheetList.setAttribute('rel', "stylesheet");
        
        var sheetDesign = document.createElement('link');
        sheetDesign.setAttribute('rel', "stylesheet");

        if(results[4].data.list == 2){
          sheetList.setAttribute('href', "./styleList2.css")
        }else{
          sheetList.setAttribute('href', "./styleList1.css")
        }

        if(results[4].data.details == 2){
          sheetDesign.setAttribute('href', "./styleDetails2.css")
        }else{
          sheetDesign.setAttribute('href', "./styleDetails1.css")
        }
        config.style = {
          sheetDesign , sheetList
        }
        document.getElementsByTagName("head")[0].appendChild(sheetDesign);
        document.getElementsByTagName("head")[0].appendChild(sheetList);
      }
      
      if (results[3] && results[3].data) {
        config.settings = results[3].data;
      }

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
            if (config.settings.bookmarks) {
              let found = false;
              for (let i = 0; i < bookmarks.length; i++) {
                if (bookmarks[i].id == element.id) {
                  found = true;
                  break;
                }
              }
              if (found) {
                t.action = {
                  icon: "material-icons material-inject--star starIcnCol",
                };
              } else {
                t.action = {
                  icon: "material-icons material-inject--star_outline starIcnCol",
                };
              }
            }
            products.push(t);
          });
          if (results[1].length < config.limit) {
            config.endReached = false;
          }
          listView.loadListViewItems(products);
          setStarColor();
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
              defaultValue: stringsConfig[sectionKey].labels[labelKey].defaultValue,
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
        config.lang.data.search.value != "" ?
        config.lang.data.search.value :
        config.lang.data.search.defaultValue
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
    for (
      var i = 0; i < document.getElementsByClassName("loadColor").length; i++
    ) {
      document
        .getElementsByClassName("loadColor")[i].style.setProperty(
          "background",
          config.appTheme.colors.bodyText,
          "important"
        );
    }
  }
  Products.search(searchOptions).then((result) => {
    let products = [];
    buildfire.bookmarks.getAll((err, bookmarks) => {
      if (err) return console.error(err);
      result.forEach((element) => {
        var t = new ListViewItem();
        t.id = element.id;
        t.title = element.data.title;
        t.description = element.data.subTitle;
        t.imageUrl = element.data.profileImgUrl;
        t.data = element.data;
        let found = false;
        for (let i = 0; i < bookmarks.length; i++) {
          if (bookmarks[i].id == element.id) {
            found = true;
            break;
          }
        }
        if (found) {
          t.action = {
            icon: "material-icons material-inject--star starIcnCol",
          };
        } else {
          t.action = {
            icon: "material-icons material-inject--star_outline starIcnCol",
          };
        }
        if (!overwrite) {
          listView.addItem(t);
        } else {
          products.push(t);
        }
      });

      if (overwrite) {
        listView.loadListViewItems(products);
      }
      setStarColor();
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
  buildfire.components.drawer.open({
      listItems: [{
          sort: config.sortAsc,
          text: config.lang.data.sortAsc.value != "" ?
            config.lang.data.sortAsc.value : config.lang.data.sortAsc.defaultValue,
        },
        {
          sort: config.sortDesc,
          text: config.lang.data.sortDesc.value != "" ?
            config.lang.data.sortDesc.value : config.lang.data.sortDesc.defaultValue,
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

init();