import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {GridExportService} from '../../../shared/common-service/grid-export.service';
import {ContractManagementService} from '../../../api/daily-sale/contract-management.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {GradeListService} from '../../../api/master-data/grade-list.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FilterFormCode} from '../../../core/constains/filter-form-code';
import {ContractAggrid} from '../../../core/constains/contract-management-ag-edit-modal';
import {ColorListService} from '../../../api/master-data/color-list.service';
import {AudioManagementService} from '../../../api/master-data/audio-management.service';
import {PaginationParamsModel} from '../../../core/models/base.model';
import {LookupService} from '../../../api/lookup/lookup.service';
import {LookupCodes} from '../../../core/constains/lookup-codes';
import {BankManagementService} from '../../../api/master-data/bank-management.service';
import {forkJoin} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'contract-management',
  templateUrl: './contract-management.component.html',
  styleUrls: ['./contract-management.component.scss']
})
export class ContractManagementComponent implements OnInit, OnChanges {
  @ViewChild('addContractModal', {static: false}) addContractModal;
  @ViewChild('addMultiContractModal', {static: false}) addMultiContractModal;
  @ViewChild('contractSaleModal', {static: false}) contractSaleModal;
  @ViewChild('cancelContractModal', {static: false}) cancelContractModal;
  @ViewChild('contractChangeModal', {static: false}) contractChangeModal;
  @ViewChild('changeDeliveryDateModal', {static: false}) changeDeliveryDateModal;
  @ViewChild('contractColorEditModal', {static: false}) contractColorEditModal;
  @ViewChild('estimateDiffTool', {static: false}) estimateDiffTool: ElementRef;
  @ViewChild('saleLeadtimeTool', {static: false}) saleLeadtimeTool: ElementRef;
  @ViewChild('agCellEditModal', {static: false}) agCellEditModal;
  @Input() filterStartForm;
  @Input() currentFilterFormType: string;
  isDlrContract;
  paginationTotalsData: number;
  paginationParams: PaginationParamsModel;
  fieldGridContract;
  searchForm: FormGroup;
  searchParams;
  rowClassRules;
  exportParams;
  contractParams;
  selectedContract;
  contracts;
  dealers;
  totalNumber = 0;
  saleNumber = 0;
  cancelNumber = 0;
  waitConfirmNumber = 0;
  filterFormCode = FilterFormCode;

  fieldGradeList;
  gradeList;
  filterDataList = [];
  isOnlyWaiting: boolean;
  apiExport = '/contract/export-to-excel';
  fileName = 'ContractManagement.xlsx';

  constructor(
    private contractManagementService: ContractManagementService,
    private dealerListService: DealerListService,
    private gradeListService: GradeListService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private audioService: AudioManagementService,
    private dataFormatService: DataFormatService,
    private formBuilder: FormBuilder,
    private bankService: BankManagementService,
    private lookupService: LookupService,
    private formStoringService: FormStoringService,
    private gridExportService: GridExportService,
    private colorListService: ColorListService,
    private toastrService: ToastrService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.filterStartForm || (this.currentFilterFormType && this.currentFilterFormType !== FilterFormCode.contract)) {
      this.filterStartForm = this.formStoringService.get(StorageKeys.contractFilterStartModal);
    }

    if (this.contractParams) {
      this.contractParams.api.refreshCells();
    }
    this.rowClassRules = {
      'is-wait-confirm': (params) => {
        if (!params || !params.data) {
          return false;
        } else {
          return this.isUndoCanceled(params.data) || this.isChanged(params.data);
        }
      }
    };
    this.resetPaginationParams();
    if ((!this.currentFilterFormType || this.currentFilterFormType === FilterFormCode.contract) && this.searchForm) {
      this.search(this.searchForm ? this.searchForm.value : null);
    }

    if (this.filterStartForm && this.filterStartForm.filterContract) {
      this.isOnlyWaiting = this.filterStartForm.filterContract.onlyWaiting;
    }
  }

  ngOnInit() {
    this.fieldGradeList = [
      {
        headerName: 'marketing code',
        field: 'marketingCode'
      }
    ];

    this.fieldGridContract = [
      {
        headerName: 'Vehicle Information',
        children: [
          {
            headerName: 'Type',
            field: 'cbuCkd',
            cellRenderer: params => {
              const cbuCkd = params.data.cbuCkd;
              if (cbuCkd === 'Y') {
                return 'CBU';
              } else if (cbuCkd === 'L') {
                return 'Lexus';
              } else {
                return 'CKD';
              }
            },
            resizable: true,
            pinned: true
          },
          {
            field: 'grade', pinned: true,
            cellClass: params => {
              return params.data.listChangeFields.indexOf('gradeNewId') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {headerName: 'GradeProd', field: 'gradeProduction', pinned: true, resizable: true},
          {
            headerName: 'FrameNo', field: 'frameNo', pinned: true,
            cellClass: params => {
              return params.data.listChangeFields.indexOf('frameNoNew') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            headerName: ContractAggrid.color.headerName,
            field: ContractAggrid.color.fieldName,
            pinned: true,
            cellClass: () => {
              return this.isOnlyWaiting ? ['cell-border'] : ['cell-border'];
            },
            resizable: true
          },
          {headerName: 'LineOffMonth', field: 'lineOffDate', pinned: true, resizable: true},
          {headerName: 'TMVInvoice', field: 'payActualInvoiceDate', pinned: true, resizable: true},
          {headerName: 'ArrivalDate', field: 'arrivalDate', pinned: true, resizable: true},
          {headerName: 'EngineNo', field: 'engineNo', pinned: true, resizable: true},
          {field: 'vin', pinned: true, resizable: true},
          {field: 'dealer', pinned: true, resizable: true}
        ]
      },
      {
        headerName: 'Contract Header',
        children: [
          {headerName: 'Contract No.', field: 'contractNo', resizable: true},
          {field: 'wodDate', resizable: true},
          {
            field: 'depositDate',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('depositDateNew') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            headerName: ContractAggrid.paymentType.headerName,
            field: ContractAggrid.paymentType.fieldName,
            cellEditModal: {
              sendMultipleRows: true,
              type: 'select',
              fieldToSet: 'paymentTypeId',
              select: {
                keyField: 'id',
                valueField: 'name',
                api: this.lookupService.getDataByCode(LookupCodes.payment_type)
              }
            }
          },
          {
            headerName: ContractAggrid.bank.headerName,
            field: ContractAggrid.bank.fieldName,
            cellEditModal: {
              sendMultipleRows: true,
              type: 'select',
              fieldToSet: 'bankId',
              select: {
                keyField: 'id',
                valueField: 'bankName',
                api: this.bankService.getAvailableBanks()
              }
            }
          },
          {
            headerName: ContractAggrid.amount.headerName,
            field: ContractAggrid.amount.fieldName,
            cellEditModal: {
              sendMultipleRows: true,
              type: 'number'
            },
            // cellRenderer: params => {
            //   return params.data.amount ? Number(params.data.amount) : null;
            // },
            cellRenderer: params => {
              return params.data.amount ? parseFloat(params.data.amount).toLocaleString() : null;
            }
          },
          {headerName: 'F_R', field: 'contractType'}
        ]
      },
      {
        headerName: 'Contract Cancelation',
        children: [
          {
            headerName: 'Cancel Date',
            cellRenderer: params => {
              const data = params.data;
              const value = data.cancelDateNew ? (data.cancelDate ? data.cancelDate : data.cancelDateNew) : data.cancelDate;
              return `<span>${this.dataFormatService.formatDateSale(value)}</span>`;
            },
            cellClass: params => {
              return params.data.cancelDateNew && !params.data.cancelDate ? ['cell-border', 'is-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            field: 'cancelType',
            cellClass: params => {
              return params.data.cancelDateNew && !params.data.cancelDate ? ['cell-border', 'is-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            headerName: 'Detail Reason',
            field: 'cancelReasonText',
            cellClass: params => {
              return params.data.cancelDateNew && !params.data.cancelDate ? ['cell-border', 'is-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          }
        ]
      },
      {
        headerName: 'Customer Information',
        children: [
          {
            field: 'customerName',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeCustomer') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            field: 'contractRepresentative',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeContractRepresentative') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            field: 'customerAddress',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeCustomerAddress') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {field: 'province', resizable: true},
          {headerName: 'Tel', field: 'tel', resizable: true,
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeTel') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
          },
          {field: 'legalStatus', resizable: true},
          {headerName: 'ID No/Tax Code', field: 'taxCode', resizable: true}
        ]
      },
      {
        headerName: 'Contact Person',
        children: [
          {
            field: 'contactName',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeContactName') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            field: 'contactAddress',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeContactAddress') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            headerName: 'Contact Tel', field: 'contactTel',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeContactTel') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          }
        ]
      },
      {
        headerName: 'Invoice Information',
        children: [
          {
            field: 'invoiceName',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeInvoiceName') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            field: 'invoiceAddress',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeInvoiceAddress') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {field: 'age', minWidth: 70, resizable: true}
        ]
      },
      {
        headerName: 'Survey Information',
        children: [
          {field: 'purchasingTypes', resizable: true},
          {field: 'purchasingPurposes', resizable: true},
          {headerName: 'Driver/Self', field: 'driver', resizable: true},
          {field: 'gender', resizable: true},
          {field: 'email', resizable: true}
        ]
      },
      {
        headerName: 'Delivery Information',
        children: [
          {
            headerName: 'Original Est Date',
            field: 'estimatedDate',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeNewEstimatedDate') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            field: 'estimatedDateNew',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeNewEstimatedDate') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            field: 'estimatedReasonType',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeEstimatedReasonId') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            field: 'newReasonType',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeEstimatedReasonId') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            headerName: 'Detail Reason', field: 'estimatedReasonText',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeEstimatedReasonText') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            headerName: 'Change Detail Reason', field: 'changeEstimatedReasonText',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('changeEstimatedReasonText') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            field: 'salesDate',
            cellClass: params => {
              return params.data.listChangeFields.indexOf('salesDateNew') > -1 ? ['cell-border', 'cell-wait-confirm'] : ['cell-border'];
            },
            resizable: true
          },
          {
            field: 'deliveryDate',
            resizable: true
          },
          {field: 'estimatedDiff', resizable: true},
          {field: 'saleLeadtime', resizable: true}
        ]
      },
      {
        headerName: 'Price & Commission',
        children: [
          {
            field: 'orderPrice',
            cellRenderer: params => {
              return params.data.orderPrice ? parseFloat(params.data.orderPrice).toLocaleString() : null;
            },
            resizable: true
          },
          {
            field: 'commissionPrice',
            cellRenderer: params => {
              return params.data.commissionPrice ? parseFloat(params.data.commissionPrice).toLocaleString() : null;
            },
            resizable: true
          },
          {
            field: 'discountPrice',
            cellRenderer: params => {
              return params.data.discountPrice ? parseFloat(params.data.discountPrice).toLocaleString() : null;
            },
            resizable: true
          },
          {
            field: 'otherPromotionValue',
            cellRenderer: params => {
              return params.data.otherPromotionValue ? parseFloat(params.data.otherPromotionValue).toLocaleString() : null;
            },
            resizable: true
          },
          {field: 'salePerson', resizable: true},
          {
            headerName: ContractAggrid.dlrRemarkForSale.headerName,
            field: ContractAggrid.dlrRemarkForSale.fieldName,
            cellEditModal: {
              sendMultipleRows: true,
              type: 'text'
            },
            cellClass: () => {
              return !this.currentUser.isAdmin && !this.isOnlyWaiting ? ['cell-clickable', 'cell-border'] : ['cell-border'];
            },
            resizable: true
          },
          {
            headerName: ContractAggrid.tmvRemark.headerName,
            field: ContractAggrid.tmvRemark.fieldName,
            cellEditModal: {
              sendMultipleRows: true,
              type: 'text'
            },
            cellClass: () => {
              return this.currentUser.isAdmin && !this.isOnlyWaiting ? ['cell-clickable', 'cell-border'] : ['cell-border'];
            },
            resizable: true
          },
          {
            headerName: ContractAggrid.dlrRemarkForCs.headerName,
            field: ContractAggrid.dlrRemarkForCs.fieldName,
            cellEditModal: {
              sendMultipleRows: true,
              type: 'text'
            }
          },
          {headerName: 'End DLR Sales', field: 'endDlrSales', resizable: true},
          {headerName: 'Sales DLR', field: 'salesDlr', resizable: true},
          {headerName: 'DLR Outlet', field: 'dlrOutlet', resizable: true},
          {field: 'district', resizable: true},
          {field: 'buyInsurance', resizable: true},
          {field: 'insuranceCompanyName', resizable: true}
        ]
      }
    ];

    this.isDlrContract = !this.currentUser.isAdmin;
    this.startUpApi();
    this.rowClassRules = {
      'is-wait-confirm': (params) => {
        if (!params || !params.data) {
          return false;
        } else {
          return this.isUndoCanceled(params.data) || this.isChanged(params.data);
        }
      }
    };
  }

  startUpApi() {
    this.loadingService.setDisplay(true);
    const gradeApi = this.currentUser.isAdmin ? this.gradeListService.getGrades(true) : this.currentUser.isLexus
      ? this.gradeListService.getGrades(true, 'lexusOnly')
      : this.gradeListService.getGrades(true, 'notLexus');
    forkJoin([
      gradeApi,
      this.dealerListService.getDealers()
    ]).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.gradeList = res[0];
      this.dealers = res[1];
      this.buildForm();
      this.search(this.searchForm ? this.searchForm.value : null);
    });
  }

  rowEditApi(rowData) {
    return this.contractManagementService.updateContractFollowup(rowData);
  }

  sizeColumnToHeaderWidth(params) {
    if (params) {
      const allColumnIds = [];
      params.columnApi.getAllColumns().forEach(column => {
        allColumnIds.push(column.colId);
      });
      setTimeout(() => {
        params.columnApi.autoSizeColumns(allColumnIds);
      });
    }
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  get currentUser() {
    return this.formStoringService.get(StorageKeys.currentUser);
  }

  isCanSale(val): boolean {
    return val && val.dealer && val.dealer === this.currentUser.dealerName && !val.salesDate;
  }

  isCanDelivery(val): boolean {
    return val && val.dealer && val.dealer === this.currentUser.dealerName && val.salesDate && !val.deliveryDate;
  }

  isCanceled(val): boolean {
    return val && val.cancelDateNew && !val.cancelDate;
  }

  isUndoCanceled(val): boolean {
    return val && val.cancelDateNew && val.cancelDate;
  }

  isCancel(val) {
    return val && val.cancelDate;
  }

  isChanged(val): boolean {
    return val && val.listChangeFields && val.listChangeFields.length;
  }

  callbackGridContract(params) {
    this.selectedContract = null;
    this.contractParams = params;
  }

  getParamsContract() {
    const selectedVehicle = this.contractParams.api.getSelectedRows();
    if (selectedVehicle) {
      this.selectedContract = selectedVehicle[0];
    }
  }

  refreshContract() {
    this.resetPaginationParams();
    this.search(this.searchForm.value);
  }

  modifyContract() {
    if (!this.selectedContract) {
      this.toastrService.error('You must choose a contract', 'Error');
    } else {
      // tslint:disable-next-line:max-line-length
      this.addContractModal.open(this.selectedContract.id, !this.isCanSale(this.selectedContract));
    }
  }

  addMultiContract() {
    if (!this.selectedContract) {
      this.toastrService.error('You must choose a contract', 'Error');

    } else {
      if (this.selectedContract.contractType === 'F') {
        this.toastrService.error('You cant add (n) contract because this contract is fleet sales application', 'Error');
      } else {
        this.addMultiContractModal.open(this.selectedContract.id, this.gradeList);
      }
    }
  }

  contractSale() {
    if (!this.selectedContract) {
      this.toastrService.error('You must choose a contract', 'Error');
    } else {
      if (this.selectedContract.cancelDate || this.selectedContract.cancelDateNew) {
        this.toastrService.error('You can\'t sale this car because the contract is canceled', 'Error');
      } else {
        this.contractSaleModal.open(this.selectedContract.id);
      }
    }
  }

  cancelContract() {
    if (!this.selectedContract) {
      this.toastrService.error('You must choose a contract', 'Error');
    } else {
      this.cancelContractModal.open(this.selectedContract.id);
    }
  }

  changeContract() {
    if (!this.selectedContract) {
      this.toastrService.error('You must choose a contract', 'Error');
    } else {
      this.contractChangeModal.open(this.selectedContract.id);
    }
  }

  changeDelivery() {
    if (!this.selectedContract) {
      this.toastrService.error('You must choose a contract', 'Error');
    } else {
      this.changeDeliveryDateModal.open(this.selectedContract.id);
    }
  }

  exportCsv() {
    this.loadingService.setDisplay(true);
    this.contractManagementService.searchContract(this.filterStartForm, this.searchParams, {filters: []}).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.exportParams.api.setRowData(res && res.contractList ? res.contractList : []);
      this.gridExportService.export(this.exportParams, 'Contract Management');
    });
  }

  exportToExcel() {
    this.paginationParams = this.paginationParams || {
      sortType: null,
      page: 1,
      size: 20,
      filters: [],
      fieldSort: null
    };
    const filterContractInside = Object.assign({}, this.filterStartForm, this.paginationParams, this.searchParams);
    if (this.paginationParams.page === 0) {
      this.paginationParams.page = 1;
    }
    this.gridExportService.onExportFile(this.apiExport, filterContractInside, this.fileName);
  }

  submitSearch() {
    this.resetPaginationParams();
    this.search(this.searchForm.value);
  }

  agCellDoubleClicked(params) {
    const field = params.colDef.field;
    let column;
    if (ContractAggrid[field]) {
      column = params.colDef;
    }
    if (column) {
      if (field === 'color') {
        // user different edit modal for color
        this.contractColorEditModal.open(params.data, column);
      } else {
        this.agCellEditModal.open(params.data, column);
      }
    }
  }

  cellMouseOver(params) {
    const field = params.colDef.field;
    if (field === 'estimatedDiff') {
      this.estimateDiffTool.nativeElement.style.visibility = 'visible';
      this.estimateDiffTool.nativeElement.style.left = `${params.event.clientX}px`;
      this.estimateDiffTool.nativeElement.style.top = `${params.event.clientY}px`;
    }
    if (field === 'saleLeadtime') {
      this.saleLeadtimeTool.nativeElement.style.visibility = 'visible';
      this.saleLeadtimeTool.nativeElement.style.left = `${params.event.clientX}px`;
      this.saleLeadtimeTool.nativeElement.style.top = `${params.event.clientY}px`;
    }
  }

  cellMouseOut(params) {
    const field = params.colDef.field;
    if (field === 'estimatedDiff') {
      this.estimateDiffTool.nativeElement.style.visibility = 'hidden';
    }
    if (field === 'saleLeadtime') {
      this.saleLeadtimeTool.nativeElement.style.visibility = 'hidden';
    }
  }

  setDataToRow(contract) {
    const index = this.contracts.indexOf(this.selectedContract);
    this.contracts[index] = contract;
    this.contractParams.api.setRowData(this.contracts);
  }

  changePaginationParams(paginationParams) {
    if (!this.contracts) {
      return;
    }

    this.paginationParams = paginationParams;
    this.search(this.searchForm.value);
  }

  searchWithSaleFilter(filterDataList) {
    this.resetPaginationParams();
    this.filterStartForm.filterDataList = filterDataList;
    this.search(this.searchForm.value);
  }

  setFilterModel(params) {
    if (this.paginationParams && this.paginationParams.filters.length) {
      const obj = {};
      this.paginationParams.filters.map(item => {
        obj[item.fieldFilter] = {
          type: 'contains',
          filterType: 'text',
          filter: item.filterValue
        };
      });

      params.api.setFilterModel(obj);
    }
  }

  private search(searchParams?) {
    this.searchParams = !this.currentUser.isAdmin ? {
      dealer_id: this.currentUser.dealerId
    } : null;
    this.searchParams = Object.assign({}, this.searchParams, searchParams, {gradeControl: undefined});
    this.loadingService.setDisplay(true);
    this.contractManagementService.searchContract(this.filterStartForm, this.searchParams, this.paginationParams).subscribe(res => {
      if (res) {
        this.paginationTotalsData = res.total;
        this.contracts = res.contractList;
        const footerData = res.contractFooterData;
        this.totalNumber = footerData ? footerData.total : 0;
        this.saleNumber = footerData ? footerData.saleAmount : 0;
        this.cancelNumber = footerData ? footerData.cancelAmount : 0;
        this.waitConfirmNumber = footerData ? footerData.waitConfirmAmount : 0;
      } else {
        this.paginationTotalsData = 0;
        this.contracts = [];

        this.totalNumber = 0;
        this.saleNumber = 0;
        this.cancelNumber = 0;
        this.waitConfirmNumber = 0;
      }

      setTimeout(() => {
        if (this.contractParams) {
          this.contractParams.api.setRowData(this.contracts);
          this.setFilterModel(this.contractParams);
          const allColumnIds = [];
          this.contractParams.columnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));
          this.contractParams.columnApi.autoSizeColumns(allColumnIds);
          if (this.selectedContract) {
            this.contractParams.api.forEachNode((node) => {
              if (node.data.id === this.selectedContract.id) {
                node.setSelected(true);
              }
            });
          }
        }
        this.loadingService.setDisplay(false);
      }, 500);
    });
  }

  private buildForm() {
    this.searchForm = this.formBuilder.group({
      gradeControl: [undefined],
      gradeId: [undefined],
      dealerId: [undefined],
      searchKey: [undefined]
    });
    if (!this.currentUser.isAdmin) {
      this.searchForm.patchValue({
        dealerId: this.currentUser.dealerId
      });
    }
    this.searchForm.get('gradeControl').valueChanges.subscribe(val => {
      this.searchForm.patchValue({
        gradeId: val ? val.id : undefined
      });
    });
  }
}
