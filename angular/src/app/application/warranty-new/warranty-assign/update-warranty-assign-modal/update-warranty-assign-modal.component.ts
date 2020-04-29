import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {WarrantyAssignApi} from '../../../../api/warranty/warranty-assign.api';
import {CarFamilyApi} from '../../../../api/common-api/car-family.api';
import {SysUserApi} from '../../../../api/system-admin/sys-user.api';

@Component({
  selector: 'update-warranty-assign-modal',
  templateUrl: './update-warranty-assign-modal.component.html',
  styleUrls: ['./update-warranty-assign-modal.component.scss']
})
export class UpdateWarrantyAssignModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedData;
  modelList;
  modelPicList;
  regionList = [
    { id: 0, value: 'All' },
    { id: 3, value: 'North' },
    { id: 4, value: 'Center' },
    { id: 5, value: 'South' }
  ];
  constructor(
    private loadingService: LoadingService,
    private warrantyAssignApi: WarrantyAssignApi,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private carFamilyApi: CarFamilyApi,
    private sysUserApi: SysUserApi
  ) { }

  ngOnInit() {
    this.carFamilyApi.findAll().subscribe(val => this.modelList = val);
    this.sysUserApi.getTMVUser().subscribe(val => this.modelPicList = val);
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  hide() {
    this.modal.hide();
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const data = this.form.value;
    this.warrantyAssignApi.saveWarrantyAssign(data).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.toastService.openSuccessModal();
      this.close.emit();
      this.modal.hide();
    });
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      id: [this.selectedData ? this.selectedData.id : null],
      modelId: [this.selectedData ? this.selectedData.modelId : undefined, GlobalValidator.required],
      modelPicId: [this.selectedData ? this.selectedData.modelPicId : undefined, GlobalValidator.required],
      regionId: [this.selectedData ? this.selectedData.regionId : undefined],
      email: [this.selectedData ? this.selectedData.email : undefined],
      bcc: [this.selectedData ? this.selectedData.bcc : undefined],
      note: [this.selectedData ? this.selectedData.note : undefined],
    });
  }

}
