import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { SetModalHeightService } from '../../../../../../shared/common-service/set-modal-height.service';
import { VehicleHistoryApi } from '../../../../../../api/vehicle-history/vehicle-history.api';
import { LoadingService } from '../../../../../../shared/loading/loading.service';
import { DataFormatService } from '../../../../../../shared/common-service/data-format.service';
import { AgCheckboxRendererComponent } from '../../../../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import { GridTableService } from '../../../../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'work-incurred',
  templateUrl: './work-incurred.component.html',
  styleUrls: ['./work-incurred.component.scss'],
})
export class WorkIncurredComponent {
  @ViewChild('modal', {static: false}) modal;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onClose = new EventEmitter<any>();
  modalHeight: number;
  params;
  fieldGrid;
  roId;
  frameworkComponents;

  constructor(private setModalHeightService: SetModalHeightService,
              private vehicleHistoryApi: VehicleHistoryApi,
              private loadingService: LoadingService,
              private dataFormatService: DataFormatService,
              private gridTableService: GridTableService) {
    this.fieldGrid = [
      {headerName: 'KTV báo', headerTooltip: 'KTV báo', field: 'techName'},
      {headerName: 'Người duyệt', headerTooltip: 'Người duyệt', field: 'appempName'},
      {headerName: 'Nội dung phát sinh', headerTooltip: 'Nội dung phát sinh', field: 'reasoncontent', width: 500},
      {
        headerName: 'Thời điểm báo', headerTooltip: 'Thời điểm báo',
        field: 'drdate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
      },
      {headerName: 'Thời gian tăng thêm (phút)', headerTooltip: 'Thời gian tăng thêm (phút)', field: 'extDuration'},
      {
        headerName: 'Duyệt', headerTooltip: 'Duyệt', field: 'sacheck',
        data: ['Y', 'N'],
        cellRenderer: 'agCheckboxRendererComponent',
      },
    ];
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent,
    };
  }

  open(roId) {
    this.roId = roId;
    this.modal.show();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  callbackGrid(params) {
    this.params = params;
    this.loadingService.setDisplay(true);
    this.vehicleHistoryApi.getUnexpectJob(this.roId).subscribe(val => {
      if (val) {
        this.params.api.setRowData(val);
      }
      this.loadingService.setDisplay(false);
    });
  }

  close() {
    const data = this.gridTableService.getAllData(this.params).filter(item => item.sacheck === 'Y');
    if (data && data.length) {
      this.loadingService.setDisplay(true);
      this.vehicleHistoryApi.verifyRequest(data.map(item => item.id)).subscribe(val => {
        this.loadingService.setDisplay(false);
        this.onClose.emit(data);
        this.modal.hide();
      });
    } else {
      this.modal.hide();
    }

  }
}
