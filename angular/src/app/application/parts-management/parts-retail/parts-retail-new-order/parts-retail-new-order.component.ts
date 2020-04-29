import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {remove} from 'lodash';

import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {PartsOfRetailOrderModel, PartsRetailDetailModel, RetailOrderModel} from '../../../../core/models/parts-management/parts-retail.model';
import {PartsInfoManagementApi} from '../../../../api/parts-management/parts-info-management.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {PartsRetailApi} from '../../../../api/parts-management/parts-retail.api';
import {AgDataValidateService} from '../../../../shared/ag-grid-table/ag-data-validate/ag-data-validate.service';
import {CustomerTypeModel} from '../../../../core/models/common-models/customer-type-model';
import {BankModel} from '../../../../core/models/common-models/bank-model';
import {CustomerApi} from '../../../../api/customer/customer.api';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-retail-new-order',
  templateUrl: './parts-retail-new-order.component.html',
  styleUrls: ['./parts-retail-new-order.component.scss']
})
export class PartsRetailNewOrderComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('searchPartGridModal', {static: false}) searchPartGridModal;
  @ViewChild('searchCustomerNameModal', {static: false}) searchCustomerNameModal;
  @ViewChild('searchCustomerCodeModal', {static: false}) searchCustomerCodeModal;
  @ViewChild('checkingModal', {static: false}) checkingModal;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Input() customerTypeArr: Array<CustomerTypeModel>;
  @Input() bankArr: Array<BankModel>;
  modalHeight: number;

  form: FormGroup;
  selectedOrder: RetailOrderModel;
  orderDetailData: PartsRetailDetailModel;

  fieldGrid;
  params;
  selectedPart: PartsOfRetailOrderModel;
  displayedData: Array<PartsOfRetailOrderModel> = [];

  fieldGridSearchPartGrid;
  fieldGridSearchCustomer;

  totalPriceBeforeTax;
  taxOnly;
  discount;
  totalPriceIncludeTax;

  editingRowParams;
  focusCellIndex = 0;

  constructor(
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private loadingService: LoadingService,
    private partsRetailApi: PartsRetailApi,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private agDataValidateService: AgDataValidateService,
    private toastService: ToastService,
    private setModalHeightService: SetModalHeightService,
    private customerApi: CustomerApi,
    private gridTableService: GridTableService
  ) {
  }

  ngOnInit() {
    this.onResize();
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 25
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        width: 60,
        cellClass: params => (params.data.pstate !== 'Y' && (!this.orderDetailData || this.orderDetailData && this.orderDetailData.parts.indexOf(params.data) === -1))
          ? ['cell-clickable', 'cell-border', 'partsCode']
          : ['cell-readonly', 'cell-border', 'partsCode'],
        validators: ['required'],
        validateOnSubmit: true,
        editable: params => params.data.pstate !== 'Y' && (!this.orderDetailData || this.orderDetailData && this.orderDetailData.parts.indexOf(params.data) === -1)
      },
      {
        headerName: 'Tên phụ tùng',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsNameVn'
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit',
        width: 30
      },
      {
        headerName: 'SL Tồn',
        headerTooltip: 'Số lượng Tồn',
        field: 'onHandQty',
        width: 40,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'SL ĐĐ',
        headerTooltip: 'Số lượng ĐĐ',
        field: 'ddQty',
        width: 40,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'SL Cần',
        headerTooltip: 'Số lượng Cần',
        field: 'qty',
        width: 40,
        editable: params => params.data.pstate !== 'Y',
        type: 'number',
        validators: ['required', 'floatNumber'],
        cellClass: params => params.data.pstate !== 'Y' ? ['cell-clickable', 'cell-border', 'text-right'] : ['cell-border', 'text-right', 'cell-readonly'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(this.dataFormatService.roundNumber(params.value, 2))
      },
      {
        headerName: 'SL ĐX',
        headerTooltip: 'Số lượng ĐX',
        field: 'dxQty',
        width: 40,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'sellPrice',
        width: 60,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'sumPrice',
        width: 80,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(Math.round(params.value)),
        valueFormatter: params => this.dataFormatService.moneyFormat(Math.round(params.value))
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
        width: 30,
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      }
    ];
    this.fieldGridSearchPartGrid = [
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        width: 60
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsNameVn'
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'sellPrice',
        width: 60,
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
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
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
        width: 30,
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      }
    ];
    this.fieldGridSearchCustomer = [
      {
        headerName: 'Tên KH',
        headerTooltip: 'Tên khách hàng',
        field: 'carownername'
      },
      {
        headerName: 'Mã KH',
        headerTooltip: 'Mã khách hàng',
        field: 'cusno'
      },
      {
        headerName: 'Địa chỉ',
        headerTooltip: 'Địa chỉ',
        field: 'carowneradd'
      },
      {
        headerName: 'SĐT',
        headerTooltip: 'Số điện thoại',
        field: 'carownertel'
      },
      {
        headerName: 'DĐ',
        headerTooltip: 'Di động',
        field: 'carownermobil'
      },
      {
        headerName: 'FAX',
        headerTooltip: 'FAX',
        field: 'carownerfax'
      },
      {
        headerName: 'Orgname',
        headerTooltip: 'Orgname',
        field: 'orgname'
      },
      {
        headerName: 'Mã số thuế',
        headerTooltip: 'Mã số thuế',
        field: 'taxcode'
      },
      {
        headerName: 'Bank_Name',
        headerTooltip: 'Bank_Name',
        field: 'bankCode'
      },
      {
        headerName: 'Số TK',
        headerTooltip: 'Số tài khoản',
        field: 'accno'
      }
    ];
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  // ****** SEARCH DATA GRID MODAL *******
  searchPartsApi(val, paginationParams?) {
    return this.partsInfoManagementApi.searchPartForOrder({partsCode: val.partsCode || null}, paginationParams);
  }

  searchCustomerByNameApi(val, paginationParams?) {
    return this.customerApi.getCustomerData({carownername: val.carownername || null}, paginationParams);
  }

  searchCustomerByCusNo(val, paginationParams?) {
    return this.customerApi.getCustomerData({cusno: val.cusno || null}, paginationParams);
  }

  setFormData(customerData) {
    this.disableCustomerForm(customerData);
    this.form.patchValue({
      customerTypeId: customerData.custypeId,
      mobile: customerData.carownermobil,
      customerCode: customerData.cusno,
      customerId: customerData.customerId,
      phone: customerData.carownertel,
      fax: customerData.carownertel,
      account: customerData.accno,
      customerName: customerData.carownername,
      companyName: customerData.orgname,
      bankId: customerData.bankId,
      address: customerData.carowneradd,
      taxNo: customerData.taxcode
    });
  }

  // ****** OPEN MODAL *******
  open(selectedOrder?, orderDetailData?) {
    this.selectedOrder = selectedOrder ? selectedOrder : undefined;
    this.orderDetailData = orderDetailData ? orderDetailData : undefined;
    this.buildForm();
    this.modal.show();
  }

  patchData() {
    // Patch data into form and grid table
    if (this.selectedOrder && this.orderDetailData) {
      this.form.patchValue(this.orderDetailData.customer);
      this.disableCustomerForm(this.orderDetailData.customer);
      this.orderDetailData.parts.forEach(part => {
        part.partsNameVn = part.partsName;
      });
      this.params.api.setRowData(this.orderDetailData.parts);
      this.getDisplayedData();
    }
  }

  reset() {
    // Reset values when close modal
    this.form = undefined;
    this.selectedOrder = undefined;
    this.displayedData = [];
    this.totalPriceBeforeTax = 0;
    this.taxOnly = 0;
    this.discount = 0;
    this.totalPriceIncludeTax = 0;
  }

  // ****** AG GRID *******
  callBackGrid(params) {
    this.params = params;
    this.patchData();
  }

  getParams() {
    const selectedPart = this.params.api.getSelectedRows();
    if (selectedPart) {
      this.selectedPart = selectedPart[0];
    }
  }

  // CELL EDITING
  cellEditingStarted(params) {
    this.editingRowParams = params;
    this.params.api.forEachNode(node => {
      if (node.data === params.data) {
        node.setSelected(true);
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
        this.params.api.forEachNode(rowNode => {
          if (params.rowIndex === rowNode.rowIndex && params.value) {
            rowNode.setDataValue('partsCode', params.value.replace(/[^a-zA-Z0-9]/g, ''));
          }
        });
        this.searchPartInfo({partsCode: params.value.replace(/[^a-zA-Z0-9]/g, '')});
        break;
      case 'qty':
        params.data.qty = this.dataFormatService.roundNumber(params.data.qty, 2);
        params.data.qty = +params.data.qty;
        if (!this.validateQty(params) || !this.validateTotalMatchedPatch()) {
          this.gridTableService.startEditCell(params);
          return;
        }
        params.data.sumPrice = +params.data.qty * +params.data.sellPrice;
        if (params.rowIndex === this.gridTableService.getAllData(this.params).length - 1) {
          this.gridTableService.setFocusCell(this.params, this.fieldGrid[1].field, null, params.rowIndex);
        }
        break;
    }
    params.api.refreshCells();
    this.getDisplayedData();
  }

  // CELL KEYBOARD EVENT
  agKeyUp(event) {
    event.stopPropagation();
    event.preventDefault();
    const keyCode = event.key;
    const srcElement = event.target as HTMLInputElement;
    const KEY_ENTER = 'Enter';
    const KEY_UP = 'ArrowUp';
    const KEY_DOWN = 'ArrowDown';
    const KEY_TAB = 'Tab';

    // Press enter to search with modal
    if (srcElement.classList.contains('partsCode') && keyCode === KEY_ENTER) {
      this.searchPartInfo({partsCode: srcElement.innerHTML});
    }
    const focusCell = this.params.api.getFocusedCell();
    // Press tab to search with modal
    const editCell = this.params.api.getEditingCells();
    if (editCell && editCell.length) {
      this.focusCellIndex = focusCell.rowIndex;
      if (keyCode === KEY_TAB && editCell[0].column.colId === 'qty') {
        this.params.api.tabToPreviousCell();
        const row = this.params.api.getDisplayedRowAtIndex(editCell[0].rowIndex);
        this.searchPartInfo({partsCode: row.data.partsCode});
      }
    }
    // Add new row with hot keys
    if (keyCode === KEY_DOWN) {
      if (focusCell.rowIndex === this.focusCellIndex && focusCell.rowIndex === this.displayedData.length - 1) {
        this.params.api.stopEditing();
        this.onAddRow();
      }
      this.focusCellIndex = focusCell.rowIndex;
    }
    if (keyCode === KEY_UP) {
      this.focusCellIndex = focusCell.rowIndex;
    }
  }

  searchPartInfo(val) {
    this.loadingService.setDisplay(true);
    this.partsInfoManagementApi.searchPartForOrder(val).subscribe(partsInfoData => {
      this.loadingService.setDisplay(false);
      partsInfoData.list.length === 1 ? this.setDataToRow(partsInfoData.list[0]) : this.searchPartGridModal.open(val, partsInfoData.list, partsInfoData.total);
    });
  }

  // ADD ROW
  get validateBeforeAddRow() {
    const fieldToCheck = {name: 'Mã phụ tùng', field: 'partsId'};
    return !(!this.agDataValidateService.checkRequiredHiddenFields(this.params, this.displayedData, fieldToCheck)
      || !this.agDataValidateService.validateDataGrid(this.params, this.fieldGrid, this.displayedData)
    );
  }

  onAddRow() {
    if (!this.validateBeforeAddRow) {
      return;
    }
    const blankPart = {
      stt: this.displayedData.length + 1,
      partsCode: undefined,
      partsName: undefined,
      unitName: undefined,
      onHandQty: undefined,
      ddQty: undefined,
      qty: undefined,
      dxQty: undefined,
      sellPrice: undefined,
      sumPrice: undefined,
      rate: undefined
    };
    this.params.api.updateRowData({add: [blankPart]});
    this.getDisplayedData();
    this.gridTableService.setFocusCell(this.params, 'partsCode', this.displayedData);
  }

  // DELETE SELECTED ROW
  deletePart() {
    if (!this.selectedPart) {
      this.toastService.openWarningToast('Bạn chưa chọn phụ tùng, hãy chọn một phụ tùng để xóa');
      return;
    }
    const index = this.orderDetailData ? this.orderDetailData.parts.indexOf(this.selectedPart) : -1;
    if (index !== -1) {
      this.loadingService.setDisplay(true);
      this.partsRetailApi.deletePartOfOrder(this.selectedOrder.id, this.selectedPart.partsId).subscribe(() => {
        this.toastService.openSuccessToast();
        this.removeSelectedRow();
        this.loadingService.setDisplay(false);
      });
    } else {
      this.removeSelectedRow();
    }
  }

  removeSelectedRow() {
    this.gridTableService.removeSelectedRow(this.params, this.selectedPart);
    this.selectedPart = undefined;
    this.getDisplayedData();
  }

  // SET DATA TO ROW
  setDataToRow(rowData) {
    this.partsRetailApi.getPartDetail(this.selectedOrder ? this.selectedOrder.id : null, rowData.id).subscribe(res => {
      const rowIndex = this.displayedData.indexOf(this.selectedPart);
      const val = {
        partsId: rowData.id,
        stt: rowIndex + 1,
        partsCode: rowData.partsCode,
        partsNameVn: rowData.partsNameVn,
        unit: rowData.unit,
        onHandQty: res.onHandQty,
        ddQty: res.ddQty,
        qty: 0,
        dxQty: res.dxQty,
        sellPrice: rowData.sellPrice,
        sumPrice: 0,
        rate: rowData.rate,

        frCd: rowData.frCd
      };
      this.gridTableService.setDataToRow(this.params, rowIndex, val, this.displayedData, 'qty');
      this.selectedPart = val;
      this.getDisplayedData();
    });
  }

  // SUBMIT DATA
  validateQty(params) {
    // Invalid if SL Cần - SL ĐX < 0
    if (+params.data.qty < 0 && +params.data.dxQty) {
      const dupplicatedParts = this.displayedData.filter(data => params.data.partsId === data.partsId);
      let totalQty = 0;
      let totaldxQty = 0;
      if (dupplicatedParts.length) {
        dupplicatedParts.forEach(part => {
          totalQty += part.qty;
          totaldxQty = part.dxQty;
        });
        if (totalQty - totaldxQty < 0) {
          this.toastService.openWarningToast(`Phụ tùng đã xuất, liên hệ với kho để xử lý, kiểm tra lại phụ tùng ${dupplicatedParts[0].partsCode}`);
          return false;
        }
      }
    }
    return true;
  }

  validateTotalMatchedPatch() {
    const newArray = Array.from(this.displayedData);
    const matchedArray = [];

    for (const part of newArray) {
      matchedArray.push(remove(newArray, (data) => {
        return data.partsId === part.partsId;
      }));
    }
    for (const childArray of matchedArray) {
      const total = childArray.reduce((a, b) => a + (b.qty || 0), 0);
      if (total < 0) {
        this.toastService.openWarningToast(`Mã phụ tùng ${childArray[0].partsCode} có tổng là ${total} < 0, vui lòng kiểm tra lại`);
        return false;
      }
    }
    return true;
  }

  viewOrder() {
    this.getDisplayedData();
    // Validate
    if (this.form.invalid) {
      return;
    }
    if (this.displayedData.length === 0) {
      this.toastService.openWarningToast('Danh sánh phụ tùng trống, hãy nhập ít nhất một phụ tùng để đặt hàng', 'Cảnh báo');
      return;
    }
    if (!this.validateBeforeAddRow || !this.validateTotalMatchedPatch()) {
      return;
    }
    this.checkingModal.open(this.selectedOrder, this.displayedData, this.form.getRawValue());
  }

  calculateFooterDetail() {
    let beforeTax = 0;
    let tax = 0;
    let taxIncluded = 0;
    let discount = 0;

    const discountPercent = this.form.value.discountPercent ? parseFloat(this.form.value.discountPercent) / 100 : 0;
    let discountEachPart = 0;

    for (const data of this.displayedData) {
      if (!data.sumPrice) {
        break;
      } else {
        data.sumPrice = Math.round(data.sumPrice);
        discountEachPart = discountPercent ? data.sumPrice * discountPercent
          : this.form.value.discountPrice ? parseFloat(this.form.value.discountPrice) / this.displayedData.length : 0;
        discount += discountEachPart;
        beforeTax += data.sumPrice;
        tax += (data.sumPrice - discountEachPart) * (data.rate / 100);
        taxIncluded += (data.sumPrice - discountEachPart) + (data.sumPrice - discountEachPart) * (data.rate / 100);
      }
    }

    this.totalPriceBeforeTax = this.dataFormatService.moneyFormat(beforeTax);
    this.taxOnly = this.dataFormatService.moneyFormat(tax);
    this.discount = this.dataFormatService.moneyFormat(discount);
    this.totalPriceIncludeTax = this.dataFormatService.moneyFormat(taxIncluded);
  }

  getDisplayedData() {
    const displayedData = [];
    this.params.api.forEachNode(node => {
      displayedData.push(node.data);
    });
    this.displayedData = displayedData;
    this.calculateFooterDetail();
  }

  disableCustomerForm(dataToCheck) {
    for (const key in this.form.controls) {
      if (dataToCheck.isCustomerSaler === 'false' || !dataToCheck.isCustomerSaler) {
        if (key !== 'discountPercent' && key !== 'discountPrice') {
          this.form.controls[key].disable();
        }
      } else {
        if (key !== 'orderNo' && key !== 'orderType') {
          this.form.controls[key].enable();
        }
      }
    }
  }

  searchCustomer(customerCode?) {
    this.loadingService.setDisplay(true);
    const searchVal = customerCode ? {cusno: this.form.getRawValue().customerCode} : {carownername: this.form.getRawValue().customerName};
    customerCode ? this.searchCustomerCodeModal.open(searchVal) : this.searchCustomerNameModal.open(searchVal);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      orderNo: [{value: undefined, disabled: true}],
      orderType: [{value: undefined, disabled: true}],
      customerTypeId: [undefined],
      mobile: [undefined, Validators.compose([GlobalValidator.phoneFormat, GlobalValidator.required])],
      salesdate: [new Date().getTime()],
      customerCode: [undefined],
      customerId: [undefined],
      phone: [undefined, GlobalValidator.phoneFormat],
      fax: [undefined, GlobalValidator.phoneFormat],
      account: [undefined, GlobalValidator.numberFormat],
      customerName: [undefined, GlobalValidator.required],
      companyName: [undefined],
      bankId: [undefined],
      address: [undefined, GlobalValidator.required],
      taxNo: [undefined, GlobalValidator.taxFormat],
      discountPercent: [0, GlobalValidator.floatNumberFormat0],
      discountPrice: [0, GlobalValidator.numberFormat]
    });
    // Only keep either discountPercent or discountValue
    this.form.get('discountPercent').valueChanges.subscribe(val => {
      if (val) {
        this.form.patchValue({discountPrice: null});
      }
      this.calculateFooterDetail();
    });
    this.form.get('discountPrice').valueChanges.subscribe(val => {
      if (val) {
        this.form.patchValue({discountPercent: null});
      }
      this.calculateFooterDetail();
    });
  }
}
