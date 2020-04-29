import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { ImportVinAffectedByCampaignApi } from '../../../api/master-data/import/import-vin-affected-by-campaign.api';
import { ToastService } from '../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'import-data-survey',
  templateUrl: './import-data-survey.component.html',
  styleUrls: ['./import-data-survey.component.scss']
})
export class ImportDataSurveyComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight;


  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private setModalHeight: SetModalHeightService,
    private importVinAffectedByCampaignApi: ImportVinAffectedByCampaignApi,
  ) {
  }

  ngOnInit() {
  }

  open() {
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  reset() {
    this.form = undefined;
  }

  apiCallUpload(val) {
    return this.importVinAffectedByCampaignApi.importVinAffected(val);
  }

  uploadSuccess() {
    this.swalAlertService.openSuccessToast();
  }

  uploadFail(error) {
    this.swalAlertService.openFailToast(error.message, 'Import Error');
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      surveyResult: [undefined],
    });
  }
}
