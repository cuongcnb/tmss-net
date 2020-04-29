import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import * as moment from 'moment';
import {omit} from 'lodash';

import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {ImportVinAffectedByCampaignApi} from '../../../../api/master-data/import/import-vin-affected-by-campaign.api';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {CampaignManagementApi} from '../../../../api/master-data/warranty/campaign-management.api';
import {SrvDRcJobsApi} from '../../../../api/master-data/warranty/srv-d-rc-jobs.api';
import {VinAffectedByCampaignApi} from '../../../../api/master-data/warranty/vin-affected-by-campaign.api';
import {CampaignOpemApi} from '../../../../api/master-data/warranty/campaign-opem.api';
import {ConfirmService} from '../../../../shared/confirmation/confirm.service';
import {CampaignDlrApi} from '../../../../api/campaign-dlr/campaign-dlr.api';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {DataCodes} from '../../../../core/constains/data-code';
import {PartsInfoManagementApi} from '../../../../api/parts-management/parts-info-management.api';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'campaign-dlr-modal',
  templateUrl: './campaign-dlr-modal.component.html',
  styleUrls: ['./campaign-dlr-modal.component.scss']
})
export class CampaignDlrModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('newWork', {static: false}) newWork;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  form: FormGroup;
  workGridField;
  newWorkGridField;
  workGridParams;
  selectedWork;
  campaignSelected;
  campaignDetail = [];
  minDate: Date;
  listDiscountType;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private importVinAffectedByCampaignApi: ImportVinAffectedByCampaignApi,
    private vinAffectedByCampaignApi: VinAffectedByCampaignApi,
    private campaignManagementApi: CampaignManagementApi,
    private campaignOpemApi: CampaignOpemApi,
    private srvDRcJobsApi: SrvDRcJobsApi,
    private formBuilder: FormBuilder,
    private confirm: ConfirmService,
    private campaignDlrApi: CampaignDlrApi,
    private gridTableService: GridTableService,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private dataFormatService: DataFormatService
  ) {
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  ngOnInit() {
    this.workGridField = [
      {
        headerName: 'STT', headerTooltip: 'Số thứ tự', width: 80,
        cellRenderer: params => params.rowIndex + 1
      },
      {headerName: 'Dòng xe', headerTooltip: 'Dòng xe', field: 'cfCode'},
      {headerName: 'Đời xe', headerTooltip: 'Đời xe', field: 'doixe'},
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'description',
        editable: true,
        cellClass: ['cell-clickable', 'cell-border']
      }
    ];
    this.newWorkGridField = [
      {headerName: 'Dòng xe', headerTooltip: 'Dòng xe', field: 'cfCode'},
      {headerName: 'Đời xe', headerTooltip: 'Đời xe', field: 'doixe'}
    ];
  }

  open(campaignSelected?, campaignDetail?) {
    this.minDate = new Date();
    this.getListDiscountType();
    this.minDate.setDate(this.minDate.getDate());
    if (campaignSelected) {
      this.campaignSelected = campaignSelected;
    }
    if (campaignDetail) {
      this.campaignDetail = campaignDetail;
    }
    this.onResize();
    this.modal.show();
    this.buildForm();
  }

  addWork(data) {
    const newData = {
      cfCode: data.cfCode,
      doixe: data.doixe,
      cmId: data.id
    };
    this.campaignDetail.push(newData);
    this.workGridParams.api.updateRowData({add: [newData]});
  }

  delWork() {
    if (this.selectedWork) {
      this.confirm.openConfirmModal('Bạn có muốn xóa bản ghi này?').subscribe(() => {
        this.campaignDetail = this.campaignDetail.filter(work => work !== this.selectedWork);
        this.workGridParams.api.setRowData(this.campaignDetail);
        this.selectedWork = undefined;
        this.swalAlertService.openSuccessToast();
      });
    } else {
      this.swalAlertService.openWarningToast('Hãy chọn dòng cần xóa');
    }
  }

  getWorkCodeList(searchKeyword, paginationParams?) {
    return this.campaignDlrApi.getCarModel(searchKeyword, paginationParams);
  }

  showCarModel(searchKeyword) {
    this.loadingService.setDisplay(true);
    this.campaignDlrApi.getCarModel({searchKeyword})
      .subscribe(models => {
        this.loadingService.setDisplay(false);
        this.newWork.open({searchKeyword}, models.list, models.total);
      });
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    if (this.form.value.effectFrom && this.form.value.effectTo && moment(this.form.value.effectFrom).isSameOrAfter(this.form.value.effectTo, 'day')) {
      this.swalAlertService.openWarningToast('Ngày bắt đầu phải nhỏ hơn ngày kết thúc', 'Lỗi chọn ngày');
      return;
    }
    if (this.form.invalid) {
      return;
    }
    const data = this.gridTableService.getAllData(this.workGridParams);
    const obj = [];
    data.forEach(it => obj.push(omit(it, ['doixe', 'cfCode'])));
    this.form.get('listOpem').setValue(obj);
    this.campaignDlrApi.updateAndAddCampaign(this.form.value).subscribe(res => {
        this.modal.hide();
        (this.campaignSelected) ? this.close.emit('update') : this.close.emit();
        this.swalAlertService.openSuccessToast();
      }
    );
  }

  reset() {
    this.form = undefined;
    this.campaignSelected = undefined;
    this.campaignDetail = [];
  }

  callbackWorkGrid(params) {
    this.workGridParams = params;
    params.api.setRowData(this.campaignDetail || []);
  }

  getWorkParams() {
    const selected = this.workGridParams.api.getSelectedRows();
    if (selected) {
      this.selectedWork = selected[0];
    }
  }

  getListDiscountType() {
    this.partsInfoManagementApi.getDataCode(DataCodes.discountType).subscribe(res => {
      this.listDiscountType = res ? res : [];
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      campaignName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(250), GlobalValidator.specialCharacter])],
      sortName: [undefined, GlobalValidator.maxLength(250)],
      campaignType: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(200)])],
      description: [undefined, GlobalValidator.maxLength(250)],
      effectFrom: [undefined, GlobalValidator.required],
      effectTo: [undefined],
      reqNo: [undefined, GlobalValidator.maxLength(50)],
      status: ['Y', GlobalValidator.required],
      percentDiscount: [0],
      priceDiscount: [0, Validators.compose([GlobalValidator.numberFormat])],
      discountType: ['0'],
      listOpem: []
    });
    this.form.get('discountType').valueChanges.subscribe(res => {
      if (res === '0') {
        this.form.get('priceDiscount').setValue(0);
        return;
      }
      if (res === '1') {
        this.form.get('percentDiscount').setValue(0);
      }
    });
    if (this.campaignSelected) {
      this.form.patchValue(this.campaignSelected);
    }
  }

  moneyFormat(value) {
    return this.dataFormatService.moneyFormat(value);
  }
}
