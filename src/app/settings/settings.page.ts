import { Component, OnInit } from "@angular/core";
import { SwPush } from "@angular/service-worker";
import { AngularFireDatabase } from "@angular/fire/database";
import { ToastController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"]
})
export class SettingsPage implements OnInit {
  isSafari = false;
  isIosStandaloneMode = false;
  showAddToHomeScreen = false;
  public notifChecked = false;
  readonly VAPID_PUBLIC_KEY =
    "BK9Ac2byemhpGs9BJGhyxEhhp-m5FyiWBfp-fnDJHwnvkUuuQj83_JJFZoCNrDav56sPJee6Epd-koA7Z4FQrJQ";
  subs: any;

  constructor(
    private swPush: SwPush,
    afDatabase: AngularFireDatabase,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) {
    this.subs = afDatabase.list(
      "/" + window.location.hostname.replace(/(\.)/g, "-") + "-subs"
    );
    /* this.subs = afDatabase.list("/pwavbv-firebaseapp-com-subs"); */
    console.log("[Settings] subs: ", this.subs);
  }

  ngOnInit() {
    this.isSafari =
      navigator.vendor &&
      navigator.vendor.indexOf("Apple") > -1 &&
      navigator.userAgent &&
      !navigator.userAgent.match("CriOS");
    // this.isSafari = true; // for debugging
    console.log("[Settings] isSafari: ", this.isSafari);
    if (this.isSafari) {
      if ("standalone" in window.navigator) {
        this.isIosStandaloneMode = window.navigator["standalone"];
      }
      // this.isIosStandaloneMode = true; // for debugging
      console.log("[Settings] isIosStandaloneMode: ", this.isIosStandaloneMode);
      this.showAddToHomeScreen = !this.isIosStandaloneMode;
    }

    /*
    const p: string = Notification["permission"]; // granted, default, denied
    console.log("[Settings] ngOnInit Notification['permission']: ", p);
    if (p === "granted") {
      this.notifChecked = true;
    }
    */

    navigator.serviceWorker.getRegistration().then(registration => {
      if (registration) {
        console.log("[Settings] ngOnInit: nregistration: ", registration);

        registration.pushManager.getSubscription().then(sub => {
          if (sub) {
            console.log(
              "[Settings] ngOnInit: User was already subscribed. Subscription: ",
              sub
            );
          }
          registration.pushManager
            .permissionState({ userVisibleOnly: true })
            .then(state => {
              console.log("[Settings] ngOnInit Push permission: ", state); // granted, prompt, denied
              if (state === "granted") {
                this.notifChecked = true;
              } else {
                this.notifChecked = false;
              }
            });
        });
      }
    });
  } // end of ngOninit

  toggleNotifications(ev) {
    console.log("[Settings] toggle event: ", ev.detail);
    if (ev.detail.checked) {
      this.subscribeToPush(ev);
    } else {
      this.unsubscribeFromPush();
    }
  }

  subscribeToPush(ev) {
    // console.log("[Settings] subscribeToPush called");
    if ("serviceWorker" in navigator) {
      this.swPush
        .requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY
        })
        .then(pushSubscription => {
          // console.log("[Settings] User is subscribed. Subscription:", pushSubscription );
          // Update the subscription database
          const mysub = JSON.stringify(pushSubscription);
          const subtime = Date();
          this.subs
          .push({ subscription: mysub, timesubmitted: subtime })
          .then(
            () => {
              console.log("[Settings] Subscription pushed: ", mysub);
            },
            error => {
              console.error("[Settings] Error has occured saving subscription: ", error);
            }
          );
          this.presentToast(
            "Du prenumerar på aviseringar \nfrån Brf Husarvikens Strand."
          );
        })
        .catch(err => {
          console.error("[Settings] requestSubscription error: ", err);
          this.presentAlert(
            "Du har blockerat aviseringar. Se Hjälp.",
            ev
          );
        });
    } else {
      this.presentAlert(
        "Det finns inte stöd för aviseringar på din enhet.",
        ev
      );
    }
  }
  unsubscribeFromPush() {
    this.swPush
      .unsubscribe()
      .then(() => {
        console.log("[Settings] unsubscribe ok");
        this.presentToast(
          "Du prenumerar inte på aviseringar \nfrån Brf Husarvikens Strand."
        );
      })
      .catch(err => {
        console.error("[Settings] unsubscribe error: ", err);
        //  this.presentAlert("[Settings] unsubscribe error", false);
      });
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "middle"
    });
    toast.present();
  }

  async presentAlert(msg, ev) {
    const alert = await this.alertCtrl.create({
      // header: "Problem",
      // subHeader: "Subtitle",
      message: msg,
      buttons: [
        {
          text: "OK",
          handler: () => {
            console.log("[App] Alert: Pressed OK");
            if (ev) {
              ev.target.checked = false;
            }
          }
        }
      ]
    });
    alert.present();
  }
}
