import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { FirCategoryModel } from '../../../core/models/fir-category/fir-category.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'list-errors-fields',
  templateUrl: './list-errors-fields.component.html',
  styleUrls: ['./list-errors-fields.component.scss'],
})
export class ListErrorsFieldsComponent implements OnInit {
  @Input() isAgencyContactQuestions: boolean;
  @ViewChild('errorFieldModal', {static: false}) errorFieldModal;
  form: FormGroup;
  gridParams;
  fieldGrid;
  selectedRowGrid: FirCategoryModel;
  dataGrid = [
    {
      errorName: 'Bộ phận 1',
      errorField: 'Lĩnh vực 1',
      isStatus: 'Hết hiệu lực',
      isSerial: '1',
      isNote: 'Ghi chú 1',
    },
    {
      errorName: 'Bộ phận 2',
      errorField: 'Lĩnh vực 2',
      isStatus: 'Còn hiệu lực',
      isSerial: '2',
      isNote: 'Ghi chú 2',
    },
    {
      errorName: 'Bộ phận 3',
      errorField: 'Lĩnh vực 3',
      isStatus: 'Hết hiệu lực',
      isSerial: '3',
      isNote: 'Ghi chú 3',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Tên bộ phận gây lỗi', headerTooltip: 'Tên bộ phận gây lỗi', field: 'errorName'},
      {headerName: 'Tên lĩnh vực lỗi', headerTooltip: 'Tên lĩnh vực lỗi', field: 'errorField'},
      {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'isStatus'},
      {headerName: 'Thứ tự', headerTooltip: 'Thứ tự', field: 'isSerial', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'Mô tả', headerTooltip: 'Mô tả', field: 'isNote'},
    ];
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
      this.errorFieldModal.open(this.selectedRowGrid);
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

  search() {
    this.swalAlert.openSuccessToast('Cập nhật thành công');
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData(this.dataGrid);
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowGrid = selectedData[0];
    }
  }

  insertData(params) {
    if (this.selectedRowGrid) {
      this.errorFieldModal.open(this.selectedRowGrid);
    }
  }
}
