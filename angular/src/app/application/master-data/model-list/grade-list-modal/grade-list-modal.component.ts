import { Component, Output, ViewChild, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GradeListService} from '../../../../api/master-data/grade-list.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { StorageKeys } from '../../../../core/constains/storageKeys';
import { FormStoringService } from '../../../../shared/common-service/form-storing.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { LookupService} from '../../../../api/lookup/lookup.service';
import { LookupCodes } from '../../../../core/constains/lookup-codes';
import { LookupDataModel } from '../../../../core/models/base.model';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'grade-list-modal',
  templateUrl: './grade-list-modal.component.html',
  styleUrls: ['./grade-list-modal.component.scss']
})
export class GradeListModalComponent {
  @ViewChild('gradeListModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modelId: string;
  selectedData;
  form: FormGroup;
  modalHeight: number;
  gasolines: Array<LookupDataModel>;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private formStoringService: FormStoringService,
    private swalAlertService: ToastService,
    private lookupService: LookupService,
    private gradeListService: GradeListService
  ) {
  }

  private getGasoline() {
    this.lookupService.getDataByCode(LookupCodes.gasoline_type).subscribe(gasolines => {
      this.gasolines = gasolines;
    });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 && c1 === c2;
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(modelId?, selectedData?) {
    this.selectedData = selectedData;
    this.modelId = modelId;
    this.getGasoline();
    this.buildForm();
    this.modalHeight = this.modalHeightService.onResize();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const value = Object.assign({}, this.form.value, {
      modelId: this.modelId
    });
    const apiCall = !this.selectedData ? this.gradeListService.createNewGrade(value) : this.gradeListService.updateGrade(value);
    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.formStoringService.clear(StorageKeys.grade);
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      marketingCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(25)])],
      enName: [undefined, GlobalValidator.maxLength(50)],
      vnName: [undefined, GlobalValidator.maxLength(50)],
      cbuCkd: ['Y', undefined],
      isFirmColor: ['N'],
      isHasAudio: ['Y'],
      gasolineTypeId: [undefined, GlobalValidator.required],
      status: ['Y'],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
    this.form.valueChanges.subscribe(data => {
      if (data) {
        this.formStoringService.set(StorageKeys.grade, data);
      }
    });
  }
}
