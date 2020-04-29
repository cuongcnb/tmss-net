import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'car-info-of-proposal',
  templateUrl: './car-info-of-proposal.component.html',
  styleUrls: ['./car-info-of-proposal.component.scss'],
})
export class CarInfoOfProposalComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() cmListByType: Array<any> = [];
  @Input() kmBefore;
  isCollapsed = true;

  constructor() {
  }

  ngOnInit() {
  }
}
