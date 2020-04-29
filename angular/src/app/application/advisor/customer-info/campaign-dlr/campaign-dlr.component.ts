import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

import {LoadingService} from '../../../../shared/loading/loading.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {CustomerApi} from '../../../../api/customer/customer.api';
import {ToastService} from '../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'campaign-dlr',
  templateUrl: './campaign-dlr.component.html',
  styleUrls: ['./campaign-dlr.component.scss']
})
export class CampaignDlrComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @Output() required = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input('dataRegisterNo') dataRegisterNo;
  @Input('formCustomer') formCustomer: FormGroup;
  modalHeight: number;
  form: FormGroup;
  isNoticeToCus: boolean;
  cusVehInfo;

  fieldGridCampaign;
  fieldGridCampaignUsed;
  listSelectedData = [];
  listIdSelectData = [];

  campaignParams;
  campaignUsedParams;
  selectedCampaigns: Array<any>;

  campaignWork: Array<any>;
  campaignDone: Array<any>;

  constructor(
    private loading: LoadingService,
    private swalAlert: ToastService,
    private modalHeightSrv: SetModalHeightService,
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private customerApi: CustomerApi
  ) {
  }

  ngOnInit() {
    this.fieldGridCampaign = [
      {headerName: 'STT', headerTooltip: 'Số thứ tự', maxWidth: 30, cellRenderer: params => params.rowIndex + 1},
      {headerName: 'Tên chiến dịch', headerTooltip: 'Tên chiến dịch', field: 'campaignName'},
      {headerName: 'Số thư', headerTooltip: 'Số thư', field: 'refNo'},
      {headerName: 'Mô tả', headerTooltip: 'Mô tả', field: 'description'},
      {
        headerName: 'Chọn chiến dịch',
        headerTooltip: 'Chọn chiến dịch làm RO',
        field: 'checked',
        editable: true, checkboxSelection: true, maxWidth: 100
      }
    ];
    this.fieldGridCampaignUsed = [
      {headerName: 'STT', headerTooltip: 'Số thứ tự', maxWidth: 30, cellRenderer: params => params.rowIndex + 1},
      {headerName: 'Tên chiến dịch', headerTooltip: 'Tên chiến dịch', field: 'campaignName'},
      {headerName: 'Số thư', headerTooltip: 'Số thư', field: 'refNo'},
      {headerName: 'Loại chiến dịch', headerTooltip: 'Loại chiến dịch', field: 'campaignType'},
      {
        headerName: 'Ngày thực hiện',
        headerTooltip: 'Ngày thực hiện',
        field: 'completeDate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {headerName: 'Đại lý thực hiện', headerTooltip: 'Đại lý thực hiện', field: 'abbreviation'},
      {headerName: 'Mã công việc', headerTooltip: 'Mã công việc', field: 'worksCode'}
    ];
  }

  onResize() {
    this.modalHeight = this.modalHeightSrv.onResizeWithoutFooter();
  }

  getCampaignByVinno(vinno, listCampaignId) {
    this.loading.setDisplay(true);
    this.customerApi.getCampaignByVin(vinno, this.formCustomer.getRawValue().registerNo.trim()).subscribe(res => {
      if (res && res.cusVehInfo && res.campaignWork && res.campaignWork.length) {
        this.cusVehInfo = res.cusVehInfo;
        this.campaignWork = res.campaignWork || [];
        this.campaignDone = res.campaignDone
          ? res.campaignDone.map(campaign => {
            return Object.assign({}, campaign, {
              worksCode: campaign.campaignOpemList.map(obj => obj.opemCode).toString()
            });
          })
          : [];
        // if (this.campaignParams) {
        //   this.patchValueAndSelectCampaign(this.campaignWork);
        if (this.campaignUsedParams) {
          this.campaignUsedParams.api.setRowData(this.campaignDone);
        }
        // }
        this.open(this.cusVehInfo);
      }
      this.loading.setDisplay(false);
    });
  }

  open(cusVehInfo) {
    this.buildForm(cusVehInfo);
    this.onResize();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
    this.cusVehInfo = undefined;
    this.selectedCampaigns = undefined;
    this.isNoticeToCus = false;

    this.campaignWork = undefined;
    this.campaignDone = undefined;

    this.campaignParams.api.setRowData();
    this.campaignUsedParams.api.setRowData();
  }

  callbackGridCampaign(params) {
    this.campaignParams = params;
    if (this.campaignWork) {
      this.patchValueAndSelectCampaign(this.campaignWork);
    }
  }

  patchValueAndSelectCampaign(data) {
    setTimeout(() => {
      const listCampaign = this.formCustomer.get('listCampaignId').value;
      this.campaignParams.api.setRowData(data);
      this.campaignParams.api.forEachNode(node => {
        if (node.data && listCampaign.includes(node.data.campId)) {
          node.setSelected(true);
        }
      });
    }, 0);
  }

  getParamsCampaign() {
    const selectedData = this.campaignParams.api.getSelectedRows();
    this.listSelectedData = selectedData ? selectedData : [];
    this.listIdSelectData = [];
    this.listSelectedData.forEach(element => {
      this.listIdSelectData.push(element.campId);
    });
    if (selectedData) {
      this.selectedCampaigns = selectedData;
    }
  }

  callbackGridCampaignUsed(params) {
    this.campaignUsedParams = params;
    if (this.campaignDone) {
      this.campaignUsedParams.api.setRowData(this.campaignDone);
    }
  }

  noticeToCus() {
    if (!this.selectedCampaigns || !this.selectedCampaigns.length) {
      this.swalAlert.openWarningToast('Phải chọn 1 chiến dịch');
      return;
    }
    // Gửi email tới hệ thống trung tâm để đánh giá đại lý
    this.loading.setDisplay(true);
    this.customerApi.remindCampaign({
      // listCampaignId: this.selectedCampaigns.map(campaign => campaign.campId),
      listCampaignId: this.listIdSelectData,
      engineNo: this.form.getRawValue().engineNo,
      vhcId: this.cusVehInfo.id,
      vinno: this.cusVehInfo.vinno
    }).subscribe(() => {
      this.swalAlert.openSuccessToast();
      this.isNoticeToCus = true;
      this.loading.setDisplay(false);
    });
  }

  requireCamp() {
    if (!this.selectedCampaigns && this.selectedCampaigns.length) {
      this.swalAlert.openWarningToast('Phải chọn 1 chiến dịch');
      return;
    }
    this.loading.setDisplay(true);
    this.customerApi.requestCampaign({
      // listCampaignId: this.selectedCampaigns.map(campaign => campaign.campId),
      listCampaignId: this.listIdSelectData,
      engineNo: this.form.getRawValue().engineNo,
      vhcId: this.cusVehInfo.id,
      vinno: this.cusVehInfo.vinno
    }).subscribe(() => {
      this.required.emit(this.selectedCampaigns.map(campaign => campaign.campId));
      this.modal.hide();
      this.loading.setDisplay(false);
      this.swalAlert.openSuccessToast('Yêu cầu chiến dịch thành công.');
    });
  }

  cancel() {
    this.required.emit();
    this.modal.hide();
  }

  private buildForm(cusVehInfo) {
    this.form = this.formBuilder.group({
      vinno: [{value: cusVehInfo ? cusVehInfo.vinno : undefined, disabled: true}],
      engineNo: [{value: cusVehInfo ? cusVehInfo.engineNo : undefined, disabled: true}],
      lastKm: [{value: cusVehInfo ? cusVehInfo.km : undefined, disabled: true}],
      cmCode: [{value: cusVehInfo ? cusVehInfo.fullmodel : undefined, disabled: true}],
      registerno: [{value: cusVehInfo ? cusVehInfo.registerno : undefined, disabled: true}],
      offical: [{value: cusVehInfo ? cusVehInfo.offical : undefined, disabled: true}],
      carownername: [{value: cusVehInfo ? cusVehInfo.carownername : undefined, disabled: true}],
      carowneradd: [{value: cusVehInfo ? cusVehInfo.carowneradd : undefined, disabled: true}],
      carownermobil: [{value: cusVehInfo ? cusVehInfo.carownermobil : undefined, disabled: true}],
      name: [{value: cusVehInfo ? cusVehInfo.name : undefined, disabled: true}],
      tel: [{value: cusVehInfo ? cusVehInfo.carownertel : undefined, disabled: true}]
    });
  }
}
