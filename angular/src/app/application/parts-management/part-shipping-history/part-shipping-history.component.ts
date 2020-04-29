import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../shared/loading/loading.service';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { DownloadService } from '../../../shared/common-service/download.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import {
  PartShippingHistoryDetailModel,
  PartShippingHistoryModel
} from '../../../core/models/parts-management/part-shipping-history.model';
import { PartShippingHistoryApi } from '../../../api/parts-management/part-shipping-history.api';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ValidateBeforeSearchService } from '../../../shared/common-service/validate-before-search.service';
import { AgCheckboxRendererComponent } from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import { AgCheckboxHeaderRendererComponent } from '../../../shared/ag-checkbox-header-renderer/ag-checkbox-header-renderer.component';
import { remove } from 'lodash';
import { StorageKeys } from '../../../core/constains/storageKeys';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-shipping-history',
  templateUrl: './part-shipping-history.component.html',
  styleUrls: ['./part-shipping-history.component.scss'],
})
export class PartShippingHistoryComponent implements OnInit {
  @ViewChild('detailModal', {static: false}) detailModal;
  form: FormGroup;

  fieldGrid;
  params;
  partShippingData: Array<PartShippingHistoryModel> = [];
  selectedShippingData: PartShippingHistoryModel;
  partListForExport: Array<PartShippingHistoryModel> = [];
  totalAmount: string;

  paginationTotalsData: number;
  paginationParams;

  fieldGridExport;
  exportParams;

  frameworkComponents;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private gridTableService: GridTableService,
    private downloadService: DownloadService,
    private dataFormatService: DataFormatService,
    private partShippingHistoryApi: PartShippingHistoryApi,
    private swalAlertService: ToastService,
    private validateBeforeSearchService: ValidateBeforeSearchService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {
        headerName: '',
        headerTooltip: '',
        field: 'checkForExport',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 30,
      },
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 30,
      },
      {
        headerName: 'Ngày RO',
        headerTooltip: 'Ngày RO',
        field: 'roDate',
        width: 60,
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Số RO',
        headerTooltip: 'Số RO',
        field: 'repairOrderNo',
        width: 80,
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'statusLabel',
        width: 70,
      },
      {
        headerName: 'Biển số xe',
        headerTooltip: 'Biển số xe',
        field: 'registerNo',
        width: 80,
      },
      {
        headerName: 'Tên khách hàng',
        headerTooltip: 'Tên khách hàng',
        field: 'customerName',
      },
      {
        headerName: 'Điện thoại',
        headerTooltip: 'Điện thoại',
        width: 70,
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        valueGetter: params => {
          return params.data && params.data.phone ? params.data.phone : params.data.tel
        }
      },
      {
        headerName: 'Tổng tiền',
        headerTooltip: 'Tổng tiền',
        field: 'totalAmountAfterTax',
        width: 70,
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
      },
    ];
    this.fieldGridExport = [
      {
        headerName: 'DLR_ID',
        headerTooltip: 'DLR_ID',
        field: 'dlrId',
        width: 50,
      },
      {
        headerName: 'REQ_ID',
        headerTooltip: 'REQ_ID',
        field: 'reqId',
        width: 50,
        cellClass: 'excelStringType',
      },
      {
        headerName: 'REQTYPE',
        headerTooltip: 'REQTYPE',
        field: 'reqType',
        width: 50,
      },
      {
        headerName: 'KIEU',
        headerTooltip: 'KIEU',
        field: 'reqTypeLabel',
        width: 100,
      },
      {
        headerName: 'NGAY_RO',
        headerTooltip: 'NGAY_RO',
        field: 'roDate',
        width: 100,
        cellClass: 'excelDateType',
      },
      {
        headerName: 'CODE',
        headerTooltip: 'CODE',
        field: 'reqTypeLabel',
        width: 100,
      },
      {
        headerName: 'TRANG_THAI',
        headerTooltip: 'TRANG_THAI',
        field: 'status',
        width: 100,
      },
      {
        headerName: 'TEN_KHACH_HANG',
        headerTooltip: 'TEN_KHACH_HANG',
        field: 'cusName',
        width: 100,
      },
      {
        headerName: 'DIEN_THOAI',
        headerTooltip: 'DIEN_THOAI',
        field: 'phone',
        width: 100,
        cellClass: ['cell-readonly', 'cell-border', 'text-right', 'excelStringType'],
      },
      {
        headerName: 'DI_DONG',
        headerTooltip: 'DI_DONG',
        field: 'mobile',
        width: 100,
        cellClass: ['cell-readonly', 'cell-border', 'text-right', 'excelStringType'],
      },
      {
        headerName: 'DIA_CHI',
        headerTooltip: 'DIA_CHI',
        field: 'cusAddress',
        width: 150,
      },
      {
        headerName: 'MA_SO_THUE',
        headerTooltip: 'MA_SO_THUE',
        field: 'taxNumber',
        width: 50,
        cellClass: 'excelStringType',
      },
      {
        headerName: 'MODEL_XE',
        headerTooltip: 'MODEL_XE',
        field: 'vehicleModel',
        width: 100,
        cellClass: 'excelStringType',
      },
      {
        headerName: 'BIEN_SO_XE',
        headerTooltip: 'BIEN_SO_XE',
        field: 'vehicleNo',
        width: 100,
      },
      {
        headerName: 'TEN_CVDV',
        headerTooltip: 'TEN_CVDV',
        field: 'advisorName',
        width: 100,
      },
      {
        headerName: 'PARTSHIPPING_ID',
        headerTooltip: 'PARTSHIPPING_ID',
        field: 'partShippingId',
        width: 100,
      },
      {
        headerName: 'PARTS_ID',
        headerTooltip: 'PARTS_ID',
        field: 'partId',
        width: 50,
      },
      {
        headerName: 'NGAY_XUAT',
        headerTooltip: 'NGAY_XUAT',
        field: 'shippingDate',
        width: 100,
        cellClass: 'excelDateType'
      },
      {
        headerName: 'GENUINE',
        headerTooltip: 'GENUINE',
        field: 'genuine',
        width: 50,
      },
      {
        headerName: 'MA_PT',
        headerTooltip: 'MA_PT',
        field: 'partCode',
        width: 50,
        cellClass: 'excelStringType',
      },
      {
        headerName: 'TEN_PT',
        headerTooltip: 'TEN_PT',
        field: 'partName',
        width: 100,
      },
      {
        headerName: 'TEN_PT_VN',
        headerTooltip: 'TEN_PT_VN',
        field: 'partNameVn',
        width: 100,
      },
      {
        headerName: 'SO_LUONG',
        headerTooltip: 'SO_LUONG',
        field: 'qty',
        width: 50,
        cellClass: ['cell-readonly', 'cell-border', 'text-right']
      },
      {
        headerName: 'GIA_BAN',
        headerTooltip: 'GIA_BAN',
        field: 'sellPrice',
        width: 50,
        cellClass: ['cell-readonly', 'cell-border', 'text-right', 'excelStringType']
      },
      {
        headerName: 'PHAN_TRAM_THUE',
        headerTooltip: 'PHAN_TRAM_THUE',
        field: 'tax',
        width: 50,
      },
      {
        headerName: 'SHIPPING_STATUS',
        headerTooltip: 'SHIPPING_STATUS',
        field: 'shippingStatus',
        width: 100,
      },
      {
        headerName: 'SHIPPINGSTATUS_NAME',
        headerTooltip: 'SHIPPINGSTATUS_NAME',
        field: 'statusLabel',
        width: 100,
      },
      {
        headerName: 'PREPICK_STATUS',
        headerTooltip: 'PREPICK_STATUS',
        field: 'prepickStatus',
        width: 100,
      },
      {
        headerName: 'CREATED_BY',
        headerTooltip: 'CREATED_BY',
        field: 'createdBy',
        width: 100,
      },
      {
        headerName: 'CREATE_DATE',
        headerTooltip: 'CREATE_DATE',
        field: 'createDate',
        width: 120,
        cellClass: 'excelDateTimeType',
      },
      {
        headerName: 'MODIFIED_BY',
        headerTooltip: 'MODIFIED_BY',
        field: 'modifiedBy',
        width: 100,
      },
      {
        headerName: 'MODIFY_DATE',
        headerTooltip: 'MODIFY_DATE',
        field: 'modifyDate',
        width: 120,
        cellClass: 'excelDateTimeType',
      },
      {
        headerName: 'DELETEFLAG',
        headerTooltip: 'DELETEFLAG',
        field: 'deleteFlag',
        width: 80,
      }
    ];
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent
    };
  }

  // =====****** AG GRID *****=====
  callbackGrid(params) {
    this.params = params;
  }

  getParams() {
    const selectedShippingData = this.params.api.getSelectedRows();
    this.partListForExport = [];
    if (selectedShippingData) {
      selectedShippingData.forEach(it => this.partListForExport.push(it));
      this.selectedShippingData = selectedShippingData[selectedShippingData.length - 1];
    }

  }

  // SEARCH DATA
  changePaginationParams(paginationParams) {
    if (! this.partShippingData) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  search() {
    if (!this.validateBeforeSearchService.validSearchDateRange(this.form.value.fromDate, this.form.value.toDate)) {
      return;
    }
    const formValue = this.validateBeforeSearchService.setBlankFieldsToNull(this.form.value);
    this.loadingService.setDisplay(true);
    this.partShippingHistoryApi.searchPartsSummary(formValue, this.paginationParams).subscribe(res => {
      this.loadingService.setDisplay(false);
      const key = Object.keys(res)[0];
      this.paginationTotalsData = parseFloat(key);
      this.partShippingData = res[key];
      this.params.api.setRowData(this.gridTableService.addSttToData(this.partShippingData, this.paginationParams));
      this.partListForExport = [];
      this.gridTableService.selectFirstRow(this.params);
    });
  }

  // CELL EDITING
  cellDoubleClicked(params) {
    this.detailModal.open(params.data);
  }

  cellValueChanged(params) {
  }

  // EXPORT DATA
  exportExcel() {
    if (this.partListForExport.length === 0) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn phụ tùng, hãy chọn ít nhất một phụ tùng để xuất dữ liệu', 'Cảnh báo');
      return;
    }
    this.loadingService.setDisplay(true);
    const requireArr = [];
    this.partListForExport.forEach(data => {
      requireArr.push({reqId: data.reqId, reqType: data.reqType});
    });
    this.partShippingHistoryApi.exportExcel(requireArr).subscribe(res => {
      this.loadingService.setDisplay(false);
      const fileName = this.gridTableService.generateExportFileName('LichSuXuatPT', StorageKeys.partsCheckPriceCodeExportTimes);
      this.convertExportData(res, fileName);
    });
  }

  convertExportData(exportDataArr: Array<PartShippingHistoryDetailModel>, fileName) {
    const data = [];
    exportDataArr.forEach(exportData => {
      data.push(exportData.partsShippingHistoryDetailInfoDTO);
      exportData.partsShippingHistoryDetailPartsDTOs.forEach(partData => {
        data.push(partData);
      });
    });
    this.exportParams.api.setRowData(data);
    this.gridTableService.export(this.exportParams, fileName, 'LichSuXuatPT', true);
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      requestType: [undefined],
      code: [undefined],
      vehicleNo: [undefined],
      partCode: [undefined],
      partName: [undefined],
      cusName: [undefined],
      fromDate: [new Date(year, month, 1).getTime()],
      toDate: [new Date(year, month, date, 23, 59, 59).getTime()],
    });
  }
}
