import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClaimModel } from '../../../../../core/models/warranty/claim.model';
import { TCodeApi } from '../../../../../api/common-api/t-code.api';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 't-code',
  templateUrl: './t-code.component.html',
  styleUrls: ['./t-code.component.scss', '../claim-detail.component.scss'],
})
export class TCodeComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('submitBtn', {static: false}) submitBtn;
  @ViewChild('findTCodeModal', {static: false}) findTCodeModal;
  @Input() form: FormGroup;
  @Input() claim: ClaimModel;
  @Input() isSubmit: boolean;
  @Input() t1Code: Array<any>;
  @Input() t2Code: Array<any>;
  @Input() t3Code: Array<any>;
  t3CodeArray: FormArray;
  tcodeType;
  fieldTCode;
  t3CodeIndex;


  constructor(private formBuilder: FormBuilder,
              private tCodeApi: TCodeApi) {
    this.fieldTCode = [
      {
        headerName: 'TCode',
        headerTooltip: 'TCode',
        field: 'tcode',
      },
      {
        headerName: 'TCode_Type',
        headerTooltip: 'TCode_Type',
        field: 'tcodetype',
      },
      {
        headerName: 'Desc_Eng',
        headerTooltip: 'Desc_Eng',
        field: 'desceng',
      },
    ];
  }

  ngOnInit() {
    this.t3CodeArray = this.form.get('t3Codes') as FormArray;
    this.form.get('t1Code').setValidators(Validators.compose([GlobalValidator.required, this.validateT1()]));
    this.form.get('t2Code').setValidators(Validators.compose([GlobalValidator.required, this.validateT2()]));
    this.checkForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isSubmit && this.submitBtn) {
      this.submitBtn.nativeElement.click();
    }
  }

  ngAfterViewInit(): void {

  }

  checkForm() {
    this.claim.t3Codes.forEach(t3Code => {
      this.addT3Code(t3Code);
    });
  }

  addT3Code(val) {
    const t3Code = this.formBuilder.group({
      tcode: [undefined, this.validateT3()],
      modifiedBy: [undefined],
      modifyDate: [undefined],
      createdBy: [undefined],
      createDate: [undefined],
      id: [undefined],
      tcodetype: [undefined],
      dealercode: [undefined],
      dealerclaimno: [undefined],
      deleteflag: [undefined],
      dlrId: [undefined],
      updatecount: [undefined],
      srvBTwc: [undefined],
    });
    t3Code.patchValue(val);
    this.t3CodeArray.push(t3Code);
  }

  validateT1() {
    return (control: FormControl) => {
      if (control && control.value) {
        const filters = this.t1Code.filter(item => item.tcode === control.value);
        if (!filters.length) {
          return {
            tCode: true,
          };
        }
      }
      return null;
    };
  }

  validateT2() {
    return (control: FormControl) => {
      if (control && control.value) {
        const filters = this.t2Code.filter(item => item.tcode === control.value);
        if (!filters.length) {
          return {
            tCode: true,
          };
        }

      }
      return null;
    };
  }

  validateT3() {
    return (control: FormControl) => {
      if (control && control.value) {
        const filters = this.t3Code.filter(item => item.tcode === control.value);
        if (!filters.length) {
          return {
            tCode: true,
          };
        }

      }
      return null;
    };
  }

  apiTCodeCall(val) {
    return this.tCodeApi.search(this.tcodeType, val.tCode || '');
  }

  setTCodeDataToRow(data) {
    if (this.tcodeType === 'T1') {
      this.form.get('t1Code').setValue(data.tcode);
      this.form.get('t1CodeType').setValue(data.tcodetype);
    }
    if (this.tcodeType === 'T2') {
      this.form.get('t2Code').setValue(data.tcode);
      this.form.get('t2CodeType').setValue(data.tcodetype);
    }
    if (this.tcodeType === 'T3') {
      this.t3CodeArray.controls[this.t3CodeIndex].patchValue(data);
    }
  }

  searchTCode(type, data, index?) {
    this.tcodeType = type;
    this.t3CodeIndex = index;
    this.findTCodeModal.open({tCode: data.target.value});
  }
}
