import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {BoOrderModel, BoPartsOfOrder} from '../../../../core/models/parts-management/bo-parts-request.model';
import {BoPartsOrderApi} from '../../../../api/parts-management/bo-parts-order.api';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {AgDataValidateService} from '../../../../shared/ag-grid-table/ag-data-validate/ag-data-validate.service';
import {differenceWith, isEqual} from 'lodash';
import {DealerModel} from '../../../../core/models/sales/dealer.model';
import {CheckingLexusPartModel, PartsManagementService} from '../../parts-management.service';
import {OrderForLexusPartApi} from '../../../../api/parts-management/order-for-lexus-part.api';
import {CommonService} from '../../../../shared/common-service/common.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bo-parts-detail-request',
  templateUrl: './bo-parts-detail-order.component.html',
  styleUrls: ['./bo-parts-detail-order.component.scss']
})
export class BoPartsDetailOrderComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('boOrderSlipModal', {static: false}) boOrderSlipModal;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter<boolean>();
  form: FormGroup;
  modalHeight: number;
  selectedOrder: BoOrderModel;

  partsOfOrder: BoPartsOfOrder[] = [];
  displayedData: BoPartsOfOrder[] = [];
  selectedPart: BoPartsOfOrder;

  fieldGrid;
  params;

  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  validQty = true;
  dlrLexusOfCurrentDlr: DealerModel;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private setModalHeightService: SetModalHeightService,
    private dataFormatService: DataFormatService,
    private boPartsOrderApi: BoPartsOrderApi,
    private gridTableService: GridTableService,
    private agDataValidateService: AgDataValidateService,
    private partsManagementService: PartsManagementService,
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
            cellRenderer: params => params.rowIndex + 1
          },
          {
            headerName: 'Mã PT',
            headerTooltip: 'Mã phụ tùng',
            field: 'partsCode',
            width: 220
          },
          {
            headerName: 'Tên PT',
            headerTooltip: 'Tên phụ tùng',
            field: 'partsName',
            width: 300
          },
          {
            headerName: 'ĐVT',
            headerTooltip: 'Đơn vị tính',
            field: 'unit'
          },
          {
            headerName: 'MIP',
            headerTooltip: 'MIP',
            field: 'mip',
            cellClass: ['cell-readonly', 'cell-border', 'text-right']
          }
        ]
      },
      {
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        children: [
          {
            headerName: 'Tồn',
            headerTooltip: 'Tồn',
            field: 'onHandQty',
            cellClass: ['cell-readonly', 'cell-border', 'text-right']
          },
          {
            headerName: 'SO',
            headerTooltip: 'SO',
            field: 'soQty',
            cellClass: ['cell-readonly', 'cell-border', 'text-right']
          },
          {
            headerName: 'BO',
            headerTooltip: 'BO',
            field: 'boQty',
            cellClass: ['cell-readonly', 'cell-border', 'text-right']
          }
        ]
      },
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'SL Cần',
            headerTooltip: 'Số lượng Cần',
            field: 'demand',
            cellClass: ['cell-readonly', 'cell-border', 'text-right']
          },
          {
            headerName: 'SL Đặt',
            headerTooltip: 'Số lượng Đặt',
            field: 'qty',
            editable: true,
            validators: ['floatPositiveNum', 'required'],
            cellClass: ['cell-clickable', 'cell-border', 'text-right']
          },
          {
            headerName: 'Đơn giá',
            headerTooltip: 'Đơn giá',
            field: 'price',
            cellClass: ['cell-readonly', 'cell-border', 'text-right'],
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
          },
          {
            headerName: 'Thành Tiền',
            headerTooltip: 'Thành Tiền',
            field: 'sumPrice',
            cellClass: ['cell-readonly', 'cell-border', 'text-right'],
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
          },
          {
            headerName: 'Thuế',
            headerTooltip: 'Thuế',
            field: 'rate',
            cellClass: ['cell-readonly', 'cell-border', 'text-right']
          },
          {
            headerName: 'PTVC',
            headerTooltip: 'Phương thức vận chuyển',
            field: 'transportType',
            editable: true,
            cellEditor: 'agRichSelect',
            cellEditorParams: {
              values: ['Đường biển', 'Hàng không']
            },
            cellClass: ['cell-clickable', 'cell-border']
          }
        ]
      }
    ];
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedOrder) {
    this.selectedOrder = selectedOrder;
    this.getLexusOfCurrentDealer();
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
    this.selectedOrder = undefined;
    this.partsOfOrder = [];
    this.displayedData = [];
    this.params.api.setRowData(this.partsOfOrder);
  }

  getLexusOfCurrentDealer() {
    // logged in dlr must order lexus part via this lexus dlr
    this.loadingService.setDisplay(true);
    this.orderForLexusPartApi.getLexusOfCurrentDealer().subscribe(dlrLexusOfCurrentDlr => {
      this.loadingService.setDisplay(false);
      this.dlrLexusOfCurrentDlr = dlrLexusOfCurrentDlr;
    });
  }

  getPartsOfBo(selectedOrder: BoOrderModel) {
    // get part info of selectedOrder
    this.loadingService.setDisplay(true);
    this.boPartsOrderApi.viewBoOrder(selectedOrder.reqId, selectedOrder.reqtype)
      .subscribe((partsOfOrder: { price: any, ro: BoPartsOfOrder[] }) => {
        this.loadingService.setDisplay(false);
        this.partsOfOrder = partsOfOrder.ro;

        this.partsOfOrder.forEach(part => {
          // basic calculation for part info
          part.demand = part.slCon;
          part.qty = part.slCon;
          part.sumPrice = part.qty * part.price;

          // set default transportType
          part.transportType = 'Đường biển';
          part.transportTypeId = 1;
        });
        this.params.api.setRowData(this.partsOfOrder);
        this.getDisplayData();
        this.calculateFooterDetail();
      });
  }

  // AG GRID
  callbackGrid(params) {
    // called when grid is created
    this.params = params;
    this.getPartsOfBo(this.selectedOrder);
  }

  getParams() {
    // called when grid row is selected
    const selectedPart = this.params.api.getSelectedRows();
    if (selectedPart) {
      this.selectedPart = selectedPart[0];
    }
  }

  // CELL EDITING
  cellEditingStopped(params) {
    // called when edit cell stopped edit. Either by focus out or press enter
    const col = params.colDef;
    const qty = +params.data.qty;
    const slCon = +params.data.slCon;
    const slDatBo = +params.data.slDatBo;
    const price = +params.data.price;
    if (col.field === 'qty') {
      // Validate qty field
      if (qty > slCon) {
        this.validQty = false;
        this.toastService.openWarningToast(`Số lượng đặt không được vượt quá số lượng còn phải đặt: ${slCon}`);
        this.gridTableService.startEditCell(params, 'qty');
        return;
      }
      // calculate sumPrice for each part
      this.validQty = true;
      params.data.sumPrice = qty * price;
      params.api.refreshCells();
      this.calculateFooterDetail();
    }
    if (col.field === 'transportType') {
      // set transportTypeId when transportType changed
      params.data.transportTypeId = params.data.transportType === 'Đường biển' ? 1 : 2;
      params.api.refreshCells();
    }
    this.getDisplayData();
  }

  // resetAfterEdit(params) {
  //   params.node.setDataValue(params.colDef.field, params.column.editingStartedValue);
  //   params.api.setFocusedCell(params.rowIndex, params.colDef.field);
  // }

  calculateFooterDetail() {
    const footerDetail = this.gridTableService.calculateFooterDetail(this.displayedData);
    this.totalPriceBeforeTax = footerDetail.totalPriceBeforeTax;
    this.taxOnly = footerDetail.taxOnly;
    this.totalPriceIncludeTax = footerDetail.totalPriceIncludeTax;
  }

  getDisplayData() {
    // get all data on grid
    this.displayedData = this.gridTableService.getAllData(this.params);
  }

  get partsWithPositiveAmount() {
    // get all part that have qty > 0 on grid
    return this.displayedData.filter(part => {
      if (part.qty > 0) {
        return part;
      }
    });
  }

  sendRequest() {
    this.getDisplayData();
    for (const it of this.displayedData) {
      if (!this.commonService.checkInt(it.qty)) {
        this.toastService.openWarningToast(`Số lượng đặt phụ tùng ${it.partsCode} là số thập phân. Vui lòng kiểm tra lại`);
        return;
      }
    }
    if (!this.agDataValidateService.validateDataGrid(this.params, this.fieldGrid, this.displayedData) || !this.validQty) {
      this.toastService.openWarningToast('Kiểm tra lại thông tin chưa chính xác trước khi gửi đi');
      return;
    }

    // Get only positive part to send
    const partsWithPositiveAmount = this.partsWithPositiveAmount;

    if (!partsWithPositiveAmount.length) {
      this.toastService.openWarningToast('Không có phụ tùng nào có số lượng > 0, vui lòng nhập tối thiểu một phụ tùng');
      return;
    }

    // Check if lexus
    const lexusCheckCondition: CheckingLexusPartModel = {
      dataArr: this.displayedData,
      dlrLexusOfCurrentDlr: this.dlrLexusOfCurrentDlr,
      gridParams: this.params,
      fieldToFocus: 'partsCode',
      fieldToCheckQty: 'qty'
    };
    if (!this.partsManagementService.validateLexusPart(lexusCheckCondition)) {
      return;
    }
    // open modal and send all validated parts
    this.boOrderSlipModal.open(this.selectedOrder, partsWithPositiveAmount);
  }

  hideModalWhenComplete(orderedParts: Array<BoPartsOfOrder>) {
    // Check whether there are any parts left to order. If not, close the modal
    const partsWithPositiveAmount = this.partsWithPositiveAmount;
    const compare1 = differenceWith(this.partsOfOrder, partsWithPositiveAmount, isEqual);
    const compare2 = differenceWith(this.partsOfOrder, orderedParts, isEqual);
    if (!compare1.length && !compare2.length) {
      this.modal.hide();
      this.close.emit(true);
    } else {
      this.getPartsOfBo(this.selectedOrder);
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      ro: [{value: undefined, disabled: true}],
      reqtype: [{value: undefined, disabled: true}],
      requestDate: [{value: undefined, disabled: true}],
      registerNo: [{value: undefined, disabled: true}],
      model: [{value: undefined, disabled: true}],
      advisorName: [{value: undefined, disabled: true}],
      customerName: [{value: undefined, disabled: true}],
      customerAddress: [{value: undefined, disabled: true}]
    });
    if (this.selectedOrder) {
      this.form.patchValue(this.selectedOrder);
    }
  }
}
