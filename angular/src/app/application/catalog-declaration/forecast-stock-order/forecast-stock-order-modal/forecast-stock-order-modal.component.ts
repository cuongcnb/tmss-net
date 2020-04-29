import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ForecastOrderModel } from '../../../../core/models/catalog-declaration/forecast-order.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'forecast-stock-order-modal',
  templateUrl: './forecast-stock-order-modal.component.html',
  styleUrls: ['./forecast-stock-order-modal.component.scss']
})
export class ForecastStockOrderModalComponent implements OnInit {
  @ViewChild('forecastModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: ForecastOrderModel;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectData?) {
    this.selectedData = selectData;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    this.close.emit();
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      numberOrder: [''],
      accessaryId: [''],
      accessaryName: [''],
      dvt: [''],
      dad: [''],
      sellAmount: [''],
      inventoryAmount: [''],
      ddAmount: [''],
      mip: [''],
      dkAmount: [''],
      soq: [''],
      realAmount: [''],
      unitPrice: [''],
      money: [''],
      tax: [''],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
