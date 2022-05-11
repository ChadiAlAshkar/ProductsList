

var config;

function init() {
    loadData();
    initListeners();
}
init();

function initListeners(){
    bookmkarkSwitchBtn.addEventListener("click", (e) => {
        config.bookmarks = e.target.checked;
        Config.save(config).then((result, err)=> {
            console.log(result);
        });
    });
    noteSwitchBtn.addEventListener("click", (e) => {
        config.notes = e.target.checked;
        Config.save(config).then((result, err)=> {
            console.log(result);
        });
    });
    sharingSwitchBtn.addEventListener("click", (e) => {
        config.sharings = e.target.checked;
        Config.save(config).then((result, err)=> {
            console.log(result);
        });
    });

    deleteDataBtn.addEventListener("click", () => {
         var searchOptions = {
                "filter": {},
                "fields": ["id"],
    };
    buildfire.dialog.confirm(
        {
          title: "Delete Data",
          message: `Are you sure you want to delete all data? This action is not reverisible`,
          confirmButton: {
            text: "Delete Data",
            type: "danger",
          },
        },
        (err, isConfirmed) => {
          if (err) console.error(err);

          if (isConfirmed) {
            //Go back
            Products.search(searchOptions).then((result, err) => {
        
                result.forEach(productId => {
                    Products.delete(productId.id).then();
     
                });
            });
          } else {
            //Prevent action
          }
        }
      );
   
    });
}

function loadData() {
    Config.get().then((result, err) => {
        if (err) {
            console.log(err);
        } else {
            if(result && result.data && !isEmpty(result.data)){
                config = result.data;
                bookmkarkSwitchBtn.checked = config.bookmarks;
                noteSwitchBtn.checked = config.notes;
                sharingSwitchBtn.checked = config.sharings;
            }
            else
            {
                config = new ConfigItem();
            }
        }
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