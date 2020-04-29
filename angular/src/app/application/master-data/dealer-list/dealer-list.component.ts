import { Component, ViewChild, Input } from '@angular/core';
import { DealerListService} from '../../../api/master-data/dealer-list.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dealer-list',
  templateUrl: './dealer-list.component.html',
  styleUrls: ['./dealer-list.component.scss']
})
export class DealerListComponent {
  @ViewChild('modifyModal', {static: false}) modifyModal;
  @Input() isDeliveryAddressRoute: boolean;

  fieldGridDealerList;
  selectedDealer;
  gridParamsDealer;
  dealerList;
  dealerListWithoutSelectedData;

  constructor(
    private dealerListService: DealerListService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.fieldGridDealerList = [
      {field: 'isLexus', resizable: true},
      {field: 'code', resizable: true},
      {field: 'abbreviation', resizable: true},
      {headerName: 'Dealer Parent', field: 'dealerParent', resizable: true},
      {
        field: 'status', cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        },
        resizable: true
      },
      {headerName: 'Dealer Type', field: 'dealerTypeName', resizable: true},
      {headerName: 'Dealer Group', field: 'groupName', resizable: true},
      {field: 'vnName', resizable: true},
      {field: 'enName', resizable: true},
      {field: 'taxCode', cellClass: ['cell-border', 'text-right'], filter: 'agNumberColumnFilter', resizable: true},
      {field: 'accountNo', resizable: true},
      {field: 'ordering', cellClass: ['cell-border', 'text-right'], filter: 'agNumberColumnFilter', resizable: true},
      {headerName: 'Director', field: 'contactPerson', resizable: true},
      {field: 'phone', cellClass: ['cell-border', 'text-right'], filter: 'agNumberColumnFilter', resizable: true},
      {field: 'fax', cellClass: ['cell-border', 'text-right'], filter: 'agNumberColumnFilter', resizable: true},
      {field: 'address', resizable: true},
      {headerName: 'Province', field: 'provinceName', resizable: true},
      {field: 'bank', resizable: true},
      {field: 'bankAddress', resizable: true},
      {field: 'description', resizable: true},
      {headerName: 'Address Print Delivery', field: 'receivingAddress', resizable: true},
    ];
  }

  refreshList() {
    this.callbackGridDealer(this.gridParamsDealer);
    this.selectedDealer = undefined;
  }

  callbackGridDealer(params) {
    this.loadingService.setDisplay(true);
    this.dealerListService.getDealers().subscribe(dealers => {
      this.dealerList = dealers;
      params.api.setRowData(dealers);
      const allColumnIds = [];
      params.columnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));
      params.columnApi.autoSizeColumns(allColumnIds);
      this.loadingService.setDisplay(false);
    });
    this.gridParamsDealer = params;
  }

  getParamsDealer(params) {
    this.gridParamsDealer = params;
    const selectedDealer = this.gridParamsDealer.api.getSelectedRows();
    if (selectedDealer) {
      this.selectedDealer = selectedDealer[0];
      this.dealerListWithoutSelectedData = this.dealerList.filter(item => item.id !== this.selectedDealer.id);
    }
  }

  updateDealer() {
    if (this.selectedDealer) {
      this.modifyModal.open(this.dealerListWithoutSelectedData, this.selectedDealer);
    } else {
      this.toastService.openWarningForceSelectData();
    }
  }

}
