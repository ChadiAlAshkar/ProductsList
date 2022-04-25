let viewer = new buildfire.components.carousel.view(".carousel");
let description = document.getElementById("my_container_div");

function init() {
  this.getIntroduction();

  buildfire.datastore.onUpdate((response) => {
    if (response.tag == Constants.Collections.PRODUCTS) {
      console.log("Products updated");
    }
    if (response.tag == Constants.Collections.INTRODUCTION) {
      description.innerHTML = response.data.description;
      viewer.loadItems(response.data.images);
    }
  });
}

function getIntroduction() {
  Introduction.get()
    .then((result) => {
      if (result) {
        viewer.loadItems(result.data.images);
        description.innerHTML = result.data.description;
      }
    })
    .catch((err) => {
      console.error("Error in getting Introduction::: ", err);
    });
}

init();
