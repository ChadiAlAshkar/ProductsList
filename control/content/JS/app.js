let editedProduct = null;
let searchTableHelper;
let timer;

const thumbnail = new buildfire.components.images.thumbnail(
  ".thumbnail-picker",
  {
    title: " ",
    dimensionsLabel: "600x600px",
    multiSelection: false,
  }
);
const thumbnail2 = new buildfire.components.images.thumbnail(
  ".thumbnail-picker2",
  {
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
  };
}

function initTinymce() {
  tinymce.init({
    selector: "#wysiwygContent",
    setup: function (editor) {
      editor.on("init", function (e) {
        // tinymce
        //   .get("wysiwygContent")
        //   .setContent(introduction.description);
      });
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
  buildfire.navigation.navigateToTab(
    {
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
      $or: [
        {
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

function openIntro() {
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

function openSub() {
  thumbnail.clear();
  thumbnail2.clear();
  title.value = "";
  subTitle.value = "";
  tinymce.get("wysiwygContent").setContent("");
  btnSave.disabled = checkSaveDisable();
  document.getElementById("mainDiv").classList.add("hidden");
  document.getElementById("subDiv").classList.remove("hidden");
}

let editedProduct = null;

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

thumbnail2.onChange = (imageUrl) => {
  // image2.classList.add("hidden");
  btnSave.disabled = checkSaveDisable();
};

thumbnail2.onDelete = (imageUrl) => {
  btnSave.disabled = true;
};

thumbnail.onDelete = (imageUrl) => {
  btnSave.disabled = true;
};

thumbnail.onChange = (imageUrl) => {
  // image1.classList.add("hidden");
  btnSave.disabled = checkSaveDisable();
};

let timer;
tinymce.init({
  selector: "#wysiwygContent",
  setup: function (editor) {
    editor.on("init", function (e) {
      // tinymce
      //   .get("wysiwygContent")
      //   .setContent(introduction.description);
    });
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

function backToMain() {
  document.getElementById("mainDiv").classList.remove("hidden");
  document.getElementById("subDiv").classList.add("hidden");
}

var title = document.getElementById("title");
title.addEventListener("keyup", function (event) {
  if (!titleErr.classList.contains("hidden")) {
    if (title.value != "") {
      titleErr.classList.add("hidden");
    }
  }
  btnSave.disabled = checkSaveDisable();
});

function saveItem() {
  let err = 0;
  if (thumbnail.imageUrl == "") {
    // image1.classList.remove("hidden");
    err = 1;
  }
  if (thumbnail2.imageUrl == "") {
    // image2.classList.remove("hidden");
    err = 1;
  }
  if (title.value == "") {
    titleErr.classList.remove("hidden");
    err = 1;
  }
  if (err == 1) return;
  if (editedProduct != null) {
    Products.update(editedProduct.id, {
        title: title.value,
        description: tinymce.activeEditor.getContent(),
        profileImgUrl: thumbnail.imageUrl,
        coverImgUrl: thumbnail2.imageUrl,
        subTitle: subTitle.value,
        creationDate: editedProduct.data.creationDate,
      })
      .then((product) => {
        this.load();
        this.backToMain();
        editedProduct = null;
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    var product = new Product();
    product.title = title.value;
    product.description = tinymce.activeEditor.getContent();
    product.profileImgUrl = thumbnail.imageUrl;
    product.coverImgUrl = thumbnail2.imageUrl;
    product.subTitle = subTitle.value;
    Products.insert(product)
      .then((product) => {
        console.log("Insert::: ", product);
        Analytics.trackAction(Analytics.events.PRODUCT_CREATED);
        this.load();
        this.backToMain();
      })
      .catch((err) => {
        console.error(err);
      });
  }
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
