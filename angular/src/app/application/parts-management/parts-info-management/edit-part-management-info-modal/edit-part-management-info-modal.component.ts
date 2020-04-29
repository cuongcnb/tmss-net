import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { distinctUntilChanged, switchMap, throttleTime } from 'rxjs/operators';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { SupplierCatalogModel } from '../../../../core/models/catalog-declaration/supplier-catalog.model';
import { PartTypeCommonModel } from '../../../../core/models/common-models/part-type-common.model';
import { UnitCommonModel } from '../../../../core/models/common-models/unit-common.model';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { PartsInfoManagementModel } from '../../../../core/models/parts-management/parts-info-management.model';
import { PartsInfoManagementApi } from '../../../../api/parts-management/parts-info-management.api';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { CurrentUserModel } from '../../../../core/models/base.model';
import { CurrentUser } from '../../../../home/home.component';
import { CurrencyModel } from '../../../../core/models/common-models/currency.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-part-management-info-modal',
  templateUrl: './edit-part-management-info-modal.component.html',
  styleUrls: ['./edit-part-management-info-modal.component.scss']
})
export class EditPartManagementInfoModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Input() supplierList: Array<SupplierCatalogModel>;
  @Input() partTypes: Array<PartTypeCommonModel>;
  @Input() unitArr: Array<UnitCommonModel>;
  @Input() currencyArr: Array<CurrencyModel>;
  @Input() kpiPartTypes: string[];
  currentUser: CurrentUserModel = CurrentUser;
  modalHeight: number;
  form: FormGroup;
  sellUnits: Array<any>;

  selectedPart: PartsInfoManagementModel;

  constructor(
    private swalAlertService: ToastService,
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private partsInfoManagementApi: PartsInfoManagementApi,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedPart?) {
    this.selectedPart = selectedPart ? selectedPart : undefined;
    this.modal.show();
    this.buildForm();
  }

  reset() {
    this.form = undefined;
    this.selectedPart = undefined;
  }

  confirm() {
    if (this.form.invalid) { return; }

    const apiCall = !!this.selectedPart ? this.partsInfoManagementApi.update(this.form.getRawValue()) : this.partsInfoManagementApi.create(this.form.getRawValue());
    this.loadingService.setDisplay(true);
    apiCall.subscribe(res => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
      this.modal.hide();
      this.close.emit(res);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      partsType: [undefined, GlobalValidator.required],
      partsCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      id: [undefined],
      localFlag: [undefined, GlobalValidator.required],
      pnc: [undefined, GlobalValidator.maxLength(6)],
      partsName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(255)])],
      partsNameVn: [undefined, GlobalValidator.maxLength(255)],
      price: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.numberFormat])],
      unitId: [undefined, GlobalValidator.required],
      sellPrice: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.numberFormat])],
      sellUnitId: [undefined, GlobalValidator.required], // Chạy theo unitId
      rate: [10],
      fobPrice: [undefined],
      fobcurrencycode: [undefined],
      supplierId: [undefined, GlobalValidator.required],
      leadTime: [undefined, GlobalValidator.floatNumberFormat],
      kpiPartType: [undefined],
      newPart: [undefined, GlobalValidator.maxLength(20)],
      oldPart: [undefined, GlobalValidator.maxLength(20)],
      handlemodel: [undefined, GlobalValidator.maxLength(200)],
      frCd: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(1)])],
      partSize: [undefined, GlobalValidator.maxLength(50)],
      expressShipping: [undefined, GlobalValidator.floatNumberFormat],
      coo: [undefined, GlobalValidator.maxLength(200)],
      status: [undefined, GlobalValidator.required],
      remark: [undefined, GlobalValidator.maxLength(200)],
    });

    this.form.get('unitId').valueChanges
      .pipe(
        throttleTime(500),
        distinctUntilChanged(),
        switchMap(unitId => this.partsInfoManagementApi.searchSellUnit(unitId))
      ).subscribe(sellUnits => {
        if (!sellUnits.length) {
          this.swalAlertService.openWarningToast('Không có thông tin đơn vị tính cho giá bán.');
          return;
        }

        if (sellUnits.length === 1) {
          this.form.get('sellUnitId').disable();
        } else {
          this.form.get('sellUnitId').reset();
          this.form.get('sellUnitId').enable();
        }

        this.sellUnits = [...sellUnits];
        this.form.get('sellUnitId').setValue(sellUnits[0].id);
      });

    this.form.get('supplierId').valueChanges.subscribe(val => {
      const matchSupplier = this.supplierList.find(supplier => supplier.id === val);
      this.form.patchValue({
        leadTime: matchSupplier ? matchSupplier.leadTime : 0
      });
    });

    if (this.selectedPart) {
      this.form.patchValue(this.selectedPart);
    }

    if (this.currentUser.isAdmin) {
      this.form.get('fobPrice').setValidators(Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat]));
      this.form.get('fobcurrencycode').setValidators(GlobalValidator.required);
    }
  }
}
