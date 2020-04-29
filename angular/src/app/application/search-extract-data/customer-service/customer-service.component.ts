import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchExtractDataModel } from '../../../core/models/search-extract-data/search-extract-data.model';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'customer-service',
  templateUrl: './customer-service.component.html',
  styleUrls: ['./customer-service.component.scss'],
})
export class CustomerServiceComponent implements OnInit {
  fieldGrid;
  form: FormGroup;
  gridParams;
  selectedRowGrid: SearchExtractDataModel;
  data = [
    {
      saleConsultant: 'Test1',
      dealDate: 'Test1',
      errorModel: 'Test1',
      errorVin: 'Test1',
      licensePlates: 'Test1',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private gridTableService: GridTableService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'Thông tin xe', headerTooltip: 'Thông tin xe', children: [
          {headerName: 'Tư vấn bán hàng', headerTooltip: 'Tư vấn bán hàng', field: 'saleConsultant'},
          {headerName: 'Ngày giao xe', headerTooltip: 'Ngày giao xe', field: 'dealDate'},
          {headerName: 'Model', headerTooltip: 'Model', field: 'errorModel'},
          {headerName: 'Vin', headerTooltip: 'Vin', field: 'errorVin'},
          {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'licensePlates'},
        ],
      },
      {
        headerName: 'Thông tin khách hàng', headerTooltip: 'Thông tin khách hàng', children: [
          {
            headerName: 'Thông tin chủ xe', headerTooltip: 'Thông tin chủ xe', children: [
              {headerName: 'Tên chủ xe', headerTooltip: 'Tên chủ xe', field: 'isName'},
              {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'isAddress'},
              {headerName: 'Điện thoại', headerTooltip: 'Điện thoại', field: 'isPhone'},
              {headerName: 'Email chủ xe', headerTooltip: 'Email chủ xe', field: 'isEmail'},
              {headerName: 'Quận/ huyện', headerTooltip: 'Quận/ huyện', field: 'isDistrict'},
              {headerName: 'Tỉnh/ TP', headerTooltip: 'Tỉnh/ TP', field: 'isCity'},
            ],
          },
          {
            headerName: 'Thông tin công ty', headerTooltip: 'Thông tin công ty', children: [
              {headerName: 'Tên công ty', headerTooltip: 'Tên công ty', field: 'companyName'},
              {headerName: 'Địa chỉ công ty', headerTooltip: 'Địa chỉ công ty', field: 'companyAddress'},
              {headerName: 'Điện thoại công ty', headerTooltip: 'Điện thoại công ty', field: 'companyPhone'},
              {headerName: 'Email công ty', headerTooltip: 'Email công ty', field: 'companyEmail'},
            ],
          },
          {
            headerName: 'Thông tin lái xe', headerTooltip: 'Thông tin lái xe', children: [
              {headerName: 'Người mang xe', headerTooltip: 'Người mang xe', field: 'isDriver'},
              {headerName: 'Địa chỉ lái xe', headerTooltip: 'Địa chỉ lái xe', field: 'driverAddress'},
              {headerName: 'Điện thoại lái xe', headerTooltip: 'Điện thoại lái xe', field: 'driverPhone'},
              {headerName: 'Email lái xe', headerTooltip: 'Email lái xe', field: 'driverEmail'},
            ],
          },
          {
            headerName: 'Thông tin liên hệ', headerTooltip: 'Thông tin liên hệ', children: [
              {headerName: 'Người liên hệ', headerTooltip: 'Người liên hệ', field: 'errorContact'},
              {headerName: 'Địa chỉ liên hệ', headerTooltip: 'Địa chỉ liên hệ', field: 'contactAddress'},
              {headerName: 'Điện thoại liên hệ', headerTooltip: 'Điện thoại liên hệ', field: 'contactPhone'},
              {headerName: 'Email liên hệ', headerTooltip: 'Email liên hệ', field: 'contactEmail'},
            ],
          },
        ],
      },
      {
        headerName: 'Thông tin liên hệ', headerTooltip: 'Thông tin liên hệ', children: [
          {headerName: 'Ngày liên hệ dự kiến', headerTooltip: 'Ngày liên hệ dự kiến', field: 'expectedDate'},
          {headerName: 'Ngày liên hệ thực tế', headerTooltip: 'Ngày liên hệ thực tế', field: 'dayReality'},
          {headerName: 'Loại hình liên lạc', headerTooltip: 'Loại hình liên lạc', field: 'contactType'},
          {headerName: 'Nội dung liên lạc', headerTooltip: 'Nội dung liên lạc', field: 'contentCall'},
          {headerName: 'Kết quả cuộc gọi', headerTooltip: 'Kết quả cuộc gọi', field: 'resultContact'},
          {headerName: 'Lý do', headerTooltip: 'Lý do', field: 'errorReason'},
          {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'isNote'},
          {headerName: 'Ghi chú không quay lại', headerTooltip: 'Ghi chú không quay lại', field: 'noteReason'},
          {headerName: 'Lý do không quay lại', headerTooltip: 'Lý do không quay lại', field: 'reasonKH'},
          {headerName: 'Mốc bảo dưỡng đã nhắc', headerTooltip: 'Mốc bảo dưỡng đã nhắc', field: 'nextBD'},
          {headerName: 'Người thực hiện cuộc gọi', headerTooltip: 'Người thực hiện cuộc gọi', field: 'callPeople'},
          {headerName: 'Giờ thực hiện cuộc gọi', headerTooltip: 'Giờ thực hiện cuộc gọi', field: 'contactHour'},
          {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'CVDV'},
        ],
      },
      {
        headerName: 'Nội dung dịch vụ ngày quay lại', headerTooltip: 'Nội dung dịch vụ ngày quay lại', children: [
          {headerName: 'Số RO', headerTooltip: 'Số RO', field: 'isRO'},
          {headerName: 'Ngày vào DV', headerTooltip: 'Ngày vào DV', field: 'dateDV'},
          {headerName: 'Ngày ra DV', headerTooltip: 'Ngày ra DV', field: 'dateDVOut'},
          {headerName: 'ND sửa chữa', headerTooltip: 'ND sửa chữa', field: 'repairContent'},
          {headerName: 'Ngày quay lại', headerTooltip: 'Ngày quay lại', field: 'dateComeBack'},
          {headerName: 'Số Km ngày quay lại', headerTooltip: 'Số Km ngày quay lại', field: 'updateKm'},
          {headerName: 'Loại hình dịch vụ', headerTooltip: 'Loại hình dịch vụ', field: 'serviceType'},
          {headerName: 'Cố vấn dịch vụ', headerTooltip: 'Cố vấn dịch vụ', field: 'serviceAdviser'},
          {headerName: 'Kỹ thuật viên', headerTooltip: 'Kỹ thuật viên', field: 'isTechnicians'},
        ],
      },
    ];
    this.buildForm();
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

  selectFirstRow() {
    this.gridTableService.selectFirstRow(this.gridParams);
  }

  search() {
    this.gridParams.api.setRowData(this.data);
    this.selectFirstRow();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      sortAgency: [undefined],
      dateAppointment: [undefined],
      dateAppointmentTo: [undefined],
      fromDateTo: [undefined],
      fromDate: [undefined],
      contactType: [undefined],
      dateNumber: [undefined],
      isList: [undefined],
      typeDV: [undefined],
    });
  }
}
