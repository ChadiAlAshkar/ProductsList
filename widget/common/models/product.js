class Product {
  constructor(data = {}) {
    //this.id = data.id || "";
    this.title = data.title || "";
    this.subTitle = data.subTitle || "";
    this.description = data.description || "";
    this.profileImgUrl = data.profileImgUrl || "";
    this.coverImgUrl = data.coverImgUrl || "";
    this.creationDate = data.creationDate || new Date();
    this.isFavorite = data.isFavorite || false;
  }
}
