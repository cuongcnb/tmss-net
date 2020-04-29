import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {omit} from 'lodash';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {MoneyDefineService} from '../../../../api/master-data/money-define.service';
import {GradeProductionService} from '../../../../api/master-data/grade-production.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {ColorAssignmentService} from '../../../../api/master-data/color-assignment.service';
import {InteriorAssignmentService} from '../../../../api/master-data/interior-assignment.service';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {GradeListService} from '../../../../api/master-data/grade-list.service';
import {StorageKeys} from '../../../../core/constains/storageKeys';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'money-modify-modal',
  templateUrl: './money-modify-modal.component.html',
  styleUrls: ['./money-modify-modal.component.scss']
})
export class MoneyModifyModalComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  modalHeight: number;
  productions;
  colorAssignments: Array<any>;
  interiorColorAssignments: Array<any>;
  gradeList;

  constructor(
              private formStoringService: FormStoringService,
              private formBuilder: FormBuilder,
              private swalAlertService: ToastService,
              private loadingService: LoadingService,
              private interiorColorListService: InteriorAssignmentService,
              private colorAssignmentService: ColorAssignmentService,
              private modalHeightService: SetModalHeightService,
              private gradeProductionService: GradeProductionService,
              private moneyDefineService: MoneyDefineService,
              private dataFormatService: DataFormatService,
              private gradeListService: GradeListService) {
  }

  get currentUser() {
    return this.formStoringService.get(StorageKeys.currentUser);
  }

  getGradeList() {
    const gradeApi = this.currentUser.isAdmin ? this.gradeListService.getGrades(true) : this.currentUser.isLexus
      ? this.gradeListService.getGrades(true, 'lexusOnly')
      : this.gradeListService.getGrades(true, 'notLexus');
    gradeApi.subscribe(grades => {
      this.gradeList = grades;
    });
  }

  private getProductions() {
    this.gradeProductionService.getAllGradeProduction().subscribe(productions => {
      this.productions = productions;
    });
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.onResize();
    this.getGradeList();
    // this.getProductions();
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
    let formValue = this.form.value;
    formValue = omit(formValue, ['gradeId']);
    const data = Object.assign({}, formValue, {
      priceAmount: this.convertStringToInt(formValue.priceAmount),
      orderPriceAmount: this.convertStringToInt(formValue.orderPriceAmount)
    });
    const apiCall = !this.selectedData ?
      this.moneyDefineService.createNewData(data) : this.moneyDefineService.updateData(data);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
    });
  }

  private convertStringToInt(val) {
    if (val) {
      if (typeof val === 'string') {
        return parseInt(val.replace(/,/g, ''), 10);
      } else {
        return val;
      }
    }
    return null;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      gradeId: [undefined, GlobalValidator.required],
      gradeProductionId: [undefined, GlobalValidator.required],
      colorId: [undefined, GlobalValidator.required],
      interiorColorId: [undefined],
      priceAmount: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.numberFormat, GlobalValidator.maxLength(19)])],
      orderPriceAmount: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.numberFormat, GlobalValidator.maxLength(19)])]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
      this.gradeProductionService.getGradeProductByGrade(this.selectedData.gradeId).subscribe(productions => {
        this.productions = productions;
      });
      this.colorAssignmentService.getColors(this.selectedData.gradeProductionId, true).subscribe(assignments => {
        this.colorAssignments = assignments;
      });
      this.interiorColorListService.getColors(this.selectedData.gradeProductionId, true).subscribe(assignments => {
        this.interiorColorAssignments = assignments;
      });
      this.dataFormatService.formatMoneyForm(this.form, 'priceAmount');
      this.dataFormatService.formatMoneyForm(this.form, 'orderPriceAmount');
    }
    this.form.get('gradeId').valueChanges.subscribe(val => {
      if (val) {
        this.gradeProductionService.getGradeProductByGrade(this.form.get('gradeId').value).subscribe(productions => {
          this.productions = productions;
        });
      } else {
        this.productions = [];
        this.colorAssignments = [];
        this.interiorColorAssignments = [];
      }
    });
    this.form.get('gradeProductionId').valueChanges.subscribe(val => {
      if (val) {
        this.colorAssignmentService.getColors(val, true).subscribe(assignments => {
          this.colorAssignments = assignments;
        });
        this.interiorColorListService.getColors(val, true).subscribe(assignments => {
          this.interiorColorAssignments = assignments;
        });
      } else {
        this.colorAssignments = [];
        this.interiorColorAssignments = [];
      }
    });
  }

}
