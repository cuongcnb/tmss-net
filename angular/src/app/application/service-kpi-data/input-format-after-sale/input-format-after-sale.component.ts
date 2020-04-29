import { Component, OnInit } from '@angular/core';
import { PartImportedModel } from '../../../core/models/parts-management/parts-info-management.model';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { PartsInfoManagementApi } from '../../../api/parts-management/parts-info-management.api';
import { ServiceKpiDataModel } from '../../../core/models/service-kpi-data/service-kpi-data.model';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'input-format-after-sale',
  templateUrl: './input-format-after-sale.component.html',
  styleUrls: ['./input-format-after-sale.component.scss']
})
export class InputFormatAfterSaleComponent implements OnInit {
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
      {headerName: 'Lệnh sửa chữa', headerTooltip: 'Lệnh sửa chữa', field: 'isRepair', minWidth: 130},
      {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'licensePlates', minWidth: 100},
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'isCVDV', minWidth: 100},
      {headerName: 'Ngày vào', headerTooltip: 'Ngày vào', field: 'inputDate', minWidth: 120},
      {headerName: 'Ngày quyết toán', headerTooltip: 'Ngày quyết toán', field: 'settlementDate', minWidth: 120},
      {headerName: 'Nguồn gốc', headerTooltip: 'Nguồn gốc', field: 'isRoots', minWidth: 120},
      {headerName: 'Mẫu xe', headerTooltip: 'Mẫu xe', field: 'carModel', minWidth: 100},
      {headerName: 'Mã kiểu xe', headerTooltip: 'Mã kiểu xe', field: 'codeCarType', minWidth: 100},
      {headerName: 'Số Vin', headerTooltip: 'Số Vin', field: 'isVin', minWidth: 100},
      {headerName: 'Ngày bán xe', headerTooltip: 'Ngày bán xe', field: 'sellCarDate', minWidth: 100},
      {headerName: 'Số Km', headerTooltip: 'Số Km', field: 'isKM', minWidth: 100},
      {headerName: 'ND công việc', headerTooltip: 'ND công việc', field: 'workContent', minWidth: 100},
      {headerName: 'Giờ bắt đầu sửa chữa', headerTooltip: 'Giờ bắt đầu sửa chữa', field: 'startTime', minWidth: 100},
      {headerName: 'Giờ kết thúc công việc', headerTooltip: 'Giờ kết thúc công việc', field: 'endTime', minWidth: 100},
      {headerName: 'Tổng thời gian sửa chữa', headerTooltip: 'Tổng thời gian sửa chữa', field: 'totalTime', minWidth: 100},
      {headerName: 'Tên chủ xe', headerTooltip: 'Tên chủ xe', field: 'carOwnerName', minWidth: 120},
      {headerName: 'Tên công ty', headerTooltip: 'Tên công ty', field: 'companyName', minWidth: 120},
      {headerName: 'Số điện thoại chủ xe', headerTooltip: 'Số điện thoại chủ xe', field: 'carOwnerPhone', minWidth: 100, cellClass: ['cell-border', 'text-right']},
      {headerName: 'Địa chỉ chủ xe', headerTooltip: 'Địa chỉ chủ xe', field: 'carOwnerAddress', minWidth: 130},
      {headerName: 'Quận/Huyện', headerTooltip: 'Quận/Huyện', field: 'isDistrict', minWidth: 130},
      {headerName: 'Tỉnh/Thành', headerTooltip: 'Tỉnh/Thành', field: 'isCity', minWidth: 130},
      {headerName: 'Tên người liên hệ', headerTooltip: 'Tên người liên hệ', field: 'contactName', minWidth: 100},
      {headerName: 'Số điện thoại người liên hệ', headerTooltip: 'Số điện thoại người liên hệ', field: 'contactPhone', minWidth: 100, cellClass: ['cell-border', 'text-right']},
      {headerName: 'Phân loại khách hàng', headerTooltip: 'Phân loại khách hàng', field: 'classifyKH', minWidth: 100},
      {headerName: 'Lần bảo dưỡng tiếp theo', headerTooltip: 'Lần bảo dưỡng tiếp theo', field: 'nextMaintenance', minWidth: 100},
      {headerName: 'Bảo dưỡng', headerTooltip: 'Bảo dưỡng', field: 'isMaintenance', minWidth: 100},
      {headerName: 'Sửa chữa', headerTooltip: 'Sửa chữa', field: 'isRepair', minWidth: 100},
      {headerName: 'Bảo hành GJ', headerTooltip: 'Bảo hành GJ', field: 'guaranteeGJ', minWidth: 100},
      {headerName: 'Nội bộ GJ', headerTooltip: 'Nội bộ GJ', field: 'internalGJ', minWidth: 100},
      {headerName: 'Thân và vỏ sơn', headerTooltip: 'Thân và vỏ sơn', field: 'paintSell', minWidth: 100},
      {headerName: 'Bảo hành BP', headerTooltip: 'Bảo hành BP', field: 'guaranteeBP', minWidth: 100},
      {headerName: 'Nội bộ BP', headerTooltip: 'Nội bộ BP', field: 'internalBP', minWidth: 100},
      {headerName: 'Chăm sóc/Làm đẹp xe', headerTooltip: 'Chăm sóc/Làm đẹp xe', field: 'makeupCar', minWidth: 100},
      {headerName: 'Lắp phụ kiện', headerTooltip: 'Lắp phụ kiện', field: 'fittingAccessories', minWidth: 100},
      {headerName: 'Khách hàng trả tiền', headerTooltip: 'Khách hàng trả tiền', field: 'customersPay', minWidth: 100},
      {headerName: 'Sử dụng phiếu quà tặng', headerTooltip: 'Sử dụng phiếu quà tặng', field: 'cardContent', minWidth: 100},
      {headerName: 'KTV', headerTooltip: 'KTV', field: 'isKTV', minWidth: 100},
      {headerName: 'Nhóm KTV', headerTooltip: 'Nhóm KTV', field: 'groupKTV', minWidth: 100},
      {headerName: 'Sửa chữa chung', headerTooltip: 'Sửa chữa chung', field: 'generalRepair', minWidth: 100},
      {headerName: 'Thân vỏ', headerTooltip: 'Thân vỏ', field: 'isBody', minWidth: 100},
      {headerName: 'Sơn', headerTooltip: 'Sơn', field: 'isPaint', minWidth: 100},
      {headerName: 'Công thuê ngoài', headerTooltip: 'Công thuê ngoài', field: 'publicOutsourcing', minWidth: 100},
      {headerName: 'Vật tư phụ', headerTooltip: 'Vật tư phụ', field: 'suppliesExtra', minWidth: 100},
      {headerName: 'Vật tư sơn', headerTooltip: 'Vật tư sơn', field: 'suppliesPaint', minWidth: 100},
      {headerName: 'Phụ tùng có mã KP', headerTooltip: 'Phụ tùng có mã KP', field: 'isCodeKP', minWidth: 100},
      {headerName: 'Phụ tùng SCC', headerTooltip: 'Phụ tùng SCC', field: 'accessorySCC', minWidth: 100},
      {headerName: 'Phụ tùng thân vỏ', headerTooltip: 'Phụ tùng thân vỏ', field: 'accessoryBody', minWidth: 100},
      {headerName: 'Dầu máy', headerTooltip: 'Dầu máy', field: 'isDiesel', minWidth: 100},
      {headerName: 'Dầu và hóa chất khác', headerTooltip: 'Dầu và hóa chất khác', field: 'isChemistry', minWidth: 100},
      {headerName: 'Phụ tùng có mã khác', headerTooltip: 'Phụ tùng có mã khác', field: 'codeAccessory', minWidth: 100},
      {headerName: 'Phụ kiện chính hiệu', headerTooltip: 'Phụ kiện chính hiệu', field: 'isAccessories', minWidth: 100},
      {headerName: 'Phụ tùng không chính hiệu', headerTooltip: 'Phụ tùng không chính hiệu', field: 'notGenuine', minWidth: 100},
      {headerName: 'Phụ kiện không chính hiệu', headerTooltip: 'Phụ kiện không chính hiệu', field: 'notAccessoriesGenuine', minWidth: 100},
      {headerName: 'Trước giảm giá', headerTooltip: 'Trước giảm giá', field: 'beforeSale', minWidth: 100, cellClass: ['cell-border', 'text-right']},
      {headerName: 'Sau giảm giá', headerTooltip: 'Sau giảm giá', field: 'afterSale', minWidth: 100, cellClass: ['cell-border', 'text-right']},
      {headerName: 'Tổng doanh thu sau VAT', headerTooltip: 'Tổng doanh thu sau VAT', field: 'afterVAT', minWidth: 100, cellClass: ['cell-border', 'text-right']},
      {headerName: 'Công bảo hành', headerTooltip: 'Công bảo hành', field: 'isWarranty', minWidth: 100},
      {headerName: 'Phụ tùng bảo hành & doanh thu bảo hành khác', headerTooltip: 'Phụ tùng bảo hành & doanh thu bảo hành khác', field: 'otherRevenue', minWidth: 150},
      {headerName: 'Tổng doanh thu bảo hành', headerTooltip: 'Tổng doanh thu bảo hành', field: 'totalRevenue', minWidth: 100, cellClass: ['cell-border', 'text-right']},
      {headerName: 'Ngày TMV duyệt bảo hành', headerTooltip: 'Ngày TMV duyệt bảo hành', field: 'isTMVDate', minWidth: 100},
      {headerName: 'Doanh thu bảo dưỡng', headerTooltip: 'Doanh thu bảo dưỡng', field: 'maintenanceRevenue', minWidth: 100},
      {headerName: 'Doanh thu bảo hiểm', headerTooltip: 'Doanh thu bảo hiểm', field: 'insuranceRevenue', minWidth: 100},
      {headerName: 'Doanh thu nội bộ', headerTooltip: 'Doanh thu nội bộ', field: 'internalRevenue', minWidth: 100},
      {headerName: 'Mức độ hư  hỏng', headerTooltip: 'Mức độ hư  hỏng', field: 'expecteddate', minWidth: 120},
      {headerName: 'Giảm giá công lao động', headerTooltip: 'Giảm giá công lao động', field: 'isLabor', minWidth: 120},
      {headerName: 'Giảm giá phụ tùng', headerTooltip: 'Giảm giá phụ tùng', field: 'saleAccessory', minWidth: 120, cellClass: ['cell-border', 'text-right']},
      {headerName: 'Tổng', headerTooltip: 'Tổng', field: 'isTotal', minWidth: 100, cellClass: ['cell-border', 'text-right']},
      {headerName: 'Doanh thu thực tế', headerTooltip: 'Doanh thu thực tế', field: 'actualRevenue', minWidth: 100},
      {headerName: 'Số hóa đơn', headerTooltip: 'Số hóa đơn', field: 'invoiceNumber', minWidth: 100},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'isNote', minWidth: 150},
    ];
  }

  reset() {
    this.processingInfo = [];
    this.gridParams.api.setRowData([]);
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
