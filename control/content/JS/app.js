let editedProduct = null;
let searchTableHelper;
let timer;

const thumbnail = new buildfire.components.images.thumbnail(
  ".thumbnail-picker", {
    title: " ",
    dimensionsLabel: "600x600px",
    multiSelection: false,
  }
);
const thumbnail2 = new buildfire.components.images.thumbnail(
  ".thumbnail-picker2", {
    title: " ",
    dimensionsLabel: "1200x675px",
    multiSelection: false,
  }
);

function init() {
  searchTableHelper = new SearchTableHelper(
    "searchResults",
    "records",
    searchTableConfig,
    "emptyState",
    "noDataSearch"
  );
  this.setupHandlers();
  this.initTinymce();
  searchTableHelper.search();
}

init();

function setupHandlers() {
  thumbnail.onChange = (imageUrl) => {
    itemSaveBtn.disabled = checkSaveDisable();
  };
  thumbnail2.onChange = (imageUrl) => {
    itemSaveBtn.disabled = checkSaveDisable();
  };

  thumbnail.onDelete = (imageUrl) => {
    itemSaveBtn.disabled = true;
  };
  thumbnail2.onDelete = (imageUrl) => {
    itemSaveBtn.disabled = true;
  };
  itemTitle.addEventListener("keyup", function (event) {
    itemSaveBtn.disabled = checkSaveDisable();
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
    thumbnail.loadbackground(obj.data.profileImgUrl);
    thumbnail2.loadbackground(obj.data.coverImgUrl);
    itemTitle.value = obj.data.title;
    itemSubTitle.value = obj.data.subTitle;
    tinymce.get("wysiwygContent").setContent(obj.data.description);
    itemSaveBtn.disabled = checkSaveDisable();
    mainDiv.classList.add("hidden");
    subDiv.classList.remove("hidden");
    editedProduct = obj;

    buildfire.messaging.sendMessageToWidget({
      openSub: true,
      itemClicked: editedProduct
    });
  };
}

function initTinymce() {
  tinymce.init({
    selector: "#wysiwygContent",
    setup: function (editor) {
      editor.on("keyup", function (e) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          // save();
        }, 500);
      });
      editor.on("change", function (e) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          // save();
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
      console.log("NAVIGATION FINISHED");
    }
  );
}

function openSubItemPage() {
  thumbnail.clear();
  thumbnail2.clear();
  itemTitle.value = "";
  itemSubTitle.value = "";
  tinymce.get("wysiwygContent").setContent("");
  itemSaveBtn.disabled = checkSaveDisable();
  mainDiv.classList.add("hidden");
  subDiv.classList.remove("hidden");
}

function backToMain() {
  document.getElementById("mainDiv").classList.remove("hidden");
  document.getElementById("subDiv").classList.add("hidden");
  buildfire.messaging.sendMessageToWidget({
    openSub: false
  });
}

function generateSampleData() {
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
  var isAddingProduct = false;
  if (editedProduct != null) {
    $productSub = this.updateProduct(editedProduct);
  } else {
    isAddingProduct = true;
    $productSub = this.addProduct();
  }

  $productSub
    .then(() => {
      this.init();
      this.backToMain();
      if (isAddingProduct) {
        Analytics.trackAction(Analytics.events.PRODUCT_CREATED);
      }
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