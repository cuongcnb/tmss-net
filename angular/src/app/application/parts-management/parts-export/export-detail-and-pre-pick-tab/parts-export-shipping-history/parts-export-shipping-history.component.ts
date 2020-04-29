import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { GridTableService } from '../../../../../shared/common-service/grid-table.service';
import { DataFormatService } from '../../../../../shared/common-service/data-format.service';
import { PartsExportPartDetailShipping } from '../../../../../core/models/parts-management/parts-export.model';

import { StatusColor, StatusColorLabel } from '../../../status-color.enum';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-export-shipping-history',
  templateUrl: './parts-export-shipping-history.component.html',
  styleUrls: ['./parts-export-shipping-history.component.scss'],
})
export class PartsExportShippingHistoryComponent implements OnInit, OnChanges {
  @Input() tabDisplay: boolean;
  @Input() partShippingHistory: PartsExportPartDetailShipping;
  fieldGrid;
  params;
  selectedData;

  constructor(
    private gridTableService: GridTableService,
    private dataFormatService: DataFormatService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.patchData();
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 80,
      },
      {
        headerName: 'Xuất vào lúc',
        headerTooltip: 'Xuất vào lúc',
        field: 'createDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
      },
      {
        headerName: 'Vị trí',
        headerTooltip: 'Vị trí',
        field: 'locationno',
      },
      {
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        field: 'qty',
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value),
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'shippingStatusName',
        cellStyle: params => this.backgroundColorForGrid(params)
      },
    ];
  }

  backgroundColorForGrid(params) {
    if (params.data.color && params.data.color.shippingStatusName) {
      switch (params.data.color.shippingStatusName) {
        case StatusColorLabel.PREPICK:
          return { 'background-color': `${StatusColor.PREPICK} !important` };
        case StatusColorLabel.PREPICK_OLD:
          return { 'background-color': `${StatusColor.CANCEL_PREPICK_OLD} !important` };
        case StatusColorLabel.CANCEL_PREPICK:
          return { 'background-color': `${StatusColor.CANCEL_PREPICK} !important` };
        case StatusColorLabel.CANCEL_PREPICK_OLD:
          return { 'background-color': `${StatusColor.CANCEL_PREPICK_OLD} !important` };
        case StatusColorLabel.COMPLETE:
          return { 'background-color': `${StatusColor.COMPLETE} !important` };
        case StatusColorLabel.RETURN:
          return { 'background-color': `${StatusColor.RETURN} !important` };
      }
    }
    return {};
  }

  callbackGrid(params) {
    this.params = params;
    this.patchData();
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  patchData() {
    if (this.params && this.partShippingHistory) {
      this.params.api.setRowData(this.gridTableService.addSttToData(this.partShippingHistory));
    }
  }
}
