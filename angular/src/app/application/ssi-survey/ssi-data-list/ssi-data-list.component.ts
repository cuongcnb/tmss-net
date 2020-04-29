import { Component, OnInit , Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ssi-data-list',
  templateUrl: './ssi-data-list.component.html',
  styleUrls: ['./ssi-data-list.component.scss']
})
export class SsiDataListComponent implements OnInit {
  @Input() dataList: boolean;
  fieldGridDataList;
  gridParams;
  selectedRowData;
  form: FormGroup;
  dataTest: Array<any>;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGridDataList = [
      {headerName: 'Loại khảo sát', headerTooltip: 'Loại khảo sát', field: 'surveyType'},
      {headerName: 'Cột dữ liệu', headerTooltip: 'Cột dữ liệu', field: 'colData'},
      {headerName: 'Loại dữ liệu', headerTooltip: 'Loại dữ liệu', field: 'dataType'},
      {headerName: 'Tên dữ liệu', headerTooltip: 'Tên dữ liệu', field: 'dataName'},
      {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'node'},
    ];
    this.dataTest = [
      {
        surveyType: 'SSI',
        colData: 'Customer',
        dataType: 'Company',
        dataName: 'Thành Bưởi',
        status: 'Còn hiệu lực',
        node: '',
      }
    ];
  }

  callBackGridDataList(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParamsDataList() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowData = selectedData[0];
    }
  }

  searchData() {
    if (this.form.value.surveyType && this.form.value.colData && this.form.value.dataType) {
      this.gridParams.api.setRowData(this.dataTest);
    } else {
      this.swalAlert.openWarningToast( 'Thất bại');
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      surveyType: [undefined],
      colData: [undefined],
      dataType: [undefined],
    });
  }

  copyData(data) {
    this.gridParams.api.updateRowData({add: [data]});
  }

}
