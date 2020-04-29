import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ssi-survey-list',
  templateUrl: './ssi-survey-list.component.html',
  styleUrls: ['./ssi-survey-list.component.scss']
})
export class SsiSurveyListComponent implements OnInit {
  @Input() webList: boolean;
  form: FormGroup;
  ssiSurveyList: Array<any>;
  data: Array<any>;
  param;
  gridParams;
  selectRowGrid;
  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.ssiSurveyList = [
      {headerName: 'STT', headerTooltip: 'Số thứ tự', field: 'stt'},
      {headerName: 'Tên khách hàng', headerTooltip: 'Tên khách hàng', field: 'customerName'},
      {headerName: 'Người đứng tên hợp đồng', headerTooltip: 'Người đứng tên hợp đồng', field: 'representative'},
      {headerName: 'Địa chỉ khách hàng', headerTooltip: 'Địa chỉ khách hàng', field: 'customerAdd'},
      {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'phoneNumber'},
      {headerName: 'Tên người liên hệ', headerTooltip: 'Tên người liên hệ', field: 'contactName'},
      {headerName: 'số điện thoại người liên hệ', headerTooltip: 'số điện thoại người liên hệ', field: 'contactPhoneNumber'},
      {headerName: 'Ngày báo bán', headerTooltip: 'Ngày báo bán', field: 'saleDate'},
      {headerName: 'Ngày giao xe', headerTooltip: 'Ngày giao xe', field: 'deliveryDate'},
      {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'agency'},
      {headerName: 'IDD', headerTooltip: 'IDD', field: 'idd'},
      {headerName: 'Người bán', headerTooltip: 'Người bán', field: 'seller'},
      {headerName: 'Model', headerTooltip: 'Model', field: 'model'},
      {headerName: 'Số khung', headerTooltip: 'Số khung', field: 'frameNumber'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'note'},
      {headerName: 'DLR remark for CS', headerTooltip: 'DLR remark for CS', field: 'dlrRemark'}
    ];
    this.data = [
      {
        stt: '1',
        customerName: 'Nguyễn Văn Hoàngg',
        representative: 'Nguyễn Văn Hoàng',
        customerAdd: 'Hà Nội',
        phoneNumber: '0965888999',
        contactName: 'Nguyễn Văn Hoàng',
        contactPhoneNumber: '0965888999',
        saleDate: '20/11/2018',
        delivelyDate: '30/11/2018',
        agency: 'Thanh Xuân',
        idd: '1515157',
        seller: 'Hoàng Đình Hà',
        model: '2018',
        frameNumber: '1d1122ss5',
        note: '',
        dlrRemark: '',
      },
      {
        stt: '2',
        customerName: 'Nguyễn Văn phong',
        representative: 'Nguyễn Văn Phong',
        customerAdd: 'Quảng Ninh',
        phoneNumber: '0965888999',
        contactName: 'Nguyễn Văn Hoàng',
        contactPhoneNumber: '0965888999',
        saleDate: '25/11/2018',
        delivelyDate: '10/12/2018',
        agency: 'Thăng Long',
        idd: '1515157',
        seller: 'Hoàng Đình Hà',
        model: '2018',
        frameNumber: '1d1122ss5',
        note: 'abc',
        dlrRemark: '',
      }
    ];
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dayIn: [undefined],
      dayOut: [undefined],
    });
  }

  search() {
    if (!this.form.get('dayIn').value || !this.form.get('dayOut').value) {
      this.swalAlertService.openFailToast('Chưa chọn ngày' , 'Thất bại');
    } else {
      this.gridParams.api.setRowData(this.data);
    }

  }

  callBackSsiSurveyList(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParamsSsiSurveyList() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectRowGrid = selectedData[0];
    }
  }
}
