import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { PetrolService} from '../../../../api/master-data/petrol.service';
import { GradeProductionService} from '../../../../api/master-data/grade-production.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'petrol-modal',
  templateUrl: './petrol-modal.component.html',
  styleUrls: ['./petrol-modal.component.scss']
})
export class PetrolModalComponent {
  @ViewChild('petrolModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Input() dealerId;

  selectedPetrol;
  form: FormGroup;
  gradeProductions;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private gradeProductionService: GradeProductionService,
    private petrolService: PetrolService
  ) {
  }

  private getGradeProductions() {
    this.gradeProductionService.getAllGradeProduction().subscribe(gradeProductions => {
      this.gradeProductions = gradeProductions;
    });
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedPetrol?) {
    this.selectedPetrol = selectedPetrol;
    this.buildForm();
    this.onResize();
    this.getGradeProductions();
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
      dealerId: this.dealerId
    });

    this.loadingService.setDisplay(true);
    const apiCall = !this.selectedPetrol
      ? this.petrolService.createNewPetrol(value)
      : this.petrolService.updatePetrol(value);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
    });
  }


  private buildForm() {
    this.form = this.formBuilder.group({
      id: [''],
      gradeProducesId: ['', GlobalValidator.required],
      quantityAmount: ['', Validators.compose([GlobalValidator.required, GlobalValidator.petrolQuantityAmount])],
    });
    if (this.selectedPetrol) {
      this.form.patchValue(this.selectedPetrol);
    }

  }
}
