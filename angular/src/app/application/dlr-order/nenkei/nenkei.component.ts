import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {DlrOrderService} from '../../../api/dealer-order/dlr-order.service';
import {ImportTemplate} from '../../../core/constains/import-types';
import {SwalAlertService} from '../../../shared/swal-alert/swal-alert.service';
import {ImportService} from '../../../api/import/import.service';
import {DealerIdConfigs} from '../../../core/constains/dealer';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nenkei',
  templateUrl: './nenkei.component.html',
  styleUrls: ['./nenkei.component.scss']
})
export class NenkeiComponent implements OnInit {
  dealers;
  isTmv: boolean;
  currentUser: any;
  currentDealerId;
  OrderParam;
  fielGridOrder;
  selectedDate: Date;
  showSuccessMessage;
  form: FormGroup;
  dealerId;
  importTemplate = ImportTemplate;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private dealerListService: DealerListService,
    private formStoringService: FormStoringService,
    private dataFormatService: DataFormatService,
    private dlrOrderService: DlrOrderService,
    private swalAlertService: SwalAlertService,
    private importService: ImportService
  ) {
  }

  ngOnInit() {
    this.currentDealerId = this.formStoringService.get(StorageKeys.currentUser).dealerId;
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.isTmv = this.currentUser.isAdmin;
    this.dealers = [];
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

    this.fielGridOrder = [
      {
        headerName: 'Đại lý',
        field: 'dealer'
      },
      {
        headerName: 'Grade',
        field: 'grade'
      },
      {
        headerName: 'Origin',
        field: 'origin',
      },
      {
        headerName: 'Revise',
        field: 'revise'
      },
      {
        headerName: 'Tháng',
        field: 'monthText'
      },
      {
        headerName: 'Ngày import',
        field: 'createDate'
      }
    ];
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealerId: this.currentDealerId
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
      currentDate,
      dlrId: this.dealerId
    };

    this.dlrOrderService.getDealerNenkeiData(dlrOrderParam).subscribe(data => {
      this.OrderParam.api.setRowData(data);
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

  getImportTemplate() {
    this.loadingService.setDisplay(true);
    this.importService.downloadTemplate(this.importTemplate.tmvNenkei).subscribe(data => {
      this.loadingService.setDisplay(false);
      this.importService.downloadFile(data);
    });
  }

  exportData() {
    this.OrderParam.api.exportDataAsExcel();
  }

  generateDay(dtChange?) {
    !dtChange ? this.selectedDate = this.getDayFromLocalStorage() ? new  Date(this.getDayFromLocalStorage()) : new Date()
      : this.selectedDate = new Date(dtChange);
    this.formStoringService.set(StorageKeys.orderDate, this.selectedDate);
  }

  getDayFromLocalStorage() {
    const selectedDate = this.formStoringService.get(StorageKeys.orderDate);
    return selectedDate;
  }

}
