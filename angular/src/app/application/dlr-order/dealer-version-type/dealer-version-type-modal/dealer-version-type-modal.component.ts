import {Component, ViewChild, Output, EventEmitter, OnInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DealerVersionTypeService } from '../../../../api/dealer-order/dealer-version-type.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {DealerListService} from '../../../../api/master-data/dealer-list.service';
import {DataOrderConfigType} from '../../../../core/constains/dataOrderConfigType';
import {DealerModel} from '../../../../core/models/base.model';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  selector: 'dealer-version-type-modal',
  templateUrl: './dealer-version-type-modal.component.html',
  styleUrls: ['./dealer-version-type-modal.component.scss']
})
export class DealerVersionTypeModalComponent {

  @ViewChild('dealerVersionTypeModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: any;
  form: FormGroup;
  dealers: Array<DealerModel>;
  modalHeight: number;
  dataOrderConfigType = DataOrderConfigType;
  constructor(
              private formBuilder: FormBuilder,
              private loadingService: LoadingService,
              private modalHeightService: SetModalHeightService,
              private dealerVersionTypeService: DealerVersionTypeService,
              private swalAlertService: ToastService,
              private dealerListService: DealerListService) {
  }


  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      dataType: [undefined, GlobalValidator.required],
      versionType: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(256)])],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }

  }

  reset() {
    this.form = undefined;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 && c1 === c2;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
    const apiCall = !this.selectedData ?
      this.dealerVersionTypeService.createNewDealerVersionType(data) : this.dealerVersionTypeService.updateDealerVersionType(data);

    this.loadingService.setDisplay(true);
    apiCall.subscribe((res) => {
      this.loadingService.setDisplay(false);
      if(res.message === 'Success') {
        this.close.emit();
        this.modal.hide();
        this.swalAlertService.openSuccessModal();
      } else {
        this.swalAlertService.openFailModal(res.message);
      }
    });
  }

}
