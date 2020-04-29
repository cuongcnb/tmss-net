import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { GradeListService} from '../../../../api/master-data/grade-list.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { StorageKeys } from '../../../../core/constains/storageKeys';
import { FormStoringService } from '../../../../shared/common-service/form-storing.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-additional-buying',
  templateUrl: './edit-additional-buying.component.html',
  styleUrls: ['./edit-additional-buying.component.scss']
})
export class EditAdditionalBuyingComponent implements OnInit {
  @ViewChild('editAdditionalBuying', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  gradeList;
  colorList;
  selectedBuyingItem;
  currentUser;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private gradeListService: GradeListService,
    private swalAlertService: ToastService,
    private formStoringService: FormStoringService,
  ) {
  }

  ngOnInit() {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
  }

  getGradeList() {
    const gradeApi = this.currentUser.isAdmin ? this.gradeListService.getGrades(true) : this.currentUser.isLexus
      ? this.gradeListService.getGrades(true, 'lexusOnly')
      : this.gradeListService.getGrades(true, 'notLexus');
    this.loadingService.setDisplay(true);
    gradeApi.subscribe(grades => {
      this.gradeList = grades;
      this.loadingService.setDisplay(false);
    });
  }

  open(selectedBuyingItem) {
    this.selectedBuyingItem = selectedBuyingItem;
    this.getGradeList();
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  confirm() {
    if (this.form.invalid) {
      return;
    } else if (new Date(this.form.value.expectedArrivalDate) <= new Date()) {
      this.swalAlertService.openFailModal('Expected Date must be greater than Today');
      return;
    }

    const emmitValue = Object.assign({}, {
      value: this.form.getRawValue(),
      isUpdate: !!this.selectedBuyingItem
    });
    this.close.emit(emmitValue);
    this.modal.hide();
  }

  private buildForm() {
    const gradeId = this.selectedBuyingItem ? this.selectedBuyingItem.gradeId : undefined;
    const colorId = this.selectedBuyingItem ? this.selectedBuyingItem.colorId : undefined;
    const expectedArrivalDate = this.selectedBuyingItem ? this.selectedBuyingItem.expectedArrivalDate : undefined;
    const remark = this.selectedBuyingItem ? this.selectedBuyingItem.remark : undefined;
    this.form = this.formBuilder.group({
      gradeId: [undefined, GlobalValidator.required],
      colorId: [colorId, GlobalValidator.required],
      expectedArrivalDate: [expectedArrivalDate, GlobalValidator.required],
      remark: [remark],
    });
    if (gradeId) {
      this.form.patchValue({ gradeId });
    }
    this.form.get('gradeId').valueChanges.subscribe(val => {
      if (val) {
        this.gradeListService.getGradeColor(val).subscribe(colorList => {
          this.colorList = colorList;
          this.form.patchValue({
            colorId: null
          });
        });
      }
    });
  }

}
