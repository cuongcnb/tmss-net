import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'follow-order-update-modal',
  templateUrl: './follow-order-update-modal.component.html',
  styleUrls: ['./follow-order-update-modal.component.scss'],
})
export class FollowOrderUpdateModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  gridField;
  gridParams;
  detailData;
  selectedData;
  data: any[] = [
    {
      contactDate: '9/12/2018',
      bookDate: '',
      isInWorkshop: false,
      note: 'ABC',
    },
    {
      contactDate: '1',
      bookDate: '',
      isInWorkshop: true,
      note: 'ABC',
    },
  ];
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private gridTableService: GridTableService,
    private modalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
    this.initGrid();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  private initGrid() {
    this.gridField = [
      {
        headerName: 'Ngày liên hệ',
        headerTooltip: 'Ngày liên hệ',
        field: 'contactDate',
        editable: true,
      },
      {
        headerName: 'Đặt hẹn',
        headerTooltip: 'Đặt hẹn',
        field: 'bookDate',
        editable: true,
      },
      {
        headerName: 'Xe trong xưởng',
        headerTooltip: 'Xe trong xưởng',
        field: 'isInWorkshop',
        editable: true,
        checkboxSelection: true,
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'note',
        editable: true,
      },
    ];
  }

  open(detailData?) {
    this.initGrid();
    this.detailData = detailData;
    this.modal.show();
  }

  callbackGrid(params) {
    this.gridParams = params;
    params.api.setRowData(this.data);
  }

  getParams() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.selectedData = selected[0];
    }
  }

  refresh() {
    this.gridParams.api.setRowData(this.data);
    this.selectedData = undefined;
  }

  addRow() {
    const blankData = {
      name: undefined,
      note: undefined,
      status: 'Y',
    };
    this.gridParams.api.updateRowData({add: [blankData]});
  }

  delRow() {
    this.gridParams.api.updateRowData({remove: [this.selectedData]});
    this.selectedData = undefined;
  }

  save() {
  }

}
