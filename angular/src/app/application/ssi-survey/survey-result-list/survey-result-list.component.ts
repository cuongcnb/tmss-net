import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { SsiSurveyModel } from '../../../core/models/ssi-survey/ssi-survey.model';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'survey-result-list',
  templateUrl: './survey-result-list.component.html',
  styleUrls: ['./survey-result-list.component.scss'],
})
export class SurveyResultListComponent implements OnInit {
  @Input() csiResult: boolean;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Output() detailData;
  form: FormGroup;
  surveyResultList: Array<any>;
  gridParams;
  dataTest: Array<any>;
  selectedData: SsiSurveyModel;
  displayedData;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private gridTableService: GridTableService,
    private dataFormatService: DataFormatService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.surveyResultList = [
      {headerName: 'Tên khách hàng', headerTooltip: 'Tên khách hàng', field: 'customerName'},
      {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'customerAdd'},
      {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'phoneNumber'},
      {headerName: 'Người liên hệ', headerTooltip: 'Người liên hệ', field: 'contactName'},
      {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'contactPhoneNumber', cellClass: ['cell-readonly', 'cell-border', 'text-right']},
      {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'agency'},
      {
        headerName: 'Ngày tạo',
        headerTooltip: 'Ngày tạo',
        field: 'dayCreateQuestion',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Ngày khảo sát',
        headerTooltip: 'Ngày khảo sát',
        field: 'daySurvey',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
    ];
    this.dataTest = [
      {
        customerName: 'Nguyễn Văn Hạnh',
        customerAdd: 'Hà Nội',
        phoneNumber: '0164888988',
        contactName: 'Nguyễn Văn Hạnh',
        contactPhoneNumber: '0164888988',
        agency: 'Toyota Thanh Xuân',
        dayCreateQuestion: '02/01/2018',
        daySurvey: '02/01/2018',
      },
      {
        customerName: 'Nguyễn Văn Hạnh',
        customerAdd: 'Thành Phố Hồ Chí Minh',
        phoneNumber: '0164888988',
        contactName: 'Nguyễn Văn Hạnh',
        contactPhoneNumber: '0164888988',
        agency: 'Toyota Bến Thành',
        dayCreateQuestion: '11/01/2018',
        daySurvey: '01/01/2018',
      },
    ];
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dayIn: [undefined],
      dayOut: [undefined],
      agency: [undefined],
      searchCondition: [undefined],
    });
  }

  callBackGridSurveyResultList(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParamsSurveyResultList() {
    const selectData = this.gridParams.api.getSelectedRows();
    if (selectData) {
      this.selectedData = selectData[0];
    }
    this.getDisplayedData();
  }

  searchResult() {
    if (!this.form.get('dayIn').value || !this.form.get('dayOut').value) {
      this.swalAlertService.openFailToast('Chưa chọn ngày', 'Thất bại');
    } else {
      this.gridParams.api.setRowData(this.dataTest);
    }
  }

  getDataBatch(params) {
    this.form.controls.dayIn.patchValue(params);
    this.form.controls.dayOut.patchValue(params);

  }

  updateData(data) {
    const index = this.displayedData.indexOf(this.selectedData);
    this.displayedData[index] = Object.assign(data, {
      customerName: data.customerName,
      customerAdd: data.customerAdd,
      phoneNumber: data.phoneNumber,
      contactName: data.contactName,
      contactPhoneNumber: data.contactPhoneNumber,
      agency: data.agency,
      dayCreateQuestion: data.dayCreateQuestion,
      daySurvey: data.daySurvey,
    });
    this.gridParams.api.setRowData(this.gridTableService.addSttToData(this.displayedData));
    this.getDisplayedData();
  }

  getDisplayedData() {
    const displayedData = [];
    this.gridParams.api.forEachNode(node => {
      displayedData.push(node.data);
    });
    this.displayedData = displayedData;
  }
}
