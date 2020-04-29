import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ProgressBrealInfoModel} from '../../../../core/models/coo/progress-breal-info.model';
import {ModalDirective} from 'ngx-bootstrap';
import {TMSSTabs} from '../../../../core/constains/tabs';
import {EventBusService} from '../../../../shared/common-service/event-bus.service';
import {CustomerApi} from '../../../../api/customer/customer.api';
import {LoadingService} from '../../../../shared/loading/loading.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'management-vehicle',
  templateUrl: './management-vehicle.component.html',
  styleUrls: ['./management-vehicle.component.scss']
})
export class ManagementVehicleComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;

  form: FormGroup;
  fieldGrid;
  params;
  selectedData: ProgressBrealInfoModel;
  advisors;

  constructor(
    private eventBus: EventBusService,
    private customerApi: CustomerApi,
    private loadingService: LoadingService
  ) {
    this.fieldGrid = [
      {headerName: 'STT', headerTooltip: 'STT', field: 'stt'},
      {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'registerNo'},
      {headerName: 'Số RO', headerTooltip: 'Số RO', field: ''},
      {headerName: 'CVDV', headerTooltip: 'CVDV', field: ''},
      {
        headerName: 'Loại hình RO', headerTooltip: 'Loại hình RO', field: 'roType', valueFormatter: params => Number(params.value) === 2 ? 'Sửa chữa chung' : 'Đồng sơn'
      }
    ];
  }

  ngOnInit() {
  }

  open() {
    this.modal.show();
    if (this.params) {
      this.params.api.setRowData([{roType: 1}, {roType: 2}]);
      this.params.api.sizeColumnsToFit(this.params);
    }
  }

  callbackGrid(params) {
    params.api.setRowData([{roType: 1}, {roType: 2}]);
    this.params = params;
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  onCellDoubleClicked(param) {
    if (param.colDef && param.colDef.field === 'registerNo') {
      this.modal.hide();
      this.openRepairProcess(param.data.roType);
    } else {
      this.openProposal(param.data);
    }
  }

  openRepairProcess(roType) {
    if (!roType) {
      return;
    }
    if (roType === '2') {
      this.eventBus.emit({
        type: 'openComponent',
        functionCode: TMSSTabs.generalRepairProgress
      });
    } else {
      this.eventBus.emit({
        type: 'openComponent',
        functionCode: TMSSTabs.dongsonProgress
      });
    }
  }

  openProposal(data) {
    if (!data) {
      return;
    }
    const obj = {
      registerNo: data.registerNo,
      vinno: data.vinno
    };
    let roId = data.roId;
    this.customerApi.getCustomerData(obj).subscribe(res => {
      roId = (res.list && res.list.length > 0) ? res.list[0].roId : null;
    }, () => {
    }, () => {
      const customer = {
        cusDId: data.cusDId,
        cusId: data.customerId,
        roId,
        vehiclesId: data.vehiclesId,
        cusvsId: data.cusvsId
      };
      this.loadingService.setDisplay(true);
      this.customerApi.getCustomerDetail(customer).subscribe(val => {
        this.loadingService.setDisplay(false);
        this.eventBus.emit({
          type: 'openComponent',
          functionCode: TMSSTabs.proposal,
          val
        });
      });
    });
  }
}
