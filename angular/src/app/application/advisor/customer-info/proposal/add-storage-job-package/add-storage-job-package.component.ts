import { Component, Input, OnInit, ViewChild, Injector } from '@angular/core';
import { JobGroupTypes } from '../../../../../core/constains/job-group-types';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { DataFormatService } from '../../../../../shared/common-service/data-format.service';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';
import { JobGroupModel } from '../../../../../core/models/catalog-declaration/job-group.model';
import { CarFamilyApi } from '../../../../../api/common-api/car-family.api';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-storage-job-package',
  templateUrl: './add-storage-job-package.component.html',
  styleUrls: ['./add-storage-job-package.component.scss'],
})
export class AddStorageJobPackageComponent extends AppComponentBase implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-input-rename
  @Input('formD') formProposal;
  selectedData: JobGroupModel;
  form;
  modalHeight;
  // currentUser = CurrentUser;
  jobGroupTypes = JobGroupTypes;
  cfList = [];

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private modalHeightService: SetModalHeightService,
    private carFamilyApi: CarFamilyApi,
  ) {
    super(injector);
  }

  ngOnInit() {
    if (!this.currentUser.isAdmin) {
      this.jobGroupTypes = this.jobGroupTypes.filter(type => type.name !== 'Bảo dưỡng');
    }
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData) {
    this.carFamilyApi.getByCFType(selectedData.cmType).subscribe(cfList => {
      this.cfList = cfList || [];
    });
    this.selectedData = selectedData;
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
    this.selectedData = undefined;
  }

  save() {
    const obj = [this.form.getRawValue(), this.formProposal.value.jobListDs, this.formProposal.value.jobListScc, this.formProposal.value.partList];
    if (this.form.invalid) {
      return;
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      gjCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(30), GlobalValidator.specialCharacter])],
      id: [undefined],
      gjName: [undefined, Validators.compose([GlobalValidator.maxLength(100), GlobalValidator.specialCharacter])],
      remark: [undefined, GlobalValidator.maxLength(200)],
      jobType: [this.jobGroupTypes[0].id],
      doixe: [null],
      cfId: [null],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }

}
