import { Component } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SwUpdate } from "@angular/service-worker";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private swUpdate: SwUpdate,
    public alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log("[App] Platform ready");

      if (this.swUpdate.isEnabled) {
        console.log("[App] swUpdate is enabled: ", this.swUpdate);

        this.swUpdate.available.subscribe(event => {
          // console.log('[App] Update available: current version is', event.current, 'available version is', event.available);
          console.log("[App] New version available");
          this.presentAlert();
        });
      }

      // code for debugging notification action support
      /*    Notification.requestPermission(status => {
        console.log("Notification permission status:", status);
        if (status === "granted") {
          navigator.serviceWorker.getRegistration().then(reg => {
            const options = {
              actions: [
                {
                  action: "appstart",
                  title: "Explore this new world",
                  icon: "assets/icon/favicon.ico"
                },
                {
                  action: "cancel",
                  title: "Close notification",
                  icon: "assets/icon/favicon.ico"
                }
              ],
              body: "Here is a notification body!",
              image: "assets/imgs/logga.png",
           //   icon: "images/example.png",
              vibrate: [100, 50, 100, 50, 100],
              data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
              },
            };
            reg.showNotification("Hello world!", options);
          });
        }
      });

      this.statusBar.styleDefault();
      this.splashScreen.hide(); */
    });
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: "Ny version",
      //     subHeader: "Subtitle",
      message: "En ny version av VemBorVar finns nedladdad. Välj OK för att få den nya versionen",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          //     cssClass: 'secondary',
          handler: () => {
            console.log("[App] Confirm Cancel");
          }
        },
        {
          text: "OK",
          handler: () => {
            console.log("[App] Confirm Ok");
            let url = "";
            url = window.location.protocol + "//" + window.location.host;
            console.log("[App] Loading ", url);
            window.location.href = url;
          }
        }
      ]
    });
    alert.present();
  }
}
