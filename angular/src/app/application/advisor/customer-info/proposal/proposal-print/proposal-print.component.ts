import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SetModalHeightService} from '../../../../../shared/common-service/set-modal-height.service';
import {PartsInfoManagementApi} from '../../../../../api/parts-management/parts-info-management.api';
import {DataCodes} from '../../../../../core/constains/data-code';
import {DataFormatService} from '../../../../../shared/common-service/data-format.service';
import {RepairOrderApi} from '../../../../../api/quotation/repair-order.api';
import {ToastService} from '../../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'proposal-print',
  templateUrl: './proposal-print.component.html',
  styleUrls: ['./proposal-print.component.scss']
})
export class ProposalPrintComponent implements OnInit {
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onPrint = new EventEmitter();
  @ViewChild('modal', {static: false}) modal;
  @ViewChild('btn', {static: false}) btn: ElementRef;
  @Input() isAdvisor: boolean;
  form: FormGroup;
  modalHeight: number;
  selectedData;
  insStone;
  data;
  constantKm = 5000;
  isWarning = false;
  listCurMainLevel;
  listMaintainValue;
  listNextMainLevel;

  constructor(private formBuilder: FormBuilder,
              private setModalHeightService: SetModalHeightService,
              private partsInfoManagementApi: PartsInfoManagementApi,
              private repairOrderApi: RepairOrderApi,
              private swalAlertService: ToastService,
              public dataFormatService: DataFormatService) {
    this.insStone = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  getCurMainLevel() {
    this.partsInfoManagementApi.getDataCode(DataCodes.curMainLevel).subscribe(res => {
      this.listCurMainLevel = res;
    });
  }

  getMaintainValue() {
    this.partsInfoManagementApi.getDataCode(DataCodes.maintainValue).subscribe(res => {
      this.listMaintainValue = res;
      if (res) {
        if (this.data.km < Number(res[res.length - 1].dataValue)) {
          const data = res.find(it => Number(it.dataValue) > this.data.km);
          this.form.patchValue({
            maintainValue: data ? data.dataValue : res[0].dataValue
          });
        } else {
          this.form.get('maintainValue').disable();
        }
      }
    });
  }

  getNextMainLevel() {
    this.partsInfoManagementApi.getDataCode(DataCodes.nextMainLevel).subscribe(res => {
      this.listNextMainLevel = res;
    });
  }

  print() {
    if (this.form.invalid) {
      return;
    }
    const obj = this.form.value;
    obj.isMa = !!obj.isMa && obj.isMa !== 'N' ? 'Y' : 'N';
    obj.isMaPlus = !!obj.isMaPlus && obj.isMaPlus !== 'N' ? 'Y' : 'N';
    obj.isNonMa = !!obj.isNonMa && obj.isNonMa !== 'N' ? 'Y' : 'N';
    obj.isEM = !!obj.isEM && obj.isEM !== 'N' ? 'Y' : 'N';
    if (obj.isMa === 'N' && obj.isMaPlus === 'N' && obj.isNonMa === 'N') {
      this.swalAlertService.openWarningToast('Bạn chưa chọn công việc sửa chữa hiện tại');
      return;
    }
    this.onPrint.emit(obj);
    this.modal.hide();
  }

  showWarning() {
    this.isWarning = true;
    setTimeout(() => {
      this.isWarning = false;
    }, 2000);
  }

  reset() {
    this.form = undefined;
  }

  open(data) {
    this.data = data;
    this.buildForm();
    this.getCurMainLevel();
    this.getMaintainValue();
    this.getNextMainLevel();
    this.repairOrderApi.getMrsTmssRo(this.data.roId).subscribe(res => {
      this.form.patchValue({
        isMa: res.isMa === 'Y',
        isMaPlus: res.isMaPlus === 'Y',
        isNonMa: res.isNonMa === 'Y',
        isEM: res.isEM === 'Y',
        curMainLevelId: res.curMainLevelId ? res.curMainLevelId.toString() : null,
        maintainValue: res.maintainValue ? res.maintainValue.toString() : null,
        nextMainLevelId: res.nextMainLevelId ? res.nextMainLevelId.toString() : null
      });
    });
    this.modal.show();
    setTimeout(() => {
      this.btn.nativeElement.focus();
    }, 200);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      isMa: [undefined],
      isMaPlus: [undefined],
      isNonMa: [undefined],
      curMainLevelId: [undefined, Validators.required],
      maintainValue: [undefined],
      nextMainLevelId: [undefined],
      isEM: [undefined]
    });
    this.form.get('isMa').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('isMaPlus').setValue(false);
        this.form.get('isNonMa').setValue(false);
      }
    });
    this.form.get('isMaPlus').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('isMa').setValue(false);
        this.form.get('isNonMa').setValue(false);
      }
    });
    this.form.get('isNonMa').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('isMa').setValue(false);
        this.form.get('isMaPlus').setValue(false);
      }
    });

    // Set default value
    this.form.get('isMa').setValue(true);
    this.form.get('isEM').setValue(true);
  }
}
