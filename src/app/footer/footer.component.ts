import { Component, OnInit, ViewChildren } from '@angular/core';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @ViewChildren('p') p;

  i = 0;
  collection;

  page: number;

  activeRoute: string;

  constructor(private mainServ: MainService) {
  }

  ngOnInit() {
    // this.mainServ.items.subscribe(event => {
    //   this.collection = event;
    // });
    this.collection = this.mainServ.items;
  }

  next() {
    this.collection = this.mainServ.items;
    // this.i++;
    // this.activeRoute = this.routes[this.i];
    if (!this.activeRoute || this.activeRoute === 'main') {
      this.activeRoute = 'resize';
      this.page = 1;
      this.mainServ.selectedNum = this.page;
      this.mainServ.changeNum.emit(this.page);
      this.mainServ.activeRoute.emit(this.activeRoute);
    }
    if (this.activeRoute === 'resize') {
      let arr = this.mainServ.itemsString.split(',').map(element => {
        return element.trim();
      });

      if (!this.mainServ.items.length) {
        this.mainServ.items = arr.map(element => {
          return {name: element.trim(), group: 1, radius: 50}
        });
        this.collection = this.mainServ.items;
      } else {
        this.mainServ.items.map((element, index) => {
          element.name = arr[index];
          element.x = +element.x;
          element.y = +element.y;
          return element;
        });
      }
    }
    this.mainServ.activeRoute.emit(this.activeRoute);
  }

  changePage(event) {
    this.mainServ.selectedNum = event;
    this.mainServ.changeNum.emit(event);
  }

  goToPage(page) {
    this.page = null;
    this.activeRoute = page;
    this.mainServ.activeRoute.emit(this.activeRoute);
  }

  nextPage() {
    this.page++;
    if (this.page > this.collection.length) {
      this.goToPage('grouped');
    } else {
      this.mainServ.selectedNum = this.page;
      this.mainServ.changeNum.emit(this.page);
    }
  }

  export() {
    this.activeRoute = 'finish';
    this.mainServ.activeRoute.emit(this.activeRoute);
    this.mainServ.saveSVG.emit(true);
  }
}
