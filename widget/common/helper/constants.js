class Constants {
  //This db variable was used in order not to repeat "builfire.datastore" many times in our code
  static get db() {
    return buildfire.datastore;
  }

  static get Collections() {
    return {
      PRODUCTS: "Products",
      INTRODUCTION: "Introduction",
      LANGUAGE: "$bfLanguageSettings_",
    };
  }
}
