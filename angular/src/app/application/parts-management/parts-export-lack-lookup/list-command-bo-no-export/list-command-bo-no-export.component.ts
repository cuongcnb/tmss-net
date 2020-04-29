import {OnChanges, Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';

import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {PartsExportLackLookupApi} from '../../../../api/parts-management/parts-export-lack-lookup.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {TMSSTabs} from '../../../../core/constains/tabs';
import {EventBusService} from '../../../../shared/common-service/event-bus.service';
import {ValidateBeforeSearchService} from '../../../../shared/common-service/validate-before-search.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'list-command-bo-no-export',
  templateUrl: './list-command-bo-no-export.component.html',
  styleUrls: ['./list-command-bo-no-export.component.scss']
})
export class ListCommandBoNoExportComponent implements OnInit, OnChanges {
  @Input() shippingModal;
  @Input() tabDisplay: boolean;
  fieldRoList;
  roList;
  roParams;
  selectedRoNode;

  fieldRoDetailList;
  roDetailList;
  roDetailParams;

  searchForm;

  constructor(
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private partsExportLackLookupApi: PartsExportLackLookupApi,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private eventBus: EventBusService,
    private validateBeforeSearchService: ValidateBeforeSearchService,
    private gridTableService: GridTableService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldRoList = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
        field: 'stt',
        width: 80
      },
      {
        headerName: 'Kiểu RO',
        headerTooltip: 'Kiểu RO',
        field: 'reqName'
      },
      {
        headerName: 'Số RO',
        headerTooltip: 'Số RO',
        field: 'code'
      },
      {
        headerName: 'Ngày RO',
        headerTooltip: 'Ngày RO',
        field: 'roDate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'Biển số xe',
        headerTooltip: 'Biển số xe',
        field: 'registerNo'
      }
    ];
    this.fieldRoDetailList = [
      {
        children: [
          {
            headerName: 'STT',
            headerTooltip: 'Số thứ tự',
            cellRenderer: params => params.rowIndex + 1,
            field: 'stt',
            width: 80
          },
          {
            headerName: 'Mã PT',
            headerTooltip: 'Mã phụ tùng',
            field: 'partscode'
          },
          {
            headerName: 'Tên PT',
            headerTooltip: 'Tên phụ tùng',
            field: 'partsname'
          }
        ]
      },
      {
        headerName: 'Số Lượng',
        headerTooltip: 'Số Lượng',
        children: [
          {
            headerName: 'Tồn',
            headerTooltip: 'Tồn',
            field: 'inventoryQty'
          },
          {
            headerName: 'Cần',
            headerTooltip: 'Cần',
            field: 'orderQty'
          },
          {
            headerName: 'Xuất',
            headerTooltip: 'Xuất',
            field: 'deliveryQty'
          },
          {
            headerName: 'Thiếu',
            headerTooltip: 'Thiếu',
            field: 'remainQty'
          }
        ]
      },
      {
        headerName: 'SL Đặt BO',
        headerTooltip: 'Số lượng Đặt BO',
        children: [
          {
            headerName: 'Đã Về',
            headerTooltip: 'Đã Về',
            field: 'receivedBoQty'
          },
          {
            headerName: 'Chưa về',
            headerTooltip: 'Chưa về',
            field: 'remainBoQty'
          }
        ]
      },
      {
        headerName: 'SL BO Prepick',
        headerTooltip: 'Số lượng BO Prepick',
        children: [
          {
            headerName: 'DPR',
            headerTooltip: 'DPR',
            field: 'prepickBoQty'
          },
          {
            headerName: 'CPR',
            headerTooltip: 'CPR',
            field: 'remainPrepickBoQty'
          }
        ]
      }
    ];
  }

  ngOnChanges(): void {
    if (this.tabDisplay && this.roParams && this.roDetailParams) {
      this.gridTableService.autoSizeColumn(this.roParams, true);
      this.gridTableService.autoSizeColumn(this.roDetailParams, true);
    }
  }

  openShipping() {
    if (!this.selectedRoNode) {
      this.toastService.openWarningToast('Vui lòng chọn một RO để Mở Shipping');
      return;
    }
    this.eventBus.emit({
      type: 'openComponent',
      functionCode: TMSSTabs.dlrBoPartsExport,
      // roBoInfo: this.selectedRoNode.data,
      data: {
        repairOrderNo: this.selectedRoNode.data.code,
        type: this.selectedRoNode.data.reqType,
        searchOnStart: true
      }
    });
  }

  // =====***** AG GRID RO *****=====
  callbackRo(params) {
    this.roParams = params;
    this.gridTableService.autoSizeColumn(this.roParams, true);
  }

  getParamsRo() {
    const selectedRoNode = this.roParams.api.getSelectedNodes();
    if (selectedRoNode) {
      this.selectedRoNode = selectedRoNode[0];
      this.searchRoDetail();
    }
  }

  searchRo() {
    this.loadingService.setDisplay(true);
    this.partsExportLackLookupApi.findRoBo(this.searchForm.value).subscribe(val => {
        this.loadingService.setDisplay(false);
        this.roList = val;
        this.roParams.api.setRowData(this.roList);
        if (this.roList.length) {
          this.roParams.api.getModel().rowsToDisplay[0].setSelected(true);
        } else {
          this.selectedRoNode = null;
          this.roDetailList = [];
          this.roDetailParams.api.setRowData(this.roDetailList);
        }
        this.gridTableService.autoSizeColumn(this.roParams);
      }, () => this.loadingService.setDisplay(false)
    )
    ;
  }

  // =====***** AG GRID RO DETAIL *****=====
  callbackRoDetail(params) {
    this.roDetailParams = params;
    this.gridTableService.autoSizeColumn(this.roDetailParams);
  }

  searchRoDetail() {
    if (!this.validateBeforeSearchService.validSearchDateRange(this.searchForm.value.fromDate, this.searchForm.value.toDate)
      || this.searchForm.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);
    this.partsExportLackLookupApi.findRoDetailBo(this.selectedRoNode.data).subscribe(val => {
      this.loadingService.setDisplay(false);
      this.roDetailList = val;
      this.roDetailParams.api.setRowData(this.roDetailList);
    });
    this.gridTableService.autoSizeColumn(this.roDetailParams);
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.searchForm = this.formBuilder.group({
      requestType: [0],
      partsCode: [undefined],
      fromDate: [new Date(year, month, date).getTime(), GlobalValidator.required],
      toDate: [new Date(year, month, date, 23, 59, 59).getTime(), GlobalValidator.required]
    });

  }

}
