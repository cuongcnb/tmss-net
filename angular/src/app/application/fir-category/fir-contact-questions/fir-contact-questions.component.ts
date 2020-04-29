import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { FirCategoryModel } from '../../../core/models/fir-category/fir-category.model';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fir-contact-questions',
  templateUrl: './fir-contact-questions.component.html',
  styleUrls: ['./fir-contact-questions.component.scss'],
})
export class FirContactQuestionsComponent implements OnInit {
  @Input() isAgencyContactQuestions: boolean;
  @ViewChild('newContactQuestion', {static: false}) newContactQuestion;
  form: FormGroup;
  gridParams;
  fieldGrid;
  selectedRowGrid: FirCategoryModel;
  dataGrid = [
    {
      questionName: 'Câu hỏi 1',
      isStatus: 'Hết hiệu lực',
      isSerial: '1',
      isNote: 'Ghi chú 1',
    },
    {
      questionName: 'Câu hỏi 2',
      isStatus: 'Còn hiệu lực',
      isSerial: '2',
      isNote: 'Ghi chú 2',
    },
    {
      questionName: 'Câu hỏi 3',
      isStatus: 'Hết hiệu lực',
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
      {headerName: 'Tên câu hỏi', headerTooltip: 'Tên câu hỏi', field: 'questionName'},
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
      this.newContactQuestion.open(this.selectedRowGrid);
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
      sortAgency: [undefined],
      questionName: [undefined],
    });
  }
}
