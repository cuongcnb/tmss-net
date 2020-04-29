import { Component, OnInit, ViewChild } from '@angular/core';
import { GridExportService } from '../../../shared/common-service/grid-export.service';
import { DealerListService} from '../../../api/master-data/dealer-list.service';
import { CustomerService} from '../../../api/daily-sale/customer.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cs-change-information',
  templateUrl: './cs-change-information.component.html',
  styleUrls: ['./cs-change-information.component.scss']
})
export class CsChangeInformationComponent implements OnInit {
  @ViewChild('confirmApproveModal', {static: false}) confirmApproveModal;
  @ViewChild('confirmRejectModal', {static: false}) confirmRejectModal;
  gridField;
  params;
  selectedData;
  dealers;
  dealerId: undefined;
  keywords: undefined;

  constructor(
    private gridExportService: GridExportService,
    private dealerListService: DealerListService,
    private swalAlertService: ToastService,
    private customerService: CustomerService,
    private loadingService: LoadingService,
  ) {
    this.gridField = [
      { field: 'grade', pinned: true , resizable: true},
      { field: 'frameNo', pinned: true, resizable: true },
      { field: 'engineNo', pinned: true, resizable: true },
      { field: 'color', pinned: true, resizable: true },
      { field: 'dealer', pinned: true, resizable: true },
      { field: 'customerName', pinned: true, resizable: true },
      { field: 'salesDate', pinned: true, resizable: true },
      { field: 'deliveryDate', pinned: true, resizable: true },
      { field: 'customerTel', cellClass: ['cell-border', 'text-right'], resizable: true},
      { field: 'changeTel', cellClass: ['cell-border', 'text-right'], resizable: true},
      { field: 'contactName', resizable: true},
      { field: 'changeContactName', resizable: true},
      { field: 'contactAddress', resizable: true},
      { field: 'changeContactAddress', resizable: true},
      { field: 'contactTel', cellClass: ['cell-border', 'text-right'], resizable: true},
      { field: 'changeContactTel', cellClass: ['cell-border', 'text-right'], resizable: true},
    ];
  }

  ngOnInit() {
    this.dealerListService.getDealers().subscribe(dealers => this.dealers = dealers);
  }

  callbackGrid(params) {
    this.params = params;
    this.search();
  }

  refresh() {
    this.callbackGrid(this.params);
  }

  getParams() {
    const selected = this.params.api.getSelectedRows();
    if (selected) {
      this.selectedData = selected[0];
    }
  }

  search() {
    const searchObj = {
      dealer_id: this.dealerId,
      search_key: this.keywords
    };
    this.loadingService.setDisplay(true);
    this.customerService.searchChangeInformation(searchObj).subscribe(data => {
      this.loadingService.setDisplay(false);
      this.params.api.setRowData(data);
      const allColumnIds = [];
      this.params.columnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));
      this.params.columnApi.autoSizeColumns(allColumnIds);
    });
  }

  openApproveModal() {
    if (!this.selectedData) {
      this.swalAlertService.openFailModal('You must choose a customer');
    } else {
      this.confirmApproveModal.show();
    }
  }

  openRejectModal() {
    if (!this.selectedData) {
      this.swalAlertService.openFailModal('You must choose a customer');
    } else {
      this.confirmRejectModal.show();
    }
  }

  approve() {
    this.loadingService.setDisplay(true);
    this.customerService.approveChangeInformation(this.selectedData.customerId, this.selectedData).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.refresh();
    });
  }

  reject() {
    this.loadingService.setDisplay(true);
    this.customerService.rejectChangeInformation(this.selectedData.customerId).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.refresh();
    });
  }

  export() {
    this.gridExportService.export(this.params, 'Approve Change Information Contract');
  }
}

