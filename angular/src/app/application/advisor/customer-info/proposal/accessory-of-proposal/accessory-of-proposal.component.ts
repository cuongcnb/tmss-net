import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ToastService } from '../../../../../shared/swal-alert/toast.service';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { DataFormatService } from '../../../../../shared/common-service/data-format.service';
import { PartsInfoManagementApi } from '../../../../../api/parts-management/parts-info-management.api';
import { AgSelectRendererComponent } from '../../../../../shared/ag-select-renderer/ag-select-renderer.component';
import { GridTableService } from '../../../../../shared/common-service/grid-table.service';
import { state } from '../../../../../core/constains/ro-state';
import { ConfirmService } from '../../../../../shared/confirmation/confirm.service';
import { AgCheckboxRendererComponent } from '../../../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import { NextShortcutService } from '../../../../../shared/common-service/nextShortcut.service';
import { currentTab, setFocusedCell } from '../../../../../home/home.component';
import { RepairOrderApi } from '../../../../../api/quotation/repair-order.api';

import { discountUpdate$, setDiscount } from './accessory-discount/accessory-discount.component';
import { setClickedRow } from '../proposal.component';
import { GoUpButtonComponent } from '../go-up-button/go-up-button.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'accessory-of-proposal',
  templateUrl: './accessory-of-proposal.component.html',
  styleUrls: ['./accessory-of-proposal.component.scss']
})
export class AccessoryOfProposalComponent implements OnInit, OnChanges, OnDestroy {
  @Output() countMoney = new EventEmitter();
  @Output() selectAppointment = new EventEmitter();
  @Input() proposalForm: FormGroup;
  @Input() isRefresh;
  @Input() state;
  @Input() roId;

  @ViewChild('recentlyPartPriceComponent', { static: false }) recentlyPartPriceComponent;
  @ViewChild('discountModal', { static: false }) discountModal;
  @ViewChild('searchPartsModal', { static: false }) searchPartsModal;
  @ViewChild('gridTable', { static: false }) gridTable;
  @Input() data: Array<any>;
  disabledBtnAdd = [state.settlement, state.cancel, state.complete];
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
    readjust: null,
    seq: 1
  };
  onFocus;
  onBlur;
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
  disableBtnDel = [state.quotation, state.quotationTmp];
  doubleClickParams;
  isCollapsed;
  stateCVDV = [null, state.quotationTmp, ''];
  discountObs$;
  focusedCells = [];
  partHasAppId = false;

  constructor(
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private confirmService: ConfirmService,
    public gridTableService: GridTableService,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private cdr: ChangeDetectorRef,
    private nextShortcutService: NextShortcutService,
    private repairOrderApi: RepairOrderApi,
    private elem: ElementRef
  ) {
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent,
      agCheckboxRendererComponent: AgCheckboxRendererComponent,
      goUpButtonRenderer: GoUpButtonComponent,
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
        // cellRenderer: params => {
        //   return params.value ? params.value.replace(/[^a-zA-Z0-9]/g, '') : '';
        // },
        // valueFormatter: params => {
        //   return params.value ? params.value.replace(/[^a-zA-Z0-9]/g, '') : '';
        // }
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
          return params.data && params.data.partsNameVn && !!params.data.partsNameVn ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
        }
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
        cellClass: ['cell-clickable', 'cell-border', 'partsCode'],
        editable: params => {
          const roState = this.proposalForm.get('rostate').value;
          return !this.partHasAppId && (!roState || roState === state.quotation || roState === state.quotationTmp || !params.data.quotationprintVersion);
        }
        // cellRenderer: params => {
        //   return params.value ? params.value.replace(/[^a-zA-Z0-9]/g, '') : '';
        // }
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsNameVn',
        valueGetter: params => {
          return params.data.partsNameVn || params.data.partsName || '';
        },
        width: 170
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
        cellClass: ['cell-readonly', 'cell-border', 'text-right']

      },
      {
        headerName: 'SL Tồn',
        headerTooltip: 'Số lượng Tồn',
        field: 'onhandQty',
        width: 50,
        cellClass: ['text-right', 'cell-border', 'text-right']
      },
      {
        headerName: 'SL Cần',
        headerTooltip: 'Số lượng Cần',
        field: 'qty',
        width: 50,
        cellClass: ['cell-clickable', 'cell-border', 'text-right'],
        editable: params => {
          const roState = this.proposalForm.get('rostate').value;
          return !this.partHasAppId && (!roState || roState === state.quotation || roState === state.quotationTmp || !params.data.quotationprintVersion);
        },
        validators: ['number', 'required'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'SL Nhận',
        headerTooltip: 'Số lượng Nhận',
        field: 'received',
        width: 60,
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'SL BO',
        headerTooltip: 'Số lượng BO',
        field: 'qtyBackOrder',
        width: 50,
        cellClass: ['cell-border', 'cell-readonly'],
        cellRenderer: params => {
          const data = ((params.data.qty || 0) - (params.data.onHandQty || 0));
          return data > 0 ? data : 0;
        },
        tooltipValueGetter: params => {
          const data = ((params.data.qty || 0) - (params.data.onHandQty || 0));
          return data > 0 ? Math.round(data) : 0;
        }
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'amount',
        width: 80,
        cellClass: ['cell-border', 'text-right', 'cell-readonly'],
        cellRenderer: params => this.dataFormatService.moneyFormat(Math.round(params.data.sellPrice * params.data.qty)),
        tooltip: params => this.dataFormatService.numberFormat(Math.round(params.value)),
        valueFormatter: params => this.dataFormatService.moneyFormat(Math.round(params.value))
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'taxRate',
        width: 55,
        cellClass: this.partHasAppId ? ['cell-border', 'p-0'] : ['cell-clickable', 'cell-border', 'p-0'],
        cellRenderer: 'agSelectRendererComponent',
        list: [{ key: 10, value: 10 }, { key: 5, value: 5 }, { key: 0, value: 0 }],
        // editable: true,
        required: true,
      },
      {
        headerName: '% Giảm',
        headerTooltip: '% Giảm',
        width: 50,
        field: 'discountPercent',
        validators: ['number'],
        cellClass: ['text-right', 'cell-border'],
        cellStyle: { backgroundColor: '#FFFFCC' },
        editable: true
      },
      {
        headerName: 'Giá giảm',
        headerTooltip: 'Giá giảm',
        field: 'discount',
        width: 80,
        validators: ['intNumber'],
        cellClass: ['text-right', 'cell-border'],
        tooltip: params => this.dataFormatService.moneyFormat((params.value) ? params.value : 0),
        valueFormatter: params => this.dataFormatService.moneyFormat((params.value) ? params.value : 0),
        cellStyle: { backgroundColor: '#FFFFCC' },
        editable: true

      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'notes',
        editable: true,
        width: 100,
        cellClass: ['cell-border'],
        cellStyle: { backgroundColor: '#FFFFCC' }
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
      },
      {
        field: 'seq',
        sortable: true,
        hide: true
      },
      {
        headerName: '',
        headerTooltip: 'Thay đổi thứ tự hiển thị',
        field: undefined,
        width: 50,
        cellClass: ['text-center', 'cell-border'],
        cellRenderer: 'goUpButtonRenderer',
        cellRendererParams: {
          onUpClick: this.goUp.bind(this),
          onDownClick: this.goDown.bind(this)
        }
      }
    ];
  }

  goUp(params) {
    const node = params.rowData.node;
    const index = node.childIndex;
    if (index > 0) {
      const prevNode = this.params.api.getDisplayedRowAtIndex(index - 1);
      const prevSeq = prevNode.data['seq'];
      const seq = params.rowData.node.data['seq'];
      prevNode.data['seq'] = seq;
      node.data['seq'] = prevSeq;
      var sort = [{ colId: 'seq', sort: 'asc' }];
      this.params.api.setSortModel(sort);
      const data = this.gridTableService.getAllDataAfterFilterAndSort(this.params).map(it => {
        // return Object.assign({}, it, {id: null, readjust: it.readjust ? 'Y' : 'N'})
        it.id = null;
        return it;
      });
      this.proposalForm.get('partList').setValue(data);
      this.params.api.getDisplayedRowAtIndex(index - 1).setSelected(true);
    }
  }

  goDown(params) {
    const node = params.rowData.node;
    const index = node.childIndex;
    if (index < this.params.api.getDisplayedRowCount() - 1) {
      const nextNode = this.params.api.getDisplayedRowAtIndex(index + 1);
      const nextSeq = nextNode.data['seq'];
      const seq = params.rowData.node.data['seq'];
      nextNode.data['seq'] = seq;
      node.data['seq'] = nextSeq;
      var sort = [{ colId: 'seq', sort: 'asc' }];
      this.params.api.setSortModel(sort);
      const data = this.gridTableService.getAllDataAfterFilterAndSort(this.params).map(it => {
        // return Object.assign({}, it, {id: null, readjust: it.readjust ? 'Y' : 'N'})
        it.id = null;
        return it;
      });
      this.proposalForm.get('partList').setValue(data);
      this.params.api.getDisplayedRowAtIndex(index + 1).setSelected(true);
    }
  }

  ngOnChanges(): void {
    if (this.isRefresh && this.params) {
      this.params.api.setRowData([]);
    }
    if (this.params && this.data) {
      this.selectedNode = undefined;
      this.params.api.setRowData(this.data);
      let i = 1;
      this.params.api.forEachNodeAfterFilterAndSort(node => {
        node.data['seq'] = i++;
      });
      this.calculateTotal();
    }
    if (this.params && (!this.data || this.data.length < 1) && (!this.proposalForm.get('rostate').value || Number(this.proposalForm.get('rostate').value) < 0)) {
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
        readjust: null,
        seq: 1
      };
      this.params.api.updateRowData({ add: [newVal] });
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
        if (params.rowIndex === rowNode.rowIndex && Number(params.newValue) !== Number(params.oldValue) && Number(params.newValue)) {
          rowNode.setDataValue('qtyBackOrder', (Number(params.data.qty) - params.data.onHandQty));
          rowNode.setDataValue('discount', Number(params.data.qty) > 0
            ? Math.ceil(Number(params.data.qty) * params.data.sellPrice * Number(params.data.discountPercent || 0) / 100)
            : Math.floor(Number(params.data.qty) * params.data.sellPrice * Number(params.data.discountPercent || 0) / 100));
          rowNode.setDataValue('qty', Math.round(100 * Number(params.data.qty)) / 100);
          rowNode.setDataValue('amount', Math.round(Number(params.data.qty) * params.data.sellPrice));
          return;
        }
      });
      this.params.api.refreshClientSideRowModel('aggregate');
    }
  }

  tabToNextCell(params) {
    if (params.previousCellDef && params.nextCellDef && params.previousCellDef.column.colId === 'discount' && params.nextCellDef.column.colId === 'discountPercent') {
      const data = this.params.api.getModel().rowsToDisplay[params.nextCellDef.rowIndex].data;
      if (data.discount) {
        data.discountPercent = this.returnIntOrFloat(Number(data.discount) / Number(data.sellPrice * data.qty) * 100);
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
    // if (this.state && this.state.toString() !== '1' && this.selectedNode && this.selectedNode.data.quotationprintVersion && col === 'partsCode') {
    //   return;
    // }
    // if (col === 'partsCode') {
    //   this.searchPartInfo({partsCode: params.value});
    // }

    if (col === 'discountPercent' && !this.partHasAppId) {
      this.discountModal.open(params.data.discountPercent);
    }

    this.doubleClickParams = params;
  }

  cellFocused(params) {
    setFocusedCell(params, currentTab, false);
  }

  cellEditingStarted(params) {
  }

  cellEditingStopped(params) {
    const registerno = this.proposalForm.get('registerno').value;
    params.data.partsCode = params.data.partsCode.replace(/\s/g, '');
    window.onfocus = () => {
      // tslint:disable-next-line:no-shadowed-variable
      const dataLocalStorage = JSON.parse(localStorage.getItem(registerno));
      if (dataLocalStorage) {
        if (this.params && dataLocalStorage.colId) {
          this.gridTableService.setFocusCellDontEdit(this.params, dataLocalStorage.colId, Number(dataLocalStorage.rowIndex));
          this.params.api.clearFocusedCell();
          setTimeout(() => {
            this.gridTableService.setFocusCell(
              this.params,
              dataLocalStorage.colId,
              null,
              Number(dataLocalStorage.rowIndex)
            );
          }, 100);
        }
      }
    };
    const focusCell = this.params.api.getFocusedCell();
    const dataLocalStorage = localStorage.getItem(registerno);
    if (dataLocalStorage) {
      localStorage.removeItem(registerno);
    }
    if (focusCell) {
      const obj = {
        colId: focusCell.column.colId,
        rowIndex: focusCell.rowIndex
      };
      localStorage.setItem(registerno, JSON.stringify(obj));

    }
    setFocusedCell(this.params, currentTab, true);
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
          const discountPercent = (Number(params.data.discount) !== 0)
            ? (parseFloat(params.data.discount) / ((Number(params.data.sellPrice * params.data.qty)) || 1) * 100) : 0;
          params.data.discountPercent = this.returnIntOrFloat(discountPercent);
        }
        break;
      case 'partsCode':
        if (!params.value || !params.value) {
          return;
        }
        this.params.api.forEachNode(rowNode => {
          if (params.rowIndex === rowNode.rowIndex && params.value) {
            rowNode.setDataValue('partsCode', params.value.replace(/[^a-zA-Z0-9]/g, ''));
          }
        });
        this.searchPartInfo({ partsCode: params.value.replace(/[^a-zA-Z0-9]/g, '') });
        break;
      case 'qty':
        this.params.api.forEachNode(node => {
          if (node.data.partsCode === params.data.partsCode && Number(node.data.discount) > 0) {
            this.swalAlertService.openWarningToast('Phụ tùng có giảm giá ở bên trên. Vui lòng chú ý trước khi IN BÁO GIÁ');
            return;
          }
        });
        if (params.value && Number(params.value) < 0) {
          if (this.roId === null) {
            return;
          }
          this.searchRecentlyPartPrice(params.data);
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
          this.selectedNode.setData({});
          this.gridTableService.setFocusCell(this.params, this.gridField[0].field, null, Number(this.selectedNode.childIndex));
        } else {
          const val = Object.assign(rowData, {
            stt: this.selectedNode ? this.selectedNode.rowIndex + 1 : 0,
            partsId: rowData.id,
            id: null,
            qty: null,
            onhandQty: rowData.onHandQty,
            received: 0,
            taxRate: rowData.rate,
            amount: 0,
            version: (this.proposalForm.getRawValue().quotationprint || 0) + 1,
            readjust: null,
            partsNameVn: rowData.partsNameVn ? rowData.partsNameVn : rowData.partsName,
            seq: this.selectedNode.data['seq']
          });
          this.selectedNode.setData(val);
          this.focusCellIndex = Number(this.selectedNode.childIndex);
          this.gridTableService.setFocusCellDontEdit(this.params, this.gridField[0].field, Number(this.selectedNode.childIndex));
          setTimeout(() => {
            this.gridTableService.setDataToRow(this.params, Number(this.selectedNode.childIndex), val, this.gridTableService.getAllData(this.params), 'qty');
          }, 50);
          // if (!rowData.discountPercent) {
          //   this.selectedNode.setDataValue('discountPercent', 0);
          // }
          this.proposalForm.markAsDirty();
          this.calculateTotal();
        }
      }
    });
  }

  setSellPrice(data) {
    this.loadingService.setDisplay(true);
    this.loadingService.setDisplay(false);
    this.selectedNode.setDataValue('sellPrice', Number(data.sellPrice));
    this.selectedNode.setDataValue('amount', Math.round(Number(data.sellPrice) * Number(this.selectedNode.data.qty)));
    this.gridTableService.setFocusCellDontEdit(this.params, this.gridField[0].field, this.gridTableService.getAllData(this.params).length - 1);
    this.focusCellIndex = this.gridTableService.getAllData(this.params).length - 1;
    this.proposalForm.markAsDirty();
    this.calculateTotal();
  }

  calculateTotal() {
    if (this.params) {
      let amount = 0;
      let discount = 0;
      let taxRate = 0;

      this.parts = [];
      this.params.api.forEachNode(node => {
        this.parts.push(node.data);
        amount += Math.round(this.dataFormatService.parseMoneyToValue(node.data.sellPrice * node.data.qty));
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
      const data = this.gridTableService.getAllDataAfterFilterAndSort(this.params).map(it => {
        // return Object.assign({}, it, {id: null, readjust: it.readjust ? 'Y' : 'N'})
        it.id = null;
        return it;
      });
      this.proposalForm.get('partList').setValue(data);
    }
  }

  addParts() {
    const lastIndex = this.params.api.getLastDisplayedRow();
    let lastItem = null;
    if (lastIndex >= 0) {
      lastItem = this.params.api.getDisplayedRowAtIndex(lastIndex).data;
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
      readjust: null,
      seq: lastItem ? lastItem['seq'] + 1 : 1
    };
    this.params.api.updateRowData({ add: [newVal] });
    this.gridTableService.setFocusCellDontEdit(this.params, this.gridField[0].field, lastIndex + 1);
    this.params.api.getModel().rowsToDisplay[lastIndex + 1].setSelected(true);
    this.params.api.startEditingCell({
      rowIndex: lastIndex + 1,
      colKey: 'partsCode'
    });
    this.calculateTotal();
  }

  ngOnInit() {
    this.discountObs$ = discountUpdate$.subscribe((data: any) => {
      if (data && data.registerno === this.proposalForm.get('registerno').value) {
        setDiscount(this.selectedNode, this.params, data, 'PT');
        this.calculateTotal();
        this.proposalForm.markAsDirty();
      }
    });
  }

  ngOnDestroy() {
    this.onFocus = null;
    this.onBlur = null;
    if (this.discountObs$) {
      this.discountObs$.unsubscribe();
    }
  }

  callbackGrid(params) {
    this.params = params;
    if (this.data) {
      this.params.api.setRowData(this.data);
      this.calculateTotal();
    }
    if (this.params && (!this.data || this.data.length < 1) && (!this.proposalForm.get('rostate').value || Number(this.proposalForm.get('rostate').value) < 0)) {
      this.params.api.updateRowData({ add: [this.newVal] });
    }
  }

  getParams() {
    const selectedPartsNode = this.params.api.getSelectedNodes();
    if (selectedPartsNode) {
      this.selectedNode = selectedPartsNode[0];
      if (selectedPartsNode.length === 1 && selectedPartsNode[0].data.status && +selectedPartsNode[0].data.status >= 2) {
        this.disableRemovePart = true;
      } else if (this.selectedNode.data.appId !== null && this.selectedNode.data.appId !== undefined) {
        this.partHasAppId = true;
      } else {
        this.disableRemovePart = false;
        this.partHasAppId = false;
      }
    } else {
      this.disableRemovePart = true;
    }
  }

  addPart(newVal) {
    this.params.api.updateRowData({ add: [newVal] });
  }

  removePart() {
    if (!this.selectedNode) {
      this.swalAlertService.openWarningToast('Cần chọn 1 phụ tùng');
      return;
    }
    this.confirmService.openConfirmModal('Bạn có chắc muốn xóa bản ghi được chọn').subscribe(res => {
      this.params.api.updateRowData({ remove: [this.selectedNode.data] });
      this.data = this.gridTableService.getAllData(this.params);
      this.calculateTotal();
    });
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
              quotationprintVersion: newPart.quotationprintVersion,
              appId: newPart.appId
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
              this.params.api.updateRowData({ add: [newVal], addIndex: lastIndex + i + 2 });
            }
          }
        }
        this.loadingService.setDisplay(false);
        this.calculateTotal();
        if (arrParts.length) {
          this.selectAppointment.emit();
        }
      });
  }

  moneyFormat(val) {
    return this.dataFormatService.moneyFormat(val);
  }

  agKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (this.proposalForm.getRawValue().jti !== this.proposalForm.getRawValue().createdBy && !this.stateCVDV.includes(this.state)) {
      return;
    }
    const keyCode = event.key;
    const srcElement = event.target as HTMLInputElement;
    const KEY_ENTER = 'Enter';
    const KEY_UP = 'ArrowUp';
    const KEY_DOWN = 'ArrowDown';

    const displayedData = this.gridTableService.getAllData(this.params);
    // Press enter to search with modal
    if (srcElement.classList.contains('partsCode') && keyCode === KEY_ENTER && !srcElement.innerText) {
      this.searchPartInfo({ partsCode: srcElement.innerText.replace(/[^a-zA-Z0-9]/g, '') });
    }
    // Add new row with hot keys
    const focusCell = this.params.api.getFocusedCell();
    const editingCells = this.params.api.getEditingCells();
    const isEditing = focusCell.column.colId !== 'partsCode' && !!editingCells.find(val => val.column.colId === focusCell.column.colId);
    if (keyCode === KEY_DOWN) {
      if (focusCell.rowIndex === displayedData.length - 1) {
        this.addParts();
      } else {
        this.gridTableService.setFocusCell(this.params, focusCell.column.colId, null, focusCell.rowIndex + 1, isEditing);
      }
    }
    if (keyCode === KEY_UP) {
      this.focusCellIndex = focusCell.rowIndex === 0 ? 0 : focusCell.rowIndex - 1;
      this.gridTableService.setFocusCell(this.params, focusCell.column.colId, null, this.focusCellIndex, isEditing);
    }
  }

  navigateToNextCell(params) {
    const KEY_UP = 38;
    const KEY_DOWN = 40;
    if ((params.key === KEY_UP || params.key === KEY_DOWN)) {
      return params.previousCellPosition;
    }
    return params.nextCellPosition;
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

  private searchRecentlyPartPrice(val) {
    this.loadingService.setDisplay(true);
    this.repairOrderApi.getRecentlyPartPrice(this.roId, val.partsId).subscribe(res => {
      this.loadingService.setDisplay(false);
      if (res.length === 1) {
        this.setSellPrice({ sellPrice: res[0] });
      } else if (res.length > 1) {
        this.recentlyPartPriceComponent.open(res);
      }
    });
  }

  rowClicked(event) {
    this.focusCellIndex = event.rowIndex;
    setClickedRow(this.params, this.selectedNode, 'PT');
    // if (event.node.selected && !!event.node.data) {
    //     //   this.nextShortcutService.nextCheckShortcut('PT');
    //     //   this.nextShortcutService.listen().subscribe((res: string) => {
    //     //     if (res === 'PT') {`
    //     //       this.removePart();
    //     //       this.nextShortcutService.nextFunction(null);
    //     //     }
    //     //   });
    //     // }
  }

  cancelPart() {
    this.swalAlertService.openWarningToast('Bạn phải chọn phụ tùng hoặc mã phụ tùng bị sai');
    this.params.api.setFocusedCell(this.selectedNode.rowIndex, 'partsCode');
    this.params.api.startEditingCell({
      rowIndex: this.selectedNode.rowIndex,
      colKey: 'partsCode'
    });
  }

  private returnIntOrFloat(val) {
    return val % 1 === 0 ? val : val.toFixed(2);
  }
}
