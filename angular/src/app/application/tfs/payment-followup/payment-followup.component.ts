import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../shared/loading/loading.service';
import { GridExportService } from '../../../shared/common-service/grid-export.service';
import { PaymentFollowupService} from '../../../api/tfs/payment-followup.service';
import { DealerListService} from '../../../api/master-data/dealer-list.service';
import { GradeListService} from '../../../api/master-data/grade-list.service';
import { ColorListService} from '../../../api/master-data/color-list.service';
import { FilterFormCode } from '../../../core/constains/filter-form-code';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { PaginationParamsModel } from '../../../core/models/base.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import {GradeListModel} from '../../../core/models/sales/model-list.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'payment-followup',
  templateUrl: './payment-followup.component.html',
  styleUrls: ['./payment-followup.component.scss'],
})
export class PaymentFollowupComponent implements OnInit {
  @ViewChild('paymentFollowupApproveModal', {static: false}) paymentFollowupApproveModal;
  form: FormGroup;

  paymentFollowupData;
  paymentDetailFieldGrid;
  paymentFollowupParams;
  selectedPaymentFollowup;
  dealerList = [];
  gradeList: Array<GradeListModel>;
  colorList;
  fieldGradeList;
  fieldColorList;
  filterFormCode = FilterFormCode;
  filterDataList = [];

  paginationTotalsData: number;
  paginationParams: PaginationParamsModel;
  tfsTotal: string;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private gridExportService: GridExportService,
    private paymentFollowupService: PaymentFollowupService,
    private dealerListService: DealerListService,
    private gradeListService: GradeListService,
    private colorListService: ColorListService,
    private confirmationService: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.paymentDetailFieldGrid = [
      {
        field: 'status',
        pinned: true,
        resizable: true
      },
      {
        headerName: 'Vehicle Information',
        children: [
          {
            field: 'grade',
            pinned: true,
            resizable: true
          },
          {
            field: 'frameNo',
            pinned: true,
            resizable: true
          },
          {
            field: 'vin',
            pinned: true,
            resizable: true
          },
          {
            field: 'engineNo',
            pinned: true,
            resizable: true
          },
          {
            field: 'color',
            pinned: true,
            resizable: true
          },
          {
            field: 'audio',
            resizable: true
          },
          {
            headerName: 'Paint In',
            field: 'painInDate',
            resizable: true
          },
          {
            field: 'lineOffDate',
            resizable: true
          },
          {
            headerName: 'Allo Month',
            field: 'assAlloMonth',
            resizable: true
          },
          {
            headerName: 'Payment Plan',
            field: 'dlrPaymentPlan',
            resizable: true
          },
          {
            field: 'deferPayment',
            resizable: true
          },
          {
            field: 'invoiceRequestDate',
            resizable: true
          },
          {
            field: 'assignmentDate',
            resizable: true
          },
        ],
      },
      {
        headerName: 'Payment Information',
        children: [
          {
            headerName: 'Invoice No',
            field: 'payInvoiceNo',
            resizable: true
          },
          {
            field: 'invoiceDate',
            resizable: true
          },
          {
            headerName: 'VN Amount',
            field: 'payVnAmount',
            cellClass: ['cell-border', 'text-right'],
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            resizable: true
          },
          {
            headerName: 'USD Amount',
            field: 'payUsdAmount',
            cellClass: ['cell-border', 'text-right'],
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            resizable: true
          },
        ],
      },
      {
        headerName: 'TMV Delivery',
        children: [
          {
            headerName: 'ML Delivery',
            field: 'mlDeliveryDate',
            resizable: true
          },
          {
            headerName: 'ML DeliveryTime',
            field: 'mlDeliveryTime',
            valueFormatter: params => this.dataFormatService.formatHoursSecond(params.value),
            resizable: true
          },
          {
            headerName: 'ML Plan Arrival',
            field: 'mlArrivalPlanDate',
            resizable: true
          },
          {
            headerName: 'ML Arrival Time',
            field: 'mlArrivalPlanTime',
            valueFormatter: params => this.dataFormatService.formatHoursSecond(params.value),
            resizable: true
          },
        ],
      },
      {
        headerName: 'TSC Delivery',
        children: [
          {
            headerName: 'TSC Delivery',
            field: 'tscDelivery',
            resizable: true
          },
          {
            headerName: 'TSC DeliveryTime',
            field: 'tscDeliveryTime',
            valueFormatter: params => this.dataFormatService.formatHoursSecond(params.value),
            resizable: true
          },
        ],
      },
      {
        headerName: 'DLR Arrival',
        children: [
          {
            headerName: 'Arrival Date',
            field: 'dlrArrivalDate',
            resizable: true
          },
          {
            headerName: 'Arrival Time',
            field: 'dlrArrivalTime',
            valueFormatter: params => this.dataFormatService.formatHoursSecond(params.value),
            resizable: true
          },
        ],
      },
      {
        headerName: 'DLR Other',
        children: [
          {
            headerName: 'DLR Vehicle Status',
            field: 'dlrVehicleStatusId',
            resizable: true
          },
          {
            field: 'paymentBy',
            resizable: true
          },
          {
            headerName: 'TFS Amount',
            field: 'tfsAmount',
            cellClass: ['cell-border', 'text-right'],
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            resizable: true
          },
        ],
      },
      {
        headerName: 'Documents',
        children: [
          {
            headerName: 'Doc Status',
            field: 'documentTmvSituationId',
            resizable: true
          },
          {
            headerName: 'Doc Delivery',
            field: 'documentDeliveryDate',
            resizable: true
          },
          {
            headerName: 'Delivery Time',
            field: 'documentDeliveryTime',
            valueFormatter: params => this.dataFormatService.formatHoursSecond(params.value),
            resizable: true
          },
          {
            headerName: 'Arrival Date',
            field: 'documentArrivalDate',
            resizable: true
          },
          {
            headerName: 'Arrival Time',
            field: 'documentArrivalTime',
            valueFormatter: params => this.dataFormatService.formatHoursSecond(params.value),
            resizable: true
          },
          {
            headerName: 'Arrival Remark',
            field: 'documentArrivalRemark',
            resizable: true
          },
          {
            header: 'DLR Doc Status',
            field: 'documentDlrSituationId',
            resizable: true
          },
        ],
      },
      {
        headerName: 'Fleet Information',
        children: [
          {
            field: 'fleetPrice',
            cellClass: ['cell-border', 'text-right'],
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            resizable: true
          },
          {
            field: 'fleetCustomer',
            resizable: true
          },
          {
            field: 'saleDate',
            resizable: true

          },
          {
            field: 'dealer',
            resizable: true
          },
          {
            field: 'otherDealer',
            resizable: true
          },
          {
            field: 'changeFrom',
            resizable: true
          },
          {
            headerName: 'Other Dealer',
            field: 'otherDealer2',
            resizable: true
          },
        ],
      },
    ];
    this.fieldGradeList = [
      {
        headerName: 'marketing code',
        field: 'marketingCode',
        resizable: true
      },
    ];
    this.fieldColorList = [
      {
        headerName: 'code',
        field: 'code',
        resizable: true
      },
    ];
    this.masterApi();
  }

  masterApi() {
    this.loadingService.setDisplay(true);
    forkJoin([
      this.gradeListService.getGrades(true),
      this.dealerListService.getDealers(),
      this.colorListService.getColors(),
    ]).subscribe(res => {
      this.gradeList = res[0];
      this.dealerList = res[1];
      this.colorList = res[2];
      this.loadingService.setDisplay(false);
      this.search();
    });
  }

  callbackGridPayment(params) {
    this.paymentFollowupParams = params;
  }

  getParamsPayment() {
    const selectedPaymentFollowup = this.paymentFollowupParams.api.getSelectedRows();
    if (selectedPaymentFollowup) {
      this.selectedPaymentFollowup = selectedPaymentFollowup[0];
    }
  }

  searchWithSaleFilter(filterDataList) {
    this.filterDataList = filterDataList;
    this.search();
  }

  changePaginationParams(paginationParams) {
    if (!this.paymentFollowupData) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  search() {
    this.loadingService.setDisplay(true);
    this.paymentFollowupService.searchPaymentFollowup(this.form.value, this.filterDataList, this.paginationParams).subscribe(paymentFollowupData => {
      this.paymentFollowupData = paymentFollowupData.list;
      this.paginationTotalsData = paymentFollowupData.total;
      this.tfsTotal = this.dataFormatService.numberFormat(paymentFollowupData.tfsTotal);
      this.paymentFollowupParams.api.setRowData(this.paymentFollowupData);
      this.paymentFollowupParams.api.forEachNode(node => {
        if (node.childIndex === 0) {
          node.setSelected(true);
          const allColumnIds = [];
          node.columnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));
          node.columnApi.autoSizeColumns(allColumnIds);
        }
      });
      this.loadingService.setDisplay(false);
    });
  }

  undo() {
    this.confirmationService.openConfirmModal('Are you sure', 'Do you want to undo this payment?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.paymentFollowupService.undoPaymentFollowup(this.selectedPaymentFollowup.id).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.search();
          this.swalAlertService.openSuccessModal();
          this.selectedPaymentFollowup = undefined;
        });
      });
  }

  export() {
    this.gridExportService.export(this.paymentFollowupParams, 'Payment Followup');
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      quickSearch: [undefined],
      status: [undefined],
      dealerId: [undefined],
      gradeId: [undefined],
      gradeControl: [undefined],
      colorId: [undefined],
      colorControl: [undefined],
    });
    this.form.get('gradeControl').valueChanges.subscribe(value => {
      if (value) {
        this.loadingService.setDisplay(true);
        this.gradeListService.getGradeColor(value.id).subscribe(colorsOfGrade => {
          this.loadingService.setDisplay(false);
          this.colorList = colorsOfGrade;
        });
        this.form.patchValue({
          colorId: undefined,
          gradeId: value.id,
          colorControl: undefined,
        });
      } else {
        this.form.patchValue({
          colorId: undefined,
          gradeId: undefined,
          colorControl: undefined,
        });
        this.loadingService.setDisplay(true);
        this.colorListService.getColorsAvailable().subscribe(colors => {
          this.loadingService.setDisplay(false);
          this.colorList = colors;
        });
      }
    });

    this.form.get('colorControl').valueChanges.subscribe(value => {
      this.form.patchValue({
        colorId: value ? value.id : undefined,
      });
    });
  }
}
