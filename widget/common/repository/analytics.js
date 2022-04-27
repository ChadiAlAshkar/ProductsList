class Analytics {

  static get events() {
    return {
      PRODUCT_CREATED: 'PRODUCT_CRETAED',
      PRODUCT_OPENED: 'PRODUCT_OPENED',
      PRODUCT_DELETED: 'PRODUCT_DELETED',
    }
  }

  static init() {
    this.registerEvent('Product Created', this.events.PRODUCT_CREATED, 'Occurs when a user creates a new Product', false);
    this.registerEvent('Product Opened', this.events.PRODUCT_OPENED, 'Occurs when a user opens a Product', false);
    this.registerEvent('Product Deleted', this.events.PRODUCT_DELETED, 'Occurs when a user deletes a Product', false);
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
      //   console.log(result);
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

Analytics.init();