class PushNotification {
    
    static init(){
        this.subscribe();
    }

   static schedule() {
        buildfire.notifications.pushNotification.schedule(
            {
              title: "Push notification",
              text: "Hello there!",
            },
            (err, result) => {
              if (err) return console.error(err);
          
              console.log("Push notification scheduled", result);
            }
          );
    }

    static cancel() {
        buildfire.notifications.pushNotification.cancel(
            "608adde30af35105452a3c96",
            (err, isCancelled) => {
              if (err) return console.error(err);
          
              console.log("Notification cancelled", isCancelled);
            }
          );
    }

    static subscribe() {
        buildfire.notifications.pushNotification.subscribe(
            { groupName: "testGroup" },
            (err, subscribed) => {
              if (err) return console.error(err);
          
              console.log("User subscribed to group", subscribed);
            }
          );
    }
    static unsubscribe(){
        buildfire.notifications.pushNotification.unsubscribe(
        { groupName: "testGroup" },
        (err, unsubscribed) => {
          if (err) return console.error(err);
      
          console.log("User unsubscribed from group", unsubscribed);
        }
      );
    }
}

PushNotification.init();