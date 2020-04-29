import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {DlrOrderService} from '../../../../api/dealer-order/dlr-order.service';
import {DealerListService} from '../../../../api/master-data/dealer-list.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'second-dealer-ckd-order',
  templateUrl: './dlr-order-second.component.html',
  styleUrls: ['./dlr-order-second.component.scss']
})
export class DlrOrderSecondComponent implements OnInit {
  @ViewChild('forceDifferentSelection', {static: false}) forceDifferentSelection;
  orderMonth: string;
  orderHeader;
  orderSummaryHeader;
  fielGridOrder;
  fielGridOrderSummary;
  OrderParam;
  OrderSummaryParam;
  selectedDate: Date;
  currentDate;
  selectedYear: number;
  isResetForm: boolean;
  dealers;
  currentDealerId;
  dealerId;
  form: FormGroup;
  showSuccessMessage;
  searchClicked: boolean;

  constructor(
    private dlrOrderService: DlrOrderService,
    private loadingService: LoadingService,
    private dealerListService: DealerListService,
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private formStoringService: FormStoringService,
    private swalAlertService: ToastService
  ) {
  }

  callbackGridOrder(params) {
    this.OrderParam = params;
  }

  callbackGridOrderSummary(params) {
    this.OrderSummaryParam = params;
  }

  ngOnInit() {
    this.loadingService.setDisplay(true);
    this.currentDealerId = this.formStoringService.get(StorageKeys.currentUser).dealerId;
    this.dealers = [];
    this.dealerListService.getDealers().subscribe(dealers => {
      let i = 0;
      dealers.find(dealer => {
        if (Number(this.currentDealerId) === -1) {
          if (dealer.id > 0) {
            this.dealers[i] = dealer;
            i++;
          }
        } else {
          if (dealer.id === this.currentDealerId) {
            this.dealers[i] = dealer;
          }
        }
      });
      this.buildForm();
      this.loadingService.setDisplay(false);
    });
    this.generateDay();
  }

  search() {
    this.loadingService.setDisplay(true);
    //
    this.dealerId = this.form.value.dealerId ? this.form.value.dealerId : 0;
    const currentDate = new Date(this.selectedDate);
    const dlrOrderParam = {currentDate, dlrId: this.dealerId};
    this.orderMonth = this.dataFormatService.formatEngDate(currentDate, false);
    const nextMonthDate = new Date(this.selectedDate);
    this.dlrOrderService.getDataSecond(dlrOrderParam).subscribe(data => {
      this.loadOrderList(data.dlrOrderDTOList);
      //
      this.loadOrderSummaryList(data.dlrOrderSummaryDTOList);
      //
      this.loadingService.setDisplay(false);
      if (this.showSuccessMessage) {
        this.showSuccessMessage = false;
        this.swalAlertService.openSuccessModal();
      }
      this.searchClicked = true;
    });
  }

  private loadOrderList(dlrOrderList) {
    if (dlrOrderList.length > 0) {
      this.fielGridOrder = [];
      this.orderHeader = dlrOrderList[0];
      // set header
      for (let i = 0; i < this.orderHeader.length; i++) {
        this.fielGridOrder[i] = {};
        this.fielGridOrder[i].field = this.orderHeader[i];
        if (i > 0) {
          this.fielGridOrder[i].width = 50;
          this.fielGridOrder[i].editable = true;
        } else {
          this.fielGridOrder[i].width = 100;
          this.fielGridOrder[i].pinned = true;
        }
      }
      //
      const dlrOrderDataList = [];
      for (let i = 1; i < dlrOrderList.length; i++) {
        const dlrOrderDataObj = {};
        for (let j = 0; j < this.orderHeader.length; j++) {
          dlrOrderDataObj[this.orderHeader[j]] = dlrOrderList[i][j];
        }
        dlrOrderDataList.push(dlrOrderDataObj);
      }
      this.OrderParam.api.setRowData(dlrOrderDataList);
    } else {

    }
  }

  private loadOrderSummaryList(dlrOrderSummaryList) {
    if (dlrOrderSummaryList.length > 0) {
      this.fielGridOrderSummary = [];
      this.orderSummaryHeader = dlrOrderSummaryList[0];
      // set header
      for (let i = 0; i < this.orderSummaryHeader.length; i++) {
        this.fielGridOrderSummary[i] = {};
        this.fielGridOrderSummary[i].field = this.orderSummaryHeader[i];
        if (i > 0) {
          this.fielGridOrderSummary[i].width = 80;
        } else {
          this.fielGridOrderSummary[i].width = 100;
          this.fielGridOrderSummary[i].pinned = true;
        }
      }
      //
      const dlrOrderSummaryDataList = [];
      for (let i = 1; i < dlrOrderSummaryList.length; i++) {
        const dlrOrderSummaryDataObj = {};
        for (let j = 0; j < this.orderSummaryHeader.length; j++) {
          dlrOrderSummaryDataObj[this.orderSummaryHeader[j]] = dlrOrderSummaryList[i][j];
        }
        dlrOrderSummaryDataList.push(dlrOrderSummaryDataObj);
      }
      this.OrderSummaryParam.api.setRowData(dlrOrderSummaryDataList);
    } else {

    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealerId: this.currentDealerId
    });
  }

  save() {
    if (this.searchClicked) {
      this.loadingService.setDisplay(true);
      this.updateOrder();
    }
  }

  private updateOrder() {
    const orderRows = this.OrderParam.api.getDisplayedRowCount();
    const currentDate = new Date(this.selectedDate);
    const orderDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    const orderData = [];
    for (let i = 0; i < orderRows; i++) {
      const val = Object.assign({}, this.OrderParam.api.getDisplayedRowAtIndex(i).data);
      orderData.push(val);
    }

    this.dlrOrderService.insertDlrOrder(this.dealerId, orderDate, orderData).subscribe(
      () => {
        this.loadingService.setDisplay(false);
        this.showSuccessMessage = true;
        this.search();
      }, (response) => {
        this.loadingService.setDisplay(false);
      }
    );
  }

  getDayFromLocalStorage() {
    const selectedDate = this.formStoringService.get(StorageKeys.orderDate);
    return selectedDate;
  }

  generateDay(dtChange?) {
    this.isResetForm = false;
    const now = new Date();
    // now.setMonth(now.getMonth() + 1);
    if (!dtChange) {
      this.selectedDate = this.getDayFromLocalStorage() ? new Date(this.getDayFromLocalStorage()) : now;
    } else {
      this.selectedDate = new Date(dtChange);
    }
    this.formStoringService.set(StorageKeys.orderDate, this.selectedDate);
  }
}
