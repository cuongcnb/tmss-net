import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

import {SetModalHeightService} from '../../../../../shared/common-service/set-modal-height.service';
import {PartsInfoManagementApi} from '../../../../../api/parts-management/parts-info-management.api';
import {DataFormatService} from '../../../../../shared/common-service/data-format.service';
import {ToastService} from '../../../../../shared/swal-alert/toast.service';
import {GridTableService} from '../../../../../shared/common-service/grid-table.service';
import {CommonService} from '../../../../../shared/common-service/common.service';
import {AgCheckboxRendererComponent} from '../../../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import {AppoinmentApi} from '../../../../../api/appoinment/appoinment.api';
import {LoadingService} from '../../../../../shared/loading/loading.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-booking-detail',
  templateUrl: './part-booking-detail.component.html',
  styleUrls: ['./part-booking-detail.component.scss']
})
export class PartBookingDetailComponent implements OnInit {
  @Output() accessoryRequired = new EventEmitter();
  @Output() closeup = new EventEmitter();
  @Input() form;
  @ViewChild('searchDataGridModal', {static: false}) searchDataGridModal;
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight: number;
  fieldGrid;
  fieldGridSearchDataGrid;
  params;
  selectedPartNode;
  displayedData: Array<any> = [];
  @Output() saveParts = new EventEmitter<any>();
  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;
  partsList;
  frameworkComponents;
  focusCellIndex = 0;

  constructor(private setModalHeightService: SetModalHeightService,
              private partsInfoManagementApi: PartsInfoManagementApi,
              private gridTableService: GridTableService,
              private dataFormatService: DataFormatService,
              private swalAlertService: ToastService,
              private appoinmentApi: AppoinmentApi,
              private loading: LoadingService,
              private commonSerivce: CommonService) {
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent
    };
    this.fieldGridSearchDataGrid = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode'},
      {
        headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
          return params.data && params.data.partsNameVn && !!params.data.partsNameVn
            ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
        }
      },
      {
        headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'sellPrice',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {headerName: 'Đơn vị', headerTooltip: 'Đơn vị', field: 'unit'},
      {headerName: 'SL Tồn', headerTooltip: 'Số lượng Tồn', field: 'onHandQty'},
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'rate'}
    ];

    this.fieldGrid = [
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        editable: true,
        cellClass: ['cell-clickable', 'cell-border', 'partsCode'],
        width: 90
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
          return params.data && params.data.partsNameVn && !!params.data.partsNameVn
            ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
        }
      },
      {
        headerName: 'SL',
        headerTooltip: 'Số lượng',
        width: 60,
        field: 'qty',
        editable: true,
        validators: ['floatNumber'],
        cellClass: ['cell-clickable', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'SL Tồn',
        headerTooltip: 'Số lượng tồn',
        field: 'onHandQty',
        width: 50,
        cellClass: ['text-right']
      },
      {
        headerName: 'TT',
        headerTooltip: 'TT',
        field: 'pstate',
        data: ['Y', 'N'],
        width: 40,
        cellRenderer: 'agCheckboxRendererComponent'
        // checkboxSelection: true,
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        width: 70,
        cellClass: ['text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit',
        width: 50
      },
      {
        headerName: 'Thuế(%)',
        headerTooltip: 'Thuế(%)',
        field: 'rate',
        width: 60,
        cellClass: ['text-right']
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'sumPrice',
        width: 80,
        cellClass: ['cell-border', 'text-right'],
        valueGetter: params => params.data ? params.data.price * params.data.qty : 0,
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Số DH',
        headerTooltip: 'Số đơn hàng',
        field: 'orderNo',
        width: 120
      },
      {
        headerName: 'Ngày đặt hàng',
        headerTooltip: 'Ngày đặt hàng',
        field: 'orderDate',
        width: 100,
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'Ngày về dự kiến',
        headerTooltip: 'Ngày về dự kiến',
        field: 'estLeadTime',
        width: 110,
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'remark',
        width: 80,
        editable: true
      }
    ];
  }

  ngOnInit() {
    this.onResize();
  }

  open(partsList) {
    this.partsList = partsList;
    this.modal.show();
  }

  reset() {
    this.partsList = undefined;
  }

  moneyFormat(val) {
    return this.dataFormatService.moneyFormat(val);
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  callbackGrid(params) {
    this.params = params;
    if (this.partsList) {
      this.getPartDetails();
      // this.getOne();
      this.calculateTotal();
    }
  }

  getParams() {
    const selectedPartNode = this.params.api.getSelectedNodes();
    if (selectedPartNode) {
      this.selectedPartNode = selectedPartNode[0];
    }
  }

  cellEditingStarted() {
  }

  cellDoubleClicked(params) {
    const col = params.colDef.field;
    if (col === 'partsCode') {
      this.searchDataGridModal.open({partsCode: params.value, status: 'Y'});
    }
  }

  cellEditingStopped(params) {
    const col = params.colDef.field;
    if (col === 'qty') {
      params.data.sumPrice = Number(params.data.qty) * Number(params.data.price);
      this.calculateTotal();
      params.api.refreshCells();
      // if (!params.data.onHandQty || params.data.onHandQty < params.data.qty) {
      //   this.swalAlertService.openWarningToast('Số lượng phụ tùng đã đặt lớn hơn tồn kho');
      // }
    }
    switch (col) {
      case 'partsCode':
        if (!params.value || !params.value) {
          return;
        }
        this.params.api.forEachNode(rowNode => {
          if (params.rowIndex === rowNode.rowIndex && params.value) {
            rowNode.setDataValue('partsCode', params.value.replace(/[^a-zA-Z0-9]/g, ''));
          }
        });
        this.searchPartInfo({partsCode: params.value.replace(/[^a-zA-Z0-9]/g, '')});
        break;
    }
  }

  searchPartApiCall(val, paginationParams?) {
    return this.partsInfoManagementApi.searchPartForQuotation({
      partsCode: val.partsCode,
      status: 'Y'
    }, paginationParams);
  }


  setDataToRow(rowData) {
    const oldData = this.selectedPartNode && this.selectedPartNode.data.partsId
      ? this.gridTableService.getAllData(this.params).filter(data => data.partsId !== this.selectedPartNode.data.partsId)
      : this.gridTableService.getAllData(this.params);
    const matchData = oldData.find(data => data.partsId === rowData.id);
    if (matchData) {
      this.swalAlertService.openWarningToast('Phụ tùng đã tồn tại');
      this.selectedPartNode.setData({});
      this.gridTableService.setFocusCell(this.params, this.fieldGrid[0].field, this.focusCellIndex);
    } else {
      const val = Object.assign(rowData, {
        stt: this.selectedPartNode.rowIndex + 1,
        id: null,
        partsId: rowData.id,
        qty: 1,
        price: rowData.sellPrice
      });
      this.selectedPartNode.setData(val);
      // if (!val.onHandQty || val.onHandQty < val.qty) {
      //   this.swalAlertService.openWarningToast('Số lượng phụ tùng đã đặt lớn hơn tồn kho');
      // }
      this.focusCellIndex = Number(this.selectedPartNode.childIndex);
      this.gridTableService.setFocusCellDontEdit(this.params, this.fieldGrid[0].field, Number(this.selectedPartNode.childIndex));

      setTimeout(() => {
        this.gridTableService.setDataToRow(this.params, Number(this.selectedPartNode.childIndex), val, this.gridTableService.getAllData(this.params), 'qty');
      }, 50);
      this.calculateTotal();
    }
  }

  onAddRow() {
    const lastIndex = this.params.api.getLastDisplayedRow();
    if (lastIndex >= 0) {
      const lastItem = this.params.api.getDisplayedRowAtIndex(lastIndex).data;
      if (!lastItem.partsCode) {
        this.swalAlertService.openWarningToast('Kiểm tra lại Mã PT');
        return;
      }
    }
    const blankPart = {
      partsCode: '',
      partsName: '',
      unit: '',
      qty: '',
      part: '',
      sumPrice: '',
      rate: '',
      expectDlrDate: '',
      remark: '',
      promiseTmvDate: '',
      qtyTmv: '',
      partsId: '',
      prePlanDId: '',
      prePlanId: '',
      unitId: '',
      pstate: ''
    };
    this.params.api.updateRowData({add: [blankPart]});
    this.gridTableService.setFocusCellDontEdit(this.params, this.fieldGrid[0].field, lastIndex + 1);
    this.params.api.getModel().rowsToDisplay[lastIndex + 1].setSelected(true);
    // setTimeout(() => {
    //   this.params.api.startEditingCell({
    //     rowIndex: lastIndex + 1,
    //     colKey: 'partsCode'
    //   });
    // }, 50);
    setTimeout(() => {
      this.gridTableService.setDataToRow(
        this.params,
        this.gridTableService.getAllData(this.params).length - 1, blankPart, this.gridTableService.getAllData(this.params),
        'partsCode');
    }, 50);
  }

  deleteRow() {
    if (!this.selectedPartNode) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn phụ tùng, Hãy chọn một phụ tùng để xóa');
      return;
    }
    if (this.selectedPartNode.data.orderNo) {
      this.swalAlertService.openWarningToast('Phụ tùng hẹn đã được đặt hàng, không thể xóa');
      return;
    }
    this.gridTableService.removeSelectedRow(this.params, this.selectedPartNode.data);
    this.selectedPartNode = undefined;
    this.calculateTotal();
  }

  calculateTotal() {
    const displayedData = this.gridTableService.getAllData(this.params).filter(it => it.partsCode && it.partsId);
    this.totalPriceBeforeTax = this.commonSerivce.sumObjectByMultipleField(displayedData, ['price', 'qty']);
    this.taxOnly = this.commonSerivce.sumObjectByMultipleField(displayedData, ['price', 'qty', 'rate']) / 100;
    this.totalPriceIncludeTax = Number(this.totalPriceBeforeTax) + Number(this.taxOnly);
  }

  requestParts() {
    this.params.api.forEachNode(node => {
      node.setDataValue('pstate', 'Y');
    });
  }

  close() {
    this.saveParts.emit(this.gridTableService.getAllData(this.params).map(item => ({quotationPart: item})));
    this.modal.hide();
    this.closeup.emit(this.totalPriceIncludeTax ? this.totalPriceIncludeTax : 0);
  }

  agKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    const keyCode = event.key;
    const srcElement = event.target as HTMLInputElement;
    const KEY_ENTER = 'Enter';
    const KEY_UP = 'ArrowUp';
    const KEY_DOWN = 'ArrowDown';
    const displayedData = this.gridTableService.getAllData(this.params);

    if (srcElement.classList.contains('partsCode') && keyCode === KEY_ENTER && !srcElement.innerText) {
      this.searchPartInfo({partsCode: srcElement.innerText.replace(/[^a-zA-Z0-9]/g, '')});
    }
    // Press enter to search with modal
    // Add new row with hot keys
    const focusCell = this.params.api.getFocusedCell();
    if (keyCode === KEY_DOWN) {
      if (focusCell.rowIndex === this.focusCellIndex && focusCell.rowIndex === displayedData.length - 1) {
        this.onAddRow();
      }
      this.focusCellIndex = focusCell.rowIndex;
    }
    if (keyCode === KEY_UP) {
      this.focusCellIndex = focusCell.rowIndex;
    }
  }

  getOne() {
    if (!this.form.value.appoinmentId) {
      return;
    }
    this.appoinmentApi.findOne(this.form.value.appoinmentId).subscribe(appointment => {
      this.params.api.setRowData(appointment.partList.map((item: { part: any, quotationPart: any }) =>
        Object.assign({}, item.part, item.quotationPart, {price: item.quotationPart ? item.quotationPart.sellPrice : null})));
      this.calculateTotal();
    });
  }

  getPartDetails() {
    if (this.form.getRawValue().appoinmentId && this.partsList.length) {
      this.loading.setDisplay(true);
      this.partsInfoManagementApi.partInfoOfAppoinment(this.form.getRawValue().appoinmentId).subscribe(res => {
        let parts = [];
        for (let i = 0; i < this.partsList.length; i++) {
          parts = parts.concat(Object.assign({}, this.partsList[i] ? this.partsList[i] : {}, {
            orderDate: res[i] ? res[i].orderDate : null,
            orderNo: res[i] ? res[i].orderNo : null,
            estLeadTime: res[i] ? res[i].estLeadTime : null,
            onHandQty: res[i] ? res[i].onHandQty : 0,
            unit: res[i] ? res[i].unitName : null
          }));
        }
        setTimeout(() => {
          this.params.api.setRowData(parts);
          this.loading.setDisplay(false);
          this.calculateTotal();
        }, 100);
      });
    } else {
      this.params.api.setRowData(this.partsList);
      this.calculateTotal();
    }
  }

  onHandWhenNotBooking() {
    const arr = [];
    const data = this.gridTableService.getAllData(this.params);
    data.forEach(it => arr.push(it.partsCode));
    this.partsInfoManagementApi.onHandWhenNotBooking(arr).subscribe(res => {
      let parts = [];
      for (let i = 0; i < data.length; i++) {
        parts = parts.concat(Object.assign({}, data[i] ? data[i] : {}, {
          onHandQty: res[i] ? res[i].onHandQty : 0,
          unit: res[i] ? res[i].unitName : null
        }));
      }
      setTimeout(() => {
        this.params.api.setRowData(parts);
        this.loading.setDisplay(false);
        this.calculateTotal();
      }, 100);
    });
  }

  private searchPartInfo(val, paginationParams?) {
    if (val.partsCode) {
      this.loading.setDisplay(true);
      this.partsInfoManagementApi.searchPartForQuotation({
        partsCode: val.partsCode,
        reqId: null
      }, paginationParams).subscribe(partsInfoData => {
        this.loading.setDisplay(false);
        if (partsInfoData.list.length === 1) {
          this.setDataToRow(partsInfoData.list[0]);
        } else {
          this.searchDataGridModal.open(val, partsInfoData.list, partsInfoData.total);
        }
      });
    } else {
      this.searchDataGridModal.open(val);
    }
  }
}
