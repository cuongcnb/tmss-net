import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridTableService } from '../../../../../shared/common-service/grid-table.service';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../../../shared/confirmation/confirm.service';
import { ManageDiscontentComplainModel } from '../../../../../core/models/manage-voc/manage-discontent-complain.model';
import { AgDatepickerRendererComponent } from '../../../../../shared/ag-datepicker-renderer/ag-datepicker-renderer.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'info-complain',
  templateUrl: './info-complain.component.html',
  styleUrls: ['./info-complain.component.scss'],
})
export class InfoComplainComponent implements OnInit {

  @ViewChild('requestModal', {static: false}) requestModal;
  @ViewChild('partsModal', {static: false}) partsModal;
  @ViewChild('chooseSupplierModal', {static: false}) chooseSupplierModal;
  form: FormGroup;
  fieldGridRequest;
  gridParamsRequest;
  fieldGridInfo;
  gridParamsInfo;
  fieldGridProcess;
  gridParamsProcess;
  selectedRowData: ManageDiscontentComplainModel;
  gridParams;
  displayedData;
  frameworkComponents;

  problem = true;
  parts = true;

  dateData;

  constructor(
    private formBuilder: FormBuilder,
    private gridTableService: GridTableService,
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGridRequest = [
      {headerName: 'Nội dung không hài lòng/Khiếu nại', headerTooltip: 'Nội dung không hài lòng/Khiếu nại', field: 'contentComplain', editable: true},
      {headerName: 'Yêu cầu của khách hàng', headerTooltip: 'Yêu cầu của khách hàng', field: 'customerRequest', editable: true},
      {headerName: 'Lĩnh vực', headerTooltip: 'Lĩnh vực', field: 'requestField'},
      {headerName: 'Nhóm vấn đề', headerTooltip: 'Nhóm vấn đề', field: 'problemGroup'},
      {headerName: 'Bộ phận hư hỏng/Loại công việc/Khu vực', headerTooltip: 'Bộ phận hư hỏng/Loại công việc/Khu vực', field: 'partsDamaged'},
      {headerName: 'Chi tiết vấn đề', headerTooltip: 'Chi tiết vấn đề', field: 'problemDetail'},
    ];

    this.fieldGridInfo = [
      {
        headerName: 'Ngày', headerTooltip: 'Ngày', field: 'dateInfo',
        cellRenderer: 'agDatepickerRendererComponent',
        disableSelect: false,
      },
      {headerName: 'Nội dung', headerTooltip: 'Nội dung', field: 'contentInfo', editable: true},
    ];

    this.fieldGridProcess = [
      {
        headerName: 'Ngày', headerTooltip: 'Ngày', field: 'dateProcess',
        cellRenderer: 'agDatepickerRendererComponent',
        disableSelect: false,
      },
      {headerName: 'Nội dung', headerTooltip: 'Nội dung', field: 'contentProcess', editable: true},
    ];

    this.dateData = [{
        dateInfo: '05/05/1996',
        contentInfo: 'ádsa1d5qw',
    }];

    this.frameworkComponents = {
      agDatepickerRendererComponent: AgDatepickerRendererComponent,
    };
  }

  callbackGridRequest(params) {
    this.gridParamsRequest = params;
    this.gridParamsRequest.api.setRowData();
  }

  getParamsRequest() {
    const selectedData = this.gridParamsRequest.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowData = selectedData[0];
    }
  }

  callbackGridInfo(params) {
    this.gridParamsInfo = params;
    this.gridParamsInfo.api.setRowData(this.dateData);
  }

  getParamsInfo() {
    const selectedData = this.gridParamsInfo.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowData = selectedData[0];
    }
  }

  callbackGridProcess(params) {
    this.gridParamsProcess = params;
    this.gridParamsProcess.api.setRowData();
  }

  getParamsProcess() {
    const selectedData = this.gridParamsProcess.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowData = selectedData[0];
    }
  }

  addData(data) {
    this.form.patchValue(data);
  }

  openCSLPModal() {
    this.chooseSupplierModal.open(true);
  }

  openCSVModal() {
    this.chooseSupplierModal.open(false);
  }

  onAddRowRequest() {
    const blankComplain = {
      contentComplain: undefined,
      customerRequest: undefined,
      requestField: undefined,
      problemGroup: undefined,
      partsDamaged: undefined,
      problemDetail: undefined,
    };
    this.gridParamsRequest.api.updateRowData({add: [blankComplain]});
    this.getDisplayedDataRequest();
    this.gridTableService.setFocusCell(this.gridParamsRequest, 'contentComplain', this.displayedData);
  }

  onDeleteRowRequest() {
    (!this.selectedRowData)
      ? this.swalAlert.openWarningToast('Hãy chọn dòng cần xóa', 'Thông báo!')
      : this.confirm.openConfirmModal('Question?', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        this.gridParamsRequest.api.updateRowData({remove: [this.selectedRowData]});
      });
  }

  onAddRowInfo() {
    const blankComplain = {
      dateInfo: undefined,
      contentInfo: undefined,
    };
    this.gridParamsInfo.api.updateRowData({add: [blankComplain]});
  }

  onDelRowInfo() {
    (!this.selectedRowData)
      ? this.swalAlert.openWarningToast('Hãy chọn dòng cần xóa', 'Thông báo!')
      : this.confirm.openConfirmModal('Question?', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        this.gridParamsInfo.api.updateRowData({remove: [this.selectedRowData]});
      });
  }

  onAddRowProcess() {
    const blankComplain = {
      dateProcess: undefined,
      contentProcess: undefined,
    };
    this.gridParamsProcess.api.updateRowData({add: [blankComplain]});
  }

  onDelRowProcess() {
    (!this.selectedRowData)
      ? this.swalAlert.openWarningToast('Hãy chọn dòng cần xóa', 'Thông báo!')
      : this.confirm.openConfirmModal('Question?', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        this.gridParamsProcess.api.updateRowData({remove: [this.selectedRowData]});
      });
  }

  getDisplayedDataRequest() {
    const displayedData = [];
    this.gridParamsRequest.api.forEachNode(node => {
      displayedData.push(node.data);
    });
    this.displayedData = displayedData;
  }

  clickRequestField(params) {
    switch (params.colDef.field) {
      case 'requestField':
        this.requestModal.open(this.selectedRowData);
        break;
      case 'problemGroup':
        this.requestModal.open(this.selectedRowData, this.problem);
        break;
      case 'partsDamaged':
        this.partsModal.open(this.selectedRowData);
        break;
      case 'problemDetail':
        this.partsModal.open(this.selectedRowData, this.parts);
        break;
    }
  }

  requestData(data) {
    const index = this.displayedData.indexOf(this.selectedRowData);
    this.displayedData[index] = Object.assign(data, {
      contentComplain: data.contentComplain,
      customerRequest: data.customerRequest,
      requestField: data.categoryName,
      problemGroup: data.areaName,
      partsDamaged: data.issueName,
      problemDetail: data.issueDTLName,
    });
    this.gridParamsRequest.api.setRowData(this.gridTableService.addSttToData(this.displayedData));
    this.getDisplayedDataRequest();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dateCreate: [undefined],
      supplierReception: [undefined],
      requestTMV: [{value: undefined, disabled: true}],
      dateReception: [undefined],
      supplierSell: [undefined],
      dateSendToTMV: [{value: undefined, disabled: true}],
      sourceReception: [undefined],
      supplierService: [undefined],
      status: [undefined],
      //
      contacter: [undefined],
      driversName: [undefined],
      driversPhone: [undefined],
      specialCustomer: [undefined],
      driversAddress: [undefined],
      otherCustomerInfo: [undefined],
      //
      vin: [undefined],
      licensePlate: [undefined],
      carType: [undefined],
      dateBuy: [undefined],
      model: [undefined],
      salesStaff: [undefined],
      cvdv: [undefined],
      salesTeam: [undefined],
      technicians: [undefined],
      km: [undefined],
      techniciansTeam: [undefined],
      //
      reasonComplain: [undefined],
      solution: [undefined],
      //
      severity: [undefined],
      responsibility: [undefined],
      reason: [undefined],
      nonFix: [undefined],
      complainRepeat: [undefined],
      supportGoodwill: [undefined],
      dateSuggest: [undefined],
      dateApproved: [undefined],
      detailGoodwill: [undefined],
    });
  }
}
