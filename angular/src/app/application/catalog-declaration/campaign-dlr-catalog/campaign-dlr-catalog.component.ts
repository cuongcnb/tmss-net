import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

import { CampaignManagementModel } from '../../../core/models/warranty/campaign-management-model';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { CampaignManagementApi } from '../../../api/master-data/warranty/campaign-management.api';
import { LoadingService } from '../../../shared/loading/loading.service';
import { VinAffectedByCampaignApi } from '../../../api/master-data/warranty/vin-affected-by-campaign.api';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { CampaignDlrApi } from '../../../api/campaign-dlr/campaign-dlr.api';
import { PartsInfoManagementApi } from '../../../api/parts-management/parts-info-management.api';
import { DataCodes } from '../../../core/constains/data-code';
import { GlobalValidator } from '../../../shared/form-validation/validators';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'campaign-dlr-catalog',
  templateUrl: './campaign-dlr-catalog.component.html',
  styleUrls: ['./campaign-dlr-catalog.component.scss']
})
export class CampaignDlrCatalogComponent implements OnInit {
  @ViewChild('campaignDlrModal', { static: false }) campaignDlrModal;
  form: FormGroup;
  campaignField;
  campaignGridParams;
  carField;
  carGridParams;
  listModelName;
  campaignList: Array<CampaignManagementModel>;
  campaignSelected: CampaignManagementModel;
  carTotalsData: number;
  campaignDetail;
  campaignData;
  indexSelected;
  listDiscountType;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private campaignManagementApi: CampaignManagementApi,
    private vinAffectedByCampaignApi: VinAffectedByCampaignApi,
    private confirm: ConfirmService,
    private campaignDlrApi: CampaignDlrApi,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private gridTableService: GridTableService,
  ) {
  }

  ngOnInit() {
    this.getListModelName();
    this.campaignField = [
      {
        headerName: 'STT', headerTooltip: 'Số thứ tự', width: 120,
        cellRenderer: params => params.rowIndex + 1
      },
      { headerName: 'Tên chiến dịch', headerTooltip: 'Tên chiến dịch', field: 'campaignName' },
      { headerName: 'Tên viết tắt', headerTooltip: 'Tên viết tắt', field: 'sortName' },
      { headerName: 'Loại chiến dịch', headerTooltip: 'Loại chiến dịch', field: 'campaignType' },
      { headerName: 'Số thư', headerTooltip: 'Số thư', field: 'reqNo' },
      { headerName: 'Mô Tả', headerTooltip: 'Mô Tả', field: 'description' },
      {
        headerName: 'Áp dụng từ ngày', headerTooltip: 'Áp dụng từ ngày', field: 'effectFrom',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'Đến ngày', headerTooltip: 'Đến ngày', field: 'effectTo',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      { headerName: '% giảm giá', headerTooltip: '% giảm giá', field: 'percentDiscount', cellClass: ['text-right'] },
      {
        headerName: 'Tiền giảm giá', headerTooltip: 'Tiền giảm giá', field: 'priceDiscount',
        cellClass: ['text-right'],
        tooltip: params => this.dataFormatService.formatMoney(params.value),
        valueFormatter: params => this.dataFormatService.formatMoney(params.value)
      },
      {
        headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status',
        cellRenderer: params => `${params.value === 'Y' ? 'Có hiệu lực' : 'Hết hiệu lực'}`
      }
    ];
    this.carField = [
      {
        headerName: 'STT', headerTooltip: 'Số thứ tự', width: 80,
        cellRenderer: params => params.rowIndex + 1
      },
      { headerName: 'Dòng xe', headerTooltip: 'Dòng xe', field: 'cfName' },
      { headerName: 'Đời xe', headerTooltip: 'Đời xe', field: 'doixe' },
      { headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'description' }
    ];
    this.buildForm();
  }

  search(type?) {
    if (this.form.invalid) {
      return;
    }
    if (this.form.value.from && this.form.value.to && moment(this.form.value.from).isSameOrAfter(this.form.value.to, 'day')) {
      this.swalAlertService.openWarningToast('Thời gian bắt đầu phải nhỏ hơn thời gian hiện tại');
      return;
    }
    this.resetPaginationParams();
    this.loadingService.setDisplay(true);
    this.campaignDlrApi.search(this.form.value).subscribe(res => {
      this.campaignData = res;
      this.loadingService.setDisplay(false);
      this.campaignGridParams.api.setRowData(res);
      const idSelect = this.indexSelected - 1;
      if (type && type === 'update') {
        this.campaignGridParams.api.forEachNode((node) => {
          if (node.childIndex === idSelect) {
            node.setSelected(true);
          }
        });
      } else {
        this.campaignGridParams.api.forEachNode((node) => {
          if (node.childIndex === 0) {
            node.setSelected(true);
          }
        });
        this.campaignGridParams.api.paginationGoToFirstPage();
        this.campaignGridParams.api.setFilterModel(null);
      }
    });

  }

  callbackCampaignGrid(params) {
    this.campaignGridParams = params;
    params.api.setRowData(this.campaignList || []);
  }

  getRowCampaign() {
    const selected = this.campaignGridParams.api.getSelectedRows();
    if (selected) {
      this.campaignSelected = selected[0];
      this.resetPaginationParams();
      this.campaignDlrApi.getCampaignDetail(this.campaignSelected.id).subscribe(res => {
        this.carGridParams.api.setRowData(res ? res : []);
        this.campaignDetail = res;
        this.gridTableService.autoSizeColumn(this.campaignGridParams);
      });
      this.campaignData.forEach((item, index) => {
        if (item === this.campaignSelected) {
          this.indexSelected = index + 1;
        }
      });
    }
  }

  callbackCarGrid(params) {
    this.carGridParams = params;
    params.api.setRowData([]);
  }

  updateCampaign() {
    this.campaignSelected
      ? this.campaignDlrModal.open(this.campaignSelected, this.campaignDetail)
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  addCampaign() {
    this.campaignDlrModal.open();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      fromDate: [undefined],
      toDate: [undefined],
      doixe: [undefined],
      campaignName: [undefined, GlobalValidator.maxLength(250)],
      status: ['Y']
    });
  }

  getListModelName() {
    // this.campaignDlrApi.getListModelName(null).subscribe(res => {
    //   this.listModelName = res ? res : [];
    // });
    this.campaignDlrApi.getListModelCar().subscribe(res => {
      this.listModelName = res ? res : [];
    });
  }


  private resetPaginationParams() {
    this.carTotalsData = 0;
  }
  // config select search
  // config = { search: true, placeholder: 'Tìm kiếm', noResultsFound: 'Không tìm thấy kết quả!', limitTo: 20 }
}
