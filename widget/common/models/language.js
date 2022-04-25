class LanguageItem {
  constructor(data = {}) {
    this.search = data.search || "";
    this.sortAsc = data.sortAsc || "";
    this.sortDesc = data.sortDesc || "";
  }
}
