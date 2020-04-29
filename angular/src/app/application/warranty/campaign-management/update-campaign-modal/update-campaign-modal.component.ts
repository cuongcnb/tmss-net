import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { CampaignManagementModel } from '../../../../core/models/warranty/campaign-management-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { VinModel } from '../../../../core/models/warranty/vin-model';
import { ImportVinAffectedByCampaignApi } from '../../../../api/master-data/import/import-vin-affected-by-campaign.api';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { CampaignManagementApi } from '../../../../api/master-data/warranty/campaign-management.api';
import { SrvDRcJobsApi } from '../../../../api/master-data/warranty/srv-d-rc-jobs.api';
import { VinAffectedByCampaignApi } from '../../../../api/master-data/warranty/vin-affected-by-campaign.api';
import { CampaignOpemApi } from '../../../../api/master-data/warranty/campaign-opem.api';
import { CampaignOpemModel } from '../../../../core/models/warranty/campaign-opem-model';
import * as moment from 'moment';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'update-campaign-modal',
  templateUrl: './update-campaign-modal.component.html',
  styleUrls: ['./update-campaign-modal.component.scss'],
})
export class UpdateCampaignModalComponent implements OnInit {
  @ViewChild('modal', { static: false }) modal: ModalDirective;
  @ViewChild('newWork', { static: false }) newWork;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  form: FormGroup;
  vinAffectedList: Array<VinModel>;
  vinAffectedField;
  vinAffectedFieldGridParams;

  worksOfCampaign: Array<CampaignOpemModel>;
  workGridField;
  newWorkGridField;
  workGridParams;
  selectedWork: CampaignOpemModel;
  campaignSelected: CampaignManagementModel;
  listSave = [];


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
  ) {
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  ngOnInit() {
    this.vinAffectedField = [
      { headerName: 'No.', headerTooltip: 'No.', field: 'id' },
      { headerName: 'Plant LOD', headerTooltip: 'Plant LOD', field: 'plantLineOffDate' },
      { headerName: 'Vehicle Type', headerTooltip: 'Vehicle Type', field: 'vehiclesType' },
      { headerName: 'Model Name', headerTooltip: 'Model Name', field: 'modelName' },
      { headerName: 'Vin', headerTooltip: 'Vin', field: 'vin' },
      { headerName: 'Regis Country', headerTooltip: 'Regis Country', field: 'registrationCountry' },
      { headerName: 'Error Messages', headerTooltip: 'Error Messages', field: 'message', cellClass: 'err-mess' },
    ];
    this.workGridField = [
      { headerName: 'Mã công việc', headerTooltip: 'Mã công việc', field: 'opemCode' },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'description',
        editable: true,
        cellClass: ['cell-clickable', 'cell-border'],
      },
    ];
    this.newWorkGridField = [
      { headerName: 'Mã công việc', headerTooltip: 'Mã công việc', field: 'rccode' },
      { headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'rcname' },
    ];
  }

  open(campaignSelected?) {
    if (campaignSelected) {
      this.campaignSelected = campaignSelected;
    }
    this.onResize();
    this.modal.show();
    this.buildForm();
  }

  addWork(data) {
    const newData = {
      description: data.rcname,
      opemCode: data.rccode,
      rcjId: data.id,
    };
    this.worksOfCampaign.push(newData);
    this.workGridParams.api.updateRowData({ add: [newData] });
  }

  delWork() {
    if (this.selectedWork) {
      this.confirm.openConfirmModal('Bạn có muốn xóa bản ghi này?').subscribe(() => {
        this.worksOfCampaign = this.worksOfCampaign.filter(work => work !== this.selectedWork);
        this.workGridParams.api.setRowData(this.worksOfCampaign);
        this.selectedWork = undefined;
        this.swalAlertService.openSuccessToast();
      });
    } else {
      this.swalAlertService.openWarningToast('Hãy chọn dòng cần xóa');
    }
  }

  getWorkCodeList(val, paginationParams?) {
    return this.srvDRcJobsApi.searchJobs({ searchKeyword: val.searchKeyword || null }, paginationParams);
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    if (this.form.value.effectFrom && this.form.value.effectTo && moment(this.form.value.effectFrom).isSameOrAfter(this.form.value.effectTo, 'day')) {
      this.swalAlertService.openWarningToast('Ngày bắt đầu phải nhỏ hơn ngày kết thúc', 'Lỗi chọn ngày');
      return;
    }
    const value = Object.assign({}, this.form.value,
      {
        listCampAffectedVin: this.listSave || null,
        listCampOpem: this.worksOfCampaign,
      });

    this.loadingService.setDisplay(true);
    this.campaignManagementApi.save(value).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.modal.hide();
      this.close.emit();
    });
  }

  reset() {
    this.form = undefined;
    this.campaignSelected = undefined;
    this.vinAffectedList = undefined;
    this.selectedWork = undefined;
  }

  callbackWorkGrid(params) {
    this.workGridParams = params;
    this.worksOfCampaign = this.campaignSelected ? this.campaignSelected.listCamOpem : [];
    params.api.setRowData(this.worksOfCampaign);
  }

  getWorkParams() {
    const selected = this.workGridParams.api.getSelectedRows();
    if (selected) {
      this.selectedWork = selected[0];
    }
    // this.gridTable.setFocusCell(this.workGridParams, 'rcname', this.worksOfCampaign, selected[0].rowIndex);
  }

  callbackVinAffectedGrid(params) {
    this.vinAffectedFieldGridParams = params;
    params.api.setRowData(this.vinAffectedList || []);
  }


  apiCallUpload(val) {
    return this.importVinAffectedByCampaignApi.importVinAffected(val);
  }

  uploadSuccess(response) {
    this.listSave = [];
    this.vinAffectedList = response || [];
    response.forEach(element => {
      const newItem = {
        modelName: element.modelName,
        plantLineOffDate: element.plantLineOffDate,
        registrationCountry: element.registrationCountry,
        vehiclesType: element.vehiclesType,
        vin: element.vin,
      };
      this.listSave.push(newItem);
    });
    if (this.vinAffectedFieldGridParams) {
      this.vinAffectedFieldGridParams.api.setRowData(this.vinAffectedList);
    }
  }

  uploadFail(error) {
    this.swalAlertService.openFailToast(error.message, 'Lỗi nhập tài liệu');
  }

  checkVinAvailable(): boolean {
    return this.vinAffectedList
      ? !!this.vinAffectedList.find(vin => !!vin.message)
      : false;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      campaignName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(200), GlobalValidator.specialCharacter])],
      sortName: [undefined, GlobalValidator.maxLength(255)],
      campaignType: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(200)])],
      description: [undefined, GlobalValidator.maxLength(2000)],
      effectFrom: [undefined, GlobalValidator.required],
      effectTo: [undefined],
      refNo: [undefined, GlobalValidator.maxLength(50)],
      status: ['Y', GlobalValidator.required],
    });
    if (this.campaignSelected) {
      this.form.patchValue(this.campaignSelected);
    }
  }
}
