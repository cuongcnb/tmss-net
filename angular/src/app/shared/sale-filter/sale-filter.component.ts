import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormStoringService} from '../common-service/form-storing.service';
import {StorageKeys} from '../../core/constains/storageKeys';
import {FilterService} from '../../api/lookup/filter.service';
import {LoadingService} from '../loading/loading.service';
import {SetModalHeightService} from '../common-service/set-modal-height.service';
import {DlrVehicleInformationService} from '../../api/swapping/dlr-vehicle-information.service';
import {NationwideSellingListService} from '../../api/swapping/nationwide-selling-list.service';
import {DispatchChangeRequestService} from '../../api/swapping/dispatch-change-request.service';
import {VehicleArrivalService} from '../../api/daily-sale/vehicle-arrival.service';
import {ContractManagementService} from '../../api/daily-sale/contract-management.service';
import {PaymentFollowupService} from '../../api/tfs/payment-followup.service';
import {CbuVehicleInfoService} from '../../api/daily-sale/cbu-vehicle-info.service';
import {DataFormatService} from '../common-service/data-format.service';
import {ToastService} from '../common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sale-filter',
  templateUrl: './sale-filter.component.html',
  styles: []
})
export class SaleFilterComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('editFilterRowModal', {static: false}) editFilterRowModal;
  @ViewChild('saveSaleFilterModal', {static: false}) saveSaleFilterModal;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Input() filterStartForm;
  @Input() searchParams;
  @Input() paginationParams;
  selectedFilter: number;
  modalHeight: number;
  fieldGrid;
  params;

  selectedData;
  displayedData = [];
  filterFieldArr = [];
  savedFilters;
  currentUser;
  caller: string;

  constructor(
    private filterService: FilterService,
    private formStoringService: FormStoringService,
    private setModalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dlrVehicleInformationService: DlrVehicleInformationService,
    private nationwideSellingListService: NationwideSellingListService,
    private dispatchChangeRequestService: DispatchChangeRequestService,
    private vehicleArrivalService: VehicleArrivalService,
    private contractManagementService: ContractManagementService,
    private paymentFollowupService: PaymentFollowupService,
    private cbuVehicleInfoService: CbuVehicleInfoService,
    private dataFormatService: DataFormatService
  ) {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'Field Name',
        field: 'fieldName',
        resizable: true,
        valueFormatter: params => this.dataFormatService.formatFilterDescription(params.value, this.filterFieldArr),
      },
      {
        field: 'condition',
        resizable: true,
      },
      {
        headerName: 'Value',
        field: 'value',
        resizable: true,
        valueFormatter: params => {
          let val = params.value;
          if (params.data.fieldName) {
            const matchField = this.filterFieldArr.find(field => field.fieldName === params.data.fieldName);
            if (matchField.dateField) {
              val = this.dataFormatService.formatDateSale(params.value);
            }
          }
          return val;
        }
      },
      {
        field: 'connective',
        resizable: true,
      },
    ];
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  getFieldsAndSavedFilters(caller: string) {
    this.loadingService.setDisplay(true);
    this.filterService.getFilterField(caller).subscribe(savedFilterAndField => {
      this.filterFieldArr = savedFilterAndField.filterFieldList;
      this.savedFilters = savedFilterAndField.savedFilterDetail;
      this.loadingService.setDisplay(false);
    });
  }

  open(caller?: string) {
    this.caller = caller ? caller : '';
    this.getFieldsAndSavedFilters(this.caller);
    this.modal.show();
  }

  resetModal() {
    this.params.api.deselectAll();
    this.selectedData = undefined;
  }

  callbackGrid(params) {
    this.params = params;
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  editRow(params) {
    const selectedData = params.api.getSelectedRows();
    this.selectedData = selectedData[0];
    if (this.selectedData) {
      this.editFilterRowModal.open(this.filterFieldArr, this.selectedData);
    }
  }

  onSelectFilter() {
    if (this.selectedFilter) {
      this.loadingService.setDisplay(true);
      this.filterService.getSaveFilterDetail(this.selectedFilter).subscribe(filterDetail => {
        this.params.api.setRowData(filterDetail);
        const allColumnIds = [];
        this.params.columnApi.getAllColumns().forEach(column => { allColumnIds.push(column.colId); });
        this.params.columnApi.autoSizeColumns(allColumnIds);
    //     this.params.api.columnApi.getAllColumns().forEach(function(column) {
    //     allColumnIds.push(column.colId);
    // });
        this.params.api.columnApi.autoSizeColumns(allColumnIds);
        this.loadingService.setDisplay(false);
        this.getDisplayedData();
      });
    } else {
      this.params.api.setRowData([]);
      this.getDisplayedData();
    }
  }

  deleteSavedFilter() {
    if (this.selectedFilter) {
      this.loadingService.setDisplay(true);
      this.filterService.deleteSavedFilter(this.selectedFilter).subscribe(() => {
        this.getFieldsAndSavedFilters(this.caller);
        this.loadingService.setDisplay(false);
        this.getFieldsAndSavedFilters(this.caller);
        this.swalAlertService.openSuccessModal();
      });
    }
  }

  // Validate data
  get checkConnective() {
    let missingConnective = true;
    if (this.displayedData.length <= 1) {
      missingConnective = false;
    } else {
      const remainList = [].concat(this.displayedData);
      // remove last item
      remainList.pop();
      if (remainList.length > 0) {
        missingConnective = !!(remainList.find(item => !item.connective));
        if (missingConnective) {
          this.swalAlertService.openFailModal('Please fill in Connective of each condition');
        }
      }
    }
    return missingConnective;
  }

  // Send
  get convertDataBeforeSend() {
    const dataToSend = [];
    if (this.displayedData && this.displayedData.length > 0) {
      this.displayedData[this.displayedData.length - 1].connective = undefined;
      this.params.api.setRowData(this.displayedData);
      const displayedData = this.displayedData;

      displayedData.forEach(data => {
        const matchField = this.filterFieldArr.find(field => data.fieldName === field.fieldName);
        if (matchField) {
          if (matchField.dateField) {
            data.value = this.dataFormatService.formatDateSale(data.value);
          }
          data = Object.assign({}, data, { dealerId: this.currentUser.dealerId, formId: 'STOCK_VEH' });
        }
        data.condition = (data.condition === 'Is Blank' ? data.condition = 'Is Null' : data.condition === 'Is Not Blank' ?
          data.condition = 'Is Not Null' : data.condition);
        dataToSend.push(data);
      });

      // Delete Connective of the last Filter before submit
      dataToSend[dataToSend.length - 1].connective = undefined;
    }
    return dataToSend;
  }

  startFilter() {
    if (!this.checkConnective) {
      this.close.emit(this.convertDataBeforeSend);
      this.modal.hide();
    }
  }

  saveAs() {
    if (!this.checkConnective) {
      this.saveSaleFilterModal.open(this.displayedData, this.filterFieldArr, this.caller);
    }
  }

  onAddRow() {
    const blankFilter = {
      fieldName: null,
      condition: null,
      value: null,
      connective: null,
    };
    this.params.api.updateRowData({ add: [blankFilter] });
    this.getDisplayedData();
  }

  removeSelectedRow() {
    this.params.api.updateRowData({ remove: [this.selectedData] });
    this.selectedData = undefined;
    this.getDisplayedData();
  }

  setDataToRow(rowData) {
    if (rowData.isUpdate) {
      const index = this.displayedData.indexOf(this.selectedData);
      this.displayedData[index] = rowData.value;
    } else {
      this.displayedData.push(rowData.value);
    }
    this.params.api.setRowData(this.displayedData);
    const allColumnIds = [];
    this.params.columnApi.getAllColumns().forEach(column => { allColumnIds.push(column.colId); });
    this.params.columnApi.autoSizeColumns(allColumnIds);
    this.getDisplayedData();
  }

  getDisplayedData() {
    const displayedData = [];
    this.params.api.forEachNode(node => {
      displayedData.push(node.data);
    });
    this.displayedData = displayedData;
  }

}
