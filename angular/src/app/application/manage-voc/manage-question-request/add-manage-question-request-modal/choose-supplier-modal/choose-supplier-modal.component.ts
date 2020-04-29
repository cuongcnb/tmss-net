import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'choose-supplier-modal',
  templateUrl: './choose-supplier-modal.component.html',
  styleUrls: ['./choose-supplier-modal.component.scss'],
})
export class ChooseSupplierModalComponent implements OnInit {

  @Output() dataOutput = new EventEmitter();
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  fieldGrid;
  gridParams;
  dataTest;
  dataTest1;
  licenseOrVin;
  dataOut;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
    this.fieldGrid = [
      {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'supplier'},
    ];
    this.dataTest = [
      {supplier: 'dai ly 1'},
      {supplier: 'dai ly 2'},
      {supplier: 'dai ly 3'},
      {supplier: 'dai ly 4'},
    ];

    this.dataTest1 = [
      {supplier: 'dl 1'},
      {supplier: 'dl 2'},
      {supplier: 'dl 3'},
      {supplier: 'dl 4'},
    ];

    this.dataOut = {customerName: 'Hung123'};
  }

  callbackGrid(params) {
    this.gridParams = params;
    if (this.licenseOrVin) {
      this.gridParams.api.setRowData(this.dataTest);
    } else {
      this.gridParams.api.setRowData(this.dataTest1);
    }
  }

  reset() {
    this.form = undefined;
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(data) {
    this.buildForm();
    this.modal.show();
    this.licenseOrVin = data;
  }

  choose() {
    this.dataOutput.emit(this.dataOut);
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({});
  }
}
