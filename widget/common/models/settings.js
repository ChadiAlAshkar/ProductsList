class SettingsItem {
  constructor(data = {}) {
    this.bookmarks = data.bookmarks || false;
    this.notes = data.notes || false;
    this.sharing = data.sharing || false;
  }
}