let editedProduct = null;
let searchTableHelper;
let timer;
var profileImage = "";
var coverImage = "";

const thumbnail = new buildfire.components.images.thumbnail(
  ".thumbnail-picker", {
    title: " ",
    dimensionsLabel: "Recommended: 600 x 600px",
    multiSelection: false,
  }
);
const thumbnail2 = new buildfire.components.images.thumbnail(
  ".thumbnail-picker2", {
    title: " ",
    dimensionsLabel: "Recommended: 1200 x 675px",
    multiSelection: false,
  }
);

function init() {
  buildfire.messaging.sendMessageToWidget({
    id: Enum.messageType.closeItem,
    openSubItemPage: false,
  });
  searchTableHelper = new SearchTableHelper(
    "searchResults",
    "records",
    searchTableConfig,
    "emptyState",
    "noDataSearch",
    "loading"
  );
  this.setupHandlers();
  initTinymce();
  Analytics.init();
  searchTableHelper.search();
}

init();

function setupHandlers() {
  let t = this;

  openSubItemPageBtn.addEventListener("click", openSubItemPage);
  sampleDataBtn.addEventListener("click", generateSampleData);
  itemSaveBtn.addEventListener("click", saveItem);
  backToMainBtn.addEventListener("click", backToMain);
  searchProductsBtn.addEventListener("click", searchProducts);

  thumbnail.onChange = (imageUrl) => {
    itemSaveBtn.disabled = checkSaveDisable();
    if (t.profileImage != imageUrl) {
      t.profileImage = buildfire.imageLib.cropImage(
        imageUrl, {
          size: "full_width",
          aspect: "1:1"
        }
      );
      thumbnail.loadbackground(t.profileImage);
      buildfire.messaging.sendMessageToWidget({
        id: Enum.messageType.profileImg,
        data: t.profileImage,
      });
    }


  };
  thumbnail2.onChange = (imageUrl) => {
    itemSaveBtn.disabled = checkSaveDisable();
    if (t.coverImage != imageUrl) {
      t.coverImage = buildfire.imageLib.cropImage(
        imageUrl, {
          size: "full_width",
          aspect: "16:9"
        }
      );
      thumbnail2.loadbackground(t.coverImage);
      buildfire.messaging.sendMessageToWidget({
        id: Enum.messageType.coverImg,
        data: t.coverImage,
      });
    }
  };

  thumbnail.onDelete = (imageUrl) => {
    itemSaveBtn.disabled = true;
    buildfire.messaging.sendMessageToWidget({
      id: Enum.messageType.profileImg,
      data: ""
    });
  };
  thumbnail2.onDelete = (imageUrl) => {
    itemSaveBtn.disabled = true;
    buildfire.messaging.sendMessageToWidget({
      id: Enum.messageType.coverImg,
      data: ""
    });

  };
  let timer;

  itemTitle.addEventListener("keyup", function (event) {
    itemSaveBtn.disabled = checkSaveDisable();

    clearTimeout(timer);
    timer = setTimeout(() => {
      buildfire.messaging.sendMessageToWidget({
        id: Enum.messageType.title,
        data: itemTitle.value,
      });
    }, 500);
  });
  searchItemText.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      searchProducts();
    }
  });
  searchTableHelper.onEditRow = (obj, tr) => {
    fillSubItem(obj);
    buildfire.messaging.sendMessageToWidget({
      id: Enum.messageType.editItem,
      openSubItemPage: true,
      itemClicked: editedProduct,
    });
  };

  buildfire.messaging.onReceivedMessage = (message) => {
    if (message.openSubItemPage) {
      fillSubItem(message.itemClicked);
    } else {
      backToMain();
    }
  };

  itemSubTitle.addEventListener("keyup", function (event) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      buildfire.messaging.sendMessageToWidget({
        id: Enum.messageType.subTitle,
        data: itemSubTitle.value,
      });
    }, 500);
  });
}

function fillSubItem(item) {
  thumbnail.loadbackground(item.data.profileImgUrl);
  thumbnail2.loadbackground(item.data.coverImgUrl);
  itemTitle.value = item.data.title;
  itemSubTitle.value = item.data.subTitle;
  tinymce.get("wysiwygContent").setContent(item.data.description);
  itemSaveBtn.disabled = checkSaveDisable();

  editedProduct = item;
  main.classList.add("hidden");
  subpage.classList.remove("hidden");
}

function initSubItemPage() {
  thumbnail.clear();
  thumbnail2.clear();
  itemTitle.value = "";
  itemSubTitle.value = "";
  tinymce.get("wysiwygContent").setContent("");
  itemSaveBtn.disabled = checkSaveDisable();
  main.classList.add("hidden");
  subpage.classList.remove("hidden");
}

function initTinymce() {
  tinymce.init({
    selector: "#wysiwygContent",
    setup: function (editor) {
      editor.on("keyup", function (e) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          buildfire.messaging.sendMessageToWidget({
            id: Enum.messageType.description,
            data: tinymce.get("wysiwygContent").getContent(),
          });
        }, 500);
      });
      editor.on("change", function (e) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          buildfire.messaging.sendMessageToWidget({
            id: Enum.messageType.description,
            data: tinymce.get("wysiwygContent").getContent(),
          });
        }, 500);
      });
    },
  });
}

function openIntroductionPage() {
  buildfire.navigation.navigateToTab({
      tabTitle: "Introduction",
      deeplinkData: {},
    },
    (err, res) => {
      if (err) return console.error(err); // `Content` tab was not found
    }
  );
}

function openSubItemPage() {
  initSubItemPage();
  buildfire.messaging.sendMessageToWidget({
    id: Enum.messageType.newItem,
  });
}

function backToMain() {
  editedProduct = null;
  main.classList.remove("hidden");
  subpage.classList.add("hidden");
  buildfire.messaging.sendMessageToWidget({
    id: Enum.messageType.closeItem,
    openSubItemPage: false,
  });
}

function generateSampleData() {
  emptyState.classList.add("hidden");
  loading.classList.remove("hidden");
  dummyData
    .insertDummyRecords()
    .then((result) => {
      init();
    })
    .catch((err) => {
      console.error(err);
    });
}

function saveItem() {
  var $productSub;
  if (editedProduct != null) {
    $productSub = updateProduct(editedProduct);
  } else {
    $productSub = addProduct();
  }

  $productSub
    .then(() => {
      init();
      backToMain();
    })
    .catch((err) => {
      console.error(err);
    });
}

function searchProducts() {
  if (searchItemText.value == "") {
    init();
  } else {
    let filter = {
      $or: [{
          "$json.title": {
            $regex: searchItemText.value,
            $options: "-i",
          },
        },
        {
          "$json.subTitle": {
            $regex: searchItemText.value,
            $options: "-i",
          },
        },
      ],
    };
    searchTableHelper.search(filter);
  }
}

function updateProduct(product) {
  return Products.update(product.id, {
    title: itemTitle.value,
    description: tinymce.activeEditor.getContent(),
    profileImgUrl: thumbnail.imageUrl,
    coverImgUrl: thumbnail2.imageUrl,
    subTitle: itemSubTitle.value,
    creationDate: product.data.creationDate,
  });
}

function addProduct() {

  var product = new Product();
  product.title = itemTitle.value;
  product.description = tinymce.activeEditor.getContent();
  product.profileImgUrl = thumbnail.imageUrl;
  product.coverImgUrl = thumbnail2.imageUrl;
  product.subTitle = itemSubTitle.value;
  return Products.insert(product);
}

function checkSaveDisable() {
  if (
    thumbnail.imageUrl == "" ||
    thumbnail2.imageUrl == "" ||
    itemTitle.value == ""
  ) {
    return true;
  }
  return false;
}