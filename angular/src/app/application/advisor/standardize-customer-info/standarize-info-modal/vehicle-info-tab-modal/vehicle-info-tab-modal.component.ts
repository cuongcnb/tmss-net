import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
  CustomerInfoModel,
  VehicleOfCusModel
} from '../../../../../core/models/advisor/standarize-customer-info.model';
import {VehicleApi} from '../../../../../api/vehicle/vehicle.api';
import {LoadingService} from '../../../../../shared/loading/loading.service';
import {CommonService} from '../../../../../shared/common-service/common.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vehicle-info-tab-modal',
  templateUrl: './vehicle-info-tab-modal.component.html',
  styleUrls: ['./vehicle-info-tab-modal.component.scss']
})
export class VehicleInfoTabModalComponent implements OnInit, OnChanges {
  @Input() listCus: Array<CustomerInfoModel>;
  @Input() isShown: boolean;
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
    if (this.isShown && this.listCus && this.listCus.length) {
      this.getVehicleOfCus(this.listCus.map(cus => cus.id));
    }
  }

  callbackGrid(params) {
    params.api.setRowData();
    this.params = params;
    if (this.isShown && this.listCus && this.listCus.length) {
      this.getVehicleOfCus(this.listCus.map(cus => cus.id));
    }
  }


  private getVehicleOfCus(listCusId) {
    this.loading.setDisplay(true);
    this.vehicleApi.getVehicleOfCustomers(listCusId).subscribe(vehicles => {
      this.loading.setDisplay(false);
      this.vehicleList = vehicles || [];
      if (this.params) {
        this.params.api.setRowData(this.vehicleList);
      }
    });
  }

  resize() {
    if (this.params) {
      this.params.api.sizeColumnsToFit(this.params);
    }
  }
}
