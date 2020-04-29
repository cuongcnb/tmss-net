import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../shared/loading/loading.service';
import {FleetUnitService} from '../../../api/fleet-sale/fleet-unit.service';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fleet-unit',
  templateUrl: './fleet-unit.component.html',
  styleUrls: ['./fleet-unit.component.scss']
})
export class FleetUnitComponent implements OnInit {
  @ViewChild('modifyFleetUnit', {static: false}) modifyFleetUnit;
  fieldGrid;
  fleetUnitParams;
  selectedFleetUnit;
  fleetUnits;

  constructor(
    private loadingService: LoadingService,
    private fleetUnitService: FleetUnitService,
    private toastService: ToastService
  ) {
    this.fieldGrid = [
      {
        headerName: 'Min',
        field: 'unitMin'
      },
      {
        headerName: 'Max',
        field: 'unitMax'
      },
      {field: 'available'},
    ];
  }

  ngOnInit() {
  }

  callbackGridFleetUnit(params) {
    this.loadingService.setDisplay(true);
    this.fleetUnitService.getAllFleetUnit().subscribe(fleetUnits => {
      this.fleetUnits = fleetUnits;
      params.api.setRowData(this.fleetUnits);
      this.loadingService.setDisplay(false);
    });
    this.fleetUnitParams = params;
  }

  getParamsFleetUnit() {
    const selectedFleetUnit = this.fleetUnitParams.api.getSelectedRows();
    if (selectedFleetUnit) {
      this.selectedFleetUnit = selectedFleetUnit[0];
    }
  }

  refreshList() {
    this.callbackGridFleetUnit(this.fleetUnitParams);
  }

  updateFleetUnit() {
    this.selectedFleetUnit
      ? this.modifyFleetUnit.open(this.selectedFleetUnit)
      : this.toastService.openWarningForceSelectData();
  }
}
