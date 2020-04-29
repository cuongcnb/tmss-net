import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchExtractDataModel } from '../../../core/models/search-extract-data/search-extract-data.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'search-customer',
  templateUrl: './search-customer.component.html',
  styleUrls: ['./search-customer.component.scss'],
})
export class SearchCustomerComponent implements OnInit {
  fieldGrid;
  form: FormGroup;
  gridParams;
  selectedRowGrid: SearchExtractDataModel;
  data = [
    {
      licensePlates: '29s6.65222',
      errorModel: 'M36',
      errorVin: 'S1996',
    },
    {
      licensePlates: '30s1.5545',
      errorModel: 'V29',
      errorVin: 'T197',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'licensePlates'},
      {headerName: 'Model', headerTooltip: 'Model', field: 'errorModel'},
      {headerName: 'Số Vin', headerTooltip: 'Số Vin', field: 'errorVin'},
    ];
    this.buildForm();
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData(this.data);
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowGrid = selectedData[0];
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      sortAgency: [undefined],
      licensePlates: [undefined],
      errorVin: [undefined],
      errorModel: [undefined],
    });
  }
}
