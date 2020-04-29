import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FleetFollowUpService} from '../../../../api/fleet-sale/fleet-follow-up.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'follow-alert-modal',
  templateUrl: './follow-alert-modal.component.html',
  styleUrls: ['./follow-alert-modal.component.scss']
})
export class FollowAlertModalComponent implements OnInit {
  @ViewChild('followAlertModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  fieldGridAlert;
  alertParams;

  constructor(private fleetFollowUpService: FleetFollowUpService) {
    this.fieldGridAlert = [
      { field: 'name' },
      { field: 'description' }
    ];
  }

  ngOnInit() {
  }

  open() {
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
  }

  save() {
  }

  callbackGridAlert(params) {
    this.alertParams = params;
  }

  getParamsAlert() {
  }

  refreshAlert() {}
}
