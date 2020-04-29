import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckDisplay, ServicesReportDetail } from '../../../core/constains/services-report-detail';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'stock-inventory-report-by-price',
  templateUrl: './stock-inventory-report-by-price.component.html',
  styleUrls: ['./stock-inventory-report-by-price.component.scss'],
})
export class StockInventoryReportByPriceComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  selectedMenu: string;
  headerName: string;
  filterMenu = ServicesReportDetail;
  checkDisplay: CheckDisplay;
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

  open(selectedMenu?) {
    this.selectedMenu = selectedMenu;
    this.buildForm();
    this.modal.show();
    this.initCheckDisplay();
    this.checkForm();
  }

  private initCheckDisplay() {
    this.checkDisplay = {
      isDisableDealer: undefined,
      isHaveAccessoryType: undefined,
    };
  }

  private checkForm() {
    this.filterMenu[this.selectedMenu].params.forEach(item => {
      this.checkDisplay[item] = true;
    });
    this.headerName = this.filterMenu[this.selectedMenu].title;
  }

  export() {
    if (this.form.invalid) {
      return;
    }
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealerCode: [1, Validators.required],
      accessoryCode: [undefined],
      accessoryType: [undefined],
      localStorage: [undefined],
      isStock: [''],
      isZero: [true],
      formatFile: ['pdf'],
    });
  }

  downloadFile(event) {

  }
}

