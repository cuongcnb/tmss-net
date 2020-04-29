import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'car-info-proposal',
  templateUrl: './car-info-proposal.component.html',
  styleUrls: ['./car-info-proposal.component.scss'],
})
export class CarInfoProposalComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() cmListByType: Array<any> = [];
  @Input() kmBefore;
  isCollapsed = true;

  constructor() {
  }

  ngOnInit() {
  }
}
