import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SalesTeamSevice} from '../../../../../api/dlr-master-data/sales-team.sevice';
import {LoadingService} from '../../../../../shared/loading/loading.service';
import {GlobalValidator} from '../../../../../shared/form-validation/validators';
import {SalesGroupService} from '../../../../../api/dlr-master-data/sales-group.service';
import {SetModalHeightService} from '../../../../../shared/common-service/set-modal-height.service';
import {ToastService} from '../../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sales-team-modal',
  templateUrl: './sales-team-modal.component.html',
  styleUrls: ['./sales-team-modal.component.scss']
})
export class SalesTeamModalComponent implements OnInit {
  @ViewChild('teamListModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  salesGroupModel;
  salesTeamModel;
  groupId: number;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private groupService: SalesGroupService,
    private setModalHeightService: SetModalHeightService,
    private salesTeamService: SalesTeamSevice,
    private swalAlertService: ToastService
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(groupId?: number, selectedData?) {
    this.salesGroupModel = selectedData;
    this.groupId = groupId;
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
    this.loadingService.setDisplay(true);
    const value = Object.assign({}, this.form.value, {
      salesGroupId: this.groupId
    });

    const apiCall = !this.salesTeamModel ?
      this.salesTeamService.createSalesTeam(value) : this.salesTeamService.updateSalesTeam(value);
    apiCall.subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
      this.close.emit();
      this.modal.hide();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      teamName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(255)])],
      reportName: [undefined, GlobalValidator.maxLength(100)],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      status: ['Y'],
      managerName: [undefined, GlobalValidator.maxLength(100)],
      description: [undefined, GlobalValidator.maxLength(255)],
    });
    if (this.salesGroupModel) {
      this.form.patchValue(this.salesGroupModel);
    }
  }

}
