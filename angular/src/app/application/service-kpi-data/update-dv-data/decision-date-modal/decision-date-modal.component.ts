import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ServiceKpiDataModel } from '../../../../core/models/service-kpi-data/service-kpi-data.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'decision-date-modal',
  templateUrl: './decision-date-modal.component.html',
  styleUrls: ['./decision-date-modal.component.scss']
})
export class DecisionDateModalComponent implements OnInit {
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
      dateTime: [undefined],
    });
  }
}
