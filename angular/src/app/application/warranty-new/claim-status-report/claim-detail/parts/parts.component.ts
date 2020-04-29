import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ClaimModel } from '../../../../../core/models/warranty/claim.model';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';
import { CurrentUser } from '../../../../../home/home.component';
import { PartsInfoManagementApi } from '../../../../../api/parts-management/parts-info-management.api';
import { CommonService } from '../../../../../shared/common-service/common.service';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { DataFormatService } from '../../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss', '../claim-detail.component.scss'],
})
export class PartsComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('submitBtn', {static: false}) submitBtn;
  @ViewChild('findPartsModal', {static: false}) findPartsModal;
  @Input() form: FormGroup;
  @Input() isSubmit: boolean;
  @Input() claim: ClaimModel;
  @Input() payCodeList: Array<any>;
  @Input() isTMV: boolean;
  currentUser = CurrentUser;
  partsArray: FormArray;
  fieldParts;
  isCheck = false;
  partsIndex;
  partsCodeSearch;
  paginationTotalsData: number;
  searchTimeout;

  @Input() sourceTable: string;

  constructor(
    private formBuilder: FormBuilder,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private commonService: CommonService,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
  ) {
    this.fieldParts = [
      {
        headerName: 'Parts_Code',
        headerTooltip: 'Parts_Code',
        field: 'partsCode',
      },
      {
        headerName: 'Parts_Name',
        headerTooltip: 'Parts_Name',
        valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        },
      }, {
        headerName: 'Parts_Type',
        headerTooltip: 'Parts_Type',
        field: 'partsTypeName',
      },
      {
        headerName: 'Price',
        headerTooltip: 'Price',
        field: 'price',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        width: 200
      },
      {
        headerName: 'Sell_Price',
        headerTooltip: 'Sell_Price',
        field: 'sellPrice',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        width: 200
      },
      {
        headerName: 'Fob_C',
        headerTooltip: 'Fob_C',
        field: 'fobcurrencycode',
        width: 100
      },
      {
        headerName: 'Local',
        headerTooltip: 'Local',
        field: 'localFlag',
        width: 100
      },
    ];
  }

  ngOnInit() {
    this.partsArray = this.form.get('warrantyClaimPartsDTOs') as FormArray;
    this.checkForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterViewInit(): void {
    if (this.isSubmit && this.submitBtn) {
      this.submitBtn.nativeElement.click();
    }
  }

  addParts(val?) {
    if (length > 0 && this.partsArray.controls[length - 1].invalid) {
      return;
    }
    const parts = this.formBuilder.group({
      id: [undefined],
      payCode: [undefined],
      // opeMFlagCtl: [{ value: false, disabled: true }],
      opeMFlagCtl: [undefined],
      opeMFlag: ['0'],
      localFlag: [undefined],
      partsCode: [undefined, GlobalValidator.required],
      partsNameVn: [undefined],
      qty: [undefined, GlobalValidator.required],
      amount: [undefined],
      fobCurrencyCode: [undefined],
      fobPrice: [undefined],
      price: [undefined],
    });

    this.partsArray.push(parts);
    setTimeout(() => {
      if (this.isSubmit && this.submitBtn) {
        this.submitBtn.nativeElement.click();
      }
    });
    if (val) {
      parts.patchValue(Object.assign({}, val, { opeMFlagCtl: (val.opeMFlag === '1') }));

    } else {
      parts.get('opeMFlagCtl').disable();
    }
    parts.get('opeMFlagCtl').valueChanges.subscribe(valCtl => {
      parts.get('opeMFlag').setValue(valCtl ? '1' : '0');
      if (valCtl) {
        if (this.isCheck) {
          this.form.get('ofpNo').setValue(parts.get('partsCode').value);
        }
        this.isCheck = false;
        this.form.get('ofpLocalFlag').setValue(parts.get('localFlag').value);
        this.partsArray.controls.forEach((partsItem: FormGroup) => {
          if (partsItem !== parts) {
            partsItem.get('opeMFlagCtl').setValue(false, { emitEvent: false });
            partsItem.get('opeMFlag').setValue('0');
          }
        });
      }
      // else if (parts.get('partsCode').value === this.form.get('ofpNo').value) {
        // this.form.get('ofpNo').setValue(null);
      // }
    });
    parts.get('qty').valueChanges.subscribe(valClt => {
      parts.get('amount').setValue(Math.round((Number(valClt) || 0) * (Number((parts.get('price').value) / 1000) || 0) * 100) / 100);
    });
    parts.get('partsCode').valueChanges.subscribe(valCtl => {
      valCtl ? parts.get('opeMFlagCtl').enable() : parts.get('opeMFlagCtl').disable();
      if (this.partsCodeSearch === valCtl || !valCtl) {
        return;
      }
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.partsCodeSearch = valCtl;
        if (!this.partsCodeSearch) {
          return;
        }
        this.loadingService.setDisplay(true);
        this.partsInfoManagementApi.searchPartsInfo({ partsCode: valCtl || '' }).subscribe(searchVal => {
          if (searchVal && searchVal.list.length === 1 && valCtl === searchVal.list[0].partsCode) {
            delete searchVal.list[0].partsCode;
            parts.patchValue(Object.assign({}, searchVal.list[0], {
              qty: 1,
              amount: (searchVal.list[0].price / 1000),
            }));
            parts.get('partsCode').setErrors(null);
          } else {
            parts.get('partsCode').setErrors({ partsCode: true });
          }
          this.loadingService.setDisplay(false);
        });
      }, 1000);
    });
  }

  deleteParts(i) {
    // if ((this.partsArray.controls[i] as FormGroup).get('opeMFlagCtl').value) {
    //   this.form.get('ofpNo').setValue(null);
    // }
    this.partsArray.removeAt(i);
    this.partsCodeSearch = undefined;
  }

  checkForm() {
    this.partsArray.valueChanges.subscribe(() => {
      const partsArrayVal = this.partsArray.controls.map((item: FormGroup) => item.getRawValue());
      this.form.get('sumPartsSubTotal').setValue(Math.round(this.commonService.sumObjectByField(partsArrayVal, 'amount') * 100) / 100);
    });
    if (this.claim.warrantyClaimPartsDTOs.length) {
      this.claim.warrantyClaimPartsDTOs.forEach(parts => {
        this.addParts(parts);
      });
    }
  }

  apiPartsCall(val, paginationParams?) {
    const part = {
      partsCode: val.partsCode,
      dlrId: -1,
      status: 'Y'
    };
    return this.partsInfoManagementApi.searchPartsInfo(part, paginationParams);
  }

  searchParts(event, i) {
    this.partsIndex = i;
    this.findPartsModal.open({ partsCode: event.target.value });
  }

  setPartsDataToRow(data) {
    this.partsCodeSearch = data.partsCode;
    this.partsArray.controls[this.partsIndex].patchValue(Object.assign({}, data, { id : null, qty: 1, amount: (data.price / 1000) }));
  }
}
