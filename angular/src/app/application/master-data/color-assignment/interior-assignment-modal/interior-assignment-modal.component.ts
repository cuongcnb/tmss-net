import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColorListService} from '../../../../api/master-data/color-list.service';
import { InteriorAssignmentService} from '../../../../api/master-data/interior-assignment.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {ConfirmService} from '../../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'interior-assignment-modal',
  templateUrl: './interior-assignment-modal.component.html',
  styleUrls: ['./interior-assignment-modal.component.scss']
})
export class InteriorAssignmentModalComponent {
  @ViewChild('interiorAssignmentModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  colors;
  vnName;
  productId: number;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private modalHeightService: SetModalHeightService,
    private colorListService: ColorListService,
    private interiorColorListService: InteriorAssignmentService,
    private confirmationService: ConfirmService
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  private getColors() {
    this.loadingService.setDisplay(true);
    this.colorListService.getColors().subscribe(colors => {
      this.colors = colors;
      this.colors = this.sortalpha(this.colors);
      this.loadingService.setDisplay(false);
    });
  }

  open(productId?, selectedData?) {
    this.selectedData = selectedData;
    this.productId = productId;
    this.getColors();
    this.buildForm();
    this.onResize();
    this.modal.show();
  }


  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 && c1 === c2;
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const value = Object.assign({}, this.form.value, {
      produceId: +this.productId,
    });
    const apiCall = this.selectedData
      ? this.interiorColorListService.updateColor(value)
      : this.interiorColorListService.createNewColor(value);

    this.confirmationService.openConfirmModal('Bạn có đồng ý thay đổi?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        apiCall.subscribe(() => {
          this.close.emit();
          this.modal.hide();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }

  reset() {
    this.form = undefined;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      colorId: [undefined, GlobalValidator.required],
      vnName: [{value: undefined, disabled: true}],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      status: ['Y'],
      description: [undefined, GlobalValidator.maxLength(255)]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }

    // Watch for value change in form code
    this.form.get('colorId').valueChanges.subscribe(value => {
      if (value) {
        const matchColor = this.colors.filter(color => color.id === value);
        this.form.patchValue({
          vnName: matchColor[0].vnName
        });
      }
    });
  }

  sortalpha(arr: any) {
    arr.sort((a, b) => {
      if (a.code < b.code) {
        return -1;
      } else if (a.code > b.code) {
        return 1;
      } else { return 0; }
    });
    return arr;
  }
}
