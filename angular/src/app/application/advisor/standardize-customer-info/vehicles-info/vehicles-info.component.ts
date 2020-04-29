import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {VehicleApi} from '../../../../api/vehicle/vehicle.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {VehicleOfCusModel} from '../../../../core/models/advisor/standarize-customer-info.model';
import {CommonService} from '../../../../shared/common-service/common.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vehicles-info',
  templateUrl: './vehicles-info.component.html',
  styleUrls: ['./vehicles-info.component.scss']
})
export class VehiclesInfoComponent implements OnInit, OnChanges {
  @Input() cusId: number;
  fieldGrid;
  params;
  vehicleList: Array<VehicleOfCusModel>;

  constructor(
    private loading: LoadingService,
    private common: CommonService,
    private vehicleApi: VehicleApi
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'registerno'},
      {headerName: 'Số khung', headerTooltip: 'Số khung', field: 'frameno'},
      {headerName: 'Số vin', headerTooltip: 'Số vin', field: 'vinno'},
      {headerName: 'Số máy', headerTooltip: 'Số máy', field: ' engineno'},
      {headerName: 'Loại máy', headerTooltip: 'Loại máy', field: 'enginecode'},
      {headerName: 'MODEL', headerTooltip: 'MODEL', field: 'cmCode'},
      {headerName: 'Màu xe', headerTooltip: 'Màu xe', field: 'vcCode'}
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cusId && !this.common.isEmpty(this.cusId)) {
      this.getVehicleOfCus(this.cusId);
    }
  }

  callbackGrid(params) {
    params.api.setRowData();
    this.params = params;
  }

  private getVehicleOfCus(cusId) {
    this.loading.setDisplay(true);
    this.vehicleApi.getVehicleOfCustomers([cusId]).subscribe(vehicles => {
      this.loading.setDisplay(false);
      this.vehicleList = vehicles || [];
      if (this.params) {
        this.params.api.setRowData(this.vehicleList);
      }
    });
  }
}
