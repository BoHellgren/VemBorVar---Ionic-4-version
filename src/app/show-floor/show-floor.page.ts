import { Component, OnInit } from '@angular/core';
import { MembersService } from '../members.service';

@Component({
  selector: 'app-show-floor',
  templateUrl: './show-floor.page.html',
  styleUrls: ['./show-floor.page.scss']
})
export class ShowFloorPage implements OnInit {
  liveHere: Array<{ lgh: string; lmv: string; membername: string }>;
  streetAddr: string; // E.g. Taxgatan 3
  houseNumber: string; // 1 for Taxgatan 7, 2 for Taxgatan 3
  floorNum: number; // E.g. 6 or 1
  floorName: string; // E.g. 6 trappor or 1 trappa

  constructor(private membersService: MembersService) {
    const url = window.location.href;
    console.log('url: ', url);
    const mask = url.substring(url.lastIndexOf('#') + 1, url.length);
    console.log('mask: ', mask);

    this.houseNumber = mask.substring(0, 1);
    if (this.houseNumber === '1') {
      this.streetAddr = 'Taxgatan 7';
    } else {
      this.streetAddr = 'Taxgatan 3';
    }

    this.floorNum = +mask.substring(1, 2) - 1;
    if (this.floorNum === 1) {
      this.floorName = this.floorNum.toString().concat(' trappa');
    } else {
      this.floorName = this.floorNum.toString().concat(' trappor');
    }

    this.liveHere = this.membersService.members.filter(member => {
      return member.lgh.substring(0, 2).indexOf(mask) > -1;
    });
  }

  ngOnInit() {}
}
