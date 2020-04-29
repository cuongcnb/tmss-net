import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ContractManagementService} from '../../../api/daily-sale/contract-management.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {GradeListModel} from '../../../core/models/sales/model-list.model';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {GradeListService} from '../../../api/master-data/grade-list.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FilterFormCode} from '../../../core/constains/filter-form-code';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'change-delivery',
  templateUrl: './change-delivery.component.html',
  styleUrls: ['./change-delivery.component.scss']
})
export class ChangeDeliveryComponent implements OnInit, OnChanges {
  @ViewChild('changeDeliveryDate', {static: false}) changeDeliveryDate;
  @ViewChild('deliveryLog', {static: false}) deliveryLog;
  @Input() filterStartForm;
  @Input() currentFilterFormType: string;
  form: FormGroup;

  fieldGrid;
  params;
  selectedData;
  dealers;
  grades: Array<GradeListModel>;

  constructor(
    private contractManagementService: ContractManagementService,
    private dealerListService: DealerListService,
    private gradeListService: GradeListService,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private formStoringService: FormStoringService,
    private formBuilder: FormBuilder,
    private toastService: ToastService
  ) {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.filterStartForm || (this.currentFilterFormType && this.currentFilterFormType !== FilterFormCode.delivery)) {
      this.filterStartForm = this.formStoringService.get(StorageKeys.deliveryFilterStartModal);
    }
    if (!this.currentFilterFormType || this.currentFilterFormType === FilterFormCode.delivery) {
      this.search();
    }
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'Vehicle Information',
        children: [
          {field: 'grade', pinned: true},
          {headerName: 'GradeProduct', field: 'gradeProduction', pinned: true},
          {headerName: 'FrameNo', field: 'frameNo', pinned: true},
          {field: 'color', pinned: true},
          {field: 'audio', pinned: true},
          {headerName: 'TMVInvoice', field: 'tmvInvoice', pinned: true},
          {headerName: 'ArrivalDate', field: 'arrivalDate', pinned: true},
          {headerName: 'EngineNo', field: 'engineNo', pinned: true},
          {field: 'vin', pinned: true}
        ]
      },
      {
        headerName: 'Contract Header',
        children: [
          {headerName: 'Dealer', field: 'dlrOutlet'},
          {field: 'contractNo'},
          {
            field: 'wodDate',
            cellRenderer: params => `<span>${this.dataFormatService.formatDateSale(params.value)}</span>`
          },
          {
            field: 'depositDate',
            cellRenderer: params => `<span>${this.dataFormatService.formatDateSale(params.value)}</span>`
          },
          {field: 'paymentType'},
          {field: 'bank'},
          {field: 'amount'},
          {headerName: 'F_R', field: 'contractType'}
        ]
      },
      {
        headerName: 'Contract Cancelation',
        children: [
          {
            field: 'cancelDate',
            cellRenderer: params => `<span>${this.dataFormatService.formatDateSale(params.value)}</span>`
          },
          {field: 'cancelType'},
          {headerName: 'Detail Reason', field: 'cancelReasonText'},
        ]
      },
      {
        headerName: 'Customer Information',
        children: [
          {field: 'contractRepresentative'},
          {field: 'customerAddress'},
          {field: 'province'},
          {headerName: 'Tel', field: 'tel'},
        ]
      },
      {
        headerName: 'Contact Person',
        children: [
          {field: 'legalStatus'},
          {field: 'contactName'},
          {field: 'contactAddress'},
          {headerName: 'Contact Tel', field: 'contactTel'}
        ]
      },
      {
        headerName: 'Invoice Information',
        children: [
          {field: 'invoiceName'},
          {field: 'invoiceAddress'},
        ]
      },
      {
        headerName: 'Delivery Information',
        children: [
          {headerName: 'EstDate', field: 'estimatedDate'},
          {headerName: 'Reason Type', field: 'estimatedReasonType'},
          {field: 'newReasonType'},
          {headerName: 'Detail Reason', field: 'estimatedReasonText'},
          {headerName: 'Change Detail Reason', field: 'changeEstimatedReasonText'},
          {
            field: 'salesDate',
            cellRenderer: params => `<span>${this.dataFormatService.formatDateSale(params.value)}</span>`
          },
          {
            field: 'deliveryDate',
            cellRenderer: params => `<span>${this.dataFormatService.formatDateSale(params.value)}</span>`
          },
          {field: 'estimatedDiff'},
          {field: 'saleLeadtime'}
        ]
      },
      {
        headerName: 'Price & Commission',
        children: [
          {field: 'orderPrice'},
          {field: 'commissionPrice'},
          {field: 'discountPrice'},
          {field: 'salePerson'},
          {headerName: 'DLR Remark For Sale', field: 'dlrRemarkForSale'},
          {headerName: 'TMV Remark', field: 'tmvRemark'},
          {headerName: 'DLR Remark for CS', field: 'dlrRemarkForCs'},
          {headerName: 'End DLR Sales', field: 'endDlrSales'},
          {headerName: 'Sales DLR', field: 'salesDlr'},
        ]
      },
    ];
    this.dealerListService.getDealers().subscribe(dealers => this.dealers = dealers);
    this.gradeListService.getGrades().subscribe(grades => this.grades = grades);
    this.search();
  }

  get currentUser() {
    return this.formStoringService.get(StorageKeys.currentUser);
  }

  callbackGrid(params) {
    this.selectedData = null;
    this.params = params;
  }

  getParams() {
    const selected = this.params.api.getSelectedRows();
    if (selected) {
      this.selectedData = selected[0];
    }
  }

  refreshList() {
    this.callbackGrid(this.params);
    this.search();
  }

  search() {
    this.loadingService.setDisplay(true);
    this.contractManagementService.searchChangeDelivery(this.form.value, this.filterStartForm).subscribe(res => {
      this.loadingService.setDisplay(false);
      setTimeout(() => {
        this.params.api.setRowData(res ? res.contractList : []);
        const allColumnIds = this.params.columnApi.getAllColumns().map(column => column.colId);
        this.params.columnApi.autoSizeColumns(allColumnIds);
      }, 200);
    });
  }

  update() {
    this.selectedData
      ? this.changeDeliveryDate.open(this.selectedData.id, true)
      : this.toastService.openWarningModal('You haven\'t selected any row, please select one', 'Select a row to update');
  }

  openDeliveryLog() {
    this.selectedData
      ? this.deliveryLog.open(this.selectedData.id)
      : this.toastService.openWarningModal('You haven\'t selected any row, please select one', 'Select a row to update');
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealerId: [undefined],
      gradeId: [undefined],
      searchKey: [undefined],
    });
  }
}
