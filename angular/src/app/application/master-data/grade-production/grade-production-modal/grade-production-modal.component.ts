import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GradeProductionService} from '../../../../api/master-data/grade-production.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {LookupService} from '../../../../api/lookup/lookup.service';
import {LookupCodes} from '../../../../core/constains/lookup-codes';
import {LookupDataModel} from '../../../../core/models/base.model';
import {IeCalculateDateService} from '../../../../shared/common-service/ie-calculate-date.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'grade-production-modal',
  templateUrl: './grade-production-modal.component.html',
  styleUrls: ['./grade-production-modal.component.scss']
})
export class GradeProductionModalComponent {
  @ViewChild('gradeProductionModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedGrade;
  selectedData;
  form: FormGroup;
  modalHeight: number;
  gasolines: Array<LookupDataModel>;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private modalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private ieCalculateDateService: IeCalculateDateService,
    private lookupService: LookupService,
    private gradeProductionService: GradeProductionService
  ) {
  }

  private getGasolines() {
    this.loadingService.setDisplay(true);
    this.lookupService.getDataByCode(LookupCodes.gasoline_type).subscribe(gasolines => {
      this.gasolines = gasolines;
      this.loadingService.setDisplay(false);
    });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 && c1 === c2;
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedGrade?, selectedData?) {
    this.selectedData = selectedData;
    this.selectedGrade = selectedGrade;
    this.getGasolines();
    this.buildForm();
    this.onResize();
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
    const value = Object.assign({}, this.form.getRawValue(), {
      gradeId: this.selectedGrade.id
    });
    const apiCall = !this.selectedData
      ? this.gradeProductionService.createNewGradeProduction(value)
      : this.gradeProductionService.updateGradeProduction(value);
    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      productionCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      shortModel: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      fullModel: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      frameNoLength: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.numberFormat, GlobalValidator.maxLength(12)])],
      status: ['Y', GlobalValidator.required],
      wmi: [undefined, GlobalValidator.maxLength(50)],
      vds: [undefined, GlobalValidator.maxLength(50)],
      cbuCkd: [this.selectedGrade.cbuCkd],
      gasolineTypeId: [undefined],
      isHasAudio: ['Y'],
      isFirmColor: ['Y'],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      fromDate: [undefined],
      toDate: [undefined],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }

  }

}
