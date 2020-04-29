import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {DlrOrderService} from '../../../api/dealer-order/dlr-order.service';
import {SwalAlertService} from '../../../shared/swal-alert/swal-alert.service';

@Component({
  selector: 'app-dlr-rundown',
  templateUrl: './dlr-rundown.component.html',
  styleUrls: ['./dlr-rundown.component.scss']
})
export class DlrRundownComponent implements OnInit {
  dealers;
  isTmv: boolean;
  currentUser: any;
  currentDealerId;
  OrderParam;
  fielGridOrder;
  excelStyles;
  selectedDate: Date;
  showSuccessMessage;
  form: FormGroup;
  dealerId;
  importDate: Date;
  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private dealerListService: DealerListService,
    private formStoringService: FormStoringService,
    private dataFormatService: DataFormatService,
    private dlrOrderService: DlrOrderService,
    private swalAlertService: SwalAlertService,
  ) {
  }

  ngOnInit() {
    this.currentDealerId = this.formStoringService.get(StorageKeys.currentUser).dealerId;
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.isTmv = this.currentUser.isAdmin;
    this.dealers = [];
    this.dealerId = this.currentDealerId;
    this.importDate = new Date();
    if (this.isTmv) {
      this.dealerListService.getAvailableDealers().subscribe(dealers => {
        this.dealers = dealers;
        this.buildForm();
        this.search();
      });
    } else {
      this.dealerListService.getDealerChild(this.dealerId).subscribe(res => {
        this.dealers = this.dealers.concat({
          id: -1,
          abbreviation: ''
        });
        this.dealers = this.dealers.concat(res);
        this.buildForm();
        this.search();
      });
    }
    this.generateDay();

    this.excelStyles = [
      {
        id: 'ExcelDate',
        dataType: 'dateTime',
        numberFormat: { format: 'yyyy-mm-dd;@' }
      }
      // {
      //   id: "ExcelDateTime",
      //   dataType: "dateTime",
      //   numberFormat: { format: "yyyy-mm-dd hh:mm:ss;@" }
      // }
    ];

    this.fielGridOrder = [
      {
        headerName: 'STT',
        field: 'stt',
        width: 90,
      },
      {
        headerName: 'Start Date',
        field: 'startDateText',
        width: 90,
        cellClass: 'ExcelDate'
      },
      {
        headerName: 'Region',
        field: 'region',
        width: 90,
      },
      {
        headerName: 'Sub Region',
        field: 'subRegion',
        width: 90,
      },
      {
        headerName: 'Mother Dlr',
        field: 'motherDlr',
        width: 90,
      },
      {
        headerName: 'Dlr Outlet',
        field: 'dlrOutlet',
        width: 90,
      },
      {
        headerName: 'Ckd Cbu',
        field: 'ckdCbu',
        width: 90,
      },
      {
        headerName: 'Model',
        field: 'model',
        width: 90,
      },
      {
        headerName: 'Grade',
        field: 'grade',
        width: 90,
      },
      {
        headerName: 'Retail',
        field: 'retail',
        width: 90,
      },
      {
        headerName: 'Fleet Quantity',
        field: 'fleetQuantity',
        width: 90,
      },
      {
        headerName: 'NetCwd',
        field: 'netCwd',
        width: 90,
      },
      {
        headerName: 'CR',
        field: 'cr',
        width: 90,
      },
      {
        headerName: 'End Stock',
        field: 'endStock',
        width: 90,
      },
      {
        headerName: 'Cancle Cr',
        field: 'cancleCr',
        width: 90,
      },
      {
        headerName: 'Delivery',
        field: 'delivery',
        width: 90,
      },
      {
        headerName: 'Dlr Order',
        field: 'dlrOrder',
        width: 90,
      },
      {
        headerName: 'Dlr Sales Plan',
        field: 'dlrSalesPlan',
        width: 90,
      },
      {
        headerName: 'Target',
        field: 'target',
        width: 90,
      },
      {
        headerName: 'Target Fleet',
        field: 'targetFleet',
        width: 90,
      },
      {
        headerName: 'Allocation',
        field: 'allocation',
        width: 90,
      },
      {
        headerName: 'Avanced Quantity',
        field: 'avancedQuantity',
        width: 90,
      },
      {
        headerName: 'Dlr Oap',
        field: 'dlrOap',
        width: 90,
      },
      {
        headerName: 'Dlr Rap',
        field: 'dlrRap',
        width: 90,
      },
      {
        headerName: 'Pure Demand',
        field: 'pureDemand',
        width: 90,
      },
      {
        headerName: 'Pure Demand Gap',
        field: 'dlrSalesPlanVsPureDemand',
        width: 90,
      }
    ];
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    this.form = this.formBuilder.group({
      dealerId: this.currentDealerId,
      fromDate: new Date(year, month - 11, 1),
      toDate: new Date(year, month + 6, new Date(year, month + 7, 0).getDate()),
      groupRegion: false
    });
  }

  callbackGridOrder(params) {
    this.OrderParam = params;
  }

  search() {
    this.loadingService.setDisplay(true);
    const currentDate = new Date(this.selectedDate);
    this.dealerId = (this.form && this.form.value.dealerId) ? this.form.value.dealerId : 0;
    const dlrOrderParam = {
      fromDate: (this.form ? this.form.value.fromDate : null),
      toDate: (this.form ? this.form.value.toDate : null),
      importDate: this.importDate,
      dlrId: this.dealerId,
      groupRegion: (this.form ? this.form.value.groupRegion : false)
    };

    this.dlrOrderService.getDealerRunDownData(dlrOrderParam).subscribe(data => {
      this.OrderParam.api.setRowData(data);
      setTimeout(() => {
        const allColumnIds = this.OrderParam.columnApi.getAllDisplayedColumns().map(column => column.colId);
        this.OrderParam.columnApi.autoSizeColumns(allColumnIds);
      }, 200);
      //
      this.loadingService.setDisplay(false);
      //
      if (this.showSuccessMessage) {
        this.showSuccessMessage = false;
        this.swalAlertService.openSuccessModal();
      }
      //
    });
  }

  exportData() {
    this.OrderParam.api.exportDataAsExcel();
  }

  generateDay(dtChange?) {
    !dtChange ? this.selectedDate = this.getDayFromLocalStorage() ? new Date(this.getDayFromLocalStorage()) : new Date()
      : this.selectedDate = new Date(dtChange);
    this.formStoringService.set(StorageKeys.orderDate, this.selectedDate);
  }

  generateImportDay(dtChange?) {
    this.importDate = !dtChange ? new Date() : new Date(dtChange);
  }

  getDayFromLocalStorage() {
    const selectedDate = this.formStoringService.get(StorageKeys.orderDate);
    return selectedDate;
  }

}
