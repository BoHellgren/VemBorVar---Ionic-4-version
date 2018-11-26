import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { MembersService } from "../members.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"]
})
export class SearchPage implements OnInit {
  hits: Array<{ lgh: string; lmv: string; membername: string }>;

  constructor(
    public navCtrl: NavController,
    private membersProvider: MembersService
  ) {
  //  console.log("[search] search constructor called");
  }

  ngOnInit() {
    // console.log("[search] ngoninit called");
    if (!this.membersProvider.members) {
      this.membersProvider.membersFromStorage();
    }
    this.hits = this.membersProvider.members;
  }

  getItems(ev: any) {
    this.hits = this.membersProvider.members;
    const val = ev.target.value;
    if (val && val.trim() !== "") {
      this.hits = this.hits.filter(member => {
        return (
          member.membername.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          member.lgh.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          member.lmv.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    }
  }
}
