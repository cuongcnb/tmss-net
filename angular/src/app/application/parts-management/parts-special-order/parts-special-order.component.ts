import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {PartsOfSpecialOrder, PartsSpecialOrderModel} from '../../../core/models/parts-management/parts-special-order.model';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {PartsSpecialOrderApi} from '../../../api/parts-management/parts-special-order.api';
import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';
import {DealerModel} from '../../../core/models/sales/dealer.model';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {CurrentUserModel} from '../../../core/models/base.model';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {AgSelectRendererComponent} from '../../../shared/ag-select-renderer/ag-select-renderer.component';
import {CurrentUser} from '../../../home/home.component';
import {ValidateBeforeSearchService} from '../../../shared/common-service/validate-before-search.service';
import {AgCheckboxRendererComponent} from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-special-order',
  templateUrl: './parts-special-order.component.html',
  styleUrls: ['./parts-special-order.component.scss']
})
export class PartsSpecialOrderComponent implements OnInit {
  @ViewChild('createSpecialOrderModal', {static: false}) createSpecialOrderModal;
  @ViewChild('cellTableEditModal', {static: false}) cellTableEditModal;
  form: FormGroup;
  currentUser: CurrentUserModel;

  frameworkComponents;

  fieldGridSpecialOrder;
  orderParams;
  orderList: Array<PartsSpecialOrderModel>;
  selectedOrder: PartsSpecialOrderModel;

  fieldGridPartsOfOrder;
  partsOfOrderParams;
  partsOfOrderList: Array<PartsOfSpecialOrder>;

  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  dealerList: Array<DealerModel>;

  fieldGridExport;
  exportParams;
  partListForExport: Array<PartsSpecialOrderModel> = [];
  excelStyles;
  editingRowParams;
  orderStatusArr = [
    {key: '1', value: 'Đại lý mới gửi'},
    {key: '2', value: 'Từ chối'},
    {key: '3', value: 'Hoàn thành'}
  ];

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private partsSpecialOrderApi: PartsSpecialOrderApi,
    private dealerApi: DealerApi,
    private formStoringService: FormStoringService,
    private gridTableService: GridTableService,
    private validateBeforeSearchService: ValidateBeforeSearchService
  ) {
  }

  ngOnInit() {
    this.currentUser = CurrentUser;
    this.getDealerList();
    this.buildForm();
    this.fieldGridSpecialOrder = [
      {
        headerName: '',
        headerTooltip: '',
        field: 'checkForExport',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 20
      },
      {
        headerName: 'Mã ĐL', headerTooltip: 'Mã đại lý', field: 'dlrCode', width: 60,
        valueFormatter: params => this.dealerList.find(dealer => dealer.id === params.data.dlrId).code
      },
      {headerName: 'Số đơn hàng', headerTooltip: 'Số đơn hàng', field: 'orderNo', width: 120},
      {headerName: 'ĐL nhận', headerTooltip: 'ĐL nhận', field: 'receiveDlr', width: 100},
      {headerName: 'Đại lý Ghi chú', headerTooltip: 'Đại lý Ghi chú', field: 'dlrNote', width: 200},
      {
        headerName: 'TMV Ghi chú', headerTooltip: 'TMV Ghi chú', field: 'tmvNote', width: 100,
        cellClass: [-2, -1].includes(this.currentUser.dealerId) ? ['cell-border', 'tmvNote'] : ['cell-readonly', 'cell-border'],
        editable: [-2, -1].includes(this.currentUser.dealerId)
      },
      {
        headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'statusName', width: 80,
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          values: this.orderStatusArr.map(status => status.value)
        },
        editable: params => [-2, -1].includes(this.currentUser.dealerId) && params.data.status === '1',
        cellClass: [-2, -1].includes(this.currentUser.dealerId) ? ['cell-border', 'tmvNote'] : ['cell-readonly', 'cell-border']
      },
      {headerName: 'PTVC', headerTooltip: 'Phương thức vận chuyển', field: 'transportType', width: 100},
      {
        headerName: 'Ngày tạo', headerTooltip: 'Ngày tạo', field: 'createDate',
        cellClass: ['cell-readonly', 'cell-border'],
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      }
    ];
    this.fieldGridPartsOfOrder = [
      {
        headerName: 'STT', headerTooltip: 'Số thứ tự', field: 'stt', width: 25,
        cellRenderer: params => params.rowIndex + 1,
        cellClass: ['text-center', 'cell-readonly', 'cell-border']
      },
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode', width: 70},
      {
        headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
          return params.data && params.data.partsNameVn && !!params.data.partsNameVn
            ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
        }, width: 130
      },
      {headerName: 'ĐVT', headerTooltip: 'Đơn vị tính', field: 'unit', width: 40},
      {
        headerName: 'SL', headerTooltip: 'Số lượng', field: 'qty', width: 20,
        cellClass: ['text-right', 'cell-readonly', 'cell-border']
      },
      {
        headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'price', width: 60,
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'sumPrice', width: 75,
        cellClass: ['text-right', 'cell-readonly', 'cell-border'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thuế', headerTooltip: 'Thuế', field: 'rate', width: 30,
        cellClass: ['text-right', 'cell-readonly', 'cell-border']
      },
      {headerName: 'Tên xe', headerTooltip: 'Tên xe', field: 'car', width: 70},
      {field: 'modelCode', width: 100},
      {headerName: 'Số VIN', headerTooltip: 'Số VIN', field: 'vin', width: 100},
      {headerName: 'Mã CK', headerTooltip: 'Mã CK', field: 'keyCode', width: 40},
      {headerName: 'Số ghế', headerTooltip: 'Số ghế', field: 'seatNo', width: 30},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark', width: 70}
    ];
    this.fieldGridExport = [
      {
        headerName: 'STT', headerTooltip: 'Số thứ tự', field: 'stt', width: 40,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'Mã Đại lý', headerTooltip: 'Mã Đại lý', field: 'dlrcode', width: 80,
        cellClass: ['cellBorder', 'excelStringType', 'font-style']
      },
      {
        headerName: 'Số đơn hàng ĐB', headerTooltip: 'Số đơn hàng ĐB', field: 'orderno', width: 80,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'PNC', headerTooltip: 'PNC', field: 'pnc', width: 80,
        cellClass: ['cellBorder', 'excelStringType', 'font-style']
      },
      {
        headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode', width: 80,
        cellClass: ['cellBorder', 'excelStringType', 'font-style']
      },
      {
        headerName: 'Tên phụ tùng', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
          return params.data && params.data.partsNameVn && !!params.data.partsNameVn
            ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
        }, width: 120,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'Tên PT Tiếng Việt', headerTooltip: 'Tên PT Tiếng Việt', field: 'partsNameVn', width: 120,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'qty', width: 60,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'Đơn Giá', headerTooltip: 'Đơn Giá', field: 'price', width: 80,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'sumPrice', width: 80,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'FRC', headerTooltip: 'FRC', field: 'frcd', width: 40,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'Modelcode', headerTooltip: 'Modelcode', field: 'modelcode', width: 70,
        cellClass: ['cellBorder', 'excelStringType', 'font-style']
      },
      {
        headerName: 'Vinno', headerTooltip: 'Vinno', field: 'vin', width: 80,
        cellClass: ['cellBorder', 'excelStringType', 'font-style']
      },
      {
        headerName: 'Số chìa khóa', headerTooltip: 'Số chìa khóa', field: 'keycode', width: 80,
        cellClass: ['cellBorder', 'excelStringType', 'font-style']
      },
      {
        headerName: 'Số ghế', headerTooltip: 'Số ghế', field: 'seatno', width: 60,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'Nguồn nhập', headerTooltip: 'Nguồn nhập', field: 'partsSource', width: 70,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'Ngày đặt', headerTooltip: 'Ngày đặt', field: 'createDate', width: 80,
        cellClass: ['cellBorder', 'excelDateType', 'font-style']
      },
      {
        headerName: 'Ghi chú của DLR', headerTooltip: 'Ghi chú của DLR', field: 'remark', width: 100,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'Thời gian đợi TMV xử lý', headerTooltip: 'Thời gian đợi TMV xử lý', field: 'waittmvprocessdate', width: 120,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'statusName', width: 80,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'Thời gian xử lý', headerTooltip: 'Thời gian xử lý', field: 'processdate', width: 100,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'Ghi chú của TMV', headerTooltip: 'Ghi chú của TMV', field: 'remarkTmv', width: 100,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'Giờ đặt', headerTooltip: 'Giờ đặt', field: 'orderhour', width: 70,
        cellClass: ['cellBorder', 'font-style']
      },
      {
        headerName: 'Đại lý nhận', headerTooltip: 'Đại lý nhận', field: 'receivedlr', width: 70,
        cellClass: ['cellBorder', 'font-style']
      }
    ];
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent,
      agCheckboxRendererComponent: AgCheckboxRendererComponent
    };
    this.excelStyles = [{
      id: 'font-style',
      font: {
        size: 11,
        fontName: 'Times New Roman'
      }
    }];
  }

  getDealerList() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers().subscribe(dealerList => {
      this.loadingService.setDisplay(false);
      this.dealerList = dealerList;
    });
  }

  // ====**** ORDER GRID ****====
  callBackGridSpecialOrder(params) {
    this.orderParams = params;
    // this.searchOrder();
  }

  getParamsSpecialOrder() {
    const partListForExport = this.orderParams.api.getSelectedRows();
    this.partListForExport = [];
    if (partListForExport && partListForExport.length > 0) {
      partListForExport.forEach(it => this.partListForExport.push(it));
      this.getCellData();
    }
  }

  cellDoubleClicked(params) {
    const col = params.colDef.field;
    if ([-2, -1].includes(this.currentUser.dealerId) && col === 'statusName') {
      this.getPartsOfOrder(params.data.id);
    }
    if (![-2, -1].includes(this.currentUser.dealerId) && col !== 'statusName') {
      this.updateOrder();
    }
  }

  // EDITING DATA
  cellEditingStarted(params) {
    this.editingRowParams = params;
  }

  cellValueChanged(params) {
    const field = params.colDef.field;
    if (field === 'statusName') {
      if (params.column.editingStartedValue === params.data.statusName) {
        return;
      }
      params.data.status = this.orderStatusArr.find(status => status.value === params.data.statusName).key;
      params.api.refreshCells();
      this.tmvUpdateData(params.data);
    }

    // if (field === 'checkForExport') {
    //   if (params.data[field]) {
    //     this.partListForExport.push(params.data);
    //   } else if (this.partListForExport.length) {
    //     remove(this.partListForExport, params.data);
    //   }
    // }
  }

  agKeyUp(event: KeyboardEvent) {
    const keyCode = event.key;
    const srcElement = event.target as HTMLInputElement;

    if (srcElement.classList.contains('tmvNote') && keyCode === 'Enter') {
      if (this.editingRowParams) {
        this.tmvUpdateData(this.editingRowParams.data);
        this.editingRowParams = null;
      }
    }

    if (keyCode === 'ArrowDown' || keyCode === 'ArrowUp') {
      this.getCellData();
    }
  }

  onCellClicked(event) {
    this.getCellData();
  }

  getCellData() {
    const focusCell = this.orderParams.api.getFocusedCell();
    if (focusCell) {
      this.selectedOrder = this.orderParams.api.getRowNode(focusCell.rowIndex).data;
      this.getPartsOfOrder();
    }
  }

  tmvUpdateData(data) {
    const orderData = Object.assign({}, {
      order: data,
      parts: this.partsOfOrderList
    });
    this.loadingService.setDisplay(true);
    this.partsSpecialOrderApi.updateOrder(orderData).subscribe(() => {
      this.swalAlertService.openSuccessToast();
      this.searchOrder();
      this.loadingService.setDisplay(false);
    });
  }

  updateOrder() {
    if (!this.selectedOrder) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn đơn hàng, hãy chọn một đơn hàng để sửa');
      return;
    }
    if (this.disableUpdateBtn) {
      this.swalAlertService.openWarningToast('Đơn hàng đã được xử lý, không thể cập nhật');
      return;
    }
    this.createSpecialOrderModal.open(this.selectedOrder, this.partsOfOrderList);
  }

  // SEARCH
  searchOrder(updateOrder?) {
    if (!this.validateBeforeSearchService.validSearchDateRange(this.form.value.fromDate, this.form.value.toDate)) {
      return;
    }
    const formValue = this.validateBeforeSearchService.setBlankFieldsToNull(this.form.value);
    this.loadingService.setDisplay(true);
    this.partsSpecialOrderApi.searchSpecialOrder(formValue).subscribe(orderList => {
      this.partListForExport = [];
      this.loadingService.setDisplay(false);
      this.orderList = orderList;
      this.orderParams.api.setRowData(this.orderList);
      this.partListForExport = [];
      if (!this.orderList.length) {
        this.partsOfOrderList = [];
        this.partsOfOrderParams.api.setRowData(this.partsOfOrderList);
        this.calculateFooterDetail();
      }
    });
    setTimeout(() => {
      this.orderParams.api.sizeColumnsToFit(this.orderParams);
      if (this.orderList.length > 0) {
        this.gridTableService.selectFirstRow(this.orderParams);
        this.gridTableService.setFocusCellDontEdit(this.orderParams, this.fieldGridSpecialOrder[0].field, 0);
      }
    }, 50);
  }

  refreshAfterEdit(updatedValue) {
    // const year = new Date().getFullYear();
    // const month = new Date().getMonth();
    // const date = new Date().getDate();
    // this.form.patchValue({
    //   orderNo: updatedValue.speordNo,
    //   partsCode: undefined,
    //   fromDate: new Date(year, month, 1).getTime(),
    //   dlrCode: !this.currentUser.isAdmin ? this.currentUser.dealerId : undefined,
    //   status: 4,
    //   toDate: new Date(year, month, date, 23, 59, 59).getTime(),
    // });
    !this.selectedOrder || updatedValue.id !== this.selectedOrder.id
      ? this.searchOrder() : this.searchOrder(true);
  }

  // EXPORT
  exportExcel() {
    if (this.partListForExport.length === 0) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn đơn hàng, hãy chọn ít nhất một đơn hàng để xuất dữ liệu', 'Cảnh báo');
      return;
    }
    const fileName = this.gridTableService.generateExportFileName('DatHangDacBiet', StorageKeys.specialOrderExportTimes);
    const idArr = [];
    this.partListForExport.forEach(data => {
      idArr.push(data.id);
    });
    this.loadingService.setDisplay(true);
    this.partsSpecialOrderApi.export(idArr).subscribe(res => {
      if (res && Array.isArray(res)) {
        res.forEach((val, index) => val.stt = index + 1);
      }
      this.exportParams.api.setRowData(res ? res : []);
      this.gridTableService.export(this.exportParams, fileName);
      this.loadingService.setDisplay(false);
    });
  }

  // ====**** PART OF ORDER GRID ****====
  callBackGridPartsOfOrder(params) {
    this.partsOfOrderParams = params;
  }

  getParamsPartsOfOrder() {
  }

  getPartsOfOrder(id?) {
    if (id == null && this.selectedOrder) {
      id = this.selectedOrder.id;
    }
    if (id != null) {
      this.loadingService.setDisplay(true);
      this.partsSpecialOrderApi.getPartsOfOrder(id).subscribe(partsOfOrderList => {
        this.loadingService.setDisplay(false);
        this.partsOfOrderList = partsOfOrderList.parts;
        this.partsOfOrderParams.api.setRowData(this.partsOfOrderList);

        setTimeout(() => {
          this.partsOfOrderParams.api.sizeColumnsToFit(this.partsOfOrderParams);
        }, 50);
        this.calculateFooterDetail();
      });
    }
  }

  calculateFooterDetail() {
    const footerDetail = this.gridTableService.calculateFooterDetail(this.partsOfOrderList);
    this.totalPriceBeforeTax = footerDetail.totalPriceBeforeTax;
    this.taxOnly = footerDetail.taxOnly;
    this.totalPriceIncludeTax = footerDetail.totalPriceIncludeTax;
  }

  get disableUpdateBtn() {
    return !this.selectedOrder || (this.selectedOrder && this.selectedOrder.status !== '1');
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      orderNo: [undefined],
      partsCode: [undefined],
      fromDate: [new Date(year, month, 1).getTime()],
      dlrId: [![-2, -1].includes(this.currentUser.dealerId) ? this.currentUser.dealerId : undefined],
      status: 4,
      toDate: [new Date(year, month, date, 23, 59, 59).getTime()]
    });
  }

  deleteCharacterSpecial(val) {
    if (val) {
      this.form.get('partsCode').setValue(val.replace(/[^a-zA-Z0-9]/g, ''));
    }
  }
}
