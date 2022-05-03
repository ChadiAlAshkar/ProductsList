export default class IntroductionItem {
  constructor(data = {}) {
    this.description = data.description || "";
    this.images = data.images || [];
  }
}
