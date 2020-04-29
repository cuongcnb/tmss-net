import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ColorAssignmentService} from '../../../../api/master-data/color-assignment.service';
import {InteriorAssignmentService} from '../../../../api/master-data/interior-assignment.service';
import {GradeProductionService} from '../../../../api/master-data/grade-production.service';
import {ContractManagementService} from '../../../../api/daily-sale/contract-management.service';
import {MoneyDefineService} from '../../../../api/master-data/money-define.service';
import {IeCalculateDateService} from '../../../../shared/common-service/ie-calculate-date.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {LookupCodes} from '../../../../core/constains/lookup-codes';
import {LookupDataModel} from '../../../../core/models/base.model';
import {LookupService} from '../../../../api/lookup/lookup.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-multi-contract-modal',
  templateUrl: './add-multi-contract-modal.component.html',
  styleUrls: ['./add-multi-contract-modal.component.scss']
})
export class AddMultiContractModalComponent implements OnInit {
  @ViewChild('addMultiContractModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  gradeList;
  products;
  colorAssignments: Array<any> = [];
  interiorColorAssignments: Array<any> = [];
  paymentTypes: Array<LookupDataModel>;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private gradeProductionService: GradeProductionService,
    private interiorColorListService: InteriorAssignmentService,
    private colorAssignmentService: ColorAssignmentService,
    private contractManagementService: ContractManagementService,
    private moneyService: MoneyDefineService,
    private ieCalculateDateService: IeCalculateDateService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private lookupService: LookupService,
    private setModalHeightService: SetModalHeightService,
    private dataFormatService: DataFormatService
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedFollowUpId, gradeList) {
    this.gradeList = gradeList;
    this.contractManagementService.getModifyData(selectedFollowUpId).subscribe(val => {
      this.buildForm(val);
    });
    this.lookupService.getDataByCode(LookupCodes.payment_type).subscribe(types => this.paymentTypes = types);
    this.modal.show();
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    this.loadingService.setDisplay(true);
    this.contractManagementService.insertMultiplyContract(this.form.value).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
      this.close.emit();
      this.modal.hide();
    });
  }

  private buildForm(val) {
    this.form = this.formBuilder.group({
      contractNo: [{value: undefined, disabled: true}],
      total: [{value: undefined, disabled: true}],
      customerName: [{value: undefined, disabled: true}],
      gradeId: [undefined, GlobalValidator.required],
      gradeProductionId: [undefined, GlobalValidator.required],
      colorId: [undefined, GlobalValidator.required],
      interiorColorId: [undefined],
      addMore: [1, Validators.compose([GlobalValidator.required, Validators.min(1), GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      estimatedDate: [undefined],
      amount: [undefined, Validators.compose([Validators.min(0), GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      orderPrice: [undefined, Validators.compose([Validators.min(0), GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      commissionPrice: [undefined, Validators.compose([Validators.min(0), GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      discountPrice: [undefined, Validators.compose([Validators.min(0), GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      otherPromotionValue: [undefined, Validators.compose([Validators.min(0), GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      paymentTypeId: [undefined, GlobalValidator.required],
      contractId: [undefined]
    });
    this.watchFormValueChanges();
    this.form.patchValue(val);
  }

  private watchFormValueChanges() {
    const gradeId = this.form.get('gradeId');
    const gradeProductionId = this.form.get('gradeProductionId');
    const colorId = this.form.get('colorId');
    const interiorColorId = this.form.get('interiorColorId');

    gradeId.valueChanges.subscribe(val => {
      if (val) {
        this.gradeProductionService.getGradeProductionTable(val).subscribe(products => {
          this.products = products || [];
        });
      } else {
        this.products = [];
        this.colorAssignments = [];
        this.interiorColorAssignments = [];
      }

      this.form.patchValue({
        gradeProductionId: null,
        colorId: null,
        interiorColorId: null
      });
    });

    gradeProductionId.valueChanges.subscribe(val => {
      if (val) {
        this.colorAssignmentService.getColors(val).subscribe(assignments => {
          this.colorAssignments = assignments || [];
        });
        this.interiorColorListService.getColors(val).subscribe(assignments => {
          this.interiorColorAssignments = assignments || [];
        });
      } else {
        this.colorAssignments = [];
        this.interiorColorAssignments = [];
      }

      this.form.patchValue({
        colorId: null,
        interiorColorId: null
      });
    });

    colorId.valueChanges.subscribe(val => {
      if (val && gradeProductionId.value) {
        this.moneyService.getPrice(gradeProductionId.value, val).subscribe(price => {
          if (price) {
            this.form.patchValue({
              orderPrice: price
            });
          }
        });
      }
    });

    interiorColorId.valueChanges.subscribe(val => {
      if (colorId.value && gradeProductionId.value && val !== null && val !== undefined) {
        this.moneyService.getPrice(gradeProductionId.value, colorId.value, val).subscribe(price => {
          if (price) {
            this.form.patchValue({
              orderPrice: price
            });
          }
        });
      }
    });
  }
}
