import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModifyAfterProcessModel } from '../../../core/models/fir/modify-after-process.model';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-after-process',
  templateUrl: './modify-after-process.component.html',
  styleUrls: ['./modify-after-process.component.scss'],
})
export class ModifyAfterProcessComponent implements OnInit {

  @ViewChild('updateMAPModal', {static: false}) modal;
  @ViewChild('lslhModal', {static: false}) lslhModal;
  form: FormGroup;
  fieldGrid;
  addGridParams;
  selectedData: ModifyAfterProcessModel;

  dataSearch = [
    {
      supplier: 'Dại ly 1',
      status: 'dang xu ly',
      code: '015575',
      licensePlate: '29h1-5620',
      driversName: 'HQH',
      dateIn: '14/12/2018',
      dateOut: '18/12/2018',
      lsc: 'full service',
      lscType: 'service type 1',
      serviceAdvisor: 'Htzbos',
      feedBack: 'very good',
      lslh: '15/12/2018',
      // lslh content
      //   'dateContact': '15/12/2018',
      //   'timeContact': '15:20:45',
      //   'contacter': 'Nguyễn Văn Hưng',
      //   'statusContact': 'Thanh cong',
      //   'customerFeedBack': 'Khá tốt',
      //   'reasonContactFail': 'abc',
      //   'reasonNoContact': 'def',
      // phản hồi phòng ban
      feedBacker: '',
      parts: '',
      dateFeedBack: '',
      statusContactCustomer: '',
      reasonNotContact: '',
      explainMisapprehend: '',
      apologizeCustomer: '',
      satisfied: '',
      agreeBack: '',
      dateBack: '',
      timeBack: '',
      notBack: '',
      reasonNotBack: '',
      q1: '',
      q2: '',
      q3: '',
      // Chi tiết lỗi
      errorCode: '',
      coreReason: '',
      preventiveMeasures: '',
      processMeasures: '',
      // thông tin trường hợp sửa chữa lại
      customerComeBack: '',
      dateCustomerBack: '',
      sLSC: '',
      nameResolve: '',
      repairContent: '',
    },
  ];
  lslh = [{
    dateContact: '15/12/2018',
    timeContact: '15:20:45',
    contacter: 'Nguyễn Văn Hưng',
    statusContact: 'Thanh cong',
    customerFeedBack: 'Khá tốt',
    reasonContactFail: '',
    reasonNotContact: '',
  }];

  constructor(
    private formBuilder: FormBuilder,
    private gridTableService: GridTableService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'Thông tin liên hệ',
        headerTooltip: 'Thông tin liên hệ',
        children: [
          {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'supplier'},
          {headerName: 'Tình trạng', headerTooltip: 'Tình trạng', field: 'status'},
          {headerName: 'Mã số', headerTooltip: 'Mã số', field: 'code'},
          {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'licensePlate'},
          {headerName: 'Tên lái xe', headerTooltip: 'Tên lái xe', field: 'driversName'},
          {headerName: 'Ngày vào', headerTooltip: 'Ngày vào', field: 'dateIn'},
          {headerName: 'Ngày ra', headerTooltip: 'Ngày ra', field: 'dateOut'},
          {headerName: 'LSC', headerTooltip: 'LSC', field: 'lsc'},
          {headerName: 'Loại LSC', headerTooltip: 'Loại LSC', field: 'lscType'},
          {headerName: 'Cố vấn dịch vụ', headerTooltip: 'Cố vấn dịch vụ', field: 'serviceAdvisor'},
          {headerName: 'Ý kiến khách hàng', headerTooltip: 'Ý kiến khách hàng', field: 'feedBack'},
          {headerName: 'LSLH', headerTooltip: 'LSLH', field: 'lslh'},
        ],
      },
      {
        headerName: 'Phản hồi của các phòng chuyên môn',
        headerTooltip: 'Phản hồi của các phòng chuyên môn',
        children: [
          {headerName: 'Người phản hồi', headerTooltip: 'Người phản hồi', field: 'feedBackers'},
          {headerName: 'Bộ phận', headerTooltip: 'Bộ phận', field: 'parts'},
          {headerName: 'Ngày phản hồi', headerTooltip: 'Ngày phản hồi', field: 'dateFeedBack'},
          {headerName: 'Tình trạng LH với KH', headerTooltip: 'Tình trạng LH với KH', field: 'statusContactCustomer'},
          {headerName: 'Lý do không liên hệ', headerTooltip: 'Lý do không liên hệ', field: 'reasonNotContact'},
          {headerName: 'Giải thích sự hiểu lầm', headerTooltip: 'Giải thích sự hiểu lầm', field: 'explainMisapprehend'},
          {headerName: 'Xin lỗi KH và mời KH quay lại', headerTooltip: 'Xin lỗi KH và mời KH quay lại', field: 'apologizeCustomer'},
          {headerName: 'Hài lòng', headerTooltip: 'Hài lòng', field: 'satisfied'},
          {headerName: 'Đồng ý quay lại', headerTooltip: 'Đồng ý quay lại', field: 'agreeBack'},
          {headerName: 'Quay lại ngày', headerTooltip: 'Quay lại ngày', field: 'dateBack'},
          {headerName: 'Quay lại giờ', headerTooltip: 'Quay lại giờ', field: 'timeBack'},
          {headerName: 'Không quay lại', headerTooltip: 'Không quay lại', field: 'notBack'},
          {headerName: 'Lý do không quay lại', headerTooltip: 'Lý do không quay lại', field: 'reasonNotBack'},
          {headerName: 'Q1', headerTooltip: 'Q1', field: 'q1'},
          {headerName: 'Q2', headerTooltip: 'Q2', field: 'q2'},
          {headerName: 'Q3', headerTooltip: 'Q3', field: 'q3'},
        ],
      },
      {
        headerName: 'Chi tiết lỗi',
        headerTooltip: 'Chi tiết lỗi',
        children: [
          {headerName: 'Mã lỗi', headerTooltip: 'Mã lỗi', field: 'errorCode'},
          {headerName: 'Nguyên nhân cốt lõi', headerTooltip: 'Nguyên nhân cốt lõi', field: 'coreReason'},
          {headerName: 'Biện pháp chống tái diễn', headerTooltip: 'Biện pháp chống tái diễn', field: 'preventiveMeasures'},
          {headerName: 'Biện pháp xử lý - Tình trạng giải quyết', headerTooltip: 'Biện pháp xử lý - Tình trạng giải quyết', field: 'processMeasures'},
        ],
      },
      {
        headerName: 'Thông tin trường hợp sửa chữa lại',
        headerTooltip: 'Thông tin trường hợp sửa chữa lại',
        children: [
          {headerName: 'Khách hàng CB', headerTooltip: 'Khách hàng CB', field: 'customerComeBack'},
          {headerName: 'Ngày khách hàng quay lại', headerTooltip: 'Ngày khách hàng quay lại', field: 'dateCustomerBack'},
          {headerName: 'Số LSC', headerTooltip: 'Số LSC', field: 'sLSC'},
          {headerName: 'Tên TA giải quyết', headerTooltip: 'Tên TA giải quyết', field: 'nameResolve'},
          {headerName: 'Nội dung sửa chữa lại', headerTooltip: 'Nội dung sửa chữa lại', field: 'repairContent'},
        ],
      },
    ];
    this.buildForm();
  }

  clickLSLH(params) {
    if (params.colDef.field === 'lslh') {
      this.lslhModal.open(this.selectedData);
    }
  }

  selectFirstRow() {
    this.gridTableService.selectFirstRow(this.addGridParams);
  }

  onSubmit() {
  }

  search() {
    this.addGridParams.api.setRowData(this.dataSearch);
    this.selectFirstRow();
  }

  callbackGrid(params) {
    this.addGridParams = params;
    this.addGridParams.api.setRowData();
  }

  getParams() {
    const selected = this.addGridParams.api.getSelectedRows();
    if (selected) {
      this.selectedData = selected[0];
    }
  }

  update() {
    this.modal.open(this.selectedData);
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      dlrId: [undefined],
      status: [undefined],
      code: [undefined],
      LSC: [undefined],
      fromDate: [new Date(year, month, date - 7)],
      toDate: [new Date().getTime()],
      licensePlate: [undefined],
      vin: [undefined],
    });
  }
}
