import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ErrorCodes } from '../../../../../core/interceptors/error-code';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';

const VEHICLE_IN_PROGRESS = 6066;

@Component({
  selector: 'vehicle-in-progress-modal',
  templateUrl: './vehicle-in-progress-modal.component.html',
  styleUrls: ['./vehicle-in-progress-modal.component.scss']
})
export class VehicleInProgressModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  vehicleList;
  title = ErrorCodes[VEHICLE_IN_PROGRESS];
  isCollapsedWS = false;
  modalHeight: number;
  registerNo: string;
  constructor(private modalHeightService: SetModalHeightService) { }

  ngOnInit() {
  }

  open(vehicleList) {
    this.vehicleList = vehicleList;
    this.registerNo = this.vehicleList[0].registerNo;
    this.modal.show();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  close() {
    this.modal.hide();
  }

}
