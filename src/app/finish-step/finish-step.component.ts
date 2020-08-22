import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-finish-step',
  templateUrl: './finish-step.component.html',
  styleUrls: ['./finish-step.component.scss']
})
export class FinishStepComponent implements OnInit {

  constructor(private mainServ: MainService) { }

  fullName;

  ngOnInit() {
    this.fullName = this.mainServ.fullName;
  }

}
