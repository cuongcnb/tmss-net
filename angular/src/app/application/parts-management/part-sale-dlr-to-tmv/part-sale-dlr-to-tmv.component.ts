import {Component, OnInit, ViewChild} from '@angular/core';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {PaginationParamsModel} from '../../../core/models/base.model';
import {PartsCancelTrackingModel} from '../../../core/models/parts-management/parts-cancel-tracking.model';
import {AgCheckboxRendererComponent} from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ValidateBeforeSearchService} from '../../../shared/common-service/validate-before-search.service';
import {AgInCellButtonComponent} from '../../../shared/ag-in-cell-button/ag-in-cell-button.component';
import {PartSaleDlrToTmvApi} from '../../../api/parts-management/part-sale-dlr-to-tmv.api';
import {PartsInfoManagementApi} from '../../../api/parts-management/parts-info-management.api';
import {AgDatepickerRendererComponent} from '../../../shared/ag-datepicker-renderer/ag-datepicker-renderer.component';
import {TMSSTabs} from '../../../core/constains/tabs';
import {EventBusService} from '../../../shared/common-service/event-bus.service';
import {ServiceReportApi} from '../../../api/service-report/service-report.api';
import {DownloadService} from '../../../shared/common-service/download.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-sale-dlr-to-tmv',
  templateUrl: './part-sale-dlr-to-tmv.component.html',
  styleUrls: ['./part-sale-dlr-to-tmv.component.scss']
})
export class PartSaleDlrToTmvComponent implements OnInit {
  @ViewChild('reportModal', {static: false}) reportModal;
  @ViewChild('rejectModal', {static: false}) rejectModal;
  @ViewChild('partsRetailOrder', {static: false}) partsRetailOrder;
  @ViewChild('searchPartsModal', {static: false}) searchPartsModal;
  searchForm: FormGroup;

  fieldPartsList;
  partsParams;
  partsList: PartsCancelTrackingModel[];
  selectedPartsNode;
  focusCellIndex;
  selectedNode;
  paginationParams: PaginationParamsModel;
  paginationTotalsData;

  fieldGridExport;
  exportParams;
  partListForExport: PartsCancelTrackingModel[] = [];

  rowClassRules;
  frameworkComponents;
  fieldPartsSearch;
  dataDefault = {
    partsCode: null,
    partsnamevn: null,
    locationno: null,
    mip: null,
    price: null,
    stockQty: null,
    qty: null,
    modifyDate: null,
    tmvBuyQty: null,
    pONo: null,
    status: null
  };

  constructor(
    private dataFormatService: DataFormatService,
    private swalAlertSerivce: ToastService,
    private partSaleDlrToTmvApi: PartSaleDlrToTmvApi,
    private loadingService: LoadingService,
    private confirmService: ConfirmService,
    private gridTableService: GridTableService,
    private formBuilder: FormBuilder,
    private validateBeforeSearchService: ValidateBeforeSearchService,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private serviceReportApi: ServiceReportApi,
    private downloadService: DownloadService,
    private eventBus: EventBusService
  ) {
    this.fieldPartsSearch = [
      {
        headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode',
        width: 90
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
          return params.data && params.data.partsNamevn && !!params.data.partsNamevn ? params.data.partsNamevn : params.data && params.data.partsName ? params.data.partsName : '';
        }
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit',
        width: 50
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        width: 80,
        cellClass: ['cell-readonly', 'cell-border', ' text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Tồn',
        headerTooltip: 'Tồn',
        field: 'stockQty',
        width: 50
      }
    ];
    this.fieldPartsList = [
      {
        headerName: 'Mã phụ tùng',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        cellClass: params => params.data.id ? ['cell-border', 'partsCode'] : ['cell-clickable', 'cell-border', 'partsCode'],
        width: 140, editable: params => !params.data.id
      },
      {
        headerName: 'Tên phụ tùng',
        headerTooltip: 'Tên phụ tùng',
        width: 140,
        valueGetter: params => {
          return params.data && params.data.partsNamevn && !!params.data.partsNamevn ? params.data.partsNamevn : params.data && params.data.partsName ? params.data.partsName : '';
        }
      },
      {
        headerName: 'Vị trí',
        headerTooltip: 'Vị trí',
        field: 'locationno',
        width: 80
      },
      {
        headerName: 'MIP',
        headerTooltip: 'MIP',
        field: 'mip',
        width: 50
      },
      {
        headerName: 'Giá mua TMV',
        headerTooltip: 'Giá mua TMV',
        field: 'price',
        width: 100,
        cellClass: ['text-right'],
        tooltip: params => this.dataFormatService.formatMoney(params.value),
        valueFormatter: params => this.dataFormatService.formatMoney(params.value)
      },
      {
        headerName: 'SL Tồn',
        headerTooltip: 'Số lượng tồn',
        field: 'stockQty',
        width: 80,
        cellClass: param => Number(param.data.stockQty) < Number(param.data.qty)
          ? ['text-right', 'cell-readonly', 'cell-border', 'cell-warning'] : ['text-right', 'cell-readonly', 'cell-border']
      },
      {
        headerName: 'SL Bán',
        headerTooltip: 'Số lượng bán',
        field: 'qty',
        width: 80,
        cellClass: param => Number(param.data.stockQty) < Number(param.data.qty)
          ? ['text-right', 'cell-border', 'cell-warning'] : ['text-right', 'cell-border', 'cell-clickable'],
        editable: true,
        validators: ['number', 'required']
      },
      {
        headerName: 'Ngày ĐK bán',
        headerTooltip: 'Ngày đăng ký bán',
        field: 'modifyDate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        width: 120,
        cellClass: ['text-right', 'cell-border']
      },
      {
        headerName: 'TMV mua',
        headerTooltip: 'Số lượng TMV mua',
        field: 'tmvBuyQty',
        width: 100
      },
      {
        headerName: 'Số đơn hàng',
        headerTooltip: 'Số đơn hàng',
        field: 'pONo',
        width: 100
      },
      {
        headerName: 'Xác nhận',
        headerTooltip: 'Xác nhận',
        cellRenderer: 'agInCellButtonComponent',
        cellClass: 'p-0',
        buttonDef: {
          text: 'Duyệt',
          iconName: 'fa fa-check-square-o',
          function: this.approve.bind(this)
        },
        buttonDefTwo: {
          text: 'Từ chối',
          useRowData: true,
          function: this.reject.bind(this)
        },
        width: 200
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'note',
        width: 140
      },
      {
        field: 'isEdit',
        hide: true
      }
    ];
    this.fieldGridExport = [
      {
        headerName: 'Mã phụ tùng',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        width: 100
      },
      {
        headerName: 'Tên phụ tùng',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsNamevn',
        width: 100
      },
      {
        headerName: 'Vị trí',
        headerTooltip: 'Vị trí',
        field: 'locationno',
        width: 120
      },
      {
        headerName: 'MIP',
        headerTooltip: 'MIP',
        field: 'mip',
        width: 50
      },
      {
        headerName: 'Giá mua TMV',
        headerTooltip: 'Giá mua TMV',
        field: 'price',
        width: 80
      },
      {
        headerName: 'SL Tồn',
        headerTooltip: 'Số lượng tồn',
        field: 'stockQty',
        width: 80,
        cellClass: ['text-right', 'cell-readonly', 'cell-border']
      },
      {
        headerName: 'SL Bán',
        headerTooltip: 'Số lượng bán',
        field: 'qty',
        width: 80,
        cellClass: ['cell-clickable', 'cell-border', 'text-right'],
        validators: ['number', 'required', 'notNegativeNumber']
      },
      {
        headerName: 'Ngày ĐK bán',
        headerTooltip: 'Ngày đăng ký bán',
        field: 'modifyDate',
        cellClass: ['cell-border', 'cell-readonly'],
        cellRenderer: 'agDatepickerRendererComponent',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'SL TMV mua',
        headerTooltip: 'Số lượng TMV mua',
        field: 'tmvBuyQty'
      },
      {
        headerName: 'Số đơn hàng',
        headerTooltip: 'Số đơn hàng',
        field: 'pONo'
      },
      {
        headerName: 'Xác nhận',
        headerTooltip: 'Xác nhận',
        cellRenderer: 'agInCellButtonComponent',
        cellClass: 'p-0',
        buttonDef: {
          text: 'Duyệt',
          iconName: 'fa fa-check-square-o',
          function: this.approve.bind(this)
        },
        buttonDefTwo: {
          text: 'Hủy',
          useRowData: true,
          function: this.reject.bind(this)
        },
        width: 120
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'note'
      }
    ];
    this.rowClassRules = {
      'row-marked': 'data.status==="1"'
    };
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent,
      agInCellButtonComponent: AgInCellButtonComponent,
      agDatepickerRendererComponent: AgDatepickerRendererComponent

    };
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      partCode: [undefined]
    });
  }

  callbackParts(params) {
    this.partsParams = params;
  }

  getParamsParts() {
    const selectedPartsNode = this.partsParams.api.getSelectedNodes();
    const selectedParts = this.partsParams.api.getSelectedRows();
    this.partListForExport = [];
    if (selectedPartsNode) {
      selectedParts.forEach(it => this.partListForExport.push(it));
      this.selectedPartsNode = selectedPartsNode[0];
    }
    this.focusCellIndex = this.gridTableService.getAllData(this.partsParams).length - 1;
  }

  search() {
    this.selectedPartsNode = undefined;
    this.loadingService.setDisplay(true);
    this.partSaleDlrToTmvApi.searchPart(this.searchForm.value.partCode).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.paginationTotalsData = res.count;
      this.partsParams.api.setRowData(res.list);
      this.gridTableService.selectFirstRow(this.partsParams);
      setTimeout(() => {
        this.partsParams.api.sizeColumnsToFit(this.partsParams);
      }, 50);
    });
  }

  cellValueChanged(params) {
    this.partsParams.api.forEachNode(rowNode => {
      if (params.rowIndex === rowNode.rowIndex && params.newValue !== params.oldValue && params.newValue) {
        rowNode.setDataValue('isEdit', 1);
      }
    });
  }

  cellEditingStopped(params) {
    const col = params.colDef.field;
    switch (col) {

      case 'partsCode':
        if (!params.value || !params.value) {
          return;
        }
        this.partsParams.api.forEachNode(rowNode => {
          if (params.rowIndex === rowNode.rowIndex && params.value) {
            rowNode.setDataValue('partsCode', params.value.replace(/[^a-zA-Z0-9]/g, ''));
          }
        });
        this.searchPartInfo({partsCode: params.value.replace(/[^a-zA-Z0-9]/g, '')});
        break;
    }
  }


  approve(params) {
    this.confirmService.openConfirmModal('Bạn có chắc chắn muốn duyệt bản ghi này?').subscribe(() => {
      const obj = {
        id: params.data.id,
        partId: params.data.partId
      };
      this.partSaleDlrToTmvApi.approve(obj).subscribe(() => {
        this.swalAlertSerivce.openSuccessToast();
        this.search();
      });
    }, () => {
    });
  }

  reject(params) {
    this.rejectModal.open(params);
  }

  confirmReject(obj) {
    this.partSaleDlrToTmvApi.reject(obj).subscribe(() => {
      this.swalAlertSerivce.openSuccessToast();
      this.search();
    });
  }


  resetPaginationParams() {
    this.selectedPartsNode = undefined;
    this.partsList = undefined;
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  export() {
    this.exportParams.api.setRowData(this.partListForExport);
    this.gridTableService.export(this.exportParams, 'BanPhuTungDaiLyChoTMV', 'BanPhuTungDaiLyChoTMV');
  }

  changePaginationParams(paginationParams) {
    if (!this.partsList) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }


  addParts() {
    const lastIndex = this.partsParams.api.getLastDisplayedRow();
    if (lastIndex >= 0) {
      const lastItem = this.partsParams.api.getDisplayedRowAtIndex(lastIndex).data;
      if (!lastItem.partsCode) {
        this.swalAlertSerivce.openWarningToast('Kiểm tra lại Mã PT');
        return;
      }
      if (!lastItem.partId) {
        this.swalAlertSerivce.openWarningToast('Bạn phải chọn phụ tùng trong danh sách');
        return;
      }
    }
    this.partsParams.api.updateRowData({add: [this.dataDefault]});
    this.gridTableService.setFocusCellDontEdit(this.partsParams, this.fieldPartsList[0].field, lastIndex + 1);
    this.partsParams.api.getModel().rowsToDisplay[lastIndex + 1].setSelected(true);
    this.partsParams.api.startEditingCell({
      rowIndex: lastIndex + 1,
      colKey: 'partsCode'
    });
  }

  saveParts() {
    const data = this.gridTableService.getAllData(this.partsParams);
    const obj = [];
    data.forEach(it => {
      if (Number(it.isEdit) === 1) {
        obj.push({
          id: it.id,
          qty: it.qty
        });
      }
    });
    if (obj && obj.length < 1) {
      this.swalAlertSerivce.openWarningToast('Bạn chưa sửa dữ liệu');
      return;
    }
    this.loadingService.setDisplay(true);
    this.partSaleDlrToTmvApi.savePart(obj).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertSerivce.openSuccessToast();
      this.search();
    });
  }

  removePart() {
    if (!this.selectedPartsNode) {
      this.swalAlertSerivce.openWarningToast('Cần chọn 1 phụ tùng');
    } else {
      if (!this.selectedPartsNode.data.id) {
        this.partsParams.api.updateRowData({remove: [this.selectedPartsNode.data]});
        return;
      }
      this.confirmService.openConfirmModal('Bạn có chắc muốn xóa bản ghi được chọn').subscribe(res => {
        this.partSaleDlrToTmvApi.deletePart(this.selectedPartsNode.data.id).subscribe(() => {
          this.swalAlertSerivce.openSuccessToast();
          this.search();
        });
      });
    }
  }

  agKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    const keyCode = event.key;
    const srcElement = event.target as HTMLInputElement;
    const KEY_ENTER = 'Enter';
    const KEY_UP = 'ArrowUp';
    const KEY_DOWN = 'ArrowDown';

    const displayedData = this.gridTableService.getAllData(this.partsParams);
    const isFocusCell = this.partsParams.api.getFocusedCell();

    // Press enter to search with modal
    if (srcElement.classList.contains('partsCode') && keyCode === KEY_ENTER) {
      this.searchPartInfo({partsCode: srcElement.innerHTML});
    }

    // Add new row with hot keys
    const focusCell = this.partsParams.api.getFocusedCell();
    if (keyCode === KEY_DOWN) {
      if (focusCell.rowIndex === this.focusCellIndex && focusCell.rowIndex === displayedData.length - 1) {
        this.addParts();
      }
      this.focusCellIndex = focusCell.rowIndex;
      const lastIndex = this.partsParams.api.getLastDisplayedRow();
      setTimeout(() => {
        this.partsParams.api.forEachNode((node) => {
          if (node.rowIndex === lastIndex) {
            node.setSelected(true);
          }
        });
      }, 100);
    }
    if (keyCode === KEY_UP) {
      this.focusCellIndex = focusCell.rowIndex;
    }
  }

  cancelPart() {
    this.swalAlertSerivce.openWarningToast('Bạn phải chọn phụ tùng hoặc mã phụ tùng bị sai');
    this.partsParams.api.setFocusedCell(this.selectedPartsNode.rowIndex, 'partsCode');
    this.partsParams.api.startEditingCell({
      rowIndex: this.selectedPartsNode.rowIndex,
      colKey: 'partsCode'
    });
  }

  setDataToRow(rowData) {
    this.loadingService.setDisplay(true);
    this.partSaleDlrToTmvApi.addPart(rowData).subscribe(res => {
        this.loadingService.setDisplay(false);
        this.swalAlertSerivce.openSuccessToast();
        this.search();
      }, () => this.gridTableService.setFocusCell(this.partsParams, this.fieldPartsList[0].field, null, this.gridTableService.getAllData(this.partsParams).length - 1)
    );
  }

  searchPartApiCall(val, paginationParams?) {
    return this.partSaleDlrToTmvApi.searchAllPartInStock({partsCode: val.partsCode}, paginationParams);
  }

  onBtnPartsRetailOrder() {
    this.eventBus.emit({
      type: 'openComponent',
      functionCode: TMSSTabs.dlrPartsRetail
    });
  }

  private searchPartInfo(val, paginationParams?) {
    if (val.partsCode) {
      this.loadingService.setDisplay(true);
      this.partSaleDlrToTmvApi.searchAllPartInStock({partsCode: val.partsCode}, paginationParams).subscribe(partsInfoData => {
        this.loadingService.setDisplay(false);
        if (partsInfoData.list.length === 1) {
          this.setDataToRow(partsInfoData.list[0]);
        } else {
          this.searchPartsModal.open(val, partsInfoData.list, partsInfoData.total);
        }
      });
    } else {
      this.searchPartsModal.open(val);
    }
  }

  print(event) {
    switch (event.type) {
      case 1:
        this.printOrderOverAll(event);
        break;
      case 2:
        this.printListAttachBill(event);
        break;
      case 3:
        this.printListDelivery(event);
        break;
      default:
        break;
    }
  }

  printOrderOverAll(data) {
    this.loadingService.setDisplay(true);
    this.serviceReportApi.printOrderOverAll(data).subscribe((res) => {
      if (res) {
        this.downloadService.downloadFile(res);
      }
      this.loadingService.setDisplay(false);
    });
  }

  printListAttachBill(data) {
    this.loadingService.setDisplay(true);
    this.serviceReportApi.printListAttachBill(data).subscribe((res) => {
      if (res) {
        this.downloadService.downloadFile(res);
      }
      this.loadingService.setDisplay(false);
    });
  }

  printListDelivery(data) {
    this.loadingService.setDisplay(true);
    this.serviceReportApi.printListDelivery(data).subscribe((res) => {
      if (res) {
        this.downloadService.downloadFile(res);
      }
      this.loadingService.setDisplay(false);
    });
  }

  replaceSpecial(val) {
    this.searchForm.get('partCode').setValue(val ? val.replace(/[^a-zA-Z0-9]/g, '') : val);
  }
}
