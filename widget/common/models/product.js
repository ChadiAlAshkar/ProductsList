class Product {
  constructor(data = {}) {
    this.id = data.id || "";
    this.title = data.title || "";
    this.subtitle = data.subtitle || "";
    this.description = data.description || "";
    this.profileImgUrl = data.profileImgUrl || "";
    this.coverImgUrl = data.coverImgUrl || "";
    this.creationDate = data.creationDate || new Date();
  }
}
