import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {CashierApi} from '../../../../api/dlr-cashier/cashier.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'go-out-gate-printing',
  templateUrl: './go-out-gate-printing.component.html',
  styleUrls: ['./go-out-gate-printing.component.scss']
})
export class GoOutGatePrintingComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal;
  @Output() print = new EventEmitter();
  modalHeight: number;
  gridField;
  gridParams;

  roId: number;
  cusvsId: number;

  constructor(
    private modalHeightService: SetModalHeightService,
    private loading: LoadingService,
    private cashierApi: CashierApi,
    private dataFormatService: DataFormatService
  ) {
  }

  ngOnInit() {
    this.gridField = [
      {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'registerNo'},
      {headerName: 'Số RO chưa thu ngân', headerTooltip: 'Số RO chưa thu ngân', field: 'repairorderno'},
      {headerName: 'Trạng thái của RO', headerTooltip: 'Trạng thái của RO', field: 'state'},
      {
        headerName: 'Số tiền', headerTooltip: 'Số tiền', field: 'total',
        cellClass: ['text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {headerName: 'Người tạo RO', headerTooltip: 'Người tạo RO', field: 'empName'}
    ];
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(roId, cusvsId) {
    this.roId = roId;
    this.cusvsId = cusvsId;
    this.onResize();
    this.modal.show();
  }

  reset() {
    this.roId = undefined;
    this.cusvsId = undefined;
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.getCashierRO();
  }

  printing() {
    this.print.emit(1);
  }

  private getCashierRO() {
    this.loading.setDisplay(true);
    this.cashierApi.getCashierRO(this.roId, this.cusvsId).subscribe(res => {
      !!res ? this.gridParams.api.setRowData(res) : this.gridParams.api.setRowData();
      this.loading.setDisplay(false);
      this.gridParams.api.sizeColumnsToFit(this.gridParams);
    });
  }
}
