import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { DlrFloorModel } from '../../../../core/models/catalog-declaration/dlr-floor.model';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { DlrFloorApi } from '../../../../api/master-data/catalog-declaration/dlr-floor.api';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'update-dlr-floor-modal',
  templateUrl: './update-dlr-floor-modal.component.html',
  styleUrls: ['./update-dlr-floor-modal.component.scss']
})
export class UpdateDlrFloorModalComponent implements OnInit {
  @ViewChild('modal', { static: false }) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: DlrFloorModel;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dlrFloorApi: DlrFloorApi,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
    if (!this.selectedData) {
      this.form.controls.status.disable();
    }
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const apiCall = this.selectedData
      ? this.dlrFloorApi.update(this.form.value)
      : this.dlrFloorApi.create(this.form.value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.swalAlertService.openSuccessToast();
      this.modal.hide();
      this.close.emit();
    });
  }

  reset() {
    this.form = undefined;
    this.selectedData = undefined;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      floorName: [undefined, [GlobalValidator.required, GlobalValidator.maxLength(200), GlobalValidator.specialCharacter]],
      id: [undefined],
      description: [undefined, GlobalValidator.maxLength(200)],
      status: ['Y'],
      type: [undefined, GlobalValidator.required],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}

