import { Component, OnInit } from '@angular/core';
import { ServiceKpiDataModel } from '../../../core/models/service-kpi-data/service-kpi-data.model';
import { PartImportedModel } from '../../../core/models/parts-management/parts-info-management.model';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { PartsInfoManagementApi } from '../../../api/parts-management/parts-info-management.api';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'input-format-before-sale',
  templateUrl: './input-format-before-sale.component.html',
  styleUrls: ['./input-format-before-sale.component.scss']
})
export class InputFormatBeforeSaleComponent implements OnInit {
  processingInfo: Array<string> = [];
  fieldGrid;
  gridParams;
  selectedRowGrid: ServiceKpiDataModel;
  uploadedData: Array<PartImportedModel>;


  constructor(
    private setModalHeightService: SetModalHeightService,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private gridTableService: GridTableService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Trạng thái Import', headerTooltip: 'Trạng thái Import', field: 'importStatus', minWidth: 100},
      {headerName: 'Lệnh sửa chữa', headerTooltip: 'Lệnh sửa chữa', field: 'isRepair', minWidth: 100},
      {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'licensePlates', minWidth: 80},
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'isCVDV', minWidth: 80},
      {headerName: 'Ngày vào', headerTooltip: 'Ngày vào', field: 'inputDate', minWidth: 80},
      {headerName: 'Ngày quyết toán', headerTooltip: 'Ngày quyết toán', field: 'settlementDate', minWidth: 100},
      {headerName: 'Nguồn gốc', headerTooltip: 'Nguồn gốc', field: 'isRoots', minWidth: 80},
      {headerName: 'Mẫu xe', headerTooltip: 'Mẫu xe', field: 'carModel', minWidth: 80},
      {headerName: 'Mã kiểu xe', headerTooltip: 'Mã kiểu xe', field: 'codeCarType', minWidth: 80},
      {headerName: 'Số Vin', headerTooltip: 'Số Vin', field: 'isVin', minWidth: 80},
      {headerName: 'Ngày bán xe', headerTooltip: 'Ngày bán xe', field: 'sellCarDate', minWidth: 80},
      {headerName: 'Số Km', headerTooltip: 'Số Km', field: 'isKM', minWidth: 80},
      {headerName: 'ND công việc', headerTooltip: 'ND công việc', field: 'workContent', minWidth: 80},
      {headerName: 'Giờ bắt đầu sửa chữa', headerTooltip: 'Giờ bắt đầu sửa chữa', field: 'startTime', minWidth: 100},
      {headerName: 'Giờ kết thúc công việc', headerTooltip: 'Giờ kết thúc công việc', field: 'endTime', minWidth: 100},
      {headerName: 'Tổng thời gian sửa chữa', headerTooltip: 'Tổng thời gian sửa chữa', field: 'totalTime', minWidth: 120},
      {headerName: 'Tên chủ xe', headerTooltip: 'Tên chủ xe', field: 'carOwnerName', minWidth: 120},
      {headerName: 'Tên công ty', headerTooltip: 'Tên công ty', field: 'companyName', minWidth: 120},
      {headerName: 'Số điện thoại chủ xe', headerTooltip: 'Số điện thoại chủ xe', field: 'carOwnerPhone', minWidth: 80},
      {headerName: 'Địa chỉ chủ xe', headerTooltip: 'Địa chỉ chủ xe', field: 'carOwnerAddress', minWidth: 150},
      {headerName: 'Quận/Huyện', headerTooltip: 'Quận/Huyện', field: 'isDistrict', minWidth: 120},
      {headerName: 'Tỉnh/Thành', headerTooltip: 'Tỉnh/Thành', field: 'isCity', minWidth: 120},
      {headerName: 'Tên người liên hệ', headerTooltip: 'Tên người liên hệ', field: 'contactName', minWidth: 120},
      {headerName: 'Số điện thoại người liên hệ', headerTooltip: 'Số điện thoại người liên hệ', field: 'contactPhone', minWidth: 80},
      {headerName: 'Phân loại khách hàng', headerTooltip: 'Phân loại khách hàng', field: 'classifyKH', minWidth: 80},
      {headerName: 'Lần bảo dưỡng tiếp theo', headerTooltip: 'Lần bảo dưỡng tiếp theo', field: 'nextMaintenance', minWidth: 80},
      {headerName: 'Bảo dưỡng', headerTooltip: 'Bảo dưỡng', field: 'isMaintenance', minWidth: 80},
      {headerName: 'Sửa chữa', headerTooltip: 'Sửa chữa', field: 'isRepair', minWidth: 80},
      {headerName: 'Bảo hành GJ', headerTooltip: 'Bảo hành GJ', field: 'guaranteeGJ', minWidth: 80},
      {headerName: 'Nội bộ GJ', headerTooltip: 'Nội bộ GJ', field: 'internalGJ', minWidth: 150},
      {headerName: 'Thân và vỏ sơn', headerTooltip: 'Thân và vỏ sơn', field: 'paintSell', minWidth: 80},
      {headerName: 'Bảo hành BP', headerTooltip: 'Bảo hành BP', field: 'guaranteeBP', minWidth: 80},
      {headerName: 'Nội bộ BP', headerTooltip: 'Nội bộ BP', field: 'internalBP', minWidth: 80},
      {headerName: 'Chăm sóc/Làm đẹp xe', headerTooltip: 'Chăm sóc/Làm đẹp xe', field: 'makeupCar', minWidth: 80},
      {headerName: 'Lắp phụ kiện', headerTooltip: 'Lắp phụ kiện', field: 'fittingAccessories', minWidth: 80},
      {headerName: 'Khách hàng trả tiền', headerTooltip: 'Khách hàng trả tiền', field: 'customersPay', minWidth: 80},
      {headerName: 'Sử dụng phiếu quà tặng', headerTooltip: 'Sử dụng phiếu quà tặng', field: 'cardContent', minWidth: 80},
      {headerName: 'KTV', headerTooltip: 'KTV', field: 'isKTV', minWidth: 80},
      {headerName: 'Nhóm KTV', headerTooltip: 'Nhóm KTV', field: 'groupKTV', minWidth: 80},
      {headerName: 'Sửa chữa chung', headerTooltip: 'Sửa chữa chung', field: 'generalRepair', minWidth: 80},
      {headerName: 'Thân vỏ', headerTooltip: 'Thân vỏ', field: 'isBody', minWidth: 80},
      {headerName: 'Sơn', headerTooltip: 'Sơn', field: 'isPaint', minWidth: 80},
      {headerName: 'Công thuê ngoài', headerTooltip: 'Công thuê ngoài', field: 'publicOutsourcing', minWidth: 80},
      {headerName: 'Vật tư phụ', headerTooltip: 'Vật tư phụ', field: 'suppliesExtra', minWidth: 80},
      {headerName: 'Vật tư sơn', headerTooltip: 'Vật tư sơn', field: 'suppliesPaint', minWidth: 80},
      {headerName: 'Phụ tùng có mã KP', headerTooltip: 'Phụ tùng có mã KP', field: 'isCodeKP', minWidth: 80},
      {headerName: 'Phụ tùng SCC', headerTooltip: 'Phụ tùng SCC', field: 'accessorySCC', minWidth: 80},
      {headerName: 'Phụ tùng thân vỏ', headerTooltip: 'Phụ tùng thân vỏ', field: 'accessoryBody', minWidth: 80},
      {headerName: 'Dầu máy', headerTooltip: 'Dầu máy', field: 'isDiesel', minWidth: 80},
      {headerName: 'Dầu và hóa chất khác', headerTooltip: 'Dầu và hóa chất khác', field: 'isChemistry', minWidth: 120},
      {headerName: 'Phụ tùng có mã khác', headerTooltip: 'Phụ tùng có mã khác', field: 'codeAccessory', minWidth: 80},
      {headerName: 'Phụ kiện chính hiệu', headerTooltip: 'Phụ kiện chính hiệu', field: 'isAccessories', minWidth: 120},
      {headerName: 'Phụ tùng không chính hiệu', headerTooltip: 'Phụ tùng không chính hiệu', field: 'notGenuine', minWidth: 120},
      {headerName: 'Phụ kiện không chính hiệu', headerTooltip: 'Phụ kiện không chính hiệu', field: 'notAccessoriesGenuine', minWidth: 120},
      {headerName: 'Trước giảm giá', headerTooltip: 'Trước giảm giá', field: 'beforeSale', minWidth: 80},
      {headerName: 'Sau giảm giá', headerTooltip: 'Sau giảm giá', field: 'afterSale', minWidth: 80},
      {headerName: 'Tổng doanh thu sau VAT', headerTooltip: 'Tổng doanh thu sau VAT', field: 'afterVAT', minWidth: 120},
      {headerName: 'Công bảo hành', headerTooltip: 'Công bảo hành', field: 'isWarranty'},
      {headerName: 'Phụ tùng bảo hành & doanh thu bảo hành khác', headerTooltip: 'Phụ tùng bảo hành & doanh thu bảo hành khác', field: 'otherRevenue', minWidth: 120},
      {headerName: 'Tổng doanh thu bảo hành', headerTooltip: 'Tổng doanh thu bảo hành', field: 'totalRevenue', minWidth: 120},
      {headerName: 'Ngày TMV duyệt bảo hành', headerTooltip: 'Ngày TMV duyệt bảo hành', field: 'isTMVDate', minWidth: 120},
      {headerName: 'Doanh thu bảo dưỡng', headerTooltip: 'Doanh thu bảo dưỡng', field: 'maintenanceRevenue', minWidth: 120},
      {headerName: 'Doanh thu bảo hiểm', headerTooltip: 'Doanh thu bảo hiểm', field: 'insuranceRevenue', minWidth: 120},
      {headerName: 'Doanh thu nội bộ', headerTooltip: 'Doanh thu nội bộ', field: 'internalRevenue', minWidth: 100},
      {headerName: 'Mức độ hư  hỏng', headerTooltip: 'Mức độ hư  hỏng', field: 'expecteddate', minWidth: 80},
      {headerName: 'Giảm giá công lao động', headerTooltip: 'Giảm giá công lao động', field: 'isLabor', minWidth: 80},
      {headerName: 'Giảm giá phụ tùng', headerTooltip: 'Giảm giá phụ tùng', field: 'saleAccessory', minWidth: 80},
      {headerName: 'Tổng', headerTooltip: 'Tổng', field: 'isTotal', minWidth: 80},
      {headerName: 'Doanh thu thực tế', headerTooltip: 'Doanh thu thực tế', field: 'actualRevenue', minWidth: 80},
      {headerName: 'Số hóa đơn', headerTooltip: 'Số hóa đơn', field: 'invoiceNumber', minWidth: 80},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'isNote', minWidth: 150},
    ];
  }

  apiCallUpload(val) {
    return this.partsInfoManagementApi.importPartsInfo(val);
  }

  uploadSuccess(response) {
    this.uploadedData = response.Success;
    this.gridParams.api.setRowData(this.gridTableService.addSttToData(this.uploadedData));
    this.processingInfo = ['Import dữ liệu thành công'];
  }

  uploadFail(error) {
    this.processingInfo = error;
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
}
