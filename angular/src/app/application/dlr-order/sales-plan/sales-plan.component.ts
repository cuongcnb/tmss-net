import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DealerListModel} from '../../../core/models/master-data/dealer-list.model';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {DlrOrderService} from '../../../api/dealer-order/dlr-order.service';
import {SwalAlertService} from '../../../shared/swal-alert/swal-alert.service';
import {ImportService} from '../../../api/import/import.service';
import {ImportTemplate} from '../../../core/constains/import-types';
import {DealerIdConfigs} from '../../../core/constains/dealer';
import {DataOrderConfigType} from '../../../core/constains/dataOrderConfigType';
import {DealerVersionTypeService} from '../../../api/dealer-order/dealer-version-type.service';

@Component({
  selector: 'dlr-sales-plan',
  templateUrl: './sales-plan.component.html',
  styleUrls: ['./sales-plan.component.scss']
})
export class SalesPlanComponent implements OnInit {
  @ViewChild('forceDifferentSelection', {static: false}) forceDifferentSelection;
  fielGridOrder;
  selectedDate: Date;
  form: FormGroup;
  isResetForm: boolean;
  OrderParam;
  dealers;
  currentDealerId;
  dealerId;
  showSuccessMessage;
  searchClicked: boolean;
  importTemplate = ImportTemplate;
  isTmv: boolean;
  currentUser: any;
  dealerOrderConfigs: any;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private dealerListService: DealerListService,
    private formStoringService: FormStoringService,
    private dataFormatService: DataFormatService,
    private dlrOrderService: DlrOrderService,
    private swalAlertService: SwalAlertService,
    private importService: ImportService,
    private dealerVersionTypeService: DealerVersionTypeService
  ) {
  }

  ngOnInit() {
    this.loadingService.setDisplay(true);
    this.currentDealerId = this.formStoringService.get(StorageKeys.currentUser).dealerId;
    this.dealers = [];
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.isTmv = this.currentUser.isAdmin;
    this.dealerId = this.currentDealerId;
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
    this.getVersionType();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealerId: this.currentDealerId,
      dealerOrderConfigId: -1
    });
  }

  callbackGridOrder(params) {
    this.OrderParam = params;
  }

  getDayFromLocalStorage() {
    const selectedDate = this.formStoringService.get(StorageKeys.orderDate);
    return selectedDate;
  }

  generateDay(dtChange?) {
    this.isResetForm = false;
    !dtChange ? this.selectedDate = this.getDayFromLocalStorage() ? new Date(this.getDayFromLocalStorage()) : new Date()
      : this.selectedDate = new Date(dtChange);
    this.formStoringService.set(StorageKeys.orderDate, this.selectedDate);
  }

  search() {
    this.loadingService.setDisplay(true);
    //
    const currentDate = new Date(this.selectedDate);
    const orderMonth = this.dataFormatService.formatEngDate(currentDate, false);
    //
    this.fielGridOrder = [
      {
        headerName: 'Đại lý',
        field: 'dealer',
        // pinned: true,
        width: 90
      },
      {
        headerName: 'Grade',
        field: 'grade',
        width: 90
      },
      {
        headerName: 'Kế hoạch BH lẻ',
        field: 'qty',
        width: 90
      },
      {
        headerName: 'PureDemand',
        field: 'pureDemand',
        width: 90
      },
      {
        headerName: 'Tháng',
        field: 'monthText',
        width: 90
      },
      {
        headerName: 'Version Type',
        field: 'versionType'
      },
      {
        headerName: 'Ngày import',
        field: 'create_Date',
        width: 90
      },
      {
        headerName: 'Gói import',
        field: 'import_Date',
        width: 90
      }
    ];
    //
    this.dealerId = (this.form && this.form.value.dealerId) ? this.form.value.dealerId : 0;
    const dlrOrderParam = {
      currentDate: currentDate,
      dlrId: this.dealerId,
      dealerOrderConfigId: this.form.value.dealerOrderConfigId
    };
    this.dlrOrderService.getDealerSalesPlanData(dlrOrderParam).subscribe(data => {
      this.OrderParam.api.setRowData(data);
      //
      this.loadingService.setDisplay(false);
      //
      if (this.showSuccessMessage) {
        this.showSuccessMessage = false;
        this.swalAlertService.openSuccessModal();
      }
      //
      this.searchClicked = true;
    });
  }

  getVersionType() {
    // const currentDate = new Date(this.selectedDate);
    // this.dealerId = (this.form && this.form.value.dealerId) ? this.form.value.dealerId : 0;
    // const dealerOrderConfigParam = {
    //   dealerId: this.dealerId,
    //   monthDate: currentDate,
    //   dataType: DataOrderConfigType[1].name
    // };
    this.dealerVersionTypeService.getAll().subscribe(res => {
      this.dealerOrderConfigs = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i]['dataType'] === DataOrderConfigType[0].name) {
          this.dealerOrderConfigs.push(res[i]);
        }
      }
      this.dealerOrderConfigs.unshift({
        id: -1,
        versionType: 'ALL'
      });
    });
  }

  getImportTemplate() {
    this.loadingService.setDisplay(true);
    this.dealerId = (this.form && this.form.value.dealerId) ? this.form.value.dealerId : 0;
    const currentDate = new Date(this.selectedDate);
    let versionType = "";
    for (let i = 0; i < this.dealerOrderConfigs.length; i++) {
      if (this.dealerOrderConfigs[i].id === this.form.value.dealerOrderConfigId && this.dealerOrderConfigs[i].id > 0) {
        versionType = this.dealerOrderConfigs[i].versionType;
      }
    }
    const dlrOrderParam = {
      currentDate: currentDate,
      dlrId: this.dealerId,
      dealerOrderConfigId: this.form.value.dealerOrderConfigId,
      versionType: versionType
    };
    this.dlrOrderService.getDealerPlanTemplate(dlrOrderParam).subscribe((data) => {
      this.loadingService.setDisplay(false);
      this.importService.downloadFile(data);
    });
  }

  exportData() {
    this.OrderParam.api.exportDataAsExcel();
  }
}
