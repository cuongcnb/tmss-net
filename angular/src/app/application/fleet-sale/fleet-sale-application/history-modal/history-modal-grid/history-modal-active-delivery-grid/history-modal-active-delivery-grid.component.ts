import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'history-modal-active-delivery-grid',
  templateUrl: './history-modal-active-delivery-grid.component.html',
  styleUrls: ['./history-modal-active-delivery-grid.component.scss']
})
export class HistoryModalActiveDeliveryGridComponent implements OnInit, OnChanges {
  @Input() historyOfSelectedFAH;
  fieldGridActiveDelivery;
  activeDeliveryParams;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.activeDeliveryParams) {
      this.activeDeliveryParams.api.setRowData(this.historyOfSelectedFAH.activeDeliveryList);
    }
  }

  ngOnInit() {
    this.fieldGridActiveDelivery = [
      {
        field: 'grade',
        minWidth: 80
      },
      {
        field: 'gradeProduction',
        minWidth: 100,
      },
      {
        headerName: 'Dealer',
        children: [
          { headerName: 'Qty', field: 'quantity', minWidth: 70, cellClass: ['cell-border', 'text-right'] },
          { headerName: 'Month', field: 'month', minWidth: 90, cellClass: ['cell-border', 'text-right'] },
          { headerName: 'Year', field: 'year', minWidth: 75, cellClass: ['cell-border', 'text-right'] },
        ]
      },
      {
        headerName: 'TMV',
        children: [
          { headerName: 'Qty', field: 'quantityTmv', minWidth: 70, cellClass: ['cell-border', 'text-right'] },
          { headerName: 'Month', field: 'monthTmv', minWidth: 90, cellClass: ['cell-border', 'text-right'] },
          { headerName: 'Year', field: 'yearTmv', minWidth: 75, cellClass: ['cell-border', 'text-right'] },
        ]
      },
    ];
  }

  callbackGridActiveDelivery(params) {
    this.activeDeliveryParams = params;
  }
}
