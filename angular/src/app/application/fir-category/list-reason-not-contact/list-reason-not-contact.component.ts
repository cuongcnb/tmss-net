import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirCategoryModel } from '../../../core/models/fir-category/fir-category.model';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'list-reason-not-contact',
  templateUrl: './list-reason-not-contact.component.html',
  styleUrls: ['./list-reason-not-contact.component.scss'],
})
export class ListReasonNotContactComponent implements OnInit {
  @ViewChild('notContactModal', {static: false}) notContactModal;
  form: FormGroup;
  gridParams;
  fieldGrid;
  selectedRowGrid: FirCategoryModel;
  dataGrid = [
    {
      isNotContact: 'Lý do 1',
      isValue: '1',
      isStatus: 'Hết hiệu lực',
      isSerial: '1',
      isNote: 'Ghi chú 1',
    },
    {
      isNotContact: 'Lý do 2',
      isValue: '22',
      isStatus: 'Còn hiệu lực',
      isSerial: '2',
      isNote: 'Ghi chú 2',
    },
    {
      isNotContact: 'Lý do 3',
      isValue: '333',
      isStatus: 'Còn hiệu lực',
      isSerial: '3',
      isNote: 'Ghi chú 3',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private gridTableService: GridTableService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Lý do không liên lạc được', headerTooltip: 'Lý do không liên lạc được', field: 'isNotContact'},
      {headerName: 'Giá trị', headerTooltip: 'Giá trị', field: 'isValue'},
      {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'isStatus'},
      {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'isSerial', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'isNote'},
    ];
    this.buildForm();
  }

  refresh() {
    this.selectedRowGrid = undefined;
    this.gridParams.api.setRowData(this.dataGrid);
  }

  addNew(data) {
    this.dataGrid.push(data);
    this.refresh();
  }

  editRow() {
    if (this.selectedRowGrid) {
      this.notContactModal.open(this.selectedRowGrid);
    } else {
      this.swalAlert.openWarningToast('Bạn phải chọn 1 dòng');
    }
  }

  update(selectedData) {
    this.dataGrid = this.dataGrid.map(data => {
      // @ts-ignore
      return data === this.selectedRowGrid ? selectedData : data;
    });
    this.refresh();
  }

  deleteRow() {
    if (this.selectedRowGrid) {
      this.confirm.openConfirmModal('Question?', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        // @ts-ignore
        this.dataGrid = this.dataGrid.filter(data => data !== this.selectedRowGrid);
        this.refresh();
      });
    } else {
      this.swalAlert.openWarningToast('Bạn phải chọn 1 dòng');
    }
  }

  insertData(params) {
    if (this.selectedRowGrid) {
      this.notContactModal.open(this.selectedRowGrid);
    }
  }

  selectFirstRow() {
    this.gridTableService.selectFirstRow(this.gridParams);
  }

  search() {
    this.gridParams.api.setRowData(this.dataGrid);
    this.selectFirstRow();
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowGrid = selectedData[0];
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      isNotContact: [undefined],
    });
  }

}
