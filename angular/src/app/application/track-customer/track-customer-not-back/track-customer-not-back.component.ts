import { Component, Input, OnInit } from '@angular/core';
import { TrackCustomerNotBackModel } from '../../../core/models/track-customer/track-customer-not-back.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'track-customer-not-back',
  templateUrl: './track-customer-not-back.component.html',
  styleUrls: ['./track-customer-not-back.component.scss'],
})
export class TrackCustomerNotBackComponent implements OnInit {

  @Input() isBuyCar: boolean;
  form: FormGroup;
  fieldGrid;
  gridParams;
  selectedData: TrackCustomerNotBackModel;

  dataSearch = [{
    checkup: 'c5as4445awe',
    customerType: 'VIP',
    estimatedDay: '6/9/1996',
  }];

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Biển kiểm soát', headerTooltip: 'Biển kiểm soát', field: 'checkup'},
      {headerName: 'Loại KH', headerTooltip: 'Loại khách hàng', field: 'customerType'},
      {headerName: 'Ngày dự tính', headerTooltip: 'Ngày dự tính', field: 'estimatedDay'},
    ];
    this.buildForm();
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  search() {
    this.gridParams.api.setRowData(this.dataSearch);
  }

  onSubmit() {

  }

  private buildForm() {
    this.form = this.formBuilder.group({
      statusContact: [undefined],
      supplier: [undefined],
      contactDate: [undefined],
      toDate: [undefined],
      cvdv: [undefined],
      bks: [undefined],
      vin: [undefined],
      notBackIn: [undefined],
      customerType: [undefined],
      estimatedDay: [undefined],
    });
  }
}
