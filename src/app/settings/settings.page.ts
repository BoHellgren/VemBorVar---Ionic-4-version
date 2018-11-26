import { Component, OnInit } from "@angular/core";
import { SwPush } from "@angular/service-worker";
import { AngularFireDatabase } from "angularfire2/database";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"]
})
export class SettingsPage implements OnInit {
  isSafari = false;
  isIosStandaloneMode = false;
  showAddToHomeScreen = false;

  public notif = { switch: false };
  readonly VAPID_PUBLIC_KEY =
    "BK9Ac2byemhpGs9BJGhyxEhhp-m5FyiWBfp-fnDJHwnvkUuuQj83_JJFZoCNrDav56sPJee6Epd-koA7Z4FQrJQ";
  subs: any;

  constructor(
    private swPush: SwPush,
    afDatabase: AngularFireDatabase,
    public toastCtrl: ToastController
  ) {
    this.subs = afDatabase.list("/pwavbv-firebaseapp-com-subs");
    console.log("[Settings] subs: ", this.subs);
    console.log("[Settings] notif: ", this.notif.switch);
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

    const p: string = Notification["permission"];
    console.log("[Settings] ngOnInit Notification permission: ", p);
    // granted, default, denied

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
                this.notif.switch = true;
              } else {
                this.notif.switch = false;
              }
            });
        });
      }
    });
  }

  toggleNotifications(ev) {
    console.log("[Settings] toggle event: ", ev.detail);
    if (ev.detail.checked) {
      this.subscribeToPush();

    } else {
      this.unsubscribeFromPush();
    }
  }

  subscribeToPush() {
    // console.log("[Settings] notif: ", this.notif.switch);
    // console.log("[Settings] subscribeToPush called");

    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
      .then(pushSubscription => {
        // console.log("[Settings] User is subscribed. Subscription:", pushSubscription );
        // Update the subscription database
        const mysub = JSON.stringify(pushSubscription);
        const subtime = Date();
        this.subs.push({ subscription: mysub, timesubmitted: subtime });
        console.log("[Settings] Subscription pushed: ", mysub);
        this.presentToast(
          "Du prenumerar nu på aviseringar från Brf Husarvikens Strand."
        );
      })
      .catch(err => {
        console.error("[Settings] requestSubscription error: ", err);
        this.notif.switch = false; // does not work!
        this.presentErrorToast(
          "Det finns inte stöd för aviseringar på din enhet."
        );
      });
  }

  unsubscribeFromPush() {
    console.log("[Settings] notif: ", this.notif.switch);
    this.swPush
      .unsubscribe()
      .then(() => {
        console.log("[Settings] unsubscribe ok");
        this.presentToast(
          "Du prenumerar inte längre på aviseringar från Brf Husarvikens Strand."
        );
      })
      .catch(err => {
        console.error("[Settings] unsubscribe error: ", err);
        this.presentErrorToast("[Settings] unsubscribe error");
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
  async presentErrorToast(msg) {
    const toast1 = await this.toastCtrl.create({
      message: msg,
      position: "middle",
      showCloseButton: true,
      closeButtonText: "OK",
    });
    toast1.present();
  }
}
