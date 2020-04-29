import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { GradeListModel} from '../../../../../core/models/sales/model-list.model';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { GradeListService} from '../../../../../api/master-data/grade-list.service';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';
import { GradeProductionService} from '../../../../../api/master-data/grade-production.service';
import { FormStoringService } from '../../../../../shared/common-service/form-storing.service';
import { StorageKeys } from '../../../../../core/constains/storageKeys';
import { ColorAssignmentService} from '../../../../../api/master-data/color-assignment.service';
import {ToastService} from '../../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fleet-edit-grid-dlr',
  templateUrl: './fleet-edit-grid-dlr.component.html',
  styleUrls: ['./fleet-edit-grid-dlr.component.scss']
})
export class FleetEditGridDlrComponent implements OnInit {
  @ViewChild('fleetEditGridDlr', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedFleetApp;
  selectedIntentionOrDelivery;
  gradeList: Array<GradeListModel> = [];
  colorList;
  gradeProductionList = [];
  isIntentionTable: boolean;
  monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  displayedIntentionData;
  currentUser;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private gradeListService: GradeListService,
    private gradeProductionService: GradeProductionService,
    private formStoringService: FormStoringService,
    private colorAssignmentService: ColorAssignmentService,
  ) {
  }

  ngOnInit() {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
  }

  getGradeList() {
    this.loadingService.setDisplay(true);
    const gradeApi = this.currentUser.isAdmin ? this.gradeListService.getGrades(true) : this.currentUser.isLexus
      ? this.gradeListService.getGrades(true, 'lexusOnly')
      : this.gradeListService.getGrades(true, 'notLexus');
    gradeApi.subscribe(gradeList => {
      this.gradeList = gradeList;
      // Get grade list based on Intention Table
      if (this.displayedIntentionData.length > 0) {
        this.gradeList = [];
        this.displayedIntentionData.forEach(intentionData => {
          // this.form.get('gradeId').setValue
          if (intentionData.gradeId) {
            this.gradeList.push(gradeList.find(grade => grade.id === intentionData.gradeId));
          }
        });
        this.form.get('gradeId').setValue(this.gradeList[0].id);
      }
      this.loadingService.setDisplay(false);
    });
  }

  open(isIntentionTable: boolean, selectedIntentionOrDelivery?, displayedIntentionData?) {
    this.isIntentionTable = isIntentionTable;
    this.selectedIntentionOrDelivery = selectedIntentionOrDelivery ? selectedIntentionOrDelivery : undefined;
    this.displayedIntentionData = displayedIntentionData ? displayedIntentionData : [];
    this.modal.show();
    this.buildForm();
    this.getGradeList();
  }

  reset() {
    this.form = undefined;
  }

  get getYearList() {
    const tenYearsFromNow = [];
    for (let i = 0; i <= 30; i++) {
      tenYearsFromNow.push(new Date().getFullYear() + i);
    }
    return tenYearsFromNow;
  }

  emmitValue() {
    const emmitValue = this.selectedIntentionOrDelivery;
    for (const key in this.form.value) {
      if (this.form.value[key]) {
        emmitValue[key] = this.form.value[key];
      }
    }

    if (this.isIntentionTable) {
      emmitValue.color = this.colorList.find(color => color.colorId === this.form.value.colorId).code;
    } else {
      const lastDayOfMonth = new Date(this.form.value.year, this.form.value.month, 0).getDate();
      if (new Date(this.form.value.year, this.form.value.month - 1, lastDayOfMonth) < new Date()) {
        this.swalAlertService.openFailModal('Selected Delivery Time is in the past, please select another time');
        return;
      }
    }

    emmitValue.grade = this.gradeList.find(grade => grade.id === this.form.value.gradeId).marketingCode;
    emmitValue.gradeProduction = this.gradeProductionList.find(gradeProduction => gradeProduction.id === this.form.value.gradeProductionId).productionCode;

    this.modal.hide();
    return emmitValue;
  }

  confirm() {
    if (this.form.invalid) {
      return;
    }
    this.close.emit(this.emmitValue());
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      gradeId: [undefined, GlobalValidator.required],
      gradeProductionId: [undefined, GlobalValidator.required],
      colorId: [{ value: undefined, disabled: !this.isIntentionTable }, GlobalValidator.required],

      quantity: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.numberFormat, GlobalValidator.maxLength(5)])],
      month: [{ value: undefined, disabled: this.isIntentionTable }, GlobalValidator.required],
      year: [{ value: undefined, disabled: this.isIntentionTable }, GlobalValidator.required],
    });
    // Edit row has grade
    if (this.isIntentionTable && this.form.value.gradeId) {
      this.loadingService.setDisplay(true);
      this.gradeListService.getGradeColor(this.form.value.gradeId, true).subscribe(colorList => {
        this.colorList = colorList;
        this.gradeProductionService.getGradeProductionTable(this.form.value.gradeId, true).subscribe(gradeProductionList => {
          this.gradeProductionList = gradeProductionList;
          this.loadingService.setDisplay(false);
        });
      });
    }
    // Change grade
    this.form.get('gradeId').valueChanges.subscribe(val => {
      if (val) {
        this.loadingService.setDisplay(true);
        this.gradeProductionService.getGradeProductionTable(val, true).subscribe(gradeProductionList => {
          this.gradeProductionList = gradeProductionList;
          this.form.get('gradeProductionId').setValue(this.gradeProductionList[0].id);
          this.loadingService.setDisplay(false);
        });
      }
    });
    this.form.get('gradeProductionId').valueChanges.subscribe(val => {
      if (val && this.isIntentionTable) {
        this.loadingService.setDisplay(true);
        this.colorAssignmentService.getColors(val, true).subscribe(colorList => {
          this.colorList = colorList;
          this.form.get('colorId').setValue(this.colorList[0].colorId);
          this.loadingService.setDisplay(false);
        });
      }
    });
    if (this.selectedIntentionOrDelivery) {
      this.form.patchValue(this.selectedIntentionOrDelivery);
    }
  }

}
