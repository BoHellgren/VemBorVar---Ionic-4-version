import { Component, OnInit } from "@angular/core";
import { MembersService } from "../members.service";

@Component({
  selector: "app-show-floor",
  templateUrl: "./show-floor.page.html",
  styleUrls: ["./show-floor.page.scss"]
})
export class ShowFloorPage implements OnInit {
  liveHere: Array<{ lgh: string; lmv: string; membername: string }>;
  showHere: Array<{ lgh: string; lmv: string; membername: string }>;
  streetAddr: string; // E.g. Taxgatan 3
  houseNumber: string; // 1 for Taxgatan 7, 2 for Taxgatan 3
  floorNum: number; // E.g. 6 or 1
  floorName: string; // E.g. 6 trappor or 1 trappa

  constructor(private membersProvider: MembersService) {}

  ngOnInit() {
    console.log("[show-floor] ngoninit called");
    const url = window.location.href; // consider angular activated route instead
    console.log("[show-floor] url: ", url);
    const mask = url.substring(url.lastIndexOf("#") + 1, url.length);
    console.log("[show-floor] mask: ", mask);

    this.houseNumber = mask.substring(0, 1);
    if (this.houseNumber === "1") {
      this.streetAddr = "Taxgatan 7";
    } else {
      this.streetAddr = "Taxgatan 3";
    }

    this.floorNum = +mask.substring(1, 2) - 1;
    if (this.floorNum === 1) {
      this.floorName = this.floorNum.toString().concat(" trappa");
    } else {
      this.floorName = this.floorNum.toString().concat(" trappor");
    }

    if (!this.membersProvider.members) {
      this.membersProvider.membersFromStorage();
    }
    this.liveHere = this.membersProvider.members.filter(member => {
      return member.lgh.substring(0, 2).indexOf(mask) > -1;
    });
    this.addSeparators();
  }

  addSeparators() {
    this.showHere = [];
    let oldlgh = this.liveHere[0].lgh;
    for (let i = 0; i < this.liveHere.length; i++) {
      if (this.liveHere[i].lgh !== oldlgh) {
        this.showHere.push({ lgh: " ", lmv: " ", membername: " " });
        oldlgh = this.liveHere[i].lgh;
      }
      this.showHere.push(this.liveHere[i]);
    }
  }

  GoUp(event) {
    // Goto next higher floor
    if (
      this.floorNum < 6 ||
      (this.floorNum < 7 && this.streetAddr === "Taxgatan 3")
    ) {
      this.floorNum++;
      this.floorName = this.floorNum.toString().concat(" trappor");
      const mask = this.houseNumber.concat((this.floorNum + 1).toString());
      this.liveHere = this.membersProvider.members.filter(member => {
        return member.lgh.substring(0, 2).indexOf(mask) > -1;
      });
      this.addSeparators();
    }
  }

  GoDown(event) {
    // Goto next lower floor
    if (this.floorNum > 1) {
      this.floorNum--;
      if (this.floorNum === 1) {
        this.floorName = this.floorNum.toString().concat(" trappa");
      } else {
        this.floorName = this.floorNum.toString().concat(" trappor");
      }
      const mask = this.houseNumber.concat((this.floorNum + 1).toString());
      this.liveHere = this.membersProvider.members.filter(member => {
        return member.lgh.substring(0, 2).indexOf(mask) > -1;
      });
      this.addSeparators();
    }
  }
}
