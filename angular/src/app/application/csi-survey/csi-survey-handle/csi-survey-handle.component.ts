import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { CsiSurveyModel } from '../../../core/models/csi-survey/csi.model';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'csi-survey-handle',
  templateUrl: './csi-survey-handle.component.html',
  styleUrls: ['./csi-survey-handle.component.scss'],
})
export class CsiSurveyHandleComponent implements OnInit {
  @Input() webCsiHandle: boolean;
  @ViewChild('removeModal', {static: false}) removeModal;
  @ViewChild('insertDataModal', {static: false}) modal;
  form: FormGroup;
  fieldGridCsiHandle;
  gridParams;
  selectedData: CsiSurveyModel;
  selectedRowData;
  data: Array<any>;
  displayedData: Array<CsiSurveyModel> = [];

  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private gridTableService: GridTableService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.data = [
      {
        agency: 'Toyota Thanh Xuân',
        customerName: 'Trần Thị Thanh',
        companyName: '',
        customerAdd: 'Hà Nội',
        contactName: 'Trần Thị Thanh',
        contactPhoneNumber: '035666565',
        node: 'Đang chờ xử lý',
        licensePlate: '30A2-98989',
        model: '2015',
        amount: '1000000000',
        repairRequest: 'Thay bánh xe',
        km: '2514',
        carComeDay: '01/01/2019',
        deliveryDay: '10/01/2019',
      },
    ];
    this.fieldGridCsiHandle = [
      {
        headerName: 'Danh sách khách hàng CSI', children: [
          {headerName: 'Lý do loại bỏ', headerTooltip: 'Lý do loại bỏ', field: 'removeReason'},
          {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'agency'},
          {headerName: 'Tên khách hàng', headerTooltip: 'Tên khách hàng', field: 'customerName'},
          {headerName: 'Tên công ty', headerTooltip: 'Tên công ty', field: 'companyName'},
          {headerName: 'Địa chỉ khách hàng', headerTooltip: 'Địa chỉ khách hàng', field: 'customerAdd'},
          {headerName: 'Tên người liên hệ', headerTooltip: 'Tên người liên hệ', field: 'contactName'},
          {headerName: 'Điện thoại liên hệ', headerTooltip: 'Điện thoại liên hệ', field: 'contactPhoneNumber'},
          {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'node'},
          {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'licensePlate'},
          {headerName: 'Model', headerTooltip: 'Model', field: 'model'},
          {headerName: 'Amount', headerTooltip: 'Amount', field: 'amount'},
          {headerName: 'Yêu cầu sửa chữa', headerTooltip: 'Yêu cầu sửa chữa', field: 'repairRequest'},
          {headerName: 'Km', headerTooltip: 'Km', field: 'km'},
          {headerName: 'Ngày mang xe đến', headerTooltip: 'Ngày mang xe đến', field: 'carComeDay'},
          {headerName: 'Ngày giao xe', headerTooltip: 'Ngày giao xe', field: 'deliveryDate'},
        ],
      },
    ];
  }

  callBackGridCsiHandle(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  deleteHandle() {
    if (this.selectedRowData) {
      this.removeModal.open(this.selectedRowData);
    } else {
      this.swalAlert.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
    }
  }

  getParamsCsiHandle() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowData = selectedData[0];
    }
  }

  search() {
    if (this.form.value.deliveryDate && this.form.value.dayOut) {
      this.gridParams.api.setRowData(this.data);
    } else {
      this.swalAlert.openWarningToast('Bạn chưa chọn thời gian');
    }
  }

  getData(data) {
    const displayData = this.gridTableService.getAllData(this.gridParams);
    const index = displayData.indexOf(this.selectedRowData);
    const value = Object.assign({}, this.selectedRowData, data);
    displayData[index] = value;
    this.gridParams.api.setRowData(this.gridTableService.addSttToData(displayData));
  }

  insertData(params) {
    if (params.colDef.field === 'removeReason') {
      this.modal.open(this.selectedRowData);
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      deliveryDate: [undefined],
      dayOut: [undefined],
    });
  }
}
