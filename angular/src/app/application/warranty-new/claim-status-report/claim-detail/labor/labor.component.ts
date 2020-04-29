import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';
import { ClaimModel } from '../../../../../core/models/warranty/claim.model';
import { CurrentUser } from '../../../../../home/home.component';
import { CommonService } from '../../../../../shared/common-service/common.service';
import {ToastService} from '../../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'labor',
  templateUrl: './labor.component.html',
  styleUrls: ['./labor.component.scss', '../claim-detail.component.scss'],
})
export class LaborComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('submitBtn', {static: false}) submitBtn;
  @ViewChild('findOperationModal', {static: false}) findOperationModal;
  @Input() form: FormGroup;
  @Input() isSubmit: boolean;
  @Input() claim: ClaimModel;
  @Input() sourceTable: string;
  @Input() payCodeList: Array<any>;
  @Input() isTMV: boolean;

  currentUser = CurrentUser;
  laborArray: FormArray;
  laborIndex;
  laborCodeSearch;

  constructor(private formBuilder: FormBuilder, private commonService: CommonService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.laborArray = this.form.get('warrantyClaimLaborDTOs') as FormArray;
    this.checkForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isSubmit && this.submitBtn) {
      this.submitBtn.nativeElement.click();
    }
  }

  ngAfterViewInit(): void {

  }

  openFindLabor(i, roType, cmId) {
    this.laborIndex = i;
    console.log(this.laborArray.controls[i].value.srvCode);
    const srvCode = this.laborArray.controls[i].value.srvCode;
    this.findOperationModal.open(roType, cmId, srvCode);
  }

  setLaborDataToRow(data) {
    this.laborCodeSearch = data.srvcode;
    this.laborArray.controls[this.laborIndex].patchValue({
      srvCode: data.srvcode,
      hours: data.dealtime,
      amount: (Math.round((Number(data.dealtime) || 0) * (Number(this.form.get('flatRateDlr').value) || 0) * 100) / 100).toFixed(2),
    });
  }

  addLabor(val?) {
    const length = this.laborArray.controls.length;
    if (length > 0 && this.laborArray.controls[length - 1].invalid) {
      this.toastService.openWarningToast('Labor invalid');
      return;
    }
    const labor = this.formBuilder.group({
      id: [undefined],
      payCode: [undefined],
      opeMFlagCtl: [undefined],
      opeMFlag: [0],
      srvCode: [undefined, GlobalValidator.required],
      // hours: [undefined],
      hours: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormatHourl])],
      amount: [undefined],
    });
    labor.get('opeMFlagCtl').valueChanges.subscribe(valCtl => {
      labor.get('opeMFlag').setValue(valCtl ? '1' : '0');
      if (valCtl) {
        this.form.get('opeM').setValue(labor.get('srvCode').value);
        this.laborArray.controls.forEach((laborItem: FormGroup) => {
          if (laborItem !== labor) {
            laborItem.get('opeMFlagCtl').setValue(false, { emitEvent: false });
            laborItem.get('opeMFlag').setValue('0');
            laborItem.updateValueAndValidity();
          }
        });
      } else if (this.form.get('opeM').value === labor.get('srvCode').value) {
        this.form.get('opeM').setValue(null);
      }
    });
    labor.get('hours').valueChanges.subscribe(valCtl => {
      labor.get('amount').setValue(Math.round((Number(valCtl) || 0) * (Number(this.form.get('flatRateDlr').value) || 0) * 100) / 100);
    });
    if (val) {
      labor.patchValue(Object.assign({}, val, { opeMFlagCtl: (val.opeMFlag === '1') }));
    }
    setTimeout(() => {
      if (this.isSubmit && this.submitBtn) {
        this.submitBtn.nativeElement.click();
      }
    });
    this.laborArray.push(labor);
  }

  deleteLabor(i) {
    if ((this.laborArray.controls[i] as FormGroup).get('opeMFlagCtl').value) {
      this.form.get('opeM').setValue(null);
    }
    this.laborArray.removeAt(i);
  }

  checkForm() {
    this.laborArray.valueChanges.subscribe(() => {
      const laborArrayVal = this.laborArray.controls.map((item: FormGroup) => item.getRawValue());
      this.form.get('laborTotalHour')
        .setValue(Math.round(this.commonService.sumObjectByField(laborArrayVal, 'hours') * 100) / 100);
      this.form.get('sumLaborSubTotal')
        .setValue(Math.round(this.commonService.sumObjectByField(laborArrayVal, 'amount') * 100) / 100);
    });
    if (this.claim.warrantyClaimLaborDTOs.length) {
      this.claim.warrantyClaimLaborDTOs.forEach(labor => {
        this.addLabor(labor);
      });
    }
  }
}
