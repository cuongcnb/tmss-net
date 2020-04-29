import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { GradeListModel} from '../../../../../../core/models/sales/model-list.model';
import { DataFormatService } from '../../../../../../shared/common-service/data-format.service';
import { GradeListService} from '../../../../../../api/master-data/grade-list.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'change-purchasing-request-intention-grid',
  templateUrl: './change-purchasing-request-intention-grid.component.html',
  styleUrls: ['./change-purchasing-request-intention-grid.component.scss']
})
export class ChangePurchasingRequestIntentionGridComponent implements OnInit, OnChanges {
  @ViewChild('fleetEditGridDlr', {static: false}) fleetEditGridDlr;
  @Input() isDlrFleetSaleApplication;
  @Input() selectedFleetApp;
  @Input() gradeList: Array<GradeListModel>;
  @Input() colorList;
  @Input() fleetIntentions;
  @Output() displayedDataToSend = new EventEmitter();
  fieldGridRequestIntention;
  requestIntentionParams;
  selectedIntention;
  gradeColors: Array<any> = [];
  displayedData: Array<any> = [];

  constructor(
    private dataFormatService: DataFormatService,
    private gradeListService: GradeListService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.fleetIntentions && this.requestIntentionParams) {
      this.requestIntentionParams.api.setRowData(this.fleetIntentions);
    }
  }

  ngOnInit() {
    this.fieldGridRequestIntention = [
      {
        headerName: 'Dealer',
        children: [
          {
            field: 'grade',
            minWidth: 100,
          },
          {
            field: 'gradeProduction',
            minWidth: 100,
          },
          {
            field: 'color',
            minWidth: 90,
          },
          {
            headerName: 'Qty',
            field: 'quantity',
            minWidth: 80,
            cellClass: ['cell-border', 'text-right']
          }
        ]
      },
      {
        headerName: 'TMV',
        children: [
          {
            headerName: 'FRSP', field: 'frsp', minWidth: 100, editable: !this.isDlrFleetSaleApplication,
            valueFormatter: params => this.dataFormatService.numberFormat(params.value), cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'FWSP', field: 'fwsp', minWidth: 90, editable: !this.isDlrFleetSaleApplication,
            valueFormatter: params => this.dataFormatService.numberFormat(params.value), cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Discount', field: 'discount', minWidth: 95, editable: !this.isDlrFleetSaleApplication,
            valueFormatter: params => this.dataFormatService.numberFormat(params.value), cellClass: ['cell-border', 'text-right']
          }
        ]
      }
    ];
  }

  createAgColorList() {
    if (this.fleetIntentions  && this.gradeList && this.colorList) {
      const gradeIdArr = [];
      this.gradeColors = [];
      const fleetIntentions = this.fleetIntentions;
      fleetIntentions.forEach(fleetIntention => {
        this.gradeList.filter(grade => fleetIntention.gradeId = grade.marketingCode === fleetIntention.gradeId ? grade.id : fleetIntention.gradeId);
        gradeIdArr.push(fleetIntention.gradeId);
      });
      this.gradeListService.getGradeColorArr(gradeIdArr).subscribe(colorsOfDisplayed => {
        if (colorsOfDisplayed) {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < colorsOfDisplayed.length; i++) {
            this.gradeColors.push(colorsOfDisplayed[i].gradeProductColorList.map(item => item.code));
          }
        }
        this.setRowData(fleetIntentions);
      });
    }
  }

  setRowData(fleetIntentions) {
    if (this.requestIntentionParams) {
      this.requestIntentionParams.api.setRowData(fleetIntentions);
      this.getDisplayedData();
    }
  }

  callbackGridRequestIntention(params) {
    this.requestIntentionParams = params;
    if (this.fleetIntentions) {
      this.setRowData(this.fleetIntentions);
    }
    this.getDisplayedData();
  }

  getParams() {
    const selectedIntention = this.requestIntentionParams.api.getSelectedRows();
    if (selectedIntention) {
      this.selectedIntention = selectedIntention[0];
    }
  }

  agCellDoubleClicked(params) {
    const col = params.colDef.field;
    // Trigger edit modal
    if (col === 'grade' || col === 'gradeProduction' || (col === 'color' || col === 'quantity')) {
      // open(isIntentionTable, selectedIntentionOrDelivery?)
      this.fleetEditGridDlr.open(true, this.selectedIntention);
    }
  }

  setFleetModalData(intentionData) {
    // this.getChangedRows(intentionData);
    const index = this.displayedData.indexOf(this.selectedIntention);
    this.displayedData[index] = intentionData;
    this.requestIntentionParams.api.setRowData(this.displayedData);
    this.getDisplayedData();
  }

  getDisplayedData() {
    const displayedData = [];
    this.requestIntentionParams.api.forEachNode(node => {
      displayedData.push(node.data);
    });
    this.displayedDataToSend.emit(displayedData);
    this.displayedData = displayedData;
  }

  onAddRow() {
    const blankIntention = {
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
    this.requestIntentionParams.api.updateRowData({ add: [blankIntention]});
    this.getDisplayedData();
  }

  removeSelectedRow() {
    this.requestIntentionParams.api.updateRowData({ remove: [this.selectedIntention] });
    this.selectedIntention = undefined;
    this.getDisplayedData();
  }
}
