import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';

import { ContactCustomModel } from '../../../../../core/models/fir/contact-custom.model';
import { DlrFloorApi } from '../../../../../api/master-data/catalog-declaration/dlr-floor.api';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.scss']
})
export class AddRequestComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: ContactCustomModel;
  form: FormGroup;
  modalHeight: number;
  gridParams;
  constructor(
    private formBuider: FormBuilder,
    private dlrFloorApi: DlrFloorApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private modalHeightService: SetModalHeightService
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  refresh() {
    this.form = undefined;
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  save() {
    if (this.form.invalid) {
      return;
    } else {
     this.close.emit(this.form.value) ;
     this.swalAlertService.openSuccessToast();
     this.modal.hide();
    }
  }
  private buildForm() {
    this.form = this.formBuider.group({
      requestContent: [undefined],
      requestCustomer: [undefined],
      requestField: [undefined],
      requestProblem: [undefined],
      partDamaged: [undefined],
      phenomenaDamaged: [undefined],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
