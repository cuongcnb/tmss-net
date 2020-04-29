import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {ClaimModel} from '../../../../core/models/warranty/claim.model';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {CurrentUser} from '../../../../home/home.component';
import {ClaimDetailApi} from '../../../../api/warranty/claim-detail.api';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {ErrorCodeApi} from '../../../../api/common-api/error-code.api';
import {VenderApi} from '../../../../api/common-api/vender.api';
import {PayCodeApi} from '../../../../api/common-api/pay-code.api';
import {TCodeApi} from '../../../../api/common-api/t-code.api';
import {SubletApi} from '../../../../api/common-api/sublet.api';
import {User} from '../../../../core/constains/user';
import {PartsInfoManagementApi} from '../../../../api/parts-management/parts-info-management.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'claim-detail',
  templateUrl: './claim-detail.component.html',
  styleUrls: ['./claim-detail.component.scss']
})
export class ClaimDetailComponent implements OnInit {
  @ViewChild('repairJobHistoryModal', {static: false}) repairJobHistoryModal;
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('reasonCode', {static: false}) reasonCode;
  @ViewChild('findErrorCodeModal', {static: false}) findErrorCodeModal;

  modalHeight;
  claimForm: FormGroup;
  claim: ClaimModel;
  action: string;
  isSubmit: boolean;
  isPartsCode = true;
  currentUser = CurrentUser;
  sourceTable;
  dataIdList;
  tcList;
  partsCode;
  offset = 0;
  isTMV = false;
  isCheckAdj = false;
  isCheckAccept = false;
  fieldErrorCode;
  venderList: Array<any>;
  payCodeList: Array<any>;
  t1CodeList: Array<any>;
  t2CodeList: Array<any>;
  t3CodeList: Array<any>;
  subletTypeList: Array<any>;
  errorCodeList: Array<any>;
  currentKmFlag: string;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter<any>();
  @Output() reload = new EventEmitter<any>();

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private claimDetailApi: ClaimDetailApi,
    private dataFormatService: DataFormatService,
    private toastService: ToastService,
    private errorCodeApi: ErrorCodeApi,
    private venderApi: VenderApi,
    private payCodeApi: PayCodeApi,
    private tCodeApi: TCodeApi,
    private subletApi: SubletApi,
    private partsInfoManagementApi: PartsInfoManagementApi,
  ) {
    this.dataIdList = [
      {
        key: 'W',
        value: 'Warranty',
      },
      {
        key: 'WPAC', // task 19566, check lại với backend xem giá trị nhận là gì
        value: 'Warranty PAC',
      },
      {
        key: 'S',
        value: 'SETR',
      },
      {
        key: 'F',
        value: 'FreePM',
      },
    ];
    this.tcList = [
      {
        key: 31,
        value: 'Recall/SSC'
      },
      {
        key: 33,
        value: 'Field Fix'
      },
      {
        key: 36,
        value: 'SETR'
      },
      {
        key: 37,
        value: 'Monitor'
      },
      {
        key: 39,
        value: 'Appeal claim'
      },
    ];

  }

  onSearchChange() {
      const parstCode = this.claimForm.get('ofpNo').value;
      console.log(parstCode);
      if (parstCode) {
        this.partsInfoManagementApi.getListPart(parstCode).subscribe(data => {
          if (!data) {
            this.isPartsCode = false;
            this.toastService.openWarningToast('Part code không đúng!');
          } else {
            this.isPartsCode = true;
          }
        });
      }
  }

  ngOnInit() {
    this.isTMV = this.currentUser.dealerId === User.tmvDealerId;
    if (this.isTMV) {
      this.errorCodeApi.searchErrorCode().subscribe(val => {
        if (val) {
          this.errorCodeList = val;
        }
      });
    }
    this.venderApi.getAll().subscribe(val => {
      if (val) {
        this.venderList = val;
      }
    });
    this.payCodeApi.search().subscribe(val => {
      if (val) {
        this.payCodeList = val;
      }
    });
    // }
    this.tCodeApi.search('T1').subscribe(val => {
      if (val) {
        this.t1CodeList = val;
      }
    });
    this.tCodeApi.search('T2').subscribe(val => {
      if (val) {
        this.t2CodeList = val;
      }
    });
    this.tCodeApi.search('T3').subscribe(val => {
      if (val) {
        this.t3CodeList = val;
      }
    });
    this.subletApi.getAll().subscribe(val => {
      if (val) {
        this.subletTypeList = val;
      }
    });
  }

  edit(selectedClaim: ClaimModel, sourceTable?) {
    this.action = 'edit';
    this.sourceTable = sourceTable;
    this.buildForm();
    this.loadingService.setDisplay(true);
    if (this.sourceTable === 'TWC') {
      this.claimDetailApi.dlrEditClaim(selectedClaim.dealerClaimNo, selectedClaim.dealerCode).subscribe(val => {
        if (val) {
          this.claim = val;
          this.buildClaim(val);
        }
      });
    } else {
      this.claimDetailApi.tmvEditCalim(selectedClaim.twcNo, sourceTable).subscribe(val => {
        if (val) {
          this.claim = val;
          this.buildClaim(val);
        }
      });
    }
  }

  adjustCheck(selectedClaim: ClaimModel, sourceTable?) {
    this.sourceTable = sourceTable;
    this.action = 'adjust';
    this.buildForm();
    this.claimDetailApi.addjustmentClaim( selectedClaim.id, this.offset, selectedClaim.dealerCode).subscribe(val => {
      if (val) {
        this.buildClaim(Object.assign({}, val, {
          subletDesc: null,
          subletDes: null,
          condition: null,
          remedy: null,
          cause: null
        }));
        this.claim = val;
      }
    });
  }

  add(sourceTable, selectedOrder?) {
    this.action = 'add';
    // if (this.isTMV) {
    //   this.sourceTable = 'STWC';
    // } else {
    //   this.sourceTable = 'TWC';
    // }
    this.sourceTable = sourceTable;
    this.buildForm();
    this.loadingService.setDisplay(true);
    this.claimDetailApi.createClaim(selectedOrder).subscribe(val => {
      if (val) {
        this.claim = val;
        this.buildClaim(val);
      }
    });
  }

  reset() {
    this.claimForm = undefined;
    this.claim = undefined;
    this.isSubmit = false;
    this.sourceTable = null;
  }

  formatDate(val) {
    return this.dataFormatService.parseTimestampToDate(val);
  }

  buildForm() {
    this.claimForm = this.formBuilder.group({
      // A0
      distCode: [undefined],
      no: [undefined],
      sfx: [undefined],
      claimantcode: [undefined],
      invoiceNo: [undefined],
      // A1
      // dealerCode: [undefined, GlobalValidator.required],
      dealerCode: [undefined],
      dlrId: [undefined],
      dealerName: [undefined],
      dealerClaimNo: [undefined],
      dealerClaimNoTemp: [undefined],
      processFlag: [undefined],
      currencyLabel: [undefined], // chua check
      monthAge: [undefined], // chua check
      // A2
      warrantyType: [{value: 'VE', disabled: true}],
      franchise: [undefined, GlobalValidator.required],
      venderCode: [{value: undefined, disabled: !this.isTMV ? true : null}], // chua check
      // A3
      nvFlag: [{value: undefined, disabled: !this.isTMV ? true : null}],
      fvFlag: [{value: undefined, disabled: !this.isTMV ? true : null}],
      // wmi: [undefined, GlobalValidator.required],
      wmi: [undefined],
      // vds: [undefined, GlobalValidator.required],
      vds: [undefined],
      // cd: [undefined, GlobalValidator.required],
      cd: [undefined],
      // vis: [undefined, GlobalValidator.required],
      vis: [undefined],
      deliveryDate: [undefined],
      lineoffdate: [undefined],
      // repairDate: [undefined, GlobalValidator.required],
      repairDate: [undefined],
      // odometer: [undefined, GlobalValidator.required],
      odometer: [undefined],
      kmFlag: ['1'],
      // A4
      // orderno: [undefined, GlobalValidator.required],
      orderno: [undefined],
      authoType: [{value: undefined, disabled: this.isTMV ? true : null}],
      authoNo: [{value: undefined, disabled: this.isTMV ? true : null}],
      dataId: [undefined],
      tc: [undefined],
      // B1
      warrantyClaimLaborDTOs: this.formBuilder.array([]),
      // B2
      flatRateDlr: [undefined],
      laborTotalHour: [undefined],
      sumLaborSubTotal: [undefined],
      // C1
      warrantyClaimSubletDTOs: this.formBuilder.array([]),
      // C2
      sumSubletSubTotal: [undefined],
      // D1
      subletDesc: [undefined],
      condition: [undefined, GlobalValidator.required],
      // condition: [undefined],
      cause: [undefined, GlobalValidator.required],
      // cause: [undefined],
      remedy: [undefined, GlobalValidator.required],
      // remedy: [undefined],
      // dlrComment: [undefined, GlobalValidator.required],
      dlrComment: [undefined],
      // distComment: [undefined, GlobalValidator.required],
      distComment: [undefined],
      // E1
      t1Code: [undefined, GlobalValidator.required],
      t1CodeType: [undefined],
      // t1Code: [undefined],
      t2Code: [undefined, GlobalValidator.required],
      t2CodeType: [undefined],
      // t2Code: [undefined],
      t3Codes: this.formBuilder.array([]),
      // F1
      warrantyClaimPartsDTOs: this.formBuilder.array([]),
      // F2
      ofpLocalFlag: [undefined],
      ofpNo: [undefined, GlobalValidator.required],
      lotCode: [undefined],
      // ofpNo: [undefined],
      sumPartsSubTotal: [undefined],
      // F3
      prrDlr: [undefined],
      pwrDlr: [undefined],
      partsTotal: [undefined],
      pwr1: [undefined],
      pwr2: [undefined],
      pwr3: [undefined],

      // G1
      total: [undefined],

      // H1
      state: this.formBuilder.group({
        stateValue: [undefined],
        stateTitle: [undefined]
      }),
      tmvState: this.formBuilder.group({
        stateValue: [undefined],
        stateTitle: [undefined]
      }),
      laborAdj: [undefined],
      partsAdj: [undefined],
      subletAdj: [undefined],
      reasonCode: [undefined],

      // extra
      sourceTable: [undefined],
      freePm: [undefined],
      ckClaimToVender: [1],
      ckClaimToVenderCtl: [true],
      isSelectedMainLabor: [0],
      isSelectedMainParts: [0],
      roType: [undefined],
      cmId: [undefined],
      opeM: [undefined], // cong viec chinh


    }, {
      validator: this.validateSubletDesc
    });
    if (this.isTMV && (this.action === 'add' || this.action === 'edit')) {
      this.claimForm.get('dealerCode').setValidators([GlobalValidator.required]);
      this.claimForm.get('dealerClaimNo').setValidators([GlobalValidator.required]);
      this.claimForm.get('orderno').setValidators([GlobalValidator.required]);
      // this.claimForm.get('repairDate').setValidators([GlobalValidator.required]);
      // this.claimForm.get('wmi').setValidators([GlobalValidator.required]);
      // this.claimForm.get('vds').setValidators([GlobalValidator.required]);
      // this.claimForm.get('cd').setValidators([GlobalValidator.required]);
      // this.claimForm.get('vis').setValidators([GlobalValidator.required]);
      this.claimForm.get('franchise').setValidators([GlobalValidator.required]);
    }
    this.claimForm.get('state').disable();
    this.claimForm.get('tmvState').disable();
    this.claimForm.get('ckClaimToVenderCtl').valueChanges.subscribe(val => {
      this.claimForm.get('ckClaimToVender').setValue(val ? 1 : 0);
    });

    // WATCH VALUE CHANGES
    // Calculate Total claim
    this.claimForm.get('sumPartsSubTotal').valueChanges.subscribe(val => {
      let partsTotal = Number(this.claimForm.get('prrDlr').value) || Number(this.claimForm.get('pwrDlr').value);
      if (this.isTMV) {
        partsTotal += Number(this.claimForm.get('freePm').value) || 0;
      }
      partsTotal = Math.round(partsTotal * Number(val) * 100) / 100;
      this.claimForm.get('partsTotal').setValue(partsTotal);
    });
    this.claimForm.get('sumLaborSubTotal').valueChanges.subscribe(() => {
      const claim = this.claimForm.getRawValue();
      // value * 1000: Part's value is in dong, while labor and sublet is in thousand dong
      const total = (Number(claim.sumLaborSubTotal) || 0) + (Number(claim.sumSubletSubTotal) || 0) + (Number(claim.partsTotal) || 0);
      this.claimForm.get('total').setValue(total);
    });
    this.claimForm.get('sumSubletSubTotal').valueChanges.subscribe(() => {
      const claim = this.claimForm.getRawValue();
      const total = (Number(claim.sumLaborSubTotal) || 0) + (Number(claim.sumSubletSubTotal) || 0) + (Number(claim.partsTotal) || 0);
      this.claimForm.get('total').setValue(total);
    });
    this.claimForm.get('partsTotal').valueChanges.subscribe(() => {
      const claim = this.claimForm.getRawValue();
      const total = (Number(claim.sumLaborSubTotal) || 0) + (Number(claim.sumSubletSubTotal) || 0) + (Number(claim.partsTotal) || 0);
      this.claimForm.get('total').setValue(total);
    });

    // kmFlag changes
    this.claimForm.get('kmFlag').valueChanges.subscribe(val => {
      if (val && this.currentKmFlag && this.currentKmFlag !== val) {
        const odometer = +this.claimForm.value.odometer || 0;
        const newOdometer = this.currentKmFlag === '1' && val === '2' ? odometer / 1.6 : odometer * 1.6;
        this.claimForm.get('odometer').setValue(newOdometer);
        this.currentKmFlag = val;
      }
    });

    //
    this.claimForm.get('opeM').valueChanges.subscribe(val => {
      this.claimForm.get('isSelectedMainLabor').setValue(val ? 1 : 0);
    });
    this.claimForm.get('ofpNo').valueChanges.subscribe(val => {
      this.claimForm.get('isSelectedMainParts').setValue(val ? 1 : 0);
    });
    // Do not check validate when nvFlag is checked
    if (this.isTMV) {
      this.claimForm.get('nvFlag').valueChanges.subscribe(val => {
        // tslint:disable-next-line:variable-name
        const a3_e1_f2 = ['t1Code', 't2Code', 'ofpNo', 'repairDate', 'wmi', 'vds', 'cd', 'vis'];
        if (val) {
          a3_e1_f2.forEach(control => {
            this.claimForm.get(control).clearValidators();
          });
        } else {
          if (this.isTMV && (this.action === 'add' || this.action === 'edit')) {
            this.claimForm.get('repairDate').setValidators([GlobalValidator.required]);
            this.claimForm.get('wmi').setValidators([GlobalValidator.required]);
            this.claimForm.get('vds').setValidators([GlobalValidator.required]);
            this.claimForm.get('cd').setValidators([GlobalValidator.required]);
            this.claimForm.get('vis').setValidators([GlobalValidator.required]);
          }
          this.claimForm.get('t1Code').setValidators([GlobalValidator.required]);
          this.claimForm.get('t2Code').setValidators([GlobalValidator.required]);
          this.claimForm.get('ofpNo').setValidators([GlobalValidator.required]);
        }
        a3_e1_f2.forEach(control => {
          this.claimForm.get(control).updateValueAndValidity();
        });
      });
    }
  }

  validateSubletDesc(group: FormGroup) {
    ((group.get('warrantyClaimSubletDTOs') as FormArray).controls.length
      && (group.get('subletDesc').value == null || group.get('subletDesc').value === ''))
      ? group.get('subletDesc').setErrors({required: true})
      : group.get('subletDesc').setErrors(null);
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  buildClaim(claim: ClaimModel) {
    this.claim = claim;
    delete claim.total;
    delete claim.partsTotal;
    delete claim.sumLaborSubTotal;
    delete claim.sumSubletSubTotal;
    delete claim.sumPartsSubTotal;
    delete claim.laborTotalHour;
    if (!claim.warrantyType) {
      claim.warrantyType = 'VE';
    }
    if (!claim.state) {
      claim.state = {
        stateValue: null,
        stateTitle: null
      };
    }
    if (!claim.tmvState) {
      claim.tmvState = {
        stateValue: null,
        stateTitle: null
      };
    }
    if (!claim.currencyLabel) {
      claim.currencyLabel = 'VND';
    }
    // if (!claim.lineoffdate) {
    //   claim.lineoffdate = new Date();
    // }
    this.claimForm.patchValue(claim);
    this.currentKmFlag = this.claimForm.value.kmFlag;
    this.loadingService.setDisplay(false);
    // -- Cho phep DLR sua so VDS và CD khi user số VIN có dang MR054HY9
    // -- Ngay 4/9/2017 theo yeu cau cua Thuy
    // if ((claim.wmi === 'MR0' && (claim.vds === '54HY9' || claim.vds === '54HY91'))) {
    //   this.claimForm.get('vds').disable();
    //   this.claimForm.get('cd').disable();
    // }
    this.modal.show();
  }

  save() {
    // this.isSubmit = true;
    // Remove validator acording to task 19574
    // if (this.claimForm.invalid) {
    //   return;
    // }
    this.loadingService.setDisplay(true);
    this.claimDetailApi.saveClaim(this.claimForm.getRawValue()).subscribe(() => {
      this.toastService.openSuccessToast('', 'Lưu thành công');
      this.loadingService.setDisplay(false);
      this.modal.hide();
      this.close.emit();
    });
  }
  // claim-detail

  print() {
   window.print();
  }

  refresh() {
    this.isSubmit = true;
    if (!this.isPartsCode) {
      this.toastService.openWarningToast('Part code không đúng!');
    }
  }

  submit() {
    this.isSubmit = true;
    if (this.claimForm.invalid) {
      return;
    }
    if (!this.isPartsCode) {
      this.toastService.openWarningToast('Part code không đúng!');
      return;
    }
    this.loadingService.setDisplay(true);
    this.claimDetailApi.submitClaim(this.claimForm.getRawValue()).subscribe(val => {
      this.toastService.openSuccessToast('', 'Submit thành công');
      if (val) {
        this.claim = val;
        this.buildClaim(val);
      }
      this.loadingService.setDisplay(false);
      // this.modal.hide();
      this.close.emit();
    });
  }

  accept() {
    const laborAdj = this.claimForm.get('laborAdj').value;
    const partsAdj = this.claimForm.get('partsAdj').value;
    const subletAdj = this.claimForm.get('subletAdj').value;
    console.log(laborAdj);
    if (laborAdj < 100 || partsAdj < 100 || subletAdj < 100) {
      this.isCheckAccept = true;
      this.isCheckAdj = false;
      return;
    } else {
      this.isCheckAccept = false;
      this.isCheckAdj = false;
    }
    if (this.action !== 'adjust') {
      this.toastService.openWarningToast('Vui lòng mở màn hình Adjust để thực hiện chức năng này');
      return;
    }
    this.isSubmit = true;
    this.claimForm.get('remedy').setValidators(GlobalValidator.required);
    this.claimForm.get('condition').setValidators(GlobalValidator.required);
    this.claimForm.get('cause').setValidators(GlobalValidator.required);
    this.claimForm.get('subletDesc').setValidators(GlobalValidator.required);
    this.claimForm.get('remedy').updateValueAndValidity();
    this.claimForm.get('condition').updateValueAndValidity();
    this.claimForm.get('cause').updateValueAndValidity();
    this.claimForm.get('subletDesc').updateValueAndValidity();
    this.claimForm.get('reasonCode').clearValidators();
    this.claimForm.updateValueAndValidity();
    if (this.claimForm.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);
    const claimFormValue = this.buildRequestJsonAdjustment(this.claimForm);
    this.claimDetailApi.acceptClaim(claimFormValue).subscribe(() => {
      this.toastService.openSuccessToast('', 'Claim đã được chấp nhận');
      this.loadingService.setDisplay(false);
      // this.modal.hide();
      this.close.emit();
      this.nextClaim();
    });
  }

  closeModal() {
    this.offset = 0;
    this.modal.hide();
  }

  nextClaim() {
    this.claimForm.get('remedy').clearValidators();
    this.claimForm.get('condition').clearValidators();
    this.claimForm.get('cause').clearValidators();
    this.claimForm.get('subletDesc').clearValidators();
    this.offset = this.claim.currentRecord;
    this.claimDetailApi.addjustmentClaim(0, this.offset, this.claim.dealerCode).subscribe(val => {
      if (val) {
        this.claim = val;
        this.buildClaim(val);
      }
    });
  }

  backClaim() {
    this.claimForm.get('remedy').clearValidators();
    this.claimForm.get('condition').clearValidators();
    this.claimForm.get('cause').clearValidators();
    this.claimForm.get('subletDesc').clearValidators();
    this.offset = this.claim.currentRecord - 2;
    this.claimDetailApi.addjustmentClaim(0, this.offset, this.claim.dealerCode).subscribe(val => {
      if (val) {
        this.claim = val;
        this.buildClaim(val);
      }
    });
  }

  buildRequestJsonAdjustment(form) {
    const result = form.getRawValue();
    result.subletDescEn = result.subletDesc;
    result.conditionEn = result.condition;
    result.causeEn = result.cause;
    result.remedyEn = result.remedy;

    result.subletDesc = this.claim.subletDesc;
    result.condition = this.claim.condition;
    result.cause = this.claim.cause;
    result.remedy = this.claim.remedy;

    return result;
  }

  addReasonCode(action) {
    this.claimForm.get('remedy').setValidators(GlobalValidator.required);
    this.claimForm.get('condition').setValidators(GlobalValidator.required);
    this.claimForm.get('cause').setValidators(GlobalValidator.required);
    this.claimForm.get('subletDesc').setValidators(GlobalValidator.required);
    this.claimForm.get('remedy').updateValueAndValidity();
    this.claimForm.get('condition').updateValueAndValidity();
    this.claimForm.get('cause').updateValueAndValidity();
    this.claimForm.get('subletDesc').updateValueAndValidity();
    if (this.action !== 'adjust') {
      this.toastService.openWarningToast('Vui lòng mở màn hình Adjust để thực hiện chức năng này');
      return;
    }
    this.isSubmit = true;
    if (this.claimForm.invalid) {
      return;
    }
    this.reasonCode.open(action);
  }

  setErrorCodeDataToRow(data) {
    this.claimForm.get('reasonCode').setValue(data.errcode);
    this[data.action]();
  }

  return() {
    this.loadingService.setDisplay(true);
    const claimFormValue = this.buildRequestJsonAdjustment(this.claimForm);
    this.claimDetailApi.returnClaim(claimFormValue).subscribe(val => {
      this.toastService.openSuccessToast('', 'Claim đã đươc Trả Về');
      this.loadingService.setDisplay(false);
      // this.modal.hide();
      this.close.emit();
      this.nextClaim();
    });
  }

  deny() {
    const claimFormValue = this.buildRequestJsonAdjustment(this.claimForm);
    this.loadingService.setDisplay(true);
    this.claimDetailApi.denyClaim(claimFormValue).subscribe(val => {
      this.toastService.openSuccessToast('', 'Claim đã bị Từ chối');
      this.loadingService.setDisplay(false);
      // this.modal.hide();
      this.close.emit();
      this.nextClaim();
    });
  }

  adjust() {
    if (this.action !== 'adjust') {
      this.toastService.openWarningToast('Vui lòng mở màn hình Adjust để thực hiện chức năng này');
      return;
    }
    this.isSubmit = true;
    this.claimForm.get('remedy').setValidators(GlobalValidator.required);
    this.claimForm.get('condition').setValidators(GlobalValidator.required);
    this.claimForm.get('cause').setValidators(GlobalValidator.required);
    this.claimForm.get('subletDesc').setValidators(GlobalValidator.required);
    this.claimForm.get('remedy').updateValueAndValidity();
    this.claimForm.get('condition').updateValueAndValidity();
    this.claimForm.get('cause').updateValueAndValidity();
    this.claimForm.get('subletDesc').updateValueAndValidity();
    const laborAdj = this.claimForm.get('laborAdj').value;
    const partsAdj = this.claimForm.get('partsAdj').value;
    const subletAdj = this.claimForm.get('subletAdj').value;

    if (laborAdj === 100 && partsAdj === 100 && subletAdj === 100) {
      this.isCheckAdj = true;
      this.isCheckAccept = false;
      return;
    } else {
      this.isCheckAdj = false;
      this.isCheckAccept = false;
    }
    if (this.claimForm.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);
    const claimFormValue = this.buildRequestJsonAdjustment(this.claimForm);
    this.claimDetailApi.adjustClaim(claimFormValue).subscribe(val => {
      this.toastService.openSuccessToast('', 'Claim đã được Điều Chỉnh');
      this.loadingService.setDisplay(false);
      // this.modal.hide();
      this.close.emit();
      this.nextClaim();
    });
  }

  convert() {
    this.claimForm.patchValue({
      subletDesc: this.claim.subletDesc,
      condition: this.claim.condition,
      cause: this.claim.cause,
      remedy: this.claim.remedy
    });
  }

  openRepairJobHistory() {
    const dealerCode = this.claim.dealerCode;
    const orderNo = this.claim.orderno;

    if (!dealerCode || !orderNo) {
      this.toastService.openWarningToast('Không có dealerCode và số RO.');
      return;
    }

    this.repairJobHistoryModal.open({orderNo, dealerCode});
  }

}
