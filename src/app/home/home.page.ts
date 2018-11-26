import { Component, OnInit } from "@angular/core";
import { MembersService } from "../members.service";

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

  constructor(private membersProvider: MembersService) {
    //  console.log("[Home] constructor started");
  }

  ngOnInit() {
    this.membersProvider.loadMembers(); // Load members from web site or storage
  }
}
