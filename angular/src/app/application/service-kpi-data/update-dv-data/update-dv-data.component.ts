import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServiceKpiDataModel } from '../../../core/models/service-kpi-data/service-kpi-data.model';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'update-dv-data',
  templateUrl: './update-dv-data.component.html',
  styleUrls: ['./update-dv-data.component.scss']
})

export class UpdateDvDataComponent implements OnInit {
  @ViewChild('importInvoiceModal', {static: false}) importInvoiceModal;
  @ViewChild('lockRO', {static: false}) lockRO;
  @ViewChild('decisionDate', {static: false}) decisionDate;
  @ViewChild('hideColumnModal', {static: false}) hideColumnModal;
  @Input() isCbu: boolean;
  fieldGrid;
  form: FormGroup;
  gridParams;
  selectedRowGrid: ServiceKpiDataModel;
  dataGrid = [
    {
      numberRepair: '1',
      settlementDate: '',
      serviceAdvisor: 'Cố vấn 1',
      licensePlates: '',
      isCity: 'Hà nội',
      isMaintenance: 'bảo dưỡng 1',
      isKTV: 'KTV1',
      groupKTV: 'Nhóm KTV1',
    },
  ];

  constructor(
    private swalAlert: ToastService,
    private formBuilder: FormBuilder,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'THÔNG TIN CHUNG', headerTooltip: 'THÔNG TIN CHUNG', children: [
          {
            headerName: 'Số lệnh sửa chữa', headerTooltip: 'Số lệnh sửa chữa', field: 'numberRepair', pinned: true, editable: true, minWidth: 100,
            cellClass: ['cell-border', 'cell-readonly' , 'text-right']
          },
          {headerName: 'Ngày quyết toán', headerTooltip: 'Ngày quyết toán', field: 'settlementDate', pinned: true, editable: true, minWidth: 100},
          {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'licensePlates', pinned: true, editable: true, minWidth: 100},
          {headerName: 'Cố vấn dịch vụ', headerTooltip: 'Cố vấn dịch vụ', field: 'serviceAdvisor', pinned: true, editable: true, minWidth: 100}
        ]
      },
      {
        headerName: 'THỜI GIAN SỬA CHỮA', headerTooltip: 'THỜI GIAN SỬA CHỮA', children: [
          {headerName: 'Giờ bắt đầu sửa chữa', headerTooltip: 'Giờ bắt đầu sửa chữa', field: 'startTime', editable: true, minWidth: 100},
          {headerName: 'Giờ kết thúc sửa chữa', headerTooltip: 'Giờ kết thúc sửa chữa', field: 'endTime', editable: true, minWidth: 100},
          {headerName: 'Tổng thời gian sửa chữa', headerTooltip: 'Tổng thời gian sửa chữa', field: 'totalTime', editable: true, minWidth: 100}
        ]
      },
      {
        headerName: 'TỈNH/THÀNH', headerTooltip: 'TỈNH/THÀNH', children: [
          {headerName: 'Tỉnh/thành', headerTooltip: 'Tỉnh/thành', field: 'isCity', editable: true, minWidth: 100},
          {headerName: 'Quận/huyện', headerTooltip: 'Quận/huyện', field: 'isDistrict', editable: true, minWidth: 100}
        ]
      },
      {
        headerName: 'LOẠI HÌNH SỬA CHỮA', headerTooltip: 'LOẠI HÌNH SỬA CHỮA', children: [
          {
            headerName: 'Sửa chữa chung', headerTooltip: 'Sửa chữa chung', children: [
              {headerName: 'Bảo dưỡng', headerTooltip: 'Bảo dưỡng', field: 'isMaintenance', editable: true, minWidth: 100},
              {headerName: 'Sửa chữa', headerTooltip: 'Sửa chữa', field: 'isRepair', editable: true, minWidth: 100},
              {headerName: 'Bảo hành', headerTooltip: 'Bảo hành', field: 'isGuarantee', editable: true, minWidth: 100},
              {headerName: 'Nội bộ', headerTooltip: 'Nội bộ', field: 'isInternal', editable: true, minWidth: 100}
            ]
          },
          {
            headerName: 'Thân vỏ và sơn',
            headerTooltip: 'Thân vỏ và sơn',
            children: [
              {headerName: 'Thân vỏ và sơn', headerTooltip: 'Thân vỏ và sơn', field: 'paintSell', editable: true, minWidth: 100},
              {headerName: 'Bảo hành', headerTooltip: 'Bảo hành', field: 'isGuarantee', editable: true, minWidth: 100},
              {headerName: 'Nội bộ', headerTooltip: 'Nội bộ', field: 'isInternal', editable: true, minWidth: 100}
            ]
          },
          {headerName: 'Chăm sóc/làm đẹp xe', headerTooltip: 'Chăm sóc/làm đẹp xe', field: 'makeupCar', editable: true, minWidth: 100},
          {headerName: 'Lắp phụ kiện', headerTooltip: 'Lắp phụ kiện', field: 'fittingAccessories', editable: true, minWidth: 100}
        ]
      },
      {
        headerName: 'HÌNH THỨC THANH TOÁN', headerTooltip: 'HÌNH THỨC THANH TOÁN', children: [
          {headerName: 'Khách hàng trả tiền', headerTooltip: 'Khách hàng trả tiền', field: 'customersPay', editable: true, minWidth: 100},
          {
            headerName: 'Nội bộ', headerTooltip: 'Nội bộ', children: [
              {headerName: 'Nội dung phiếu quà', headerTooltip: 'Nội dung phiếu quà', field: 'cardContent', editable: true, minWidth: 100}
            ]
          }
        ]
      },
      {
        headerName: 'KTV hoặc nhóm KTV', headerTooltip: 'KTV hoặc nhóm KTV', children: [
          {headerName: 'KTV', headerTooltip: 'KTV', field: 'isKTV', editable: true, minWidth: 100},
          {headerName: 'Nhóm KTV', headerTooltip: 'Nhóm KTV', field: 'groupKTV', editable: true, minWidth: 100}
        ]
      },
      {
        headerName: 'DOANH THU TRÊN QUYẾT TOÁN', headerTooltip: 'DOANH THU TRÊN QUYẾT TOÁN', children: [
          {
            headerName: 'SẢN PHẨM CHÍNH HIỆU', headerTooltip: 'SẢN PHẨM CHÍNH HIỆU', children: [
              {headerName: 'Phụ tùng có mã KP', headerTooltip: 'Phụ tùng có mã KP', field: 'isCodeKP', editable: true, minWidth: 100},
              {headerName: 'Phụ tùng SCC', headerTooltip: 'Phụ tùng SCC', field: 'accessorySCC', editable: true, minWidth: 100},
              {headerName: 'Phụ tùng thân vỏ', headerTooltip: 'Phụ tùng thân vỏ', field: 'accessoryBody', editable: true, minWidth: 100},
              {headerName: 'Dầu máy', headerTooltip: 'Dầu máy', field: 'isDiesel', editable: true, minWidth: 100},
              {headerName: 'Dầu và hóa chất khác', headerTooltip: 'Dầu và hóa chất khác', field: 'isChemistry', editable: true, minWidth: 100},
              {headerName: 'Phụ kiện', headerTooltip: 'Phụ kiện', field: 'isAccessories', editable: true},
              {headerName: 'Phụ tùng có mã khác', headerTooltip: 'Phụ tùng có mã khác', field: 'codeAccessory', editable: true, minWidth: 100},
            ]
          },
          {
            headerName: 'SẢN PHẨM KHÔNG CHÍNH HIỆU',
            children: [
              {headerName: 'Phụ tùng không chính hiệu', headerTooltip: 'Phụ tùng không chính hiệu', field: 'notGenuine', editable: true, minWidth: 100},
              {
                headerName: 'Phụ tùng không chính hiệu tính từ công', headerTooltip: 'Phụ tùng không chính hiệu tính từ công',
                field: 'notGenuineMerit', editable: true, minWidth: 100
              },
              {headerName: 'Phụ kiện', headerTooltip: 'Phụ kiện', field: 'isAccessories', editable: true, minWidth: 100}
            ]
          },
          {
            headerName: 'DOANH THU KHÁC',
            headerTooltip: 'DOANH THU KHÁC',
            children: [
              {headerName: 'Tổng doanh thu trước giảm giá', headerTooltip: 'Tổng doanh thu trước giảm giá', field: 'beforeSale', editable: true, minWidth: 100},
              {headerName: 'Tổng doanh thu sau giảm giá', headerTooltip: 'Tổng doanh thu sau giảm giá', field: 'afterSale', editable: true, minWidth: 100},
              {headerName: 'Tổng doanh thu sau VAT', headerTooltip: 'Tổng doanh thu sau VAT', field: 'afterVAT', editable: true, minWidth: 100},
              {headerName: 'Doanh thu bảo hiểm', headerTooltip: 'Doanh thu bảo hiểm', field: 'insuranceRevenue', editable: true, minWidth: 100},
              {headerName: 'Doanh thu bảo dưỡng', headerTooltip: 'Doanh thu bảo dưỡng', field: 'maintenanceRevenue', editable: true, minWidth: 100},
              {headerName: 'Doanh thu nội bộ', headerTooltip: 'Doanh thu nội bộ', field: 'internalRevenue', editable: true, minWidth: 100},
              {headerName: 'Beauty salon', headerTooltip: 'Beauty salon', field: 'beautySalon', editable: true, minWidth: 100}
            ]
          }
        ]
      },
      {headerName: 'MỨC ĐỘ HƯ HỎNG', headerTooltip: 'MỨC ĐỘ HƯ HỎNG', field: 'expecteddate', editable: true, minWidth: 100},
      {
        headerName: 'GIẢM GIÁ', headerTooltip: 'GIẢM GIÁ', children: [
          {headerName: 'Công lao động', headerTooltip: 'Công lao động', field: 'isLabor', editable: true, minWidth: 100},
          {headerName: 'Phụ tùng', headerTooltip: 'Phụ tùng', field: 'isAccessory', editable: true, minWidth: 100},
          {headerName: 'Tổng', headerTooltip: 'Tổng', field: 'isTotal', editable: true, minWidth: 100, cellClass: ['cell-border', 'cell-readonly' , 'text-right']}
        ]
      },
      {headerName: 'SỐ HÓA ĐƠN', headerTooltip: 'SỐ HÓA ĐƠN', field: 'invoiceNumber', editable: true, minWidth: 100},
      {headerName: 'GHI CHÚ', headerTooltip: 'GHI CHÚ', field: 'isNote', editable: true, minWidth: 100},
    ];
    this.buildForm();
  }

  refresh() {
    this.selectedRowGrid = undefined;
    this.gridParams.api.setRowData(this.dataGrid);
  }

  updateRate() {
    this.swalAlert.openSuccessToast('Cập nhật thành công');
  }

  isCommand() {
    if (this.selectedRowGrid) {
      this.confirm.openConfirmModal('Question?', 'Bạn có chắc chuyển trạng thái lệnh?').subscribe(() => {
        this.refresh();
      });
    } else {
      this.swalAlert.openWarningToast('Bạn phải chọn 1 dòng');
    }
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

  private buildForm() {
    this.form = this.formBuilder.group({
      sortAgency: [undefined],
      statusCommand: [undefined],
      dateTime: [undefined],
      dateTimeTo: [undefined],
      statusClassify: [undefined],
      ratioSupplies: [undefined],
    });
  }
}
