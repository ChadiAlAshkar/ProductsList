class SearchTableHelper {
  productsLength = 0;

  constructor(tableId, tag, config, emptyState, noDataSearch, loading) {
    if (!config) throw "No config provided";
    if (!tableId) throw "No tableId provided";
    this.table = document.getElementById(tableId);
    if (!this.table) throw "Cant find table with ID that was provided";

    if (!emptyState) throw "No emptyState provided";
    this.emptyState = document.getElementById(emptyState);
    if (!this.emptyState)
      throw "Cant find emptyState with ID that was provided";

    if (!noDataSearch) throw "No noDataSearch provided";
    this.noDataSearch = document.getElementById(noDataSearch);
    if (!this.noDataSearch)
      throw "Cant find noDataSearch with ID that was provided";


    if (!loading) throw "No loading provided";
    this.loading = document.getElementById(loading);
    if (!this.loading)
      throw "Cant find loading with ID that was provided";

    this.config = config;
    this.tag = tag;
    this.sort = {};
    this.commands = {};
    this.init();
  }

  init() {
    this.table.innerHTML = "";
    this.table.classList.add("hidden");
    this.noDataSearch.classList.add("hidden");
    this.renderHeader();
    this.renderBody();
  }

  renderHeader() {
    if (!this.config.columns) throw "No columns are indicated in the config";
    this.thead = ui.createElement("thead", this.table);
    this.config.columns.forEach((colConfig) => {
      let classes = ["headerCell"];
      if (colConfig.type == "date") classes.push("text-center");
      else if (colConfig.type == "number") classes.push("text-right");
      else classes.push("text-left");
      let th = ui.createElement("th", this.thead, "", "");
      let h5 = ui.createElement("h5", th, colConfig.header + " ", classes);

      colConfig.header;
      if (colConfig.sortBy) {
        const icon = ui.createElement("span", h5, "", [
          "icon",
          "icon-chevron-down",
        ]);
        const _t = this;
        th.addEventListener("click", function () {
          if (_t.sort[colConfig.sortBy] && _t.sort[colConfig.sortBy] > 0) {
            _t.sort = {
              [colConfig.sortBy]: -1,
            };
            icon.classList.remove("icon-chevron-up");
            icon.classList.add("icon-chevron-down");
          } else {
            _t.sort = {
              [colConfig.sortBy]: 1,
            };
            icon.classList.remove("icon-chevron-down");
            icon.classList.add("icon-chevron-up");
          }
          _t._fetchPageOfData();
        });
      }
    });
    if (
      this.config.options.showEditButton ||
      this.config.options.showDeleteButton
    )
      ui.createElement("th", this.thead, "", ["editColumn"]);
  }

  renderBody() {
    this.tbody = ui.createElement("tbody", this.table);
    let t = this;
    this.tbody.onscroll = (e) => {
      if (t.tbody.scrollTop / t.tbody.scrollHeight > 0.8) t._fetchNextPage();
    };
  }

  search(filter) {
    this.noDataSearch.classList.add("hidden");
    this.tbody.innerHTML = "";
    this.table.classList.add("hidden");
    this.emptyState.classList.add("hidden");
    this.loading.classList.remove("hidden");
    this.filter = filter;
    this._fetchPageOfData(this.filter, 0);
  }

  _fetchNextPage() {
    if (this.fetchingNextPage) return;
    this.fetchingNextPage = true;
    let t = this;
    this._fetchPageOfData(this.filter, this.pageIndex + 1, () => {
      t.fetchingNextPage = false;
    });
  }

  _fetchPageOfData(filter, pageIndex, callback) {
    if (pageIndex > 0 && this.endReached) return;
    let pageSize = 50;
    this.pageIndex = pageIndex;

    if (Object.keys(this.sort).length === 0) {
      this.sort = {
        creationDate: -1,
        title: 1
      };
    }

    let options = {
      filter: filter,
      sort: this.sort,
      page: pageIndex,
      pageSize: pageSize,
    };

    this.searchOptions = options;
    Products.search(this.searchOptions)
      .then((products) => {
        if (products.length > 0) {
          this.productsLength = products.length;
          this.loading.classList.add("hidden");
          this.emptyState.classList.add("hidden");
          this.table.classList.remove("hidden");
          this.tbody.innerHTML = "";
          this.loading.classList.add("hidden");
          products.forEach((p) => this.renderRow(p));
          this.endReached = results.length < pageSize;
        } else {
          this.tbody.innerHTML = "";
          this.loading.classList.add("hidden");
          if (filter != undefined) {
            this.noDataSearch.classList.remove("hidden");
          } else {
            this.emptyState.classList.remove("hidden");
          }
        }
      })
      .catch((err) => {
        // callback(err);
      });
  }

  _onCommand(obj, tr, command) {
    if (this.commands[command]) {
      this.commands[command](obj, tr);
    } else {
      console.log(`Command ${command} does not have any handler`);
    }
  }

  renderRow(obj, tr) {
    if (tr)
      //used to update a row
      tr.innerHTML = "";
    else tr = ui.createElement("tr", this.tbody);
    tr.setAttribute("objId", obj.id);
    this.config.columns.forEach((colConfig) => {
      let classes = [];
      if (colConfig.type == "date") classes = ["text-center"];
      else if (colConfig.type == "number") classes = ["text-right"];
      else if (colConfig.type == "Image") {} else classes = ["text-left"];
      var td;
      if (colConfig.type == "command") {
        td = ui.createElement(
          "td",
          tr,
          '<button class="btn btn-link">' + colConfig.text + "</button>",
          ["editColumn"]
        );
        td.onclick = (event) => {
          event.preventDefault();
          this._onCommand(obj, tr, colConfig.command);
        };
      } else if (colConfig.type == "Image") {
        try {
          classes.push("tdImageSize");
          td = ui.createElement("td", tr, output, classes);
          var cellDiv = ui.createElement("div", td, "", [
            "img-holder",
            "aspect-1-1",
          ]);
          var cellImg = ui.createElement("img", cellDiv, "", ["imgStyle"]);
          var data = obj.data;
          cellImg.src = eval("`" + colConfig.data + "`");
        } catch (error) {
          console.log(error);
        }
      } else {
        var output = "";
        try {
          ///needed for the eval statement next
          var data = obj.data;
          output = eval("`" + colConfig.data + "`");
        } catch (error) {
          console.log(error);
        }
        if (colConfig.header == "Title") {
          classes.push("pointer");
          classes.push("primaryColor");
        } else {
          classes.push("colBlack");
        }
        td = ui.createElement("td", tr, output, classes);
        if (colConfig.header == "Title") {
          td.onclick = () => {
            t.onEditRow(obj, tr);
          };
        }
      }
    });

    let t = this;

    if (
      this.config.options.showAnalyticsButton ||
      this.config.options.showEditButton ||
      this.config.options.showDeleteButton
    ) {
      let td = ui.createElement("td", tr, "", ["editColumn"]);
      let div = ui.createElement("div", td, "", ["pull-right"]);
      if (this.config.options.showAnalyticsButton) {
        let btn = ui.createElement("button", div, "", ["btn", "bf-btn-icon", "custom-background"]);
        btn.onclick = () => {
          t.onAnalyticsClicked(obj, tr);
        };
        let span = ui.createElement("span", btn, "", ["icon", "icon-chart-growth"]);
      }
      if (this.config.options.showEditButton) {
        let btn = ui.createElement("button", div, "", ["btn", "bf-btn-icon", "custom-background"]);
        btn.onclick = () => {
          t.onEditRow(obj, tr);
        };
        let span = ui.createElement("span", btn, "", ["icon", "icon-pencil"]);
      }
      if (this.config.options.showDeleteButton) {
        let btn = ui.createElement("button", div, "", ["btn", "bf-btn-icon", "custom-background"]);
        let span = ui.createElement("span", btn, "", ["icon", "icon-cross2"]);
        btn.onclick = () => {
          buildfire.dialog.confirm({
              title: "Are you sure?",
              message: "Are you sure you want to delete this product?",
              confirmButton: {
                text: "Delete",
                type: "danger",
              },
            },
            (err, isConfirmed) => {
              if (err) console.error(err);

              if (isConfirmed) {
                //Go back
                tr.classList.add("hidden");
                Products.delete(obj.id)
                  .then((result) => {
                    t.onRowDeleted(obj, tr);
                  })
                  .catch((err) => {
                    tr.classList.remove("hidden");
                  });
              } else {
                //Prevent action
              }
            }
          );
        };
      }
    }
    this.onRowAdded(obj, tr);
  }

  onSearchSet(options) {
    return options;
  }

  onRowAdded(obj, tr) {}

  onEditRow(obj, tr) {}

  onAnalyticsClicked(obj, tr) {
    // console.log(obj)
  }

  onRowDeleted(obj, tr) {
    this.productsLength -= 1;
    if (this.productsLength == 0) {
      this.emptyState.classList.remove("hidden");
      this.table.classList.add("hidden");
    }
  }
}