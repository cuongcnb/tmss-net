import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {CommonService} from '../../../../shared/common-service/common.service';
import {RepairJobHistoryModel} from '../../../../core/models/warranty/repairJobHistory.model';
import {ClaimDetailApi} from '../../../../api/warranty/claim-detail.api';
import {WarrantyPartsApi} from '../../../../api/warranty/warranty-parts.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'repair-job-history',
  templateUrl: './repair-job-history.component.html',
  styleUrls: ['./repair-job-history.component.scss']
})
export class RepairJobHistoryComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight;
  repairJobParams;
  fieldRepairJobList;
  repairJobFooter;

  partDetailParams;
  partDetailFooter;
  fieldPartDetailList;
  fieldPartDetailFooterList;
  fieldRepairJobFooterList;
  repairJobHistory: RepairJobHistoryModel;
  selectedWaitingOrder;

  constructor(private setModalHeightService: SetModalHeightService,
              private loadingService: LoadingService,
              private dataFormatService: DataFormatService,
              private commonService: CommonService,
              private claimDetailApi: ClaimDetailApi,
              private warrantyPartsApi: WarrantyPartsApi) {
    this.fieldRepairJobList = [
      {
        headerName: 'Repair (Job) Code',
        headerTooltip: 'Repair (Job) Code',
        field: 'rccode'
      },
      {
        headerName: 'Repair (Job) Name',
        headerTooltip: 'Repair (Job) Name',
        field: 'rcname'
      },
      {
        headerName: 'Repair Type',
        headerTooltip: 'Repair Type',
        field: 'rcType'
      },
      {
        headerName: 'Repair Cost',
        headerTooltip: 'Repair Cost',
        field: 'cost',
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      }
    ];
    this.fieldRepairJobFooterList = [
      {
        field: 'rccode'
      },
      {
        field: 'rcname'
      },
      {
        field: 'rcType'
      },
      {
        field: 'cost',
        cellClass: ['text-right']
      }
    ];
    this.repairJobFooter = [{

      rccode: '',
      rcname: 'Total repair amount',
      rcType: '',
      cost: 0
    }];
    this.fieldPartDetailList = [
      {
        headerName: 'Part Number',
        headerTooltip: 'Part Number',
        field: 'partscode'
      },
      {
        headerName: 'Part Name',
        headerTooltip: 'Part Name',
        field: 'partsname'
      },
      {
        headerName: 'B/O',
        headerTooltip: 'B/O',
        field: 'bo'
      },
      {
        headerName: 'Qty',
        headerTooltip: 'Qty',
        field: 'qty',
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'Repair Type',
        headerTooltip: 'Repair Type',
        field: 'repairType'
      },
      {
        headerName: 'Tax Rate',
        headerTooltip: 'Tax Rate',
        field: 'rate'
      },
      {
        headerName: '',
        headerTooltip: '',
        field: 'amount',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        valueGetter: params => params.data.qty * params.data.sellprice
      }
    ];
    this.fieldPartDetailFooterList = [
      {
        field: 'partscode'
      },
      {
        field: 'partsname'
      },
      {
        field: 'bo'
      },
      {
        field: 'qty'
      },
      {
        field: 'repairType'
      },
      {
        field: 'rate'
      },
      {
        headerName: '',
        headerTooltip: '',
        field: 'amount',
        cellClass: ['text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      }
    ];
    this.partDetailFooter = [{
      partscode: '',
      partsname: 'Total parts amount',
      bo: '',
      qty: '',
      repairType: '',
      rate: '',
      amount: 0
    }];
  }

  formatDate(val) {
    return this.dataFormatService.parseTimestampToDate(val);
  }

  ngOnInit() {
    this.onResize();
  }

  open(selectedWaitingOrder) {
    this.selectedWaitingOrder = selectedWaitingOrder;
    this.search({orderNo: this.selectedWaitingOrder.orderNo, dealerCode: this.selectedWaitingOrder.dealerCode});
  }

  reset() {
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResizeWithoutFooter();
  }

  callbackRepairJob(params) {
    this.repairJobParams = params;
    if (this.repairJobHistory && this.repairJobHistory.vwarrantyLaborDetails) {
      this.repairJobHistory.vwarrantyLaborDetails.map(item => item.rcType = 'Warranty');
    }
    this.repairJobParams.api.setRowData(this.repairJobHistory.vwarrantyLaborDetails);

  }

  callbackRepairJobFooter(params) {
    this.repairJobFooter[0].cost = this.commonService.sumObjectByField(this.repairJobHistory.vwarrantyLaborDetails, 'cost');
    params.api.setRowData(this.repairJobFooter);
  }

  callbackPartDetail(params) {
    this.partDetailParams = params;
    if (this.repairJobHistory && this.repairJobHistory.vwarrantyPartsDetails) {
      this.repairJobHistory.vwarrantyPartsDetails.forEach((item) => {
        this.warrantyPartsApi.getPart(item.partscode).subscribe(val => {
          item.repairType = 'warranty';
          item.partsname = val.partsname;
          item.rate = val.rate;
          this.partDetailParams.api.setRowData(this.repairJobHistory.vwarrantyPartsDetails);
        });
      });

    }
  }

  callbackPartDetailFooter(params) {
    this.partDetailFooter[0].amount = this.commonService.sumObjectByMultipleField(this.repairJobHistory.vwarrantyPartsDetails, ['qty', 'sellprice']);
    params.api.setRowData(this.partDetailFooter);
  }

  search(searchObj) {
    this.loadingService.setDisplay(true);
    this.claimDetailApi.getRepairOrderHistory(searchObj).subscribe(val => {
      if (val) {
        this.repairJobHistory = val;
      }
      this.modal.show();
      this.loadingService.setDisplay(false);
    });
  }
}
