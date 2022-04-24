class LanguageItem {
  constructor(data = {}) {
    this.search = data.search || "";
    this.sortAscending = data.sortAscending || "";
    this.sortDescending = data.sortDescending || "";
  }
}
