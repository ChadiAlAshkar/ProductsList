class LocalNotification {
    
 static init(){
    this.checkPermission()
 }

  static checkPermission() {
    buildfire.notifications.localNotification.checkPermissions(
      (err, hasPermissions) => {
        if (err) return console.error(err);

        console.log(
          hasPermissions ? "Permissions granted" : "Permissions not granted"
        );
      }
    );
  }

  static requestPermission() {
    buildfire.notifications.localNotification.requestPermission(
      (err, hasPermissions) => {
        if (err) return console.error(err);

        console.log(
          hasPermissions ? "Permissions granted" : "Permissions not granted"
        );
      }
    );
  }

  static schedule() {
    buildfire.notifications.localNotification.schedule(
      {
        title: "Local notification",
        text: "Hi!",
        at: new Date(),
      },
      (err, result) => {
        if (err) return console.error(err);

        console.log("Notification scheduled", result);
      }
    );
  }

  static send() {
    buildfire.notifications.localNotification.send(
      {
        title: "Local notification",
        text: "Hi!",
        data: {
          hello: "world",
        },
      },
      (err, result) => {
        if (err) return console.error(err);

        console.log("Notification sent", result);
      }
    );
  }

  static cancel() {
    buildfire.notifications.localNotification.cancel(
      1235123214,
      (err, result) => {
        if (err) return console.error(err);

        console.log("Notificaition cancelled. Id: ", result.id);
      }
    );
  }

  static onClick() {
    buildfire.notifications.localNotification.onClick = (data) => {
      console.log("Notification clicked. Notification data is", data);
    };
  }
}

LocalNotification.init();