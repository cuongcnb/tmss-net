import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimModel } from '../../../../../core/models/warranty/claim.model';
import { CurrentUser } from '../../../../../home/home.component';
import { SubletApi } from '../../../../../api/common-api/sublet.api';
import { CommonService } from '../../../../../shared/common-service/common.service';
import {ToastService} from '../../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sublet',
  templateUrl: './sublet.component.html',
  styleUrls: ['./sublet.component.scss', '../claim-detail.component.scss'],
})
export class SubletComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('submitBtn', {static: false}) submitBtn;
  @Input() form: FormGroup;
  @Input() isSubmit: boolean;
  @Input() claim: ClaimModel;
  @Input() payCodeList: Array<any>;
  @Input() subletTypeList: Array<any>;
  @Input() isTMV: boolean;

  currentUser = CurrentUser;
  subletArray: FormArray;
  @Input() sourceTable: string;

  constructor(private formBuilder: FormBuilder,
              private subletApi: SubletApi,
              private toastService: ToastService,
              private commonService: CommonService
              ) {
  }

  ngOnInit() {
    this.subletApi.getAll().subscribe(val => {
      if (val) {
        const subletTypeEmpty = {sublettype: '', desceng: ''};
        val.unshift(subletTypeEmpty);
        this.subletTypeList = val;
      }
    });
    this.subletArray = this.form.get('warrantyClaimSubletDTOs') as FormArray;
    this.checkForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isSubmit && this.submitBtn) {
      this.submitBtn.nativeElement.click();
    }
  }

  ngAfterViewInit(): void {
  }

  addSublet(val ?) {
    const length = this.subletArray.controls.length;
    if (length > 0 && this.subletArray.controls[length - 1].invalid) {
      this.toastService.openWarningToast('Sublet invalid');
      return;
    }
    setTimeout(() => {
      const zzSublet = this.subletTypeList.find(subletType => subletType.sublettype === '');
      const sublet = this.formBuilder.group({
        id: [undefined],
        dlrId: [this.currentUser.dealerId],
        payCode: [undefined],
        subletType: [this.subletArray.length <= 1 ? zzSublet.sublettype : undefined, GlobalValidator.required],
        subletInvoiceNo: [undefined, GlobalValidator.required],
        subletAmountDlr: [undefined],
        cost: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat])],
      });
      if (val) {
        sublet.patchValue(Object.assign({}, val, {dlrId: this.currentUser.dealerId}));
      }
      this.subletArray.push(sublet);
      setTimeout(() => {
        if (this.isSubmit && this.submitBtn) {
          this.submitBtn.nativeElement.click();
        }
      });
    });
  }

  deleteSublet(i) {
    this.subletArray.removeAt(i);
  }

  checkForm() {
    const subletTypeEmpty = {sublettype: '', desceng: ''};
    this.subletTypeList.unshift(subletTypeEmpty);
    this.subletArray.valueChanges.subscribe(() => {
      const subletArrayVal = this.subletArray.controls.map((item: FormGroup) => item.getRawValue());
      this.form.controls.sumSubletSubTotal.setValue(Math.round(this.commonService.sumObjectByField(subletArrayVal, 'cost') * 100) / 100);
    });
    if (this.claim.warrantyClaimSubletDTOs.length) {
      this.claim.warrantyClaimSubletDTOs.forEach(sublet => {
        this.addSublet(sublet);
      });
    }
  }
}
