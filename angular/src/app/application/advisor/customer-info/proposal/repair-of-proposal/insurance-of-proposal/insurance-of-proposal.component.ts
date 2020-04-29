import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'insurance-of-proposal',
  templateUrl: './insurance-of-proposal.component.html',
  styleUrls: ['./insurance-of-proposal.component.scss'],
})
export class InsuranceOfProposalComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('insurances') insurance;
  @Input() proposalForm: FormGroup;
  gridHeight = '280px';
  gridField;
  params;

  constructor() {
  }

  ngOnInit() {
    this.gridField = [
      {
        headerName: 'Có',
        headerTooltip: 'Có',
        field: 'yes',
      },
      {
        headerName: 'Hồ sơ',
        headerTooltip: 'Hồ sơ',
        field: 'file',
      },
    ];
  }

  callbackGrid(params) {
    this.params = params;
  }

}
