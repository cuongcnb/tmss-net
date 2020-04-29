import { Component } from '@angular/core';
import { GridExportService } from '../../../shared/common-service/grid-export.service';
import { DealerListService} from '../../../api/master-data/dealer-list.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { SwappingVehicleService} from '../../../api/swapping/swapping-vehicle.service';
import { FormStoringService } from '../../../shared/common-service/form-storing.service';
import { StorageKeys } from '../../../core/constains/storageKeys';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sell-swap-report',
  templateUrl: './sell-swap-report.component.html',
  styleUrls: ['./sell-swap-report.component.scss']
})

export class SellSwapReportComponent {
  isTmv: boolean;
  fromDate: Date = new Date((new Date().getFullYear()), (new Date()).getMonth() - 1, 1);
  toDate: Date = new Date((new Date().getFullYear()), (new Date()).getMonth() + 1, (new Date((new Date().getFullYear()), (new Date()).getMonth(), 0)).getDate());
  dealerFilter: number;
  typeFilter: string;
  sellSwapReportData;
  sellSwapReportGridField;
  sellSwapReportParams;
  selectedSellSwapReport;
  dealerList;
  currentUser;
  currentDealer;

  constructor(
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private gridExportService: GridExportService,
    private dealerListService: DealerListService,
    private swappingVehicleService: SwappingVehicleService,
    private formStoringService: FormStoringService,
    private dataFormatService: DataFormatService,
  ) {
    this.sellSwapReportGridField = [
      {
        field: 'grade',
      },
      {
        field: 'color',
      },
      {
        headerName: 'TMSS No',
        field: 'tmssNo',
      },
      {
        headerName: 'LO Plan Date',
        field: 'lineOffDate',

        cellClass: ['cell-border', 'text-right']
      },
      {
        field: 'assAlloMonth',

        cellClass: ['cell-border', 'text-right']
      },
      {
        field: 'swapDate',

        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'Sell/Buy date',
        field: 'sellBuyDate',

        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'Swap/Sell out DLR',
        field: 'swapSellDlr',
      },
      {
        headerName: 'Swap/Sell in DLR',
        field: 'swapBuyDlr',
      },
      {
        field: 'remark',
      },
    ];
    this.getDealerList();
  }

  getDealerList() {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.isTmv = this.currentUser.isAdmin;
    this.loadingService.setDisplay(true);
    this.dealerListService.getDealers().subscribe(dealerList => {
      this.dealerList = dealerList;
      if (!this.isTmv) {
        this.currentDealer = this.dealerList.find(dealer => dealer.id === this.currentUser.dealerId);
        this.dealerFilter = this.currentDealer.id;
      } else {
        this.dealerFilter = null;
      }
      this.loadingService.setDisplay(false);
    });
  }

  callbackGrid(params) {
    this.sellSwapReportParams = params;
    this.search();
  }

  getParams() {
    const selected = this.sellSwapReportParams.api.getSelectedRows();
    if (selected) {
      this.selectedSellSwapReport = selected[0];
    }
  }

  search() {
    if (!this.fromDate || !this.toDate) {
      this.swalAlertService.openFailModal('From Date and To Date are required, please fill all in before submit!');
      return;
    } else if (this.fromDate > this.toDate) {
      this.swalAlertService.openFailModal('From Date must be less than To Date, please check before send!');
      return;
    }
    this.loadingService.setDisplay(true);
    const searchObj = {
      fromDate: this.fromDate ? this.fromDate : null,
      toDate: this.toDate ? this.toDate : null,
      dealerId: this.dealerFilter ? this.dealerFilter : null,
      searchKey: this.typeFilter ? this.typeFilter : null
    };
    this.loadingService.setDisplay(true);
    this.swappingVehicleService.sellSwapReport(searchObj).subscribe(sellSwapReportData => {
      this.sellSwapReportData = sellSwapReportData;
      this.sellSwapReportParams.api.setRowData(sellSwapReportData);
      this.loadingService.setDisplay(false);
    });
  }

  export() {
    this.gridExportService.export(this.sellSwapReportParams, 'Sell/Swap Report');
  }
}
