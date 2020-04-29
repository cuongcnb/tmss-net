import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { DataFormatService } from '../../../../../../shared/common-service/data-format.service';
import { GradeListModel} from '../../../../../../core/models/sales/model-list.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'change-purchasing-active-intention-grid',
  templateUrl: './change-purchasing-active-intention-grid.component.html',
  styleUrls: ['./change-purchasing-active-intention-grid.component.scss']
})
export class ChangePurchasingActiveIntentionGridComponent implements OnInit, OnChanges {
  @Input() isDlrFleetSaleApplication;
  @Input() selectedFleetApp;
  @Input() gradeList;
  @Input() colorList;
  @Input() fleetIntentions;
  fieldGridActiveIntention;
  activeIntentionParams;

  constructor(private dataFormatService: DataFormatService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.fleetIntentions && this.activeIntentionParams) {
      this.activeIntentionParams.api.setRowData(this.fleetIntentions);
    }
  }

  ngOnInit() {
    this.fieldGridActiveIntention = [
      {
        headerName: 'Dealer',
        children: [
          {
            headerName: 'Grade',
            field: 'grade',
            minWidth: 100
          },
          {
            field: 'gradeProduction',
            minWidth: 100,
          },
          {
            headerName: 'Color',
            field: 'color',
            minWidth: 90,
          },
          {
            headerName: 'Qty',
            field: 'quantity',
            minWidth: 80,
            cellClass: ['cell-border', 'text-right']
          },
        ]
      },
      {
        headerName: 'TMV',
        children: [
          {
            headerName: 'FRSP', field: 'frsp', minWidth: 100,
            valueFormatter: params => this.dataFormatService.numberFormat(params.value), cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'FWSP', field: 'fwsp', minWidth: 90,
            valueFormatter: params => this.dataFormatService.numberFormat(params.value), cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Discount', field: 'discount', minWidth: 95,
            valueFormatter: params => this.dataFormatService.numberFormat(params.value), cellClass: ['cell-border', 'text-right']
          },
        ]
      }
    ];
  }

  callbackGridActiveIntention(params) {
    if (this.fleetIntentions) {
      params.api.setRowData(this.fleetIntentions);
    }
    this.activeIntentionParams = params;
  }
}
