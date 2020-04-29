import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { GradeListModel} from '../../../../../../core/models/sales/model-list.model';
import { DataFormatService } from '../../../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'change-purchasing-request-delivery-grid',
  templateUrl: './change-purchasing-request-delivery-grid.component.html',
  styleUrls: ['./change-purchasing-request-delivery-grid.component.scss']
})
export class ChangePurchasingRequestDeliveryGridComponent implements OnInit, OnChanges {
  @ViewChild('fleetEditGridDlr', {static: false}) fleetEditGridDlr;
  @Input() isDlrFleetSaleApplication;
  @Input() selectedFleetApp;
  @Input() fleetDeliveries;
  @Input() gradeList: Array<GradeListModel>;
  @Output() displayedDataToSend = new EventEmitter();
  fieldGridRequestDelivery;
  requestDeliveryParams;
  selectedDelivery;
  displayedData;

  constructor(
    private dataFormatService: DataFormatService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.fleetDeliveries && this.requestDeliveryParams) {
      this.requestDeliveryParams.api.setRowData(this.fleetDeliveries);
    }
  }

  ngOnInit() {
    this.fieldGridRequestDelivery = [
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
          {
            headerName: 'Qty',
            field: 'quantity',
            minWidth: 70,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Month',
            field: 'month',
            minWidth: 90,
            cellClass: ['cell-border', 'text-right'],
          },
          {
            headerName: 'Year',
            field: 'year',
            minWidth: 75,
          }
        ]
      },
      {
        headerName: 'TMV',
        children: [
          {
            headerName: 'Qty',
            field: 'quantityTmv',
            minWidth: 70,
            editable: !this.isDlrFleetSaleApplication,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Month',
            field: 'monthTmv',
            minWidth: 90,
            editable: !this.isDlrFleetSaleApplication,
            cellClass: ['cell-border', 'text-right'],
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: {
              values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            },
          },
          {
            headerName: 'Year',
            field: 'yearTmv',
            minWidth: 75,
            editable: !this.isDlrFleetSaleApplication,
            cellClass: ['cell-border', 'text-right'],
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: {
              values: this.getTenYearsFromNow
            },
          },
        ]
      },
    ];
  }

  getTenYearsFromNow() {
    const tenYearsFromNow = [];
    for (let i = 0; i <= 10; i++) {
      tenYearsFromNow.push(new Date().getFullYear() + i);
    }
    return tenYearsFromNow;
  }

  callbackGridRequestDelivery(params) {
    params.api.setRowData(this.fleetDeliveries);
    this.requestDeliveryParams = params;
    this.getDisplayedData();
  }

  getParams() {
    const selectedIntention = this.requestDeliveryParams.api.getSelectedRows();
    if (selectedIntention) {
      this.selectedDelivery = selectedIntention[0];
    }
  }

  agCellDoubleClicked(params) {
    const col = params.colDef.field;
    // Trigger edit modal
    if ((col === 'grade' || col === 'gradeProduction' || col === 'quantity') || (col === 'month' || col === 'year')) {
      this.fleetEditGridDlr.open(false, this.selectedDelivery);
    }
  }

  setFleetModalData(deliveryData) {
    const index = this.displayedData.indexOf(this.selectedDelivery);
    this.displayedData[index] = deliveryData;
    this.requestDeliveryParams.api.setRowData(this.displayedData);
    this.getDisplayedData();
  }

  getDisplayedData() {
    const displayedData = [];
    this.requestDeliveryParams.api.forEachNode(node => {
      displayedData.push(node.data);
    });
    this.displayedData = displayedData;
    this.displayedDataToSend.emit(displayedData);
  }

  onAddRow() {
    const blankDelivery = {
      grade: undefined,
      gradeId: undefined,
      gradeProduction: undefined,
      gradeProductionId: undefined,
      quantity: undefined,
      month: undefined,
      year: undefined,

      quantityTmv: undefined,
      monthTmv: undefined,
      yearTmv: undefined,
    };
    this.requestDeliveryParams.api.updateRowData({ add: [blankDelivery] });
    this.getDisplayedData();
  }

  removeSelectedRow() {
    this.requestDeliveryParams.api.updateRowData({ remove: [this.selectedDelivery] });
    this.selectedDelivery = undefined;
    this.getDisplayedData();
  }
}
