let searchTableHelper = new SearchTableHelper(
  "searchResults",
  "records",
  searchTableConfig,
  "emptyState",
  "noDataSearch"
);

// let image1 = document.getElementById("image1");
// let image2 = document.getElementById("image2");
let titleErr = document.getElementById("titleErr");
let btnSave = document.getElementById("btnSave");

function load() {
  searchTableHelper.search();
}
load();

searchTableHelper.onEditRow = (obj, tr) => {
  thumbnail.loadbackground(obj.data.profileImgUrl);
  thumbnail2.loadbackground(obj.data.coverImgUrl);
  title.value = obj.data.title;
  subTitle.value = obj.data.subTitle;
  tinymce.get("wysiwygContent").setContent(obj.data.description);
  btnSave.disabled = checkSaveDisable();
  document.getElementById("mainDiv").classList.add("hidden");
  document.getElementById("subDiv").classList.remove("hidden");
  editedProduct = obj;
  //call subPage to edit then call
  // let newObj = obj;
  // searchTableHelper.renderRow(newObj, tr); ///to update table
};

function addSampleData() {
  dummyData
    .insertDummyRecords()
    .then((result) => {
      load();
    })
    .catch((err) => {
      console.error(err);
    });
}

var search = document.getElementById("searchProductText");
search.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    searchProducts();
  }
});

function searchProducts() {
  if (searchProductText.value == "") {
    load();
  } else {
    let filter = {
      $or: [{
          "$json.title": {
            $regex: searchProductText.value,
            $options: "-i",
          },
        },
        {
          "$json.subTitle": {
            $regex: searchProductText.value,
            $options: "-i",
          },
        },
      ],
    };
    searchTableHelper.search(filter);
  }
}

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
  let err = 0;
  if (thumbnail.imageUrl == "") {
    console.log("IN1")
    err = 1;
  }
  if (thumbnail2.imageUrl == "") {
    console.log("IN2")
    err = 1;
  }
  if (title.value == "") {
    console.log("IN3")
    err = 1;
  }
  if (err == 1) return true;

  return false;
}