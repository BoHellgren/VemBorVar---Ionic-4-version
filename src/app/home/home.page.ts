import { Component } from '@angular/core';
import { MembersService } from '../members.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  stairs: string[] = [
    '6 trappor ',
    '5 trappor ',
    '4 trappor ',
    '3 trappor ',
    '2 trappor ',
    '1 trappa '
  ];

  constructor(private membersProvider: MembersService) {
    console.log('HomePage constructor started');
    this.membersProvider.loadMembers(); // Load members from web site
  }
}
