import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { DataFormatService } from '../../../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'history-modal-active-intention-grid',
  templateUrl: './history-modal-active-intention-grid.component.html',
  styleUrls: ['./history-modal-active-intention-grid.component.scss'],
})
export class HistoryModalActiveIntentionGridComponent implements OnInit, OnChanges {
  @Input() historyOfSelectedFAH;
  fieldGridActiveIntention;
  activeIntentionParams;

  constructor(
    private dataFormatService: DataFormatService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.activeIntentionParams) {
      this.activeIntentionParams.api.setRowData(this.historyOfSelectedFAH.activeDTLSList);
    }
  }

  ngOnInit() {
    this.fieldGridActiveIntention = [
      {
        headerName: 'Dealer',
        children: [
          { field: 'grade', minWidth: 100 },
          { field: 'gradeProduction', minWidth: 100, },
          { field: 'color', minWidth: 90 },
          { headerName: 'Qty', field: 'quantity', minWidth: 80 },
        ],
      },
      {
        headerName: 'TMV',
        children: [
          {
            headerName: 'FRSP',
            field: 'frsp',
            minWidth: 100,
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'FWSP',
            field: 'fwsp',
            minWidth: 90,
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Discount',
            field: 'discount',
            minWidth: 95,
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'text-right']
          },
        ],
      },
    ];
  }

  callbackGridActiveIntention(params) {
    this.activeIntentionParams = params;
  }
}

