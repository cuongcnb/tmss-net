import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {DealerListService} from '../../../../api/master-data/dealer-list.service';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {DlrOrderService} from '../../../../api/dealer-order/dlr-order.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dealer-cbu-order',
  templateUrl: './cbu-order.component.html',
  styleUrls: ['./cbu-order.component.scss']
})
export class CbuOrderComponent implements OnInit {
  @ViewChild('forceDifferentSelection', {static: false}) forceDifferentSelection;
  fielGridCbuOrder;
  selectedDate: Date;
  form: FormGroup;
  isResetForm: boolean;
  cbuOrderParam;
  dealers;
  currentDealerId;
  dealerId;
  showSuccessMessage;
  searchClicked: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private dealerListService: DealerListService,
    private formStoringService: FormStoringService,
    private dataFormatService: DataFormatService,
    private dlrOrderService: DlrOrderService,
    private swalAlertService: ToastService
  ) {
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

  private buildForm() {
    this.form = this.formBuilder.group({
      dealerId: this.currentDealerId
    });
  }

  callbackGridCbuOrder(params) {
    this.cbuOrderParam = params;
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
    const nextMonthDate = new Date(this.selectedDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const orderNextMonth = this.dataFormatService.formatEngDate(nextMonthDate, false);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const orderNextTwoMonth = this.dataFormatService.formatEngDate(nextMonthDate, false);
    //
    this.fielGridCbuOrder = [
      {
        headerName: 'Model',
        children: [
          {
            headerName: '',
            field: 'model',
            pinned: true,
            width: 90
          }
        ]
      },
      {
        headerName: 'Interior color',
        children: [
          {
            headerName: 'Code',
            field: 'interior_Color_Code',
            pinned: true,
            width: 50
          },
          {
            headerName: 'Name',
            field: 'interior_Color_Name',
            pinned: true,
            width: 100
          }
        ]
      },
      {
        headerName: 'Grade',
        children: [
          {
            headerName: '',
            field: 'grade',
            pinned: true,
            width: 80
          }
        ]
      },
      {
        headerName: 'Exterior Color',
        children: [
          {
            headerName: 'Code',
            field: 'exterior_Color_Code',
            pinned: true,
            width: 50
          },
          {
            headerName: 'Name',
            field: 'exterior_Color_Name',
            pinned: true,
            width: 100
          }
        ]
      },
      {
        headerName: orderMonth + ' production (N)',
        children: [
          {
            headerName: 'Total',
            field: 'total',
            width: 80
          },
          {
            headerName: 'Sum',
            field: 'sum',
            width: 80
          },
          {
            headerName: 'Retail',
            field: 'retail',
            editable: true,
            width: 80
          },
          {
            headerName: 'Biglot',
            field: 'biglot',
            editable: true,
            width: 80
          }
        ]
      },
      {
        headerName: orderNextMonth + ' production (N+1) (Tent)',
        children: [
          {
            headerName: 'Total',
            field: 'totall',
            width: 80
          },
          {
            headerName: 'Sum',
            field: 'summ',
            width: 80
          },
          {
            headerName: 'Retail',
            field: 'retaill',
            editable: true,
            width: 80
          },
          {
            headerName: 'Biglot',
            field: 'biglott',
            editable: true,
            width: 80
          }
        ]
      },
      {
        headerName: orderNextTwoMonth + ' production (N+2) (Tent)',
        children: [
          {
            headerName: 'Total',
            field: 'totalll',
            width: 80
          },
          {
            headerName: 'Sum',
            field: 'summm',
            width: 80
          },
          {
            headerName: 'Retail',
            field: 'retailll',
            editable: true,
            width: 80
          },
          {
            headerName: 'Biglot',
            field: 'biglottt',
            editable: true,
            width: 80
          }
        ]
      }
    ];
    //
    this.dealerId = this.form.value.dealerId ? this.form.value.dealerId : 0;
    const dlrOrderParam = {currentDate, dlrId: this.dealerId};
    this.dlrOrderService.getCbuData(dlrOrderParam).subscribe(data => {
      this.cbuOrderParam.api.setRowData(data);
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

  save() {
    if (this.searchClicked) {
      this.loadingService.setDisplay(true);
      const orderRows = this.cbuOrderParam.api.getDisplayedRowCount();
      const currentDate = new Date(this.selectedDate);
      const orderDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
      const orderData = [];
      for (let i = 0; i < orderRows; i++) {
        const val = Object.assign({}, this.cbuOrderParam.api.getDisplayedRowAtIndex(i).data);
        orderData.push(val);
      }
      this.dlrOrderService.insertDlrOrderCbu(this.dealerId, orderDate, orderData).subscribe(
        () => {
          this.loadingService.setDisplay(false);
          this.showSuccessMessage = true;
          this.search();
        }, (response) => {
          this.loadingService.setDisplay(false);
        }
      );
    }
  }
}
