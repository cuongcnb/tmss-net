import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'list-deal-car',
  templateUrl: './list-deal-car.component.html',
  styleUrls: ['./list-deal-car.component.scss']
})
export class ListDealCarComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeight: SetModalHeightService,
  ) {
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  open() {
    this.buildForm();
    this.onResize();
    this.modal.show();
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      sortAgency: [undefined],
      dealDate: [undefined],
    });
  }
}
