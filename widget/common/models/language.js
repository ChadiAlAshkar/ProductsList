class LanguageItem {
  constructor(data = {}) {
    this.search = data.search || new LanguageValues();
    this.sortAsc = data.sortAsc || new LanguageValues();
    this.sortDesc = data.sortDesc || new LanguageValues();
  }
}

class LanguageValues {
  constructor(data = {}) {
    this.value = data.value || "";
    this.defaultValue = data.defaultValue || "";
  }
}