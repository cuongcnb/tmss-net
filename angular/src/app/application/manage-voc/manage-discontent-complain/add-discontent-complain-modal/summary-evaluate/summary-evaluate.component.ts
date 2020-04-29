import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ManageDiscontentComplainModel } from '../../../../../core/models/manage-voc/manage-discontent-complain.model';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'summary-evaluate',
  templateUrl: './summary-evaluate.component.html',
  styleUrls: ['./summary-evaluate.component.scss'],
})
export class SummaryEvaluateComponent implements OnInit {

  @Input() manageComplainPotential;
  form: FormGroup;
  fieldGrid;
  gridParams;
  selectedRowData: ManageDiscontentComplainModel;
  documentList: Array<any> = [];

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {headerName: 'Tên file', headerTooltip: 'Tên file', field: 'fileName'},
      {headerName: '#', headerTooltip: '#', field: 'otherOne'},
      {headerName: '#', headerTooltip: '#', field: 'otherTwo'},
    ];
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParams() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.selectedRowData = selected[0];
    }
  }

  apiCallUpload() {

  }

  uploadSuccess(response) {
    this.documentList = response || [];
    this.gridParams.api.setRowData(this.documentList);
  }

  uploadFail(error) {
    this.swalAlertService.openFailToast(error.message, 'Import Error');
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dateFinish: [undefined],
      timeCollectInfo: [undefined],
      timeNotCount: [undefined],
      totalDate: [{value: undefined, disabled: true}],
      evaluateSettlementTimeTrue: [undefined],
      evaluateSettlementTimeFalse: [undefined],
      reasonFail: [undefined],
      //
      contentEXP: [undefined],
      performEXP: [undefined],
      //
      contactSuccess: [undefined],
      contactFail: [undefined],
      satisfied: [undefined],
      reasonSatisfied: [undefined],
      //
      handler: [undefined],
      partRelate: [undefined],
      staffSupport: [undefined],
      necessaryInfo: [undefined],
      reasonFailNecessary: [undefined],
      modifyProcessFull: [undefined],
      reasonFailModify: [undefined],
      summaryFull: [undefined],
      reasonFailSummary: [undefined],
      clarityProblem: [undefined],
      reasonFailClarity: [undefined],
      failSupplierTrue: [undefined],
      failSupplierFalse: [undefined],
      tmvToSupplier: [undefined],
    });

    this.form.get('contactSuccess').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('contactFail').patchValue(false);
      }
    });

    this.form.get('contactFail').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('contactSuccess').patchValue(false);
      }
    });

    this.form.get('failSupplierTrue').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('failSupplierFalse').patchValue(false);
      }
    });

    this.form.get('failSupplierFalse').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('failSupplierTrue').patchValue(false);
      }
    });

    this.form.get('evaluateSettlementTimeTrue').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('evaluateSettlementTimeFalse').patchValue(false);
      }
    });

    this.form.get('evaluateSettlementTimeFalse').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('evaluateSettlementTimeTrue').patchValue(false);
      }
    });
  }
}

