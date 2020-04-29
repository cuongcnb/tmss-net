import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {RoLackOfPartsModel} from '../../../core/models/parts-management/ro-lack-of-parts.model';
import {RoLackOfPartExportApi} from '../../../api/parts-management/ro-lack-of-part-export.api';
import {LoadingService} from '../../../shared/loading/loading.service';
import {AgDataValidateService} from '../../../shared/ag-grid-table/ag-data-validate/ag-data-validate.service';
import {AgCheckboxRendererComponent} from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import * as moment from 'moment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ro-lack-of-parts',
  templateUrl: './ro-lack-of-parts-export.component.html',
  styleUrls: ['./ro-lack-of-parts-export.component.scss']
})
export class RoLackOfPartsExportComponent implements OnInit, OnChanges {
  @Input() orderNo;
  form: FormGroup;

  fieldGrid;
  params;
  roData: Array<RoLackOfPartsModel> = [];
  selectedData: RoLackOfPartsModel;
  frameworkComponents: any;
  partListForExport: Array<RoLackOfPartsModel> = [];
  excelStyles;

  prepickInfo: Array<string> = [];

  constructor(
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private roLackOfPartExportApi: RoLackOfPartExportApi,
    private loadingService: LoadingService,
    private agDataValidateService: AgDataValidateService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.orderNo && this.form) {
      this.form.patchValue({
        orderNo: this.orderNo
      });
      this.searchRo();
    }
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số Thứ Tự',
        field: 'stt',
        width: 30,
        cellClass: 'fontSize',
        cellRenderer: params => params.rowIndex + 1
      },
      {
        headerName: 'Số RO',
        headerTooltip: 'Số RO',
        field: 'ro',
        width: 100,
        cellClass: 'fontSize'
      },
      {
        headerName: 'Biển số',
        headerTooltip: 'Biển số',
        field: 'plate',
        width: 60,
        cellClass: 'fontSize'
      },
      {
        headerName: '',
        headerTooltip: '',
        field: 'checkForExport',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 30,
        cellClass: 'fontSize'
      },
      {
        headerName: 'Số ĐH B/O',
        headerTooltip: 'Số đơn hàng B/O',
        field: 'orderNo',
        width: 90,
        cellClass: 'fontSize'
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        width: 70,
        cellClass: ['textFormat', 'fontSize'],
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        },
        field: 'partsName',
        width: 120,
        cellClass: 'fontSize'
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'donGia',
        cellStyle: { 'text-align': 'right' },
        width: 60,
        cellClass: 'fontSize'
      },
      {
        headerName: 'Đã đặt',
        headerTooltip: 'Đã đặt',
        field: 'orderQty',
        cellClass: ['cell-readonly', 'cell-border', 'text-right', 'fontSize'],
        width: 40
      },
      {
        headerName: 'SL Đ.về',
        headerTooltip: 'Số lượng đã về',
        field: 'qty',
        cellClass: ['cell-readonly', 'cell-border', 'text-right', 'fontSize'],
        width: 40,
      },
      {
        headerName: 'Ngày nhận',
        headerTooltip: 'Ngày nhận',
        field: 'ngayNhanHang',
        width: 120,
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        cellClass: ['cell-readonly', 'cell-border', 'text-right', 'fontSize']
      },
      {
        headerName: 'Vị trí SOP',
        headerTooltip: 'Vị trí SOP',
        field: 'prepickLocationNo',
        width: 100,
        editable: true,
        maxLength: 10,
        validators: ['required', 'maxLength'],
        validateOnSubmit: true,
        cellClass: ['cell-clickable', 'cell-border', 'text-left', 'fontSize']
      }
    ];
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent
    };
    this.buildForm();
    this.excelStyles = [
      {
        id: 'textFormat',
        dataType: 'string'
      },
      {
        id: 'fontSize',
        font: {
          size: 11
        },
      },
      {
        id: 'header',
        font: {
          size: 11
        }
      }
    ];
  }

  callbackGrid(params) {
    this.params = params;
    this.params.api.sizeColumnsToFit();
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    this.partListForExport = [];
    if (selectedData) {
      selectedData.forEach(it => this.partListForExport.push(it));
      this.selectedData = selectedData;
    }
  }

  searchRo() {
    this.loadingService.setDisplay(true);
    this.roLackOfPartExportApi.search(this.form.value).subscribe(roData => {
      this.loadingService.setDisplay(false);
      this.roData = roData;
      this.params.api.setRowData(this.roData);
      this.partListForExport = [];
      setTimeout(() => {
        this.params.api.sizeColumnsToFit(this.params);
      }, 50);
    });
  }

  cellValueChanged(params) {
    const field = params.colDef.field;
  }

  exportPrepick() {
    if (this.partListForExport.length <= 0) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn phụ tùng, hãy chọn phụ tùng để xuất');
      return;
    }
    if (this.agDataValidateService.validateDataGrid(this.params, this.fieldGrid, this.roData, this.partListForExport)) {
      this.loadingService.setDisplay(true);
      this.roLackOfPartExportApi.export(this.partListForExport).subscribe(response => {
        this.swalAlertService.openSuccessToast();
        this.prepickInfo = response;
        this.form.reset();
        this.searchRo();
        this.loadingService.setDisplay(true);
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      orderNo: [undefined],
      partsCode: [undefined],
      plate: [undefined],
      ro: [undefined]
    });
    if (this.orderNo) {
      this.form.patchValue({
        orderNo: this.orderNo
      });
      this.searchRo();
    }
  }
  // Chức năng xuất dữ liệu màn hình ra excel
  dataExport() {
    const paramsExport = {
      fileName: 'ro-thieu-phu-tung',
      sheetName: 'RO thiếu phụ tùng',
      columnKeys: ['ro', 'plate', 'orderNo', 'partsCode', 'partsName', 'donGia',
        'orderQty', 'qty', 'ngayNhanHang', 'prepickLocationNo'],
      processHeaderCallback: params => params.column.getColDef().headerName,
      processCellCallback: params => {
        const field = params.column.getColDef().field;
        switch (field) {
          case 'stt':
            return params.node.rowIndex + 1;
          case 'ngayNhanHang':
            return !!params.value ? moment(params.value).format(moment.HTML5_FMT.DATETIME_LOCAL_MS) : '';
          default:
            return params.value;
        }
      }
    };
    this.params.api.exportDataAsExcel(paramsExport);
  }
}
