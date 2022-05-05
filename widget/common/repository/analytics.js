class Analytics {

  static get events() {
    return {
      PRODUCT_VIEWED: 'PRODUCT_VIEWED'
    }
  }

  static init() {
    this.registerEvent('Product Viewed', this.events.PRODUCT_VIEWED, 'Occurs when a user views a product', false);
  }

  static registerEvent(title, key, description, silentNotification) {
    buildfire.analytics.registerEvent({
      title,
      key,
      description
    }, {
      silentNotification
    }, (err, result) => {
      if (err)
        console.error(err);
      // else
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