import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { SsiSurveyModel } from '../../../core/models/ssi-survey/ssi-survey.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ssi-survey-handle',
  templateUrl: './ssi-survey-handle.component.html',
  styleUrls: ['./ssi-survey-handle.component.scss'],
})
export class SsiSurveyHandleComponent implements OnInit {
  @ViewChild('removeType', {static: false}) removeType;
  @ViewChild('modal', {static: false}) modal;
  @Input() webHandle: boolean;
  form: FormGroup;
  ssiSurveyHandle: Array<any>;
  data: Array<any>;
  param;
  gridParams;
  selectRowGrid;
  selectedData: Array<any>;
  displayedData: Array<SsiSurveyModel> = [];

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private gridTableService: GridTableService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.ssiSurveyHandle = [
      {headerName: 'Lý do loại bỏ', headerTooltip: 'Lý do loại bỏ', field: 'removeReason'},
      {headerName: 'Địa chỉ KH', headerTooltip: 'Địa chỉ khách hàng', field: 'customerAdd'},
      {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'phoneNumber'},
      {headerName: 'Tên người liên hệ', headerTooltip: 'Tên người liên hệ', field: 'contactName'},
      {headerName: 'Điện thoại liên hệ', headerTooltip: 'Điện thoại liên hệ', field: 'contactPhoneNumber'},
      {headerName: 'Model', headerTooltip: 'Model', field: 'model'},
      {headerName: 'Số khung', headerTooltip: 'Số khung', field: 'frameNumber'},
      {headerName: 'Ngày báo bán', headerTooltip: 'Ngày báo bán', field: 'saleDate'},
      {headerName: 'Ngày giao xe', headerTooltip: 'Ngày giao xe', field: 'deliveryDate'},
      {headerName: 'Ngày tạo câu hỏi', headerTooltip: 'Ngày tạo câu hỏi', field: 'dayCreateQuestion'},
      {headerName: 'Người bán', headerTooltip: 'Người bán', field: 'seller'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'note'},
      {headerName: 'Dlr remark for CS', headerTooltip: 'Dlr remark for CS', field: 'dlrRemark'},
    ];
    this.data = [
      {
        customerAdd: 'Hà Nội',
        phoneNumber: '0343331215',
        contactName: 'Sơn',
        contactPhoneNumber: '113',
        model: '2018',
        frameNumber: 'asakkki111',
        saleDate: '20/11/2014',
        deliveryDate: '22/11/2014',
        dayCreateQuestion: '01/01/2019',
        seller: 'Hưng',
        note: '',
        dlrRemark: '',
      },
      {
        customerAdd: 'Hà Nam',
        phoneNumber: '034333333',
        contactName: 'Sĩ',
        contactPhoneNumber: '113',
        model: '2018',
        frameNumber: 'asakkki111',
        saleDate: '20/11/2014',
        deliveryDate: '22/11/2014',
        dayCreateQuestion: '01/01/2019',
        seller: 'Hưng',
        note: '',
        dlrRemark: '',
      },
      {
        customerAdd: 'Thái Nguyên',
        phoneNumber: '034444444',
        contactName: 'Vân',
        contactPhoneNumber: '114',
        model: '2013',
        frameNumber: 'asakkki111',
        saleDate: '20/11/2014',
        deliveryDate: '22/11/2014',
        dayCreateQuestion: '01/01/2019',
        seller: 'Hiền',
        note: 'mua trả góp',
        dlrRemark: 'thanh toán hàng tháng',
      },
    ];
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dayIn: [undefined],
      dayOut: [undefined],
    });
  }

  callBackGridHandle(params) {
    this.gridParams = params;
  }

  getParamsHandle() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectRowGrid = selectedData[0];
    }
  }

  searchHandle() {
    if (!this.form.get('dayIn').value || !this.form.get('dayOut').value) {
      this.swalAlertService.openFailToast('Chưa chọn ngày', 'Thất bại');
    } else {
      this.gridParams.api.setRowData(this.data);
    }
  }

  deleteHandle() {
    if (this.selectRowGrid) {
      this.removeType.open(this.selectRowGrid);
    } else {
      this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
    }
  }

  insertDataOutput(data) {
    const displayData = this.gridTableService.getAllData(this.gridParams);
    const index = displayData.indexOf(this.selectRowGrid);
    displayData[index] = Object.assign({}, this.selectRowGrid, data);
    this.gridParams.api.setRowData(this.gridTableService.addSttToData(displayData));
  }

  refresh() {
    this.swalAlertService.openSuccessToast('Cập nhật thành công');
  }

  insertData(params) {
    if (params.colDef.field === 'removeReason') {
      this.modal.open(this.selectRowGrid);
    }
  }
}
