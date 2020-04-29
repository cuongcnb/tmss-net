import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'history-modal-previous-delivery-grid',
  templateUrl: './history-modal-previous-delivery-grid.component.html',
  styleUrls: ['./history-modal-previous-delivery-grid.component.scss']
})
export class HistoryModalPreviousDeliveryGridComponent implements OnInit, OnChanges {
  @Input() historyOfSelectedFAH;
  fieldGridPreviousDelivery;
  previousDeliveryParams;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.previousDeliveryParams) {
      this.previousDeliveryParams.api.setRowData(this.historyOfSelectedFAH.previousDeliveryList);
    }
  }

  ngOnInit() {
    this.fieldGridPreviousDelivery = [
      { field: 'grade', minWidth: 80 },
      {
        field: 'gradeProduction',
        minWidth: 100,
      },
      {
        headerName: 'Dealer',
        children: [
          { headerName: 'Qty', field: 'quantity', minWidth: 70 },
          { headerName: 'Month', field: 'month', minWidth: 90 },
          { headerName: 'Year', field: 'year', minWidth: 75 },
        ]
      },
      {
        headerName: 'TMV',
        children: [
          { headerName: 'Qty', field: 'quantityTmv', minWidth: 70 },
          { headerName: 'Month', field: 'monthTmv', minWidth: 90 },
          { headerName: 'Year', field: 'yearTmv', minWidth: 75 },
        ]
      },
    ];
  }

  callbackGridPreviousDelivery(params) {
    this.previousDeliveryParams = params;
  }
}
