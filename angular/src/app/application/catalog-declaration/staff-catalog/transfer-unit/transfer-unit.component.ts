import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { EmployeeCommonModel } from '../../../../core/models/common-models/employee-common.model';
import { DivisionCommonModel } from '../../../../core/models/common-models/division-common.model';
import { DivisionCommonApi } from '../../../../api/common-api/division-common.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { EmployeeCommonApi } from '../../../../api/common-api/employee-common.api';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'transfer-unit',
  templateUrl: './transfer-unit.component.html',
  styleUrls: ['./transfer-unit.component.scss']
})
export class TransferUnitComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: EmployeeCommonModel;
  form: FormGroup;
  modalHeight: number;

  transferUnitList: Array<DivisionCommonModel>;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private unitCatalogApi: DivisionCommonApi,
    private employeeApi: EmployeeCommonApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData) {
    this.getUnits();
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const value = Object.assign({}, this.selectedData, {
      divId: this.form.value.divId,
      status: 'Y',
    });
    this.loadingService.setDisplay(true);
    this.employeeApi.saveEmp(value).subscribe(() => {
      this.swalAlertService.openSuccessToast();
      this.close.emit();
    });

    this.close.emit();
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      divId: [undefined, GlobalValidator.required],
      empName: [{value: undefined, disabled: true}],
      divName: [{value: undefined, disabled: true}],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
    this.form.get('divId').valueChanges.subscribe(val => {
      this.form.patchValue({
        divName: val
          ? this.transferUnitList.find(unit => unit.id === this.form.value.divId).divName
          : undefined
      });
    });
  }

  private getUnits() {
    this.loadingService.setDisplay(true);
    this.unitCatalogApi.getDivisionByCurrentDlr().subscribe(units => {
      this.loadingService.setDisplay(false);
      this.transferUnitList = units || [];
    });
  }
}
