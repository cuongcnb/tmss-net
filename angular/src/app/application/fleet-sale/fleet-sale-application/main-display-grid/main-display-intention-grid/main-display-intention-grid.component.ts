import {Component, Input, OnInit, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges} from '@angular/core';
import { DataFormatService } from '../../../../../shared/common-service/data-format.service';
import { EventBusType } from '../../../../../core/constains/eventBusType';
import { EventBusService } from '../../../../../shared/common-service/event-bus.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'main-display-intention-grid',
  templateUrl: './main-display-intention-grid.component.html',
  styleUrls: ['./main-display-intention-grid.component.scss']
})
export class MainDisplayIntentionGridComponent implements OnInit, OnChanges {
  @ViewChild('fleetEditGridDlr', {static: false}) fleetEditGridDlr;
  @ViewChild('fleetEditGridTmv', {static: false}) fleetEditGridTmv;
  @Input() isDlrFleetSaleApplication;
  @Input() selectedFleetApp;
  @Input() gradeList;
  @Input() colorList;
  @Input() fleetIntentions;
  @Output() displayedDataToSend = new EventEmitter();
  dataOfFleetApplication;
  fieldGridIntention;
  intentionParams;
  selectedIntention;
  displayedData: Array<any> = [];

  constructor(
    private dataFormatService: DataFormatService,
    private eventBusService: EventBusService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (this.intentionParams && this.dataOfFleetApplication) {
    //   this.intentionParams.api.setRowData(this.dataOfFleetApplication.appDTLSList);
    //   this.selectedIntention = undefined;
    //   this.getDisplayedData();
    // }
  }

  ngOnInit() {
    this.fieldGridIntention = [
      {
        headerName: 'Dealer',
        children: [
          {
            field: 'grade',
            width: 100,
          },
          {
            field: 'gradeProduction',
            width: 100,
          },
          {
            headerName: 'Color',
            field: 'color',
            width: 90,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Qty',
            field: 'quantity',
            width: 80,
            cellClass: ['cell-border', 'text-right']
          }
        ]
      },
      {
        headerName: 'TMV',
        children: [
          {
            headerName: 'FRSP',
            field: 'frsp',
            width: 100,
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'FWSP',
            field: 'fwsp',
            width: 90,
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Discount',
            field: 'discount',
            width: 95,
            valueFormatter: params => this.dataFormatService.numberFormat(params.value),
            cellClass: ['cell-border', 'text-right']
          }
        ]
      }
    ];
    this.setRowDataGrid();
  }

  setRowDataGrid() {
    this.eventBusService.on(EventBusType.onSelectFleetApp).subscribe(fleetAppMainDisplay => {
      this.dataOfFleetApplication = fleetAppMainDisplay.value;
      this.intentionParams.api.setRowData(fleetAppMainDisplay.value.appDTLSList);
      this.selectedIntention = undefined;
      this.getDisplayedData();
    });
  }

  callbackGridIntention(params) {
    this.intentionParams = params;
  }

  getParams() {
    // Get selected row
    const selectedIntention = this.intentionParams.api.getSelectedRows();
    if (selectedIntention) {
      this.selectedIntention = selectedIntention[0];
    }
  }

  agCellDoubleClicked(params) {
    const col = params.colDef.field;
    // Trigger edit modal
    if (this.isDlrFleetSaleApplication && (this.selectedFleetApp && this.selectedFleetApp.status.toUpperCase() === 'PENDING')) {
      if (col === 'grade' || col === 'gradeProduction' || (col === 'color' || col === 'quantity')) {
        this.fleetEditGridDlr.open(true, this.selectedIntention);
      }
    } else if (!this.isDlrFleetSaleApplication && (this.selectedFleetApp && this.selectedFleetApp.status.toUpperCase() === 'REQUEST')) {
      if (col === 'frsp' || (col === 'fwsp' || col === 'discount')) {
        this.fleetEditGridTmv.open(true, this.selectedIntention);
      }
    }
  }

  setFleetModalData(intentionData) {
    const index = this.displayedData.indexOf(this.selectedIntention);
    this.displayedData[index] = intentionData;
    this.intentionParams.api.setRowData(this.displayedData);
    this.getDisplayedData();
  }

  getDisplayedData() {
    const displayedData = [];
    this.intentionParams.api.forEachNode(node => {
      displayedData.push(node.data);
    });
    this.displayedData = displayedData.slice(0);
    this.displayedDataToSend.emit(this.displayedData);
  }

  onAddRow() {
    const blankIntention = {
      id: null,
      fleetAppHistoryId: null,
      grade: null,
      gradeId: null,
      gradeProduction: null,
      gradeProductionId: null,
      color: null,
      colorId: null,
      quantity: null,
      frsp: null,
      fwsp: null,
      discount: null,
    };
    this.intentionParams.api.updateRowData({ add: [blankIntention] });
    this.getDisplayedData();
  }

  removeSelectedRow() {
    this.intentionParams.api.updateRowData({ remove: [this.selectedIntention] });
    this.selectedIntention = undefined;
    this.getDisplayedData();
  }

  get disableAddBtn() {
    return !this.selectedFleetApp || (this.selectedFleetApp && this.selectedFleetApp.status !== 'PENDING') ? true : null;
  }

  get disableRemoveBtn() {
    if (!this.selectedFleetApp || (this.selectedFleetApp && this.selectedFleetApp.status !== 'PENDING')) {
      return true;
    } else if (this.selectedFleetApp && this.selectedFleetApp.status === 'PENDING') {
      if (this.selectedIntention) {
        return null;
      }
      return true;
    } else {
      return true;
    }
  }
}
