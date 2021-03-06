class Analytics {

  static registerProdEvent(prodName, prodID) {
    this.regEvent(prodName, prodID, 'Occurs when a user views product', false);
  }

  static regEvent(title, key, description, silentNotification) {
    buildfire.analytics.registerEvent({
      title,
      key,
      description
    }, {
      silentNotification
    }, (err, result) => {
      console.log(result);
      if (err)
        console.error(err);
      // else
    });
  }

  static unRegEvent(key) {
    buildfire.analytics.unregisterEvent(key, (err, res) => {
      console.log(res);
      if (err)
        console.error(err);
    });
  }

  static trackAction(key, aggregationValue) {
    let metData = {};
    if (aggregationValue) {
      metData._buildfire = {
        aggregationValue
      };
    }
    buildfire.analytics.trackAction(key, metData);
  }
}