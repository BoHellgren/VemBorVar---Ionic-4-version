import { Component, OnInit } from "@angular/core";
import { MembersService } from "../members.service";
import { AngularFireDatabase } from "@angular/fire/database";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  stairs: string[] = [
    "6 trappor ",
    "5 trappor ",
    "4 trappor ",
    "3 trappor ",
    "2 trappor ",
    "1 trappa "
  ];
  traces: any;
  constructor(
    private membersProvider: MembersService,
    public afDatabase: AngularFireDatabase
  ) {
    console.log("[Home] constructor started");
    this.traces = this.afDatabase.list(
      "/" + window.location.hostname.replace(/(\.)/g, "-") + "-traces"
    );
    /* this.traces = this.afDatabase.list("/pwavbv-firebaseapp-com-traces"); */
    console.log("[Home] traces: ", this.traces);
  }

  ngOnInit() {
    console.log("[Home] ngOnInit called");
    this.membersProvider.loadMembers(); // Load members from web site or storage

    // Update the database to trace usage of app

    let mql;
    let displayMode = "";
    mql = window.matchMedia("(display-mode: standalone)");
    if (mql.matches) {
      displayMode = "standalone";
    }
    mql = window.matchMedia("(display-mode: browser)");
    if (mql.matches) {
      displayMode = "browser";
    }
    console.log("[Home] mql display-mode: ", displayMode);
    console.log(
      "[Home] window.navigator.standalone: ",
      window.navigator["standalone"]
    );
    if (!displayMode) {
      if (window.navigator["standalone"]) {
        displayMode = "standalone";
      } else {
        displayMode = "browser";
      }
    }
    console.log("[Home] display-mode: ", displayMode);

    const tracetime = Date();
    const tracemsg = navigator["userAgent"];

    const url = "https://api.ipify.org?format=json";
    let myip = "00.00.00.00";
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        myip = data.ip;
        writeTrace(this.traces);
      })
      .catch(() => {
        console.error(
          "[Home] Failure requesting ip address from api.ipify.org"
        );
        writeTrace(this.traces);
      });

    function writeTrace(traces) {
      traces
        .push({
          version: "4.0",
          ip: myip,
          timesubmitted: tracetime,
          displayMode: displayMode,
          userAgent: tracemsg
        })
        .then(
          () => {
            console.log("[Home] Trace has been saved succesfully: ", tracemsg);
          },
          error => {
            console.error("[Home] Error has occured saving trace: ", error);
          }
        );
    }
  }
}
