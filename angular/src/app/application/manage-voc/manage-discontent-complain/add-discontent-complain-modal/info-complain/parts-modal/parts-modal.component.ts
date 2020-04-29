import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../../../shared/common-service/set-modal-height.service';
import { ManageDiscontentComplainModel } from '../../../../../../core/models/manage-voc/manage-discontent-complain.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-modal',
  templateUrl: './parts-modal.component.html',
  styleUrls: ['./parts-modal.component.scss'],
})
export class PartsModalComponent implements OnInit {

  @Output() partsData = new EventEmitter();
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  fieldGrid;
  fieldGridParts;
  gridParams;
  dataTest;
  parts: boolean;
  rowData;
  dataRequest;
  selectedRowData: ManageDiscontentComplainModel;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'AREA_CODE', headerTooltip: 'AREA_CODE', field: 'areaCode'},
      {headerName: 'ISSUE_CODE', headerTooltip: 'ISSUE_CODE', field: 'issueCode'},
      {headerName: 'ISSUE_NAME', headerTooltip: 'ISSUE_NAME', field: 'issueName'},
    ];

    this.fieldGridParts = [
      {headerName: 'ISSUE_CODE', headerTooltip: 'ISSUE_CODE', field: 'issueCode'},
      {headerName: 'ISSUE_DTL_CODE', headerTooltip: 'ISSUE_DTL_CODE', field: 'issueDTLCode'},
      {headerName: 'ISSUE_DTL_NAME', headerTooltip: 'ISSUE_DTL_NAME', field: 'issueDTLName'},
    ];

    this.dataTest = [
      {
        areaCode: 'P001',
        issueCode: 'ic 001',
        issueName: 'issue name 111',
        categoryName: 'Product (Sản phẩm)',
        areaName: 'Product problem 1',
        categoryCode: 'Product',
      }, {
        areaCode: 'P001',
        issueCode: 'ic 002',
        issueName: 'issue name 222',
        categoryName: 'Product (Sản phẩm)',
        areaName: 'Product problem 1',
        categoryCode: 'Product',
      },
    ];
  }

  reset() {
    this.form = undefined;
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  callbackGrid(params) {
    this.gridParams = params;
    if (this.rowData) {
      if (this.rowData.areaCode === 'P001') {
        this.gridParams.api.setRowData(this.dataTest);
      }
    }
  }

  open(data?, parts?) {
    this.modal.show();
    this.buildForm();
    this.parts = parts;
    this.rowData = data;
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowData = selectedData[0];
    }
  }

  choose() {
    const dataRequest = Object.assign({}, this.rowData, this.selectedRowData);
    this.partsData.emit(dataRequest);
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({});
  }
}
