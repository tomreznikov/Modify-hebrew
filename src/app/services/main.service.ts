import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  public activeRoute = new EventEmitter;

  public fullName: string;
  public itemsString: string;
  public items = [];
  public selectedNum = 1;
  public changeNum = new EventEmitter;
  public saveSVG = new EventEmitter;

  constructor() { }
}
