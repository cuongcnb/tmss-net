import {Component, ViewChild, Output, EventEmitter, OnInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

import {SetModalHeightService} from '../../../../../shared/common-service/set-modal-height.service';
import {CustomerApi} from '../../../../../api/customer/customer.api';
import {LoadingService} from '../../../../../shared/loading/loading.service';
import {GridTableService} from '../../../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vehicle-search',
  templateUrl: './vehicle-search.component.html',
  styleUrls: ['./vehicle-search.component.scss']
})
export class VehicleSearchComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() change = new EventEmitter();
  modalHeight: number;
  fieldGrid;
  params;
  selectedData;
  customerList: Array<any>;
  paginationParams;
  paginationTotalsData;
  customerInfo;
  rowClassRules;

  constructor(
    private modalHeightService: SetModalHeightService,
    private customerApi: CustomerApi,
    private loadingService: LoadingService,
    private gridTableService: GridTableService
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        width: 50,
        cellClass: ['cell-border'],
        cellRenderer: params => params.rowIndex + 1
      },
      {
        headerName: 'Tên khách hàng',
        headerTooltip: 'Tên khách hàng',
        field: 'carownername',
        cellClass: ['cell-border']
      },
      {
        headerName: 'Tel',
        headerTooltip: 'Tel',
        field: 'carownermobil',
        width: 120,
        cellClass: ['cell-border']
      },
      {
        headerName: 'Địa chỉ',
        headerTooltip: 'Địa chỉ',
        field: 'carowneradd',
        cellClass: ['cell-border']
      },
      {
        headerName: 'Biển số',
        headerTooltip: 'Biển số',
        field: 'registerNo',
        width: 90,
        cellClass: ['cell-border']
      },
      {
        headerName: 'Số VIN',
        headerTooltip: 'Số VIN',
        field: 'vinno',
        width: 180,
        cellClass: ['cell-border']
      }
    ];
    this.setColorForCustomer();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(dataSearch, registerNo?) {
    this.customerInfo = dataSearch;
    this.resetPaginationParams();
    this.search(this.customerInfo, registerNo);
    this.onResize();
  }

  callbackGrid(params) {
    this.params = params;
    this.params.api.setRowData(this.customerList);
    setTimeout(() => {
      this.gridTableService.setFocusCell(this.params, this.fieldGrid[1].field);

    }, 100);
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  search(dataSearch, registerNo?) {
    let obj = !!(dataSearch.registerNo && registerNo && dataSearch.registerNo !== registerNo)
      ? {
        registerNo: dataSearch.registerNo,
        vinno: null,
        carownermobil: null,
        carownername: null
      }
      : {
        registerNo: dataSearch.registerNo,
        vinno: dataSearch.vinno,
        carownermobil: dataSearch.carownermobil,
        carownername: dataSearch.carownername
      };

    // Tìm kiếm chính xác theo biển số đã nhập
    if (dataSearch.hasOwnProperty('searchNoneLike')) {
      obj = Object.assign({}, obj, {searchNoneLike: dataSearch.searchNoneLike});
    }

    this.loadingService.setDisplay(true);
    this.customerApi.getCustomerData(obj, this.paginationParams)
      .subscribe((val: { list: Array<any>, total: any }) => {
        this.loadingService.setDisplay(false);
        if (val && val.list) {
          if (val.list.length < 1) {
            this.change.emit({registerNo: dataSearch.registerNo});
          }
          if (val.list.length === 1) {
            this.selectedData = val.list[0];
            this.change.emit(this.selectedData);
          }
          if (val.list.length > 1) {
            this.customerList = val.list;
            this.paginationTotalsData = val.total;
            if (this.params) {
              this.params.api.setRowData(this.customerList);
              setTimeout(() => {
                this.gridTableService.setFocusCell(this.params, this.fieldGrid[1].field);

              }, 100);
            }
            this.modal.show();

          }
        }
      });

  }

  agKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    const keyCode = event.key;
    const KEY_ENTER = 'Enter';


    // Press enter to search with modal
    if (keyCode === KEY_ENTER) {
      this.change.emit(this.selectedData);
      this.modal.hide();
    }

  }

  changePaginationParams(paginationParams) {
    if (!this.customerList) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search(this.customerInfo);
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  confirm() {
    this.change.emit(this.selectedData);
    this.modal.hide();
  }

  private setColorForCustomer() {
    this.rowClassRules = {
      'is-repairing': params => params.data.cusvsStatus === 1,
      'is-quotes': params => params.data.cusvsStatus === 2,
      'is-order': params => params.data.cusvsStatus === 3
    };
  }
}
