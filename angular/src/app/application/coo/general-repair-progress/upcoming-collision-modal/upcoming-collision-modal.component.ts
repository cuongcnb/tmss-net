import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { NameProgressByState } from '../../../../core/constains/progress-state';
import { EventBusService } from '../../../../shared/common-service/event-bus.service';

@Component({
  selector: 'upcoming-collision-modal',
  templateUrl: './upcoming-collision-modal.component.html',
  styleUrls: ['./upcoming-collision-modal.component.scss']
})
export class UpcomingCollisionModalComponent implements OnInit {

  @ViewChild('modal', { static: false }) modal: ModalDirective;
  collisionVehicles;
  isCollapsedWS = false;
  modalHeight: number;
  NameProgressByState = NameProgressByState;
  constructor(private modalHeightService: SetModalHeightService,
    private eventBusService: EventBusService, ) { }

  ngOnInit() {
  }

  open(collisionVehicles) {
    this.collisionVehicles = collisionVehicles;
    this.modal.show();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  close() {
    this.modal.hide();
  }

  openRepairPlanModal(vehiclePlan) {
    this.close();
    // this.repairPlanModal.open(vehiclePlan.planId, vehiclePlan.planState, false, vehiclePlan.planWshopId, vehiclePlan.planId);
    const data = {
      type: 'openRepairPlanModal',
      wpId: vehiclePlan.planId,
      state: vehiclePlan.planState,
      wshopId: vehiclePlan.planWshopId,
      id: vehiclePlan.planId,
      planId: vehiclePlan.planId,
      actualId: null,
    };
    this.eventBusService.emit(data);
  }
}
