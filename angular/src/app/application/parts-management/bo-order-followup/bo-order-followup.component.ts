import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { BoPartsFollowupModel } from '../../../core/models/parts-management/bo-parts-followup.model';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { BoOrderFollowupApi } from '../../../api/parts-management/bo-order-followup.api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bo-order-followup',
  templateUrl: './bo-order-followup.component.html',
  styleUrls: ['./bo-order-followup.component.scss'],
})
export class BoOrderFollowupComponent implements OnInit {
  @ViewChild('manualUpdateData', {static: false}) manualUpdateData;
  @ViewChild('boPartsFollowupDetails', {static: false}) boPartsFollowupDetails;
  searchForm: FormGroup;

  fieldGrid;
  params;
  boData: Array<BoPartsFollowupModel>;
  selectedBo: BoPartsFollowupModel;

  lastUpdateTime;

  paginationTotalsData: number;
  paginationParams;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmService: ConfirmService,
    private dataFormatService: DataFormatService,
    private gridTableService: GridTableService,
    private boOrderFollowupApi: BoOrderFollowupApi,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'Số RO',
            headerTooltip: 'Số RO',
            field: 'soRo',
            rowGroup: true,
            hide: true,
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
            headerName: 'Mã PT',
            headerTooltip: 'Mã phụ tùng',
            field: 'maPt',
          },
          {
            headerName: 'Tên PT',
            headerTooltip: 'Tên phụ tùng',
            field: 'tenPt',
          },
        ]
      },
      {
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        children: [
          {
            headerName: 'Cần',
            headerTooltip: 'Cần',
            field: 'slCan',
            cellClass: ['cell-readonly', 'cell-border', 'text-right'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
          },
          {
            headerName: 'Đ.Nhặt',
            headerTooltip: 'Đ.Nhặt',
            field: 'slPrepick',
            cellClass: ['cell-readonly', 'cell-border', 'text-right'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
          },
          {
            headerName: 'Đặt',
            headerTooltip: 'Đặt',
            field: 'slDat',
            cellClass: ['cell-readonly', 'cell-border', 'text-right'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
          },
          {
            headerName: 'Đã về',
            headerTooltip: 'Đã về',
            field: 'slDaVe',
            cellClass: ['cell-readonly', 'cell-border', 'text-right'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
          }
        ]
      },
      {
        headerName: 'Ngày đặt',
        headerTooltip: 'Ngày đặt',
        field: 'ngayDh',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
      },
      {
        headerName: 'Theo dõi ETA',
        headerTooltip: 'Theo dõi ETA',
        children: [
          {
            headerName: 'ETA',
            headerTooltip: 'ETA',
            field: 'eta',
            tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
            valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
          },
          {
            headerName: 'Ghi Chú',
            headerTooltip: 'Ghi Chú',
            field: 'note', // Chưa match - backend nói để trống
          },
        ]
      },
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'Ngày về đủ thực tế',
            headerTooltip: 'Ngày về đủ thực tế',
            field: 'ngayVe',
            tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
            valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
          },
          {
            headerName: 'Số NHV',
            headerTooltip: 'Số NHV',
            field: 'soNhv',
          },
          {
            headerName: 'Vị trí Prepick',
            headerTooltip: 'Vị trí Prepick',
            field: 'viTri',
          },
        ]
      }
    ];
  }

  // ====**** BO GRID ****====
  callbackGrid(params) {
    this.params = params;
    this.searchOrder();
  }

  getParams() {
    const selectedBo = this.params.api.getSelectedRows();
    if (selectedBo) {
      this.selectedBo = selectedBo[0];
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.boData) {
      return;
    }
    this.paginationParams = paginationParams;
    this.searchOrder();
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  searchOrder() {
    this.loadingService.setDisplay(true);
    this.boOrderFollowupApi.searchOrder(this.searchForm.value, this.paginationParams).subscribe(boData => {
      this.loadingService.setDisplay(false);
      this.lastUpdateTime = boData.lastUpdate;
      this.boData = boData.list;
      this.paginationTotalsData = boData.total;
      this.selectedBo = undefined;
      this.params.api.setRowData(this.gridTableService.addSttToData(this.boData, this.paginationParams));
      this.gridTableService.autoSelectRow(this.params, this.boData, this.selectedBo);
      this.gridTableService.expandAllRows(this.params);
      this.gridTableService.autoSizeColumn(this.params, 'autoSizeColumn');
    });
  }

  viewDetail() {
    if (!this.selectedBo) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn đơn hàng, hãy chọn một đơn hàng để xem chi tiết');
      return;
    }
    this.boPartsFollowupDetails.open(this.selectedBo);
  }

  refreshData() {
    this.confirmService.openConfirmModal('Bạn có muốn cập nhật dữ liệu không?', 'Lưu ý: Thông tin tự động cập nhật sau 15 phút').subscribe(() => {
      this.searchOrder();
    }, () => {
    });
  }

  private buildForm() {
    this.searchForm = this.formBuilder.group({
      roNo: [undefined],
      plate: [undefined],
    });
  }
}
