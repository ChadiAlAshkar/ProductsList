class SearchTableHelper {
  productsLength = 0;

  constructor(tableId, tag, config, emptyState, noDataSearch) {
    if (!config) throw "No config provided";
    if (!tableId) throw "No tableId provided";
    this.table = document.getElementById(tableId);
    if (!this.table) throw "Cant find table with ID that was provided";

    if (!emptyState) throw "No emptyState provided";
    this.emptyState = document.getElementById(emptyState);
    if (!this.emptyState)
      throw "Cant find emptyState with ID that was provided";

    if (!noDataSearch) throw "No emptyState provided";
    this.noDataSearch = document.getElementById(noDataSearch);
    if (!this.noDataSearch)
      throw "Cant find noDataSearch with ID that was provided";

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
    this.thead = this._create("thead", this.table);
    this.config.columns.forEach((colConfig) => {
      let classes = ["headerCell"];
      if (colConfig.type == "date") classes.push("text-center");
      else if (colConfig.type == "number") classes.push("text-right");
      else classes.push("text-left");
      let th = this._create("th", this.thead, "", "");
      let h5 = this._create("h5", th, colConfig.header + " ", classes);

      colConfig.header;
      if (colConfig.sortBy) {
        const icon = this._create("span", h5, "", [
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
      //   if (colConfig.width) th.style.width = colConfig.width;
    });
    if (
      this.config.options.showEditButton ||
      this.config.options.showDeleteButton
    )
      this._create("th", this.thead, "", ["editColumn"]);
    // if (this.config.options.showEditButton)
    //   this._create("th", this.thead, "", ["editColumn"]);

    // if (this.config.options.showDeleteButton)
    //   this._create("th", this.thead, "", ["deleteColumn"]);
  }

  renderBody() {
    this.tbody = this._create("tbody", this.table);
    let t = this;
    this.tbody.onscroll = (e) => {
      if (t.tbody.scrollTop / t.tbody.scrollHeight > 0.8) t._fetchNextPage();
    };
  }

  search(filter) {
    this.noDataSearch.classList.add("hidden");
    this.tbody.innerHTML = "";
    this._create("tr", this.tbody, '<td colspan="99"> searching...</td>', [
      "loadingRow",
    ]);
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
        creationDate: -1
      }
    }

    let options = {
      filter: filter,
      sort: this.sort,
      page: pageIndex,
      pageSize: pageSize,
    };

    console.log(options)
    this.searchOptions = options;

    Products.search(this.searchOptions)
      .then((products) => {
        if (products.length > 0) {
          this.productsLength = products.length;
          this.emptyState.classList.add("hidden");
          this.table.classList.remove("hidden");
          this.tbody.innerHTML = "";
          products.forEach((p) => this.renderRow(p));
          this.endReached = results.length < pageSize;
        } else {
          this.tbody.innerHTML = "";
          this.noDataSearch.classList.remove("hidden");
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
    else tr = this._create("tr", this.tbody);
    tr.setAttribute("objId", obj.id);
    this.config.columns.forEach((colConfig) => {
      let classes = [];
      if (colConfig.type == "date") classes = ["text-center"];
      else if (colConfig.type == "number") classes = ["text-right"];
      else if (colConfig.type == "Image") {} else classes = ["text-left"];
      var td;
      if (colConfig.type == "command") {
        td = this._create(
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
          td = this._create("td", tr, output, classes);
          var cellDiv = this._create("div", td, "", [
            "img-holder",
            "aspect-1-1",
          ]);
          var cellImg = this._create("img", cellDiv, "", ["imgStyle"]);
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
        td = this._create("td", tr, output, classes);
      }
      //   if (colConfig.width) td.style.width = colConfig.width;
    });

    let t = this;

    if (
      this.config.options.showEditButton ||
      this.config.options.showDeleteButton
    ) {
      let td = this._create("td", tr, "", ["editColumn"]);
      let div = this._create("div", td, "", ["pull-right"]);
      if (this.config.options.showEditButton) {
        let btn = this._create("button", div, "", ["btn", "bf-btn-icon"]);
        btn.onclick = () => {
          t.onEditRow(obj, tr);
        };
        let span = this._create("span", btn, "", ["icon", "icon-pencil"]);
      }
      if (this.config.options.showDeleteButton) {
        let btn = this._create("button", div, "", ["btn", "bf-btn-icon"]);
        let span = this._create("span", btn, "", ["icon", "icon-cross2"]);
        btn.onclick = () => {
          buildfire.notifications.confirm({
              title: "Are you sure?",
              message: "Are you sure to delete this product?",
              confirmButton: {
                text: "Yes",
                key: "yes",
                type: "danger",
              },
              cancelButton: {
                text: "No",
                key: "no",
                type: "default",
              },
            },
            function (e, data) {
              if (e) console.error(e);
              if (data.selectedButton.key == "yes") {
                tr.classList.add("hidden");
                Products.delete(obj.id)
                  .then((result) => {
                    t.onRowDeleted(obj, tr);
                  })
                  .catch((err) => {
                    tr.classList.remove("hidden");
                  });
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

  onRowDeleted(obj, tr) {
    this.productsLength -= 1;
    if (this.productsLength == 0) {
      this.emptyState.classList.remove("hidden");
      this.table.classList.add("hidden");
    }
  }

  onCommand(command, cb) {
    this.commands[command] = cb;
  }

  _create(elementType, appendTo, innerHTML, classNameArray) {
    let e = document.createElement(elementType);
    if (innerHTML) e.innerHTML = innerHTML;
    if (Array.isArray(classNameArray))
      classNameArray.forEach((c) => e.classList.add(c));
    if (appendTo) appendTo.appendChild(e);
    return e;
  }
}