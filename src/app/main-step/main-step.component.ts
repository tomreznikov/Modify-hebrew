import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../services/main.service';
declare let d3;

@Component({
  selector: 'app-main-step',
  templateUrl: './main-step.component.html',
  styleUrls: ['./main-step.component.scss']
})

export class MainStepComponent implements OnInit {
  @ViewChild('uploader', {static: false}) uploader;

  constructor(private mainServ: MainService) { }

  activeRoute = 'main';
  fullName: string;
  filename: string;
  buttonLabel = 'Upload CSV';
  itemsString = '';

  ngOnInit() {
    this.mainServ.activeRoute.subscribe(event => {
      this.activeRoute = event;
    });
  }

  csvJSON(csv) {
    let lines = csv.split("\n");
    let result = [];
    let headers = lines[0].split(";");

    for (let i = 1; i < lines.length; i++) {

      let obj = {};
      let currentline = lines[i].split(";");

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);

    }
    return result;
    // return JSON.stringify(result); //JSON
  }

  handleFileSelect(evt) {
    let files = evt.target.files; // FileList object
    let file = files[0];
    this.filename = file.name;
    if (this.buttonLabel === 'Replace file') {
      this.itemsString = '';
      this.mainServ.itemsString = '';
      this.mainServ.items = [];
    }
    this.buttonLabel = 'Replace file';
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event: any) => {
      let csv = this.csvJSON(event.target.result);
      this.mainServ.items = csv.map(element => {
        if (element && element.name && (element.name !== ' ')) {
          return element;
        }
      }).filter(Boolean);
      this.itemsString += this.mainServ.items.map(element => {
        return element.name;
      }).join(', ');

      this.mainServ.itemsString = this.itemsString;
    };
    this.uploader.nativeElement.value = '';
  }

  deleteFile() {
    this.filename = null;
    this.buttonLabel = 'Upload CSV';
    this.itemsString = null;
    this.mainServ.items = [];
    this.mainServ.itemsString = null;
  }

  changeName(event) {
    this.mainServ.fullName = event;
  }

  changeArea(event) {
    this.mainServ.itemsString = this.itemsString;
  }
}
