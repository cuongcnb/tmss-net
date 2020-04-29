import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {ToastService} from '../../../../../shared/swal-alert/toast.service';
import {LoadingService} from '../../../../../shared/loading/loading.service';
import {DataFormatService} from '../../../../../shared/common-service/data-format.service';
import {PartsInfoManagementApi} from '../../../../../api/parts-management/parts-info-management.api';
import {AgSelectRendererComponent} from '../../../../../shared/ag-select-renderer/ag-select-renderer.component';
import {GridTableService} from '../../../../../shared/common-service/grid-table.service';
import {state} from '../../../../../core/constains/ro-state';
import {ConfirmService} from '../../../../../shared/confirmation/confirm.service';
import {AgCheckboxRendererComponent} from '../../../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'accessory-proposal',
  templateUrl: './accessory-proposal.component.html',
  styleUrls: ['./accessory-proposal.component.scss']
})
export class AccessoryProposalComponent implements OnInit, OnChanges {
  @Output() countMoney = new EventEmitter();
  @Input() proposalForm: FormGroup;
  @Input() isRefresh;
  @Input() state;
  @Input() roId;

  @ViewChild('discountModal', {static: false}) discountModal;
  @ViewChild('searchPartsModal', {static: false}) searchPartsModal;
  @ViewChild('gridTable', {static: false}) gridTable;
  @Input() data: Array<any>;
  disabledBtnAdd = [state.settlement, state.cancel];
  newVal = {
    partsCode: null,
    partsNameVn: null,
    unit: null,
    sellPrice: null,
    stock: null,
    onhandQty: null,
    qty: null,
    received: null,
    amount: null,
    taxRate: 10,
    discount: 0,
    discountPercent: 0,
    status: '0',
    notes: null,
    version: this.proposalForm ? (this.proposalForm.getRawValue().quotationprint || 0) + 1 : 1,
    readjust: null
  };
  stateQuotation = Number(state.quotation);
  readjust;
  form: FormGroup;
  gridField;
  selectedNode;
  params;
  beforeTax: number;
  discount: number;
  total: number;
  parts: Array<any>[] = [];
  gridHeight = '250px';
  footerData;
  fieldPartsSearch;
  frameworkComponents;
  focusCellIndex = 0;
  disableRemovePart = false;
  doubleClickParams;
  isCollapsed;

  constructor(private loadingService: LoadingService,
              private dataFormatService: DataFormatService,
              private swalAlertService: ToastService,
              private confirmService: ConfirmService,
              private gridTableService: GridTableService,
              private partsInfoManagementApi: PartsInfoManagementApi,
              private cdr: ChangeDetectorRef) {
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent,
      agCheckboxRendererComponent: AgCheckboxRendererComponent
    };
    this.footerData = [{
      partsCode: 'Tổng',
      amount: 0,
      taxRate: 0,
      discount: 0,
      notes: 0
    }];
    this.fieldPartsSearch = [
      {
        headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode',
        width: 90
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsNameVn'
      },
      {
        headerName: 'PNC',
        headerTooltip: 'PNC',
        field: 'pnc',
        width: 50
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
        field: 'sellPrice',
        width: 80,
        cellClass: ['cell-readonly', 'cell-border', ' text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Tồn',
        headerTooltip: 'Tồn',
        field: 'onHandQty',
        width: 50
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
        width: 50
      }
    ];
    this.gridField = [
      {
        headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode',
        width: 100,
        cellClass: ['cell-border', 'partsCode']
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsNameVn'
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
        field: 'sellPrice',
        width: 80,
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['cell-border', 'cell-readonly']
      },
      {
        headerName: 'SL Tồn',
        headerTooltip: 'Số lượng Tồn',
        field: 'onhandQty',
        width: 60
      },
      {
        headerName: 'SL Cần',
        headerTooltip: 'Số lượng Cần',
        field: 'qty',
        width: 60,
        cellClass: ['cell-border'],
        validators: ['number'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'SL Nhận',
        headerTooltip: 'Số lượng Nhận',
        field: 'received',
        width: 70,
        cellClass: ['cell-border', 'cell-readonly']
      },
      {
        headerName: 'SL BO',
        headerTooltip: 'Số lượng BO',
        field: 'qtyBackOrder',
        width: 70,
        cellClass: ['cell-border', 'cell-readonly'],
        cellRenderer: params => {
          const data = ((params.data.qty || 0) - (params.data.onHandQty || 0));
          return data > 0 ? data : 0;
        }
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'amount',
        width: 80,
        cellClass: ['cell-border', 'text-right', 'cell-readonly'],
        cellRenderer: params => this.dataFormatService.moneyFormat(params.data.sellPrice * params.data.qty),
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'taxRate',
        width: 50,
        cellClass: ['cell-border', 'p-0'],
        cellRenderer: 'agSelectRendererComponent',
        list: [{key: 10, value: 10}, {key: 5, value: 5}, {key: 0, value: 0}]
      },
      {
        headerName: '% giảm',
        headerTooltip: '% giảm',
        width: 60,
        field: 'discountPercent',
        validators: ['number'],
        cellClass: ['text-right', 'cell-border']
      },
      {
        headerName: 'Giá giảm',
        headerTooltip: 'Giá giảm',
        field: 'discount',
        width: 80,
        validators: ['number'],
        cellClass: ['text-right', 'cell-border'],
        tooltip: params => this.dataFormatService.moneyFormat((params.value) ? params.value : 0),
        valueFormatter: params => this.dataFormatService.moneyFormat((params.value) ? params.value : 0)
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'notes',
        width: 100
      },
      {
        headerName: 'Ver',
        headerTooltip: 'Ver',
        field: 'quotationprintVersion',
        width: 40
      },
      {
        headerName: 'Sửa lại',
        headerTooltip: 'Sửa lại',
        field: 'readjust',
        width: 50,
        cellClass: ['text-center', 'cell-border'],
        cellRenderer: params => `<input disabled type="checkbox" ${params.data.readjust === true ? 'checked' : ''}/>`
      }
    ];

  }

  ngOnChanges(): void {
    if (this.isRefresh && this.params) {
      this.params.api.setRowData([]);
    }
    if (this.params && this.data) {
      this.selectedNode = undefined;
      this.params.api.setRowData(this.data);
      this.calculateTotal();
    }
    if (this.params && (!this.data || this.data.length < 1)) {
      this.params.api.updateRowData({add: [this.newVal]});
    }
  }

  searchPartApiCall(val, paginationParams?) {
    return this.partsInfoManagementApi.searchPartForQuotation({
      partsCode: val.partsCode,
      reqId: this.roId ? this.roId : null
    }, paginationParams);
  }

  cellValueChanged(params) {
    const col = params.colDef.field;
    if (col === 'taxRate') {
      this.calculateTotal();
    }

    if (params.column.colId === 'qty') {
      this.params.api.forEachNode(rowNode => {
        if (params.rowIndex === rowNode.rowIndex) {
          rowNode.setDataValue('amount', (Number(params.data.qty) * params.data.sellPrice).toFixed(2));
          rowNode.setDataValue('qtyBackOrder', (Number(params.data.qty) - params.data.onHandQty));
          rowNode.setDataValue('discount', (Number(params.data.qty) * params.data.sellPrice * Number(params.data.discountPercent || 0) / 100)
            .toFixed(2));
        }
      });
    }
  }

  tabToNextCell(params) {
    if (params.previousCellDef && params.nextCellDef && params.previousCellDef.column.colId === 'discount' && params.nextCellDef.column.colId === 'discountPercent') {
      const data = this.params.api.getModel().rowsToDisplay[params.nextCellDef.rowIndex].data;
      if (data.discount) {
        data.discountPercent = (Number(data.discount) / Number(data.sellPrice * data.qty) * 100).toFixed(2);
        this.params.api.getRowNode(params.nextCellDef.rowIndex).setData(data);
      }
    }
    if (params.previousCellDef && params.nextCellDef && params.nextCellDef.column.colId === 'discount' && params.previousCellDef.column.colId === 'discountPercent') {
      const data = this.params.api.getModel().rowsToDisplay[params.previousCellDef.rowIndex].data;
      if (data.discountPercent) {
        data.discount = Number(data.discountPercent) * Number(data.sellPrice * data.qty) / 100;
        this.params.api.getRowNode(params.nextCellDef.rowIndex).setData(data);
      }
    }
    return params.nextCellDef;
  }

  cellDoubleClicked(params) {
    const col = params.colDef.field;
    if (this.state && this.state.toString() !== '1' && this.selectedNode && this.selectedNode.data.quotationprintVersion && col === 'partsCode') {
      return;
    }
    if (col === 'partsCode') {
      this.searchPartInfo({partsCode: params.value});
    }

    if (col === 'discountPercent') {
      this.discountModal.open(params.data.discountPercent);
    }

    this.doubleClickParams = params;
  }

  patchDiscount(data) {
    if (data.forAll) {
      this.params.api.forEachNode(rowNode => {
        rowNode.setDataValue('discountPercent', Number(data.discountPercent));
        rowNode.setDataValue('discount', Number(data.discountPercent * rowNode.data.sellPrice * rowNode.data.qty / 100));
        this.calculateTotal();
      });
    } else {
      this.selectedNode.setDataValue('discountPercent', Number(data.discountPercent));
      this.selectedNode.setDataValue('discount', Number(data.discountPercent * this.doubleClickParams.data.qty * this.doubleClickParams.data.sellPrice / 100));
      this.calculateTotal();
    }
  }

  cellEditingStarted(params) {
  }

  cellEditingStopped(params) {
    const col = params.colDef.field;
    const data = params.data;
    switch (col) {
      case 'discountPercent':
        if (Number(data.discountPercent) > 100 || Number(data.discountPercent) < 0) {
          this.swalAlertService.openWarningToast('Phần trăm phải trong khoảng 1 - 100', 'Số không hợp lệ');
          this.gridTable.focusAfterEdit(params);
          break;
        }
        if (params.column.editingStartedValue !== params.value) {
          params.data.discount = (Number(params.data.sellPrice * params.data.qty) || 0) * (Number(params.data.discountPercent) || 0) / 100;
          params.data.discountPercent = (Number(params.data.discountPercent) || 0);
        }
        break;
      case 'discount':
        if ((Number(data.discount) > Number(data.sellPrice * data.qty) || Number(data.sellPrice * data.qty) < 0 || Number(data.discount < 0)) && Number(data.qty) >= 0) {
          this.swalAlertService.openWarningToast('Khi SL Cần lớn hơn 0. Nhập số TIỀN GIẢM không thể lớn hơn THÀNH TIỀN hoặc nhỏ hơn 0', 'Số không hợp lệ');
          this.gridTable.focusAfterEdit(params);
          break;
        }
        if ((Number(data.discount) < Number(data.sellPrice * data.qty) || Number(data.sellPrice * data.qty) > 0 || Number(data.discount) > 0) && Number(data.qty) < 0) {
          this.swalAlertService.openWarningToast('Khi SL Cần nhỏ hơn 0. Nhập số TIỀN GIẢM không thể nhỏ hơn THÀNH TIỀN hoặc lớn hơn 0', 'Số không hợp lệ');
          this.gridTable.focusAfterEdit(params);
          break;
        }
        if (params.column.editingStartedValue !== params.value) {
          params.data.discountPercent = (Number(params.data.discount) !== 0)
            ? (parseFloat(params.data.discount) / ((Number(params.data.sellPrice * params.data.qty)) || 1) * 100).toFixed(2)
            : 0;
        }
        break;
    }
    params.node.setData(data);
    this.calculateTotal();
  }

  setDataToRow(rowData) {
    this.loadingService.setDisplay(true);
    this.partsInfoManagementApi.getPartInfo4Quotation([rowData.id], this.roId ? this.roId : null).subscribe(res => {
      this.loadingService.setDisplay(false);
      if (res && res.length) {
        Object.assign(rowData, res);
        const oldData = this.selectedNode && this.selectedNode.data.partsId
          ? this.gridTableService.getAllData(this.params).filter(data => data.partsId !== this.selectedNode.data.partsId)
          : this.gridTableService.getAllData(this.params);
        const matchData = oldData.find(data => data.partsId === rowData.id);
        if (matchData && (['', '1'].includes(this.state) || this.state === null)) {
          this.swalAlertService.openWarningToast('Phụ tùng đã tồn tại');
        } else {
          const val = Object.assign(rowData, {
            stt: this.selectedNode ? this.selectedNode.rowIndex + 1 : 0,
            partsId: rowData.id,
            id: null,
            qty: 1,
            onhandQty: rowData.onHandQty,
            received: 0,
            taxRate: rowData.rate,
            amount: rowData.sellPrice,
            version: (this.proposalForm.getRawValue().quotationprint || 0) + 1,
            readjust: true
          });
          this.selectedNode.setData(val);
          if (!rowData.discountPercent) {
            this.selectedNode.setDataValue('discountPercent', 0);
          }
          this.calculateTotal();
        }
      }
    });
  }

  calculateTotal() {
    if (this.params) {
      let amount = 0;
      let discount = 0;
      let taxRate = 0;

      this.parts = [];
      this.params.api.forEachNode(node => {
        this.parts.push(node.data);
        amount += this.dataFormatService.parseMoneyToValue(node.data.sellPrice * node.data.qty);
        discount += node.data.discount ? this.dataFormatService.parseMoneyToValue(node.data.discount) : 0;
        taxRate += (Number(node.data.sellPrice) * Number(node.data.qty) - Number(node.data.discount ? node.data.discount : 0)) * Number(node.data.taxRate) / 100;
      });
      this.footerData = {
        beforeTax: amount,
        discount,
        taxRate,
        total: amount - discount + taxRate
      };
      this.countMoney.emit(this.footerData);
      const data = this.gridTableService.getAllData(this.params).map(it => {
        // return Object.assign({}, it, {id: null, readjust: it.readjust ? 'Y' : 'N'})
        it.id = null;
        return it;
      });
      this.proposalForm.get('partList').setValue(data);
    }
  }

  addParts() {
    const lastIndex = this.params.api.getLastDisplayedRow();
    if (lastIndex >= 0) {
      const lastItem = this.params.api.getDisplayedRowAtIndex(lastIndex).data;
      if (!lastItem.partsCode) {
        this.swalAlertService.openWarningToast('Kiểm tra lại Mã PT');
        return;
      }
      if (!lastItem.sellPrice) {
        this.swalAlertService.openWarningToast('Bạn phải chọn phụ tùng trong danh sách');
        return;
      }
    }
    const newVal = {
      partsCode: null,
      partsNameVn: null,
      unit: null,
      sellPrice: null,
      stock: null,
      onhandQty: null,
      qty: null,
      received: null,
      amount: null,
      taxRate: 10,
      discount: 0,
      discountPercent: 0,
      status: '0',
      notes: null,
      version: this.proposalForm ? (this.proposalForm.getRawValue().quotationprint || 0) + 1 : 1,
      readjust: null
    };
    this.params.api.updateRowData({add: [newVal]});
    this.params.api.getModel().rowsToDisplay[lastIndex + 1].setSelected(true);
    this.params.api.startEditingCell({
      rowIndex: lastIndex + 1,
      colKey: 'partsCode'
    });
    this.calculateTotal();
  }

  ngOnInit() {
  }

  callbackGrid(params) {
    this.params = params;
    if (this.data) {
      this.params.api.setRowData(this.data);
      this.calculateTotal();
    }
  }

  getParams() {
    const selectedPartsNode = this.params.api.getSelectedNodes();
    if (selectedPartsNode) {
      if (selectedPartsNode.length === 1 && selectedPartsNode[0].data.status && +selectedPartsNode[0].data.status >= 2) {
        this.disableRemovePart = true;
      } else {
        this.disableRemovePart = false;
      }
      this.selectedNode = selectedPartsNode[0];
    } else {
      this.disableRemovePart = true;
    }
  }

  addPart(newVal) {
    this.params.api.updateRowData({add: [newVal]});
  }

  removePart() {
    if (!this.selectedNode) {
      this.swalAlertService.openWarningToast('Cần chọn 1 phụ tùng');
    } else {
      this.confirmService.openConfirmModal('Bạn có chắc muốn xóa bản ghi được chọn').subscribe(res => {
        this.params.api.updateRowData({remove: [this.selectedNode.data]});
        this.calculateTotal();
      });
    }
  }

  patchPartToGrid(arrParts: Array<any>) {
    const lastIndex = this.params.api.getLastDisplayedRow();
    this.loadingService.setDisplay(true);
    this.partsInfoManagementApi.getPartInfo4Quotation(arrParts.map(part => part.id), this.roId ? this.roId : null)
      .subscribe(res => {
        if (res && res.length) {
          for (let i = 0; i < arrParts.length; i++) {
            const newPart = Object.assign({}, arrParts[i], res[i]);
            const newVal = Object.assign({}, newPart, {
              stt: this.selectedNode ? this.selectedNode.rowIndex + 1 : 0,
              partsId: newPart.id,
              id: newPart.id,
              // qty: 1,
              onhandQty: newPart.onHandQty,
              received: 0,
              taxRate: newPart.rate,
              discountPercent: 0,
              amount: newPart.sellPrice,
              version: (this.proposalForm.getRawValue().quotationprint || 0) + 1
            });
            const data = this.gridTableService.getAllData(this.params);
            const partExist = data.find(it => it.partsCode === newVal.partsCode);
            if (partExist) {
              this.params.api.forEachNode(node => {
                if (node && node.data.partsCode === newVal.partsCode) {
                  node.setDataValue('qty', Number(node.data.qty) + Number(newVal.qty));
                  return;
                }
              });
            } else {
              this.params.api.updateRowData({add: [newVal]});
              this.params.api.getModel().rowsToDisplay[lastIndex + 1].setSelected(true);
              this.params.api.startEditingCell({rowIndex: lastIndex + 1, colKey: 'partsCode'});
            }


          }
        }
        this.loadingService.setDisplay(false);
        this.calculateTotal();
      });
  }

  moneyFormat(val) {
    return this.dataFormatService.moneyFormat(val);
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
    const isFocusCell = this.params.api.getFocusedCell();

    // Press enter to search with modal
    if (srcElement.classList.contains('partsCode') && keyCode === KEY_ENTER) {
      this.searchPartInfo({partsCode: srcElement.innerHTML});
    }

    // Press enter to search with modal
    /*    if (keyCode === KEY_ENTER) {
          this.focusCellIndex = isFocusCell.rowIndex
          if (srcElement.classList.contains('partsCode')) {
            this.searchPartInfo({ partsCode: srcElement.innerHTML, orderTypeId: this.form.value.orderTypeId });
          }
        }*/

    // Add new row with hot keys
    const focusCell = this.params.api.getFocusedCell();
    if (keyCode === KEY_DOWN) {
      if (focusCell.rowIndex === this.focusCellIndex && focusCell.rowIndex === displayedData.length - 1) {
        this.addParts();
      }
      this.focusCellIndex = focusCell.rowIndex;
    }
    if (keyCode === KEY_UP) {
      this.focusCellIndex = focusCell.rowIndex;
    }
  }

  private searchPartInfo(val, paginationParams?) {
    if (val.partsCode) {
      this.loadingService.setDisplay(true);
      this.partsInfoManagementApi.searchPartForQuotation({
        partsCode: val.partsCode,
        reqId: this.roId ? this.roId : null
      }, paginationParams).subscribe(partsInfoData => {
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
}
