import {Component, OnInit, ViewChild} from '@angular/core';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {PartsOrderForStoringModel} from '../../../core/models/parts-management/parts-order-for-storing.model';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {PartsOrderForStoringApi} from '../../../api/parts-management/parts-order-for-storing.api';
import {AgDataValidateService} from '../../../shared/ag-grid-table/ag-data-validate/ag-data-validate.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {DealerModel} from '../../../core/models/sales/dealer.model';
import {OrderForLexusPartApi} from '../../../api/parts-management/order-for-lexus-part.api';
import {CommonService} from '../../../shared/common-service/common.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-order-for-storing',
  templateUrl: './parts-order-for-storing.component.html',
  styleUrls: ['./parts-order-for-storing.component.scss']
})
export class PartsOrderForStoringComponent implements OnInit {
  @ViewChild('orderDetailModal', {static: false}) orderDetailModal;
  fieldGrid;
  params;
  partsOrderForStoring: Array<PartsOrderForStoringModel> = [];
  selectedPart: PartsOrderForStoringModel;

  displayedData: Array<PartsOrderForStoringModel> = [];
  frameworkComponents;

  paginationTotalsData: number;
  paginationParams;
  dlrLexusOfCurrentDlr: DealerModel;

  constructor(
    private dataFormatService: DataFormatService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private partsOrderForStoringApi: PartsOrderForStoringApi,
    private confirmService: ConfirmService,
    private agDataValidateService: AgDataValidateService,
    private gridTableService: GridTableService,
    private orderForLexusPartApi: OrderForLexusPartApi,
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'STT',
            headerTooltip: 'Số thứ tự',
            field: 'stt',
            cellStyle: params => {
              if (params.data.frCd === 'X') {
                return {'backround-color': 'red'};
              }
            },
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            width: 30
          },
          {
            headerName: 'Mã PT',
            headerTooltip: 'Mã phụ tùng',
            field: 'partsCode',
            width: 80
          },
          {
            headerName: 'Tên PT',
            headerTooltip: 'Tên phụ tùng',
            valueGetter: params => {
              return params.data && params.data.partsNameVn && !!params.data.partsNameVn
                ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
            },
            width: 150
          },
          {
            headerName: 'ĐVT',
            headerTooltip: 'Đơn vị tính',
            field: 'unit',
            width: 40
          },
          {
            headerName: 'DAD',
            headerTooltip: 'DAD',
            field: 'dad',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            width: 40
          },
          {
            headerName: 'MIP',
            headerTooltip: 'MIP',
            field: 'mip',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            width: 40
          },
          {
            headerName: 'SL Tồn',
            headerTooltip: 'Số lượng Tồn',
            field: 'onHandQty',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            width: 40
          },
          {
            headerName: 'SL ĐĐ',
            headerTooltip: 'Số lượng ĐĐ',
            field: 'onOrderQty',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            width: 40
          },
          {
            headerName: 'SL Đặt DK',
            headerTooltip: 'Số lượng đặt dự kiến',
            field: 'suggestOrderQty',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            width: 60
          }
        ]
      },
      {
        headerName: 'Tồn kho TMV',
        headerTooltip: 'Tồn kho TMV',
        children: [
          {
            headerName: 'CPD',
            headerTooltip: 'CPD',
            field: 'cpd',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            width: 40
          },
          {
            headerName: 'SPD',
            headerTooltip: 'SPD',
            field: 'spd',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            width: 40
          },
          {
            headerName: 'Leadtime',
            headerTooltip: 'Leadtime',
            field: 'estLeadTime',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            width: 60
          }
        ]
      },
      {
        headerName: 'SL đặt thực tế',
        headerTooltip: 'Số lượng đặt thực tế',
        children: [
          {
            headerName: 'Nhận ngay',
            headerTooltip: 'Nhận ngay',
            field: 'immediateUseQty',
            validators: ['notNagetiveIntNumber', 'maxLength'],
            maxLength: 15,
            editable: params => true,
            cellClass: ['cell-border', 'cell-clickable', 'text-right', 'immediateUseQty'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            width: 70
          },
          {
            headerName: 'Nhận sau',
            headerTooltip: 'Nhận sau',
            field: 'laterUseQty',
            validators: ['notNagetiveIntNumber', 'maxLength'],
            maxLength: 15,
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            width: 70
          }
        ]
      },
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'Đơn giá',
            headerTooltip: 'Đơn giá',
            field: 'price',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
            width: 80
          },
          {
            headerName: 'Thành tiền',
            headerTooltip: 'Thành tiền',
            field: 'sumPrice',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
            width: 80
          },
          {
            headerName: 'Thuế',
            headerTooltip: 'Thuế',
            field: 'rate',
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            width: 40
          }
        ]
      }
    ];
    this.getLexusOfCurrentDealer();
  }

  getLexusOfCurrentDealer() {
    this.loadingService.setDisplay(true);
    this.orderForLexusPartApi.getLexusOfCurrentDealer().subscribe(dlrLexusOfCurrentDlr => {
      this.loadingService.setDisplay(false);
      this.dlrLexusOfCurrentDlr = dlrLexusOfCurrentDlr;
    });
  }

  changePaginationParams(paginationParams) {
    if (!this.partsOrderForStoring) {
      return;
    }
    this.paginationParams = paginationParams;
    this.checkBeforeSearch();
  }

  callbackGrid(params) {
    this.params = params;
    this.searchParts();
  }

  getParams() {
    const selectedPart = this.params.api.getSelectedRows();
    if (selectedPart) {
      this.selectedPart = selectedPart[0];
    }
  }

  checkBeforeSearch() {
    if (this.editedRow.length) {
      this.confirmService.openConfirmModal('Thao tác của bạn sẽ làm mất đi dữ liệu đã được chỉnh sửa, bạn có muốn tiếp tục không?').subscribe(() => {
        this.searchParts();
      }, () => {
      });
    } else {
      this.searchParts();
    }
  }

  searchParts() {
    this.loadingService.setDisplay(true);
    this.partsOrderForStoringApi.getParts(this.paginationParams).subscribe(data => {
      this.loadingService.setDisplay(false);
      this.partsOrderForStoring = data.list;
      this.paginationTotalsData = data.total;
      this.params.api.setRowData(this.gridTableService.addSttToData(this.partsOrderForStoring, this.paginationParams));
      this.editFirstEditableRow();
      this.getDisplayedData();
    });
  }

  editFirstEditableRow() {
    if (this.displayedData.length) {
      const editableRows = [];
      this.params.api.forEachNode(node => {
        if (node.data.state !== 1 && node.data.state !== 0) {
          editableRows.push(node.childIndex);
        }
      });
      this.gridTableService.setFocusCell(this.params, 'immediateUseQty', this.displayedData, editableRows[0]);
    }
  }

  cellValueChanged(params) {
    const col = params.colDef.field;
    const immediateUseQty = params.data.immediateUseQty ? params.data.immediateUseQty : 0;
    const laterUseQty = params.data.laterUseQty ? params.data.laterUseQty : 0;
    const price = params.data.price;
    if (col === 'immediateUseQty' || col === 'laterUseQty') {
      params.data.sumPrice = (parseFloat(immediateUseQty) + parseFloat(laterUseQty)) * parseFloat(price);
      params.api.refreshCells();
      this.getDisplayedData();
    }

    if (col === 'remark') {
      if (this.editedRow.length && params.column.editingStartedValue !== params.data.remark) {
        this.confirmService.openConfirmModal('Thao tác của bạn sẽ làm mất đi dữ liệu đã được chỉnh sửa, bạn có muốn tiếp tục không?').subscribe(() => {
          this.changePart(params);
        }, () => {
          params.node.setDataValue(params.colDef.field, params.column.editingStartedValue);
        });
      } else {
        this.changePart(params);
      }
    }
  }

  changePart(params) {
    if (params.data.remark.indexOf('HỦY') > -1) {
      this.loadingService.setDisplay(true);
      this.partsOrderForStoringApi.cancelPart(params.data.partsId).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.toastService.openSuccessToast();
        this.searchParts();
      });
    } else if (params.data.remark.indexOf('ĐẶT MÃ MỚI') > -1) {
      this.loadingService.setDisplay(true);
      this.partsOrderForStoringApi.replacePart(params.data.partsId, params.data.newPartId).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.toastService.openSuccessToast();
        this.searchParts();
      });
    }
  }

  getDisplayedData() {
    this.displayedData = this.gridTableService.getAllData(this.params);
  }

  get editedRow(): Array<PartsOrderForStoringModel> {
    this.getDisplayedData();
    const editedRow = [];
    this.displayedData.forEach(part => {
      if (part.immediateUseQty > 0 || part.laterUseQty > 0) {
        editedRow.push(part);
      }
    });
    return editedRow;
  }

  checkLexusPart(editedRow: Array<PartsOrderForStoringModel>) {
    if (this.dlrLexusOfCurrentDlr) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < editedRow.length; i++) {
        if (editedRow[i].frCd === 'X') {
          this.toastService.openWarningToast(`Không được phép đặt phụ tùng Lexus, vui lòng kiểm tra lại mã phụ tùng ${editedRow[i].partsCode}`);
          return false;
        }
      }
    }
    return true;
  }

  showOrderList() {
    if (this.agDataValidateService.validateDataGrid(this.params, this.fieldGrid, this.displayedData)) {
      const editedRow = this.editedRow;
      if (!editedRow || (editedRow && editedRow.length === 0)) {
        this.toastService.openWarningToast('Bạn chưa nhập số lượng order. Hãy nhập ít nhất cho một phụ tùng');
        return;
      } else if (!this.checkLexusPart(editedRow)) {
        return;
      } else {
        if (!this.commonService.checkInt(this.selectedPart.immediateUseQty)) {
          return;
        }
        this.orderDetailModal.open(editedRow);
      }
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


    const displayedData = this.gridTableService.getAllData(this.params);

    // Add new row with hot keys
    const focusCell = this.params.api.getFocusedCell();
    if (!srcElement.classList.contains('ag-cell-edit-input')) {
      return;
    }
    if (keyCode === KEY_DOWN) {
      this.gridTableService.setFocusCell(this.params, focusCell.column.colId, null, focusCell.rowIndex === displayedData.length ? focusCell.rowIndex : focusCell.rowIndex + 1);

    }
    if (keyCode === KEY_UP) {
      this.gridTableService.setFocusCell(this.params, focusCell.column.colId, null, focusCell.rowIndex === 0 ? focusCell.rowIndex : focusCell.rowIndex - 1);
    }
  }
}
