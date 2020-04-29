import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { CustomerReceptingModel } from '../../../../core/models/queuing-system/customer-service-reception.model';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { QueuingApi } from '../../../../api/queuing-system/queuing.api';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'customer-waiting',
  templateUrl: './customer-waiting.component.html',
  styleUrls: ['./customer-waiting.component.scss'],
})
export class CustomerWaitingComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @Output() choose = new EventEmitter();
  fieldGrid;
  params;
  selectedData: CustomerReceptingModel;
  list: Array<CustomerReceptingModel>;
  modalHeight: number;
  registerNo: string;

//   this.rowClassRules = {
//   'is-repairing': (params) => {
//     return params.data.status === 1;
//   },
//   'is-has-proposal': (params) => {
//     return params.data.status === 2;
//   },
//   'is-has-booking': (params) => {
//     return params.data.status === 3;
//   },
//   'not-required': (params) => {
//     return params.data.status === 4;
//   },
// };

  constructor(
    private modalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private queuingApi: QueuingApi,
    private dataFormatService: DataFormatService,
  ) {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
      },
      {headerName: 'Bàn', headerTooltip: 'Bàn', field: 'deskName'},
      {headerName: 'Cố vấn dịch vụ', headerTooltip: 'Cố vấn dịch vụ', field: 'empName'},
      {
        headerName: 'Loại KH', headerTooltip: 'Loại khách hàng', cellClass: ['text-center', 'cell-border'],
        cellRenderer: params => {
          if (params.data.isAppointment === 'Y') {
            return 'Hẹn';
          }
          if (params.data.isWarranty === 'Y') {
            return 'Bảo hành';
          }
          if (params.data.isReRepair === 'Y') {
            return 'Sửa chữa lại';
          }
          if (params.data.is1K === 'Y') {
            return '1K';
          }
          return 'KHDV';
        },
      },
      {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'registerNo'},
      {
        headerName: 'Giờ vào',
        headerTooltip: 'Giờ vào',
        field: 'inDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
      },
      {
        headerName: 'YCSC', headerTooltip: 'Yêu cầu sửa chữa', cellClass: ['text-center', 'cell-border'],
        cellRenderer: params => {
          let result = '';
          if (params.data.isMa === 'Y') {
            result += 'BD';
          }
          if (params.data.isGj === 'Y') {
            result += result.length ? ' + GJ' : 'GJ';
          }
          if (params.data.isBp === 'Y') {
            result += result.length ? ' + BP' : 'BP';
          }
          return result;
        },
      },
    ];
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  reset() {
    this.list = null;
    this.selectedData = undefined;
  }

  open() {
    this.search();
    this.modal.show();
  }

  callbackGrid(params) {
    this.params = params;
    this.params.api.setRowData(this.list);
  }

  getParams() {
    const selected = this.params.api.getSelectedRows();
    if (selected) {
      this.selectedData = selected[0];
    }
  }

  onKeyUp(e) {
    if (e.key === 'Enter') {
      this.search();
    }
  }

  search() {
    this.loadingService.setDisplay(true);
    this.queuingApi.searchCustomerWaiting(this.registerNo).subscribe(list => {
      this.loadingService.setDisplay(false);
      this.list = list || [];
      if (this.params) {
        this.params.api.setRowData(this.list);
      }
    });
  }

  chooseVehicle() {
    if (!this.selectedData) {
      this.swalAlertService.openWarningToast(' ', 'Bạn cần chọn 1 khách hàng');
      return;
    }

    this.loadingService.setDisplay(true);
    this.queuingApi.modifyUserIntoCustomer(this.selectedData.id, 'add').subscribe(() => {
      this.loadingService.setDisplay(false);
      this.choose.emit(this.selectedData.registerNo);
      this.modal.hide();
    });
  }

  unChooseVehicle() {
    if (!this.selectedData) {
      this.swalAlertService.openWarningToast(' ', 'Bạn cần chọn 1 khách hàng');
      return;
    }
    this.loadingService.setDisplay(true);
    this.queuingApi.modifyUserIntoCustomer(this.selectedData.id, 'remove').subscribe(() => {
      this.loadingService.setDisplay(false);
      // this.choose.emit(this.selectedData.registerNo);
      this.modal.hide();
    });
  }

  viewVehicle() {
    if (!this.selectedData) {
      this.swalAlertService.openWarningToast(' ', 'Bạn cần chọn 1 khách hàng');
      return;
    }
    this.choose.emit(this.selectedData.registerNo);
    this.modal.hide();
  }

}
