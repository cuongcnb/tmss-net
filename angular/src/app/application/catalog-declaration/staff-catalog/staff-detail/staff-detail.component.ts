import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeCommonModel } from '../../../../core/models/common-models/employee-common.model';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { EmployeeCommonApi } from '../../../../api/common-api/employee-common.api';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { TitleModel } from '../../../../core/models/common-models/title-model';
import { EmployeeTypeModel } from '../../../../core/models/common-models/employee-type-model';
import { EmployeeTypeApi } from '../../../../api/common-api/employee-type.api';
import { TitleApi } from '../../../../api/common-api/title.api';
import { CurrentUser } from '../../../../home/home.component';
import { JobTypes } from '../../../../core/constains/job-type';
import {DivisionCommonApi} from '../../../../api/common-api/division-common.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.scss'],
})

export class StaffDetailComponent implements OnInit, OnChanges {
  @ViewChild('btnSubmit', {static: false}) btnSubmit: ElementRef;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Output() addStaff = new EventEmitter();
  @Output() savedStaff = new EventEmitter();
  @Input() detailData: EmployeeCommonModel;
  @Input() selectedDivId: number;
  isCallGetImg: boolean;
  isChangeForm: boolean;
  isClickSaveBtn: boolean;
  jobTypes = JobTypes;
  currentUser = CurrentUser;
  imgUrl: string;
  form: FormGroup;
  transferUnitList;

  titleEmps: Array<TitleModel> = [];
  empTypes: Array<EmployeeTypeModel> = [];

  constructor(
    private formBuilder: FormBuilder,
    private confirmService: ConfirmService,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private employeeApi: EmployeeCommonApi,
    private employeeTypeApi: EmployeeTypeApi,
    private titleApi: TitleApi,
    private unitCatalogApi: DivisionCommonApi
  ) {
  }

  ngOnInit() {
    this.getUnits();
    this.getTitles();
    this.getEmpTypes();
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isClickSaveBtn = false;
    if (this.isChangeForm) {
      this.confirmService.openConfirmModal
      ('Lưu thay đổi?', 'Bạn muốn thao tác với bản ghi khác nhưng chưa lưu lại sự thay đổi. Bạn có muốn lưu lại sự thay đổi?')
        .subscribe(() => {
          if (this.form.invalid) {
            this.swalAlertService.openWarningToast('Sự thay đổi của bạn không lưu được vì giá trị nhập vào không hợp lệ');
            this.patchValue();
            return;
          }
          this.save();
        }, () => {
          this.patchValue();
        });
    } else {
      this.patchValue();
    }
  }

  private getUnits() {
    this.loadingService.setDisplay(true);
    this.unitCatalogApi.getDivisionByCurrentDlr().subscribe(units => {
      this.loadingService.setDisplay(false);
      this.transferUnitList = units || [];
    });
  }

  submit(isClickSaveBtn) {
    this.isClickSaveBtn = isClickSaveBtn;
    this.btnSubmit.nativeElement.click();
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    if (this.form.value.birthday > new Date().getTime()) {
      this.swalAlertService.openWarningToast('Ngày sinh phải nhỏ hơn ngày hiện tại!');
      return;
    }

    this.loadingService.setDisplay(true);
    const value = Object.assign({}, this.form.value, {
      id: this.detailData && this.detailData != null ? this.detailData.id : null,
      divId: this.form.value.divId ? this.form.value.divId : this.selectedDivId,
      img_url: this.imgUrl,
    });
    const reloadAfterSave = () => {
      if (this.isChangeForm) {
        this.patchValue();
        this.isChangeForm = false;
      } else {
        this.form.reset();
        this.isChangeForm = false;
      }
      this.close.emit(this.isClickSaveBtn);
      this.loadingService.setDisplay(false);
      this.imgUrl = null;
    };
    this.employeeApi.saveEmp(value).subscribe(res => {
      this.savedStaff.emit(res);
      reloadAfterSave();
      this.swalAlertService.openSuccessToast();
    }, error => {},
    () => {
      if (!this.isClickSaveBtn) {
        reloadAfterSave();
      }
    });
  }

  apiCallUpload(file) {
    return this.employeeApi.uploadNewImage(file);
  }

  apiCallGetImg() {
    return this.employeeApi.getImg(this.detailData.id);
  }

  patchImgUrl(imgUrl) {
    this.imgUrl = imgUrl;
    this.isChangeForm = true;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      empCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(20), GlobalValidator.specialCharacter])],
      id: [this.detailData ? this.detailData.id : null],
      divId: [this.detailData ? this.detailData.divId : this.selectedDivId],
      dlrId: [this.currentUser.dealerId],
      empImg: [undefined],
      empName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50), GlobalValidator.specialCharacter])],
      sex: [1],
      status: ['Y'],
      tel: [undefined, GlobalValidator.phoneFormat],
      birthday: [undefined],
      typeId: [undefined],
      titleId: [undefined],
      empAddress: [undefined, GlobalValidator.maxLength(100)],
      email: [undefined, Validators.compose([GlobalValidator.emailFormat, GlobalValidator.maxLength(50)])],
      empColor: [undefined, GlobalValidator.maxLength(30)],
      startDate: [undefined],
      typeJob: [{value: this.jobTypes[this.jobTypes.length - 1].id, disabled: true}, GlobalValidator.required],
    });

    this.form.get('titleId').valueChanges.subscribe(val => {
      const matchValue = this.titleEmps.find(title => title.titleName === 'Kỹ thuật viên');

      if (matchValue && matchValue.id === val) {
        this.form.get('typeJob').enable();
      } else {
        this.form.get('typeJob').disable();
      }
    });

    this.form.valueChanges.subscribe(() => {
      this.isChangeForm = true;
    });
  }

  private getTitles() {
    this.loadingService.setDisplay(true);
    this.titleApi.getAll().subscribe(titles => {
      this.titleEmps = titles || [];
      this.loadingService.setDisplay(false);
    });
  }

  private getEmpTypes() {
    this.loadingService.setDisplay(true);
    this.employeeTypeApi.getAll().subscribe(empTypes => {
      this.empTypes = empTypes || [];
      this.loadingService.setDisplay(false);
    });
  }

  private patchValue() {
    this.isCallGetImg = false;
    if (this.form) {
      this.form.reset();
      this.form.patchValue({divId: this.selectedDivId});
      if (this.detailData) {
        this.form.patchValue(this.detailData);
      } else {
        this.detailData = undefined;
      }
    }

    setTimeout(() => {
      this.isChangeForm = false;
      if (this.detailData) {
        this.isCallGetImg = true;
      }
    });
  }
}
