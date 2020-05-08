import {Component, EventEmitter, OnInit, Output, ViewChild, Injector} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {CarModelApi} from '../../../../api/common-api/car-model.api';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {SrvDRcJobsApi} from '../../../../api/master-data/warranty/srv-d-rc-jobs.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {AgDataValidateService} from '../../../../shared/ag-grid-table/ag-data-validate/ag-data-validate.service';
import {ConfirmService} from '../../../../shared/confirmation/confirm.service';
import {JobGroupTypes} from '../../../../core/constains/job-group-types';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-update-job-modal',
  templateUrl: './add-update-job-modal.component.html',
  styleUrls: ['./add-update-job-modal.component.scss']
})
export class AddUpdateJobModalComponent extends AppComponentBase implements OnInit {
  @Output() closeModal = new EventEmitter();
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight: number;
  form: FormGroup;
  selectedJob;
  // currentUser = CurrentUser;
  jobGroupTypes = JobGroupTypes;
  jobTimeId: number;
  jobTimeDlrId: number;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService,
    private gridTableService: GridTableService,
    private dataFormatService: DataFormatService,
    private loading: LoadingService,
    private agDataValidate: AgDataValidateService,
    private swalAlert: ToastService,
    private confirm: ConfirmService,
    private carModelApi: CarModelApi,
    private srvDRcJobsApi: SrvDRcJobsApi,
  ) {
    super(injector);
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedJob?) {
    this.selectedJob = selectedJob;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.selectedJob = undefined;
    this.form = undefined;
    this.jobTimeId = undefined;
    this.jobTimeDlrId = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const value = Object.assign({}, this.form.getRawValue(), {
      id: this.selectedJob ? this.selectedJob.id : null,
      jobtype: this.form.value.jobgroup,
    });
    this.loading.setDisplay(true);
    const apiCall = this.selectedJob
      ? this.srvDRcJobsApi.updateJobForCar(value)
      : this.srvDRcJobsApi.insertJobForCar(value);
    apiCall.subscribe(() => {
      this.loading.setDisplay(false);
      this.swalAlert.openSuccessToast();
      this.modal.hide();
      this.closeModal.emit();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      rccode: [{
        value: undefined,
        disabled: this.selectedJob
      }, [GlobalValidator.required, GlobalValidator.maxLength(20), GlobalValidator.specialCharacter, GlobalValidator.inputFormat]],
      rcname: [undefined, [GlobalValidator.required, GlobalValidator.maxLength(150), GlobalValidator.specialCharacter]],
      internal: ['Y'],
      remark: [undefined, GlobalValidator.maxLength(200)],
      jobgroup: [''],
      status: ['Y']
    });
    if (this.selectedJob) {
      this.form.patchValue(this.selectedJob);
    }

  }
}
