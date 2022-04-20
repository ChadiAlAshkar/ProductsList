let searchTableHelper = new SearchTableHelper(
  "searchResults",
  "records",
  searchTableConfig,
  "emptyState",
  "noDataSearch"
);

function load() {
  searchTableHelper.search();
}
load();

searchTableHelper.onEditRow = (obj, tr) => {
  console.log(obj);
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
  document.getElementById('mainDiv').classList.add("hidden");
  document.getElementById('subDiv').classList.remove("hidden");
}