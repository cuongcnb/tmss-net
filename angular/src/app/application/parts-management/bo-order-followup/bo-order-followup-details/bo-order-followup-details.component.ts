import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import {
  BoDetailViewModel,
  BoPartsFollowupModel, PartOfBoDetailModel,
} from '../../../../core/models/parts-management/bo-parts-followup.model';
import { BoOrderFollowupApi } from '../../../../api/parts-management/bo-order-followup.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bo-parts-followup-details',
  templateUrl: './bo-order-followup-details.component.html',
  styleUrls: ['./bo-order-followup-details.component.scss'],
})
export class BoOrderFollowupDetailsComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight: number;
  mainDisplayData: BoPartsFollowupModel; // selectedPart từ màn hình chính

  searchBoForm: FormGroup;
  searchPartForm: FormGroup;

  fieldGridBoOrder;
  boOrderParams;
  boDetailViewData: Array<BoDetailViewModel>;
  selectedBoDetail: BoDetailViewModel;
  paginationTotalBo;
  boPaginationParams;

  fieldGridPartList;
  partListParams;
  partOfBoDetailData: Array<PartOfBoDetailModel>;
  paginationTotalPart: number;
  partPaginationParams;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private gridTableService: GridTableService,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private boOrderFollowupApi: BoOrderFollowupApi,
  ) {
    this.fieldGridBoOrder = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 80,
      },
      {
        headerName: 'Số ĐH B/O',
        headerTooltip: 'Số ĐH B/O',
        field: 'orderNo',
      },
      {
        headerName: 'Số RO',
        headerTooltip: 'Số RO',
        field: 'soRo',
      },
      {
        headerName: 'Biển số',
        headerTooltip: 'Biển số',
        field: 'bienSoXe',
      },
      {
        headerName: 'CVDV',
        headerTooltip: 'Cố vấn dịch vụ',
        field: 'tenCvdv',
      },
      {
        headerName: 'Ngày đặt',
        headerTooltip: 'Ngày đặt',
        field: 'ngayDh',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
      },
      {
        headerName: 'Kiểu đặt hàng',
        headerTooltip: 'Kiểu đặt hàng',
        field: 'kieuDh',
      },
      {
        headerName: 'Số ngày',
        headerTooltip: 'Số ngày',
        field: 'dateCount',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
      },
    ];
    this.fieldGridPartList = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'maPt',
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'tenPt',
        minWidth: 150
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'dvt',
      },
      {
        headerName: 'Đã đặt',
        headerTooltip: 'Đã đặt',
        field: 'slDat',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
      },
      {
        headerName: 'Nhà CC',
        headerTooltip: 'Nhà CC',
        field: 'supplier',
      },
      {
        headerName: 'ETA',
        headerTooltip: 'ETA',
        field: 'eta',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
      },
      {
        headerName: 'ETA1',
        headerTooltip: 'ETA1',
        field: 'eta1',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
      },
      {
        headerName: 'ETA2',
        headerTooltip: 'ETA2',
        field: 'eta2',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
      },
      {
        headerName: 'SL Đ.về',
        headerTooltip: 'Số lượng Đ.về',
        field: 'slDaVe',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
      },
      {
        headerName: 'Ngày về',
        headerTooltip: 'Ngày về',
        field: 'ngayVe',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'ghiChu',
      },
    ];
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(mainDisplayData) {
    this.modal.show();
    this.mainDisplayData = mainDisplayData;
    this.buildForm();
  }

  reset() {
    this.searchBoForm = undefined;
    this.searchPartForm = undefined;
  }

  // =====***** BO ORDER GRID *****=====
  callbackBoOrder(params) {
    this.boOrderParams = params;
    this.searchBoOrder();
  }

  getBoParams() {
    const selectedData = this.boOrderParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedBoDetail = selectedData[0];
      this.searchPartOfBo();
    }
  }

  resetBoPagination() {
    if (this.boPaginationParams) {
      this.boPaginationParams.page = 1;
    }
    this.paginationTotalBo = 0;
  }

  changePaginationParamsBo(paginationParams) {
    if (! this.boDetailViewData) {
      return;
    }
    this.boPaginationParams = paginationParams;
    this.searchBoOrder();
  }

  searchBoOrder() {
    this.resetPartPagination();
    this.loadingService.setDisplay(true);
    this.boOrderFollowupApi.searchBoList(this.searchBoForm.value, this.boPaginationParams).subscribe(boDetailViewData => {
      this.loadingService.setDisplay(false);
      this.boDetailViewData = boDetailViewData.list;
      this.paginationTotalBo = boDetailViewData.total;
      this.boOrderParams.api.setRowData(this.gridTableService.addSttToData(this.boDetailViewData));
      if (this.boDetailViewData.length) {
        this.gridTableService.selectFirstRow(this.boOrderParams);
      } else {
        this.partOfBoDetailData = [];
        this.paginationTotalPart = 0;
        this.partListParams.api.setRowData(this.gridTableService.addSttToData(this.partOfBoDetailData));
      }
    });
  }

  // =====***** PART GRID *****=====
  callbackPartList(params) {
    this.partListParams = params;
  }

  resetPartPagination() {
    if (this.partPaginationParams) {
      this.partPaginationParams.page = 1;
    }
    this.paginationTotalPart = 0;
  }

  changePaginationParamsPart(paginationParams) {
    if (! this.boDetailViewData) {
      return;
    }
    this.partPaginationParams = paginationParams;
    this.searchPartOfBo();
  }

  searchPartOfBo() {
    if (! this.selectedBoDetail) {
      this.swalAlertService.openWarningToast('Bạn phải chọn một đơn hàng để tìm kiếm', 'Cảnh báo');
      return;
    }
    this.loadingService.setDisplay(true);
    this.boOrderFollowupApi.searchPartOfBo(this.selectedBoDetail.orderId, this.searchPartForm.value, this.partPaginationParams).subscribe(partOfBoDetailData => {
      this.loadingService.setDisplay(false);
      this.partOfBoDetailData = partOfBoDetailData.list;
      this.paginationTotalPart = partOfBoDetailData.total;
      this.partListParams.api.setRowData(this.gridTableService.addSttToData(this.partOfBoDetailData));
    });
  }

  private buildForm() {
    this.searchBoForm = this.formBuilder.group({
      orderNo: [undefined],
      soRo: [this.mainDisplayData.soRo],
      bienSoXe: [undefined],
      tenCvdv: [undefined],
      kieuDh: [undefined],
    });
    this.searchPartForm = this.formBuilder.group({
      partsCode: [undefined],
      partsName: [undefined],
      supplier: [undefined],
    });
  }
}
