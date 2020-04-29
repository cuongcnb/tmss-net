import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DealerAddressDeliveryService} from '../../../api/master-data/dealer-address-delivery.service';
import { DealerListService} from '../../../api/master-data/dealer-list.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dealer-address-print-delivery',
  templateUrl: './dealer-address-print-delivery.component.html',
  styleUrls: ['./dealer-address-print-delivery.component.scss']
})
export class DealerAddressPrintDeliveryComponent implements OnInit {
  @ViewChild('modifyAddressDelivery', {static: false}) modifyAddressDelivery;

  fieldGrid;
  gridParam;
  selectedData;
  dealers = [];
  dealerIdFilter;

  constructor(private loadingService: LoadingService,
              private dealerListService: DealerListService,
              private swalAlertService: ToastService,
              private confirmationService: ConfirmService,
              private dealerAddressDeliveryService: DealerAddressDeliveryService) {
    this.fieldGrid = [
      {field: 'dealer'},
      {field: 'otherDealer'},
      {field: 'priority'},
      {field: 'address', minWidth: 400},
      {
        field: 'status',
        cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      }
    ];
  }

  filterByDealer(dealerId) {
    this.dealerIdFilter = dealerId;
    this.callbackGrid(this.gridParam, this.dealerIdFilter);
  }

  ngOnInit() {
    this.dealerListService.getDealers().subscribe(dealers => {
      this.dealers = dealers;
    });
  }

  callbackGrid(params, dealerId?) {
    this.loadingService.setDisplay(true);
    this.dealerAddressDeliveryService.getList(dealerId ? dealerId : null).subscribe(list => {
      params.api.setRowData(list);
      this.loadingService.setDisplay(false);
    });
    this.gridParam = params;
  }

  refreshList() {
    this.selectedData = undefined;
    this.callbackGrid(this.gridParam, this.dealerIdFilter);
  }

  getParams(params) {
    this.gridParam = params;
    const selectedData = this.gridParam.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  updateData() {
    if (this.selectedData) {
      this.modifyAddressDelivery.open(this.selectedData);
    } else {
      this.swalAlertService.openWarningModal('You havent selected any row, please select one to update', 'Select a row to update');
    }
  }

  deleteDealerAddress() {
    this.confirmationService.openConfirmModal('Are you sure?', '"Do you want to delete this data?').subscribe(() => {
      this.loadingService.setDisplay(true);
      this.dealerAddressDeliveryService.deleteDealerAddress(this.selectedData.id).subscribe(() => {
        this.refreshList();
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessModal();
      });
    });
  }
}
