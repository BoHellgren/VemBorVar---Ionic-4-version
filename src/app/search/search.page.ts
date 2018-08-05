import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MembersService } from '../members.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPage implements OnInit {
  hits: Array<{ lgh: string; lmv: string; membername: string }>;

  constructor(public navCtrl: NavController, private membersProvider: MembersService) {
    console.log('search constructor called');
    this.hits = this.membersProvider.members;
    console.log(this.hits);
  }

  ngOnInit() {
    console.log('search ngoninit called');
    /* this.hits = [];
    this.hits.push({ lgh: '123', lmv: '1001', membername: 'Tomas Frank' });
    this.hits.push({ lgh: '123', lmv: '1001', membername: 'Anna Jansson' });

    this.hits.push({ lgh: '131', lmv: '1102', membername: 'Lennart Axelsson' });
    this.hits.push({ lgh: '131', lmv: '1102', membername: 'Yvonne Axelsson' });
    this.hits.push({ lgh: '132', lmv: '1103', membername: 'Stefan Killander' });
    this.hits.push({ lgh: '132', lmv: '1103', membername: 'Cecilia Killander' });
    this.hits.push({ lgh: '133', lmv: '1101', membername: 'Clas Halldin' });
    this.hits.push({ lgh: '133', lmv: '1101', membername: 'Gunilla Halldin' }); */
  }

  itemTapped(event, lgh) {
    const mask = lgh.substring(0, 2);
    console.log('mask', mask);
    this.navCtrl.goForward('/show-floor');

    // this.navCtrl.push(ShowFloorPage, mask);
  }
}
