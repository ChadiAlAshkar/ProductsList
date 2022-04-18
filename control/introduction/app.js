let editor = new buildfire.components.carousel.editor(".carousel", []);
let introduction = new IntroductionItem();
introduction.description = "";
introduction.images = [];

function init() {
  Introduction.get()
    .then((result) => {
      if (result) {
        introduction.description = result.data.description;
        let timer;
        tinymce.init({
          selector: "#wysiwygContent",
          oninit: "postInitWork",
          setup: function (editor) {
            editor.on("init", function (e) {
              tinymce
                .get("wysiwygContent")
                .setContent(introduction.description);
            });
            editor.on("keyup", function (e) {
              clearTimeout(timer);
              timer = setTimeout(() => {
                save();
              }, 500);
            });
            editor.on("change", function (e) {
              clearTimeout(timer);
              timer = setTimeout(() => {
                save();
              }, 500);
            });
          },
        });

        introduction.images = result.data.images;
        editor.loadItems(introduction.images);
      }
    })
    .catch((err) => {
      console.error("Error in getting Introduction::: ", err);
    });
  //Carousel Listeners and functions
  editor.onItemChange = (item, index) => {
    if (introduction.images.length > index) {
      introduction.images[index] = item;
      save();
    }
  };

  editor.onOrderChange = (item, oldIndex, newIndex) => {
    reOrderCarousel(oldIndex, newIndex);
    save();
  };

  editor.onAddItems = (items) => {
    items.forEach((itm) => {
      introduction.images.push(itm);
      save();
    });
  };

  editor.onDeleteItem = (item, index) => {
    introduction.images.splice(index, 1);
    save();
  };
}

function reOrderCarousel(from, to) {
  // Delete the item from it's current position
  var item = introduction.images.splice(from, 1);
  // Make sure there's an item to move
  if (!item.length) {
    throw new Error("There is no item in the array at index " + from);
  }
  // Move the item to its new position
  introduction.images.splice(to, 0, item[0]);
}

function save() {
  introduction.description = tinymce.activeEditor.getContent();

  Introduction.save(introduction)
    .then((result) => {})
    .catch((err2) => {
      console.error("Error in saving Introduction::: ", err2);
    });
}

init();