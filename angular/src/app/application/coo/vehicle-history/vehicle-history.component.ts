import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProgressBrealInfoModel } from '../../../core/models/coo/progress-breal-info.model';
import { VehicleHistoryApi } from '../../../api/vehicle-history/vehicle-history.api';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vehicle-history',
  templateUrl: './vehicle-history.component.html',
  styleUrls: ['./vehicle-history.component.scss'],
})
export class VehicleHistoryComponent implements OnInit {
  form: FormGroup;
  fieldGrid;
  params;
  selectedData: ProgressBrealInfoModel;

  constructor(
    private formBuilder: FormBuilder,
    private vehicleHistory: VehicleHistoryApi,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
  ) {
    this.fieldGrid = [
      {headerName: 'Số RO', headerTooltip: 'Số RO', field: 'repairorderno'},
      {headerName: 'Lý do dừng', headerTooltip: 'Lý do dừng', field: 'reasoncontent'},
      {
        headerName: 'Thời điểm dừng', headerTooltip: 'Thời điểm dừng', field: 'brdate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
      },
      {
        headerName: 'Thời điểm tiếp tục', headerTooltip: 'Thời điểm tiếp tục', field: 'ctdate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
      },
      {headerName: 'GP Khoang', headerTooltip: 'GP Khoang', field: 'freewsflag', valueFormatter: params => (params.value === 'Y') ? 'Có' : 'Không'},
      {headerName: 'Nội dung', headerTooltip: 'Nội dung', field: 'brtype'},
    ];
  }

  ngOnInit() {
    this.buildForm();
  }

  callbackGrid(params) {
    params.api.setRowData();
    this.params = params;
    this.search();
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  search() {
    this.loadingService.setDisplay(true);
    this.vehicleHistory.getVehicleHistory(this.form.value).subscribe(res => {
      this.params.api.setRowData(res);
      this.loadingService.setDisplay(false);
    });

  }

  private buildForm() {
    this.form = this.formBuilder.group({
      fromDate: [this.dataFormatService.formatDate(new Date())],
      toDate: [this.dataFormatService.formatDate(new Date())],
      roType: [2],
    });
  }
}
