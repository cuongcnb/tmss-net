import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SetModalHeightService } from '../../../../../../shared/common-service/set-modal-height.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { ManageDiscontentComplainModel } from '../../../../../../core/models/manage-voc/manage-discontent-complain.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'request-modal',
  templateUrl: './request-modal.component.html',
  styleUrls: ['./request-modal.component.scss'],
})
export class RequestModalComponent implements OnInit {

  @Output() requestData = new EventEmitter();
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight: number;
  form: FormGroup;
  fieldGrid;
  gridParams;
  dataTest: Array<any> = [];
  dataTest1: Array<any> = [];
  dataRequest;

  selectedRowData: ManageDiscontentComplainModel;
  fieldGridProblem;
  problem;
  rowData;
  displayedData;

  constructor(
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.onResize();
    this.fieldGrid = [
      {headerName: 'CATEGORY_CODE', headerTooltip: 'CATEGORY_CODE', field: 'categoryCode'},
      {headerName: 'CATEGORY_Name', headerTooltip: 'CATEGORY_Name', field: 'categoryName'},
    ];

    this.fieldGridProblem = [
      {headerName: 'CATEGORY_CODE', headerTooltip: 'CATEGORY_CODE', field: 'categoryCode'},
      {headerName: 'AREA_CODE', headerTooltip: 'AREA_CODE', field: 'areaCode'},
      {headerName: 'AREA_NAME', headerTooltip: 'AREA_NAME', field: 'areaName'},
    ];

    this.dataTest = [
      {
        categoryCode: 'Product',
        categoryName: 'Product(Sản phẩm)',
      }, {
        categoryCode: 'Sales',
        categoryName: 'Sales(Kinh doanh)',
      },
    ];

    this.dataTest1 = [
      {
        categoryCode: 'Product',
        areaCode: 'P001',
        areaName: 'Product problem 1',
        categoryName: 'Product (Sản phẩm)',
      }, {
        categoryCode: 'Product',
        areaCode: 'P002',
        areaName: 'Product problem 2',
        categoryName: 'Product (Sản phẩm)',
      },
    ];
  }

  open(data?, problem?) {
    this.modal.show();
    this.buildForm();
    this.problem = problem;
    this.rowData = data;
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
      if (this.rowData.categoryCode === 'Product' && this.problem) {
        this.gridParams.api.setRowData(this.dataTest1);
      } else if (this.rowData.categoryCode === 'Sales' && this.problem) {
        this.gridParams.api.setRowData();
      } else {
        this.gridParams.api.setRowData(this.dataTest);
      }
    }
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowData = selectedData[0];
    }
  }

  choose() {
    this.dataRequest = Object.assign(this.selectedRowData, {
      contentComplain: this.rowData.contentComplain,
      customerRequest: this.rowData.customerRequest,
    });
    this.requestData.emit(this.dataRequest);
    this.modal.hide();
    this.problem = undefined;
  }

  private buildForm() {
    this.form = this.formBuilder.group({});
  }
}
