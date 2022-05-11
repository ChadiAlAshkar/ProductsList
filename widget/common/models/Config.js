class ConfigItem {
    constructor(data = {}) {
      this.bookmarks = data.bookmarks || false;
      this.sharings = data.sharings || false;
      this.notes = data.notes || false;
    }
  }