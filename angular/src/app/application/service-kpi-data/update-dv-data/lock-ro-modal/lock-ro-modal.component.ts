import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ServiceKpiDataModel } from '../../../../core/models/service-kpi-data/service-kpi-data.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lock-ro-modal',
  templateUrl: './lock-ro-modal.component.html',
  styleUrls: ['./lock-ro-modal.component.scss']
})
export class LockRoModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedData: ServiceKpiDataModel;

  constructor(
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.onResize();
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      sortAgency: [undefined],
      dateTime: [undefined],
      dateTimeTo: [undefined],
    });
  }
}
