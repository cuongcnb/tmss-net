import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';

import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {PartsExportLackLookupApi} from '../../../../api/parts-management/parts-export-lack-lookup.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {TMSSTabs} from '../../../../core/constains/tabs';
import {EventBusService} from '../../../../shared/common-service/event-bus.service';
import {ValidateBeforeSearchService} from '../../../../shared/common-service/validate-before-search.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'list-ro-export-lack',
  templateUrl: './list-ro-export-lack.component.html',
  styleUrls: ['./list-ro-export-lack.component.scss']
})
export class ListRoExportLackComponent implements OnInit {
  @Input() shippingModal;
  @Input() tabDisplay: boolean;
  recvSearchForm;
  roSearchForm;

  fieldPartsList;
  partsList;
  partsParams;

  fieldRoList;
  roList;
  roParams;
  selectedRoNode;

  fieldRoDetailList;
  roDetailList;
  roDetailParams;

  constructor(
    private formBuider: FormBuilder,
    private dataFormatService: DataFormatService,
    private partsExportLackLookupApi: PartsExportLackLookupApi,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private eventBus: EventBusService,
    private validateBeforeSearchService: ValidateBeforeSearchService,
    private gridTableService: GridTableService
  ) {
    this.fieldPartsList = [
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
        field: 'partsCode'
      },
      {
        headerName: 'SL',
        headerTooltip: 'Số lượng',
        field: 'qty'
      }
    ];
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
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
        field: 'stt',
        width: 50
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partscode',
        width: 120,
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsname',
        width: 250
      },
      {
        headerName: 'Tồn',
        headerTooltip: 'Tồn',
        field: 'inventoryQty',
        width: 80
      },
      {
        headerName: 'Cần',
        headerTooltip: 'Cần',
        field: 'orderQty',
        width: 80
      },
      {
        headerName: 'Xuất',
        headerTooltip: 'Xuất',
        field: 'deliveredQty',
        width: 80
      },
      {
        headerName: 'Thiếu',
        headerTooltip: 'Thiếu',
        field: 'remainQty',
        width: 80
      }
    ];

  }

  ngOnInit() {
    this.buildForm();
  }

  openShipping() {
    if (!this.selectedRoNode) {
      this.toastService.openWarningToast('Vui lòng chọn một RO để Mở Shipping');
      return;
    }
    this.eventBus.emit({
      type: 'openComponent',
      functionCode: TMSSTabs.dlrBoPartsExport,
      data: {
        repairOrderNo: this.selectedRoNode.data.code,
        type: this.selectedRoNode.data.reqType,
        searchOnStart: true
      }
    });
  }

  // =====***** AG GRID PARTS *****=====
  callbackParts(params) {
    this.partsParams = params;
  }

  searchRecv() {
    if (this.recvSearchForm.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);
    this.partsExportLackLookupApi.findRecv(this.recvSearchForm.value).subscribe(val => {
      this.loadingService.setDisplay(false);
      if (val) {
        this.partsList = val;
        this.partsParams.api.setRowData(this.partsList);
      }
      this.gridTableService.autoSizeColumn(this.partsParams, true);
    });
  }

  // =====***** AG GRID RO *****=====
  callbackRo(params) {
    this.roParams = params;
  }

  getParamsRo() {
    const selectedRoNode = this.roParams.api.getSelectedNodes();
    if (selectedRoNode) {
      this.selectedRoNode = selectedRoNode[0];
      this.searchRoDetail();
    }
  }

  searchRo() {
    const formValue = Object.assign({}, this.roSearchForm.value);
    if (!this.validateBeforeSearchService.validSearchDateRange(formValue.fromDate, formValue.toDate)
      || this.roSearchForm.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);
    this.partsExportLackLookupApi.findRo(Object.assign({}, formValue,
      {
        listOfreceivedPartId: this.partsList
          ? this.partsList.map(item => item.partId).toString()
          : ''
      }
    )).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.roList = res;
      if (this.roList.length) {
        this.roParams.api.setRowData(this.roList);
        this.roParams.api.getModel().rowsToDisplay[0].setSelected(true);
      } else {
        this.selectedRoNode = null;
        this.roDetailList = [];
        this.roParams.api.setRowData([]);
        this.roDetailParams.api.setRowData(this.roDetailList);
      }
      this.roParams.api.sizeColumnsToFit(this.roParams);
    });
  }

  // =====***** AG GRID RO DETAIL *****=====
  callbackRoDetail(params) {
    this.roDetailParams = params;
  }

  searchRoDetail() {
    this.loadingService.setDisplay(true);
    const obj = {
      reqId: this.selectedRoNode.data.reqId,
      reqType: this.selectedRoNode.data.reqType
    };
    this.partsExportLackLookupApi.findRoDetail(obj).subscribe(val => {
        this.loadingService.setDisplay(false);
        if (val) {
          this.roDetailList = val;
          this.roDetailParams.api.setRowData(this.roDetailList);
          this.gridTableService.autoSizeColumn(this.roDetailParams);
        }
      }
    );
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.recvSearchForm = this.formBuider.group({
      receivedDate: [new Date().getTime(), GlobalValidator.required],
      session: [1] // 1: phien 1,2: phien 2
    });

    this.roSearchForm = this.formBuider.group({
      requestType: ['-1'], // 0: lsc, 1: ban le, 2: dat hen
      partsCode: [undefined],
      vehicleNo: [undefined],
      ro: [undefined],
      fromDate: [new Date(year, month, date).getTime(), GlobalValidator.required],
      toDate: [new Date(year, month, date, 23, 59, 59).getTime(), GlobalValidator.required]
    });
  }
}
