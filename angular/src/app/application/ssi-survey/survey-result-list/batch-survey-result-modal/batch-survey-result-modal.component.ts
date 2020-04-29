import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, SimpleChanges } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SsiSurveyModel } from '../../../../core/models/ssi-survey/ssi-survey.model';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'batch-survey-result-modal',
  templateUrl: './batch-survey-result-modal.component.html',
  styleUrls: ['./batch-survey-result-modal.component.scss']
})
export class BatchSurveyResultModalComponent implements OnInit, OnChanges {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Input() detailData;
  batchGrid;
  dataTest;
  gridParams;
  selectedRowGrid;
  selectedData: SsiSurveyModel;

  constructor(
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
  ) {
  }

  ngOnInit() {
    this.batchGrid = [
      {
        headerName: 'Từ ngày',
        headerTooltip: 'Từ ngày',
        field: 'dayIn',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'Đến ngày',
        headerTooltip: 'Đến ngày',
        field: 'dayOut',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
    ];
    this.dataTest = [
      {
        dayIn: '01/01/2019',
        dayOut: '03/01/2019',
      },
      {
        dayIn: '04/01/2019',
        dayOut: '07/01/2019',
      },
      {
        dayIn: '08/01/2019',
        dayOut: '11/01/2019',
      },
      {
        dayIn: '11/01/2019',
        dayOut: '12/01/2019',
      }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedData = this.detailData;
  }

  getParamsBatch() {
    const selectData = this.gridParams.api.getSelectedRows();
    if (selectData) {
      this.selectedData = selectData[0];
    }
  }

  callBackGridBatch(params) {
    this.gridParams = params;
    params.api.setRowData(this.dataTest);
  }

  open() {
    this.modal.show();
  }

  save() {
    this.close.emit(this.selectedData);
    this.swalAlertService.openSuccessToast();
    this.modal.hide();
  }

  reset() {
  }

}
