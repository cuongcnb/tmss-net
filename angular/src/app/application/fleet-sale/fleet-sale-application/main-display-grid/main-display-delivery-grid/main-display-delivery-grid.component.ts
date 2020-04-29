import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { EventBusService } from '../../../../../shared/common-service/event-bus.service';
import { EventBusType } from '../../../../../core/constains/eventBusType';
import {ToastService} from '../../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'main-display-delivery-grid',
  templateUrl: './main-display-delivery-grid.component.html',
  styleUrls: ['./main-display-delivery-grid.component.scss']
})
export class MainDisplayDeliveryGridComponent implements OnInit, OnChanges {
  @ViewChild('fleetEditGridDlr', {static: false}) fleetEditGridDlr;
  @ViewChild('fleetEditGridTmv', {static: false}) fleetEditGridTmv;
  @Input() isDlrFleetSaleApplication;
  @Input() selectedFleetApp;
  @Input() gradeList;
  @Input() displayedIntentionData;
  @Output() displayedDataToSend = new EventEmitter();
  dataOfFleetApplication;
  fieldGridDelivery;
  deliveryParams;
  selectedDelivery;
  selectedDeliveryNode;
  displayedData: Array<any> = [];

  constructor(
    private eventBusService: EventBusService,
    private swalAlertService: ToastService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (this.deliveryParams && this.dataOfFleetApplication) {
    //   this.deliveryParams.api.setRowData(this.dataOfFleetApplication.appDeliveriesList);
    //   this.selectedDelivery = undefined;
    //   this.getDisplayedData();
    // }
  }

  ngOnInit() {
    this.fieldGridDelivery = [
      // {
      //   children: [],
      //   rowGroup: true,
      // },
      {
        field: 'grade',
        width: 80,
      },
      {
        field: 'gradeProduction',
        width: 100,
      },
      {
        headerName: 'Dealer',
        children: [
          {
            headerName: 'Qty',
            field: 'quantity',
            width: 70,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Month',
            field: 'month',
            width: 90,
            cellClass: ['cell-border', 'text-right'],
          },
          {
            headerName: 'Year',
            field: 'year',
            width: 75,
            cellClass: ['cell-border', 'text-right'],
          },
        ]
      },
      {
        headerName: 'TMV',
        children: [
          {
            headerName: 'Qty',
            field: 'quantityTmv',
            width: 70,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'Month',
            field: 'monthTmv',
            width: 90,
            cellClass: ['cell-border', 'text-right'],
          },
          {
            headerName: 'Year',
            field: 'yearTmv',
            width: 75,
            cellClass: ['cell-border', 'text-right'],
          },
        ]
      },
    ];
    this.setRowDataGrid();
  }

  setRowDataGrid() {
    this.eventBusService.on(EventBusType.onSelectFleetApp).subscribe(fleetAppMainDisplay => {
      this.dataOfFleetApplication = fleetAppMainDisplay.value;
      this.deliveryParams.api.setRowData(fleetAppMainDisplay.value.appDeliveriesList);
      this.selectedDelivery = undefined;
      this.getDisplayedData();
    });
  }

  callbackGridDelivery(params) {
    this.deliveryParams = params;
  }

  getParams() {
    const selectedDelivery = this.deliveryParams.api.getSelectedNodes();
    if (selectedDelivery) {
      this.selectedDelivery = selectedDelivery[0] ? selectedDelivery[0].data : undefined;
      this.selectedDeliveryNode = selectedDelivery[0];
    }
  }

  agCellDoubleClicked(params) {
    const col = params.colDef.field;
    // Trigger edit modal
    if (this.isDlrFleetSaleApplication && (this.selectedFleetApp && this.selectedFleetApp.status.toUpperCase() === 'PENDING')) {
      if ((col === 'grade' || col === 'gradeProduct' || col === 'quantity') || (col === 'month' || col === 'year')) {
        this.fleetEditGridDlr.open(false, this.selectedDelivery, this.displayedIntentionData);
      }
    } else if (!this.isDlrFleetSaleApplication && (this.selectedFleetApp && this.selectedFleetApp.status.toUpperCase() === 'REQUEST')) {
      if ((col === 'quantityTmv' || (col === 'monthTmv') || col === 'yearTmv')) {
        this.fleetEditGridTmv.open(false, this.selectedDelivery);
      }
    }
  }

  setFleetModalData(deliveryData) {
    const index = this.displayedData.indexOf(this.selectedDelivery);
    this.displayedData[index] = deliveryData;
    this.deliveryParams.api.setRowData(this.displayedData);
    this.getDisplayedData();
  }

  getDisplayedData() {
    const displayedData = [];
    this.deliveryParams.api.forEachNode(node => {
      displayedData.push(node.data);
    });
    this.displayedData = displayedData.slice(0);
    this.displayedDataToSend.emit(this.displayedData);
  }

  onAddRow() {
    if (!this.isDlrFleetSaleApplication && !this.selectedDeliveryNode) {
      this.swalAlertService.openWarningModal('Please choose a Delivery Plan');
      return;
    }
    const blankDelivery = {
      id: !this.isDlrFleetSaleApplication ? this.selectedDelivery.id : null,
      fleetAppHistoryId: null,
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
    if (this.isDlrFleetSaleApplication) {
      this.deliveryParams.api.updateRowData({add: [blankDelivery]});
    } else {
      this.deliveryParams.api.updateRowData({add: [blankDelivery], addIndex: this.selectedDeliveryNode.rowIndex + 1});
    }
    this.getDisplayedData();
  }

  removeSelectedRow() {
    if (!this.selectedDeliveryNode) {
      this.swalAlertService.openWarningModal('Please choose a Delivery Plan');
      return;
    }
    this.deliveryParams.api.updateRowData({remove: [this.selectedDelivery]});
    this.selectedDelivery = undefined;
    this.getDisplayedData();
  }

  get disableAddBtn() {
    return (this.isDlrFleetSaleApplication && (!this.selectedFleetApp || (this.selectedFleetApp && this.selectedFleetApp.status !== 'PENDING')))
    // Login by DLR && Fleet Status = pending
    || (!this.isDlrFleetSaleApplication && (this.selectedFleetApp && this.selectedFleetApp.status.toUpperCase() !== 'REQUEST'))
      // Login by TMV && Fleet Status = request
      ? true : null;
  }

  get disableRemoveBtn() {
    // Login by DLR && Fleet Status = pending
    return (this.isDlrFleetSaleApplication && this.selectedFleetApp && this.selectedFleetApp.status === 'PENDING')
      || (
        !this.isDlrFleetSaleApplication && this.selectedFleetApp
      && this.selectedFleetApp.status.toUpperCase() === 'REQUEST' && this.selectedDelivery && !this.selectedDelivery.grade
    )
      // Login by TMV && Fleet Status = pending && Chọn dòng tự thêm
      ? null : true;

  }
}
