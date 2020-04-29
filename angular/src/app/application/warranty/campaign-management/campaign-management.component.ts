import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CampaignManagementModel } from '../../../core/models/warranty/campaign-management-model';
import { VinModel } from '../../../core/models/warranty/vin-model';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { CampaignManagementApi } from '../../../api/master-data/warranty/campaign-management.api';
import { LoadingService } from '../../../shared/loading/loading.service';
import { VinAffectedByCampaignApi } from '../../../api/master-data/warranty/vin-affected-by-campaign.api';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { PaginationParamsModel } from '../../../core/models/base.model';
import * as moment from 'moment';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'campaign-management',
  templateUrl: './campaign-management.component.html',
  styleUrls: ['./campaign-management.component.scss']
})
export class CampaignManagementComponent implements OnInit {
  @ViewChild('updateCampaignModal', {static: false}) updateCampaignModal;
  form: FormGroup;
  campaignField;
  campaignGridParams;
  vinAffectedField;
  vinAffectedFieldGridParams;

  campaignList: Array<CampaignManagementModel>;
  campaignSelected: CampaignManagementModel;
  vinAffectedList: Array<VinModel>;
  vinPaginationParams: PaginationParamsModel;
  vinPaginationTotalsData: number;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private campaignManagementApi: CampaignManagementApi,
    private vinAffectedByCampaignApi: VinAffectedByCampaignApi,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.campaignField = [
      {
        headerName: 'STT', headerTooltip: 'Số thứ tự', width: 120,
        cellRenderer: params => params.rowIndex + 1
      },
      {headerName: 'Tên chiến dịch', headerTooltip: 'Tên chiến dịch', field: 'campaignName'},
      {headerName: 'Tên viết tắt', headerTooltip: 'Tên viết tắt', field: 'sortName'},
      {headerName: 'Loại chiến dịch', headerTooltip: 'Loại chiến dịch', field: 'campaignType'},
      {headerName: 'Số thư', headerTooltip: 'Số thư', field: 'refNo'},
      {headerName: 'Mô Tả', headerTooltip: 'Mô Tả', field: 'description'},
      {
        headerName: 'Áp dụng từ ngày', headerTooltip: 'Áp dụng từ ngày', field: 'effectFrom',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Đến ngày', headerTooltip: 'Đến ngày', field: 'effectTo',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {headerName: 'Mã công việc', headerTooltip: 'Mã công việc', field: 'worksCode'},
      {
        headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status',
        cellRenderer: params => `${params.value === 'Y' ? 'Còn hiệu lực' : 'Hết hiệu lực'}`
      },
    ];
    this.vinAffectedField = [
      {
        headerName: 'No.', headerTooltip: 'No.', width: 80,
        cellRenderer: params => params.rowIndex + 1
      },
      {headerName: 'Plant LOD', headerTooltip: 'Plant LOD', field: 'plantLineOffDate'},
      {headerName: 'Vehicle Type', headerTooltip: 'Vehicle Type', field: 'vehiclesType'},
      {headerName: 'Model Name', headerTooltip: 'Model Name', field: 'modelName'},
      {headerName: 'Vin', headerTooltip: 'Vin', field: 'vin'},
      {headerName: 'Regis Country', headerTooltip: 'Regis Country', field: 'registrationCountry'},
    ];
    this.buildForm();
  }

  changePaginationParams(paginationParams) {
    if (!this.vinAffectedList) {
      return;
    }

    this.vinPaginationParams = paginationParams;
    this.getVinAffectedByCampaign(this.campaignSelected.id);
  }

  search() {
    if (this.form.value.from && this.form.value.to && moment(this.form.value.from).isSameOrAfter(this.form.value.to, 'day')) {
      this.swalAlertService.openWarningToast('From Date must be less than To Date');
      return;
    }
    this.resetVinAffected();
    this.resetPaginationParams();
    this.loadingService.setDisplay(true);
    this.campaignManagementApi.search(this.form.value).subscribe(res => {
      this.campaignList = res.map(campaign => {
        return Object.assign({}, campaign, {
          worksCode: campaign.listCamOpem.map(obj => {
            return obj.opemCode;
          }).toString()
        });
      });
      this.campaignGridParams.api.setRowData(this.campaignList);
      this.loadingService.setDisplay(false);
    });
  }

  callbackCampaignGrid(params) {
    this.campaignGridParams = params;
    params.api.setRowData(this.campaignList || []);
    this.search();
  }

  getRowCampaign() {
    const selected = this.campaignGridParams.api.getSelectedRows();
    if (selected) {
      this.campaignSelected = selected[0];
      this.resetPaginationParams();
      this.getVinAffectedByCampaign(this.campaignSelected.id);
    }
  }

  callbackVinAffectedGrid(params) {
    this.vinAffectedFieldGridParams = params;
    params.api.setRowData(this.vinAffectedList || []);
  }

  resetVinAffected() {
    this.campaignSelected = undefined;
    this.vinPaginationTotalsData = undefined;
    if (this.vinAffectedFieldGridParams) {
      this.vinAffectedFieldGridParams.api.setRowData();
    }
  }

  updateCampaign() {
    this.campaignSelected
      ? this.updateCampaignModal.open(this.campaignSelected, this.vinAffectedList)
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  deleteCampaign() {
    this.campaignSelected
      ? this.confirm.openConfirmModal('Bạn có muốn xóa bản ghi này?').subscribe(() => {
        this.loadingService.setDisplay(true);
        this.campaignManagementApi.remove(this.campaignSelected.id).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.search();
          this.swalAlertService.openSuccessToast();
        });
      })
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  addCampaign() {
    this.updateCampaignModal.open();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      from: [undefined],
      to: [undefined],
      opemCode: [undefined],
      campaignName: [undefined],
    });
  }

  private getVinAffectedByCampaign(campaignId) {
    this.loadingService.setDisplay(true);
    this.vinAffectedByCampaignApi.getVinNoByCampaignId(campaignId, this.vinPaginationParams).subscribe(res => {
      if (res) {
        this.vinAffectedList = res.list;
        this.vinPaginationTotalsData = res.total;
        this.vinAffectedFieldGridParams.api.setRowData(this.vinAffectedList);
      }
      this.loadingService.setDisplay(false);
    });
  }

  private resetPaginationParams() {
    if (this.vinPaginationParams) {
      this.vinPaginationParams.page = 1;
    }
    this.vinPaginationTotalsData = 0;
  }
}
