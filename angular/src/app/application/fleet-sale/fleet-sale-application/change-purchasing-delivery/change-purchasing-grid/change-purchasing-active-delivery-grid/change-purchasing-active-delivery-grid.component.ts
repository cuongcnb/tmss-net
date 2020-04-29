import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { GradeListModel} from '../../../../../../core/models/sales/model-list.model';
import { DataFormatService } from '../../../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'change-purchasing-active-delivery-grid',
  templateUrl: './change-purchasing-active-delivery-grid.component.html',
  styleUrls: ['./change-purchasing-active-delivery-grid.component.scss']
})
export class ChangePurchasingActiveDeliveryGridComponent implements OnInit, OnChanges {
  @Input() isDlrFleetSaleApplication;
  @Input() selectedFleetApp;
  @Input() fleetDeliveries;
  @Input() gradeList: Array<GradeListModel>;
  fieldGridActiveDelivery;
  activeDeliveryParams;

  constructor(
    private dataFormatService: DataFormatService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.fleetDeliveries && this.activeDeliveryParams) {
      this.activeDeliveryParams.api.setRowData(this.fleetDeliveries);
    }
  }

  ngOnInit() {
    this.fieldGridActiveDelivery = [
      {
        headerName: 'Grade',
        field: 'grade',
        minWidth: 80,
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
    if (this.fleetDeliveries) {
      params.api.setRowData(this.fleetDeliveries);
    }
    this.activeDeliveryParams = params;
  }
}
