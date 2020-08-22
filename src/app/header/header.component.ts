import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  currentDate: string;

  constructor(private mainServ: MainService) { }

  fullName;
  activeRoute;

  ngOnInit() {
    this.currentDate = moment().format('MMMM DD, YYYY');

    this.fullName = this.mainServ.fullName;
    this.mainServ.activeRoute.subscribe(element => {
      this.fullName = this.mainServ.fullName;
      this.activeRoute = element;
    });
  }
}
