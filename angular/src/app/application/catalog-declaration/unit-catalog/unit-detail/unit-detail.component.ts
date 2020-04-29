import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DivisionCommonModel } from '../../../../core/models/common-models/division-common.model';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';
import { DivisionCommonApi } from '../../../../api/common-api/division-common.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { EmployeeCommonApi } from '../../../../api/common-api/employee-common.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'unit-detail',
  templateUrl: './unit-detail.component.html',
  styleUrls: ['./unit-detail.component.scss']
})
export class UnitDetailComponent implements OnInit, OnChanges {
  @Input() detailData: DivisionCommonModel;
  @ViewChild('btnSubmit', {static: false}) btnSubmit: ElementRef;
  @ViewChild('searchManager', {static: false}) searchManager;
  @ViewChild('searchDivision', {static: false}) searchDivision;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;

  managerGridField;
  childOfGridField;

  constructor(
    private loadingService: LoadingService,
    private confirmService: ConfirmService,
    private swalAlertService: ToastService,
    private formBuilder: FormBuilder,
    private unitCatalogApi: DivisionCommonApi,
    private employeeApi: EmployeeCommonApi,
  ) {
  }

  ngOnInit() {
    this.managerGridField = [
      {headerName: 'Mã Nhân viên', headerTooltip: 'Mã Nhân viên', field: 'empCode'},
      {headerName: 'Tên Nhân viên', headerTooltip: 'Tên Nhân viên', field: 'empName'},
    ];
    this.childOfGridField = [
      {headerName: 'Mã Đơn vị', headerTooltip: 'Mã Đơn vị', field: 'divCode'},
      {headerName: 'Tên Đơn vị', headerTooltip: 'Tên Đơn vị', field: 'divName'},
    ];
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.patchValue();
  }

  submit() {
    this.btnSubmit.nativeElement.click();
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    if (this.form.value.id && this.form.value.parentDivId === this.form.value.id) {
      this.swalAlertService.openWarningToast(this.form.value.divCode + ' không thể là con của chính nó');
      return;
    }

    const apiCall = this.form.value.id
      ? this.unitCatalogApi.update(this.form.value)
      : this.unitCatalogApi.create(this.form.value);
    this.loadingService.setDisplay(true);
    apiCall.subscribe(res => {
      this.form.patchValue({id: res.id});
      this.close.emit();
      this.swalAlertService.openSuccessToast();
    });
  }

  callSearchManager() {
    this.loadingService.setDisplay(true);
    this.employeeApi.getEmpByCurrentDlr().subscribe(res => {
      this.searchManager.open(null, res);
      this.loadingService.setDisplay(false);
    });
  }

  callSearchDivision() {
    this.loadingService.setDisplay(true);
    this.unitCatalogApi.getDivisionByCurrentDlr().subscribe(res => {
      this.searchDivision.open(null, res);
      this.loadingService.setDisplay(false);
    });
  }

  patchManager(data) {
    this.form.patchValue({
      managerId: data && data.id ? data.id : null,
      managerName: data && data.empName ? data.empName : null,
    });
  }

  patchDivision(data) {
    this.form.patchValue({
      parentDivId: data && data.id ? data.id : null,
      parentDivName: data && data.divName ? data.divName : null,
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      divCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(20), GlobalValidator.specialCharacter])],
      id: [undefined],
      parentDivId: [undefined],
      parentDivName: [undefined],
      divName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50), GlobalValidator.specialCharacter])],
      des: [undefined, GlobalValidator.maxLength(200)],
      managerId: [undefined],
      managerName: [undefined],
      status: ['Y'],
    });
  }

  private patchValue() {
    if (this.form) {
      this.form.reset();
      if (this.detailData) {
        this.form.patchValue(this.detailData);
      }
    }
  }
}
