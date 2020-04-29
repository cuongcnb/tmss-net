import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { ManageDiscontentComplainModel } from '../../../core/models/manage-voc/manage-discontent-complain.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'manage-discontent-complain',
  templateUrl: './manage-discontent-complain.component.html',
  styleUrls: ['./manage-discontent-complain.component.scss'],
})
export class ManageDiscontentComplainComponent implements OnInit {

  @Input() manageComplainPotential: boolean;
  // tslint:disable-next-line:no-input-rename
  @Input('complainPotential') complainPotential: boolean;
  @ViewChild('addModal', {static: false}) addModal;
  form: FormGroup;
  fieldGrid;
  gridParams;
  selectedRowData: ManageDiscontentComplainModel;
  fieldGridPotential;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private confirm: ConfirmService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {
        headerName: 'Thông tin chung', children: [
          {headerName: 'Người tạo', headerTooltip: 'Người tạo', field: 'creat'},
          {headerName: 'Ngày tiếp nhận', headerTooltip: 'Ngày tiếp nhận', field: 'dateReception'},
          {headerName: 'Nguồn tiếp nhận', headerTooltip: 'Nguồn tiếp nhận', field: 'peopleReception'},
          {headerName: 'Ngày gửi OCR', headerTooltip: 'Ngày gửi OCR', field: 'dateSendOCR'},
          {headerName: 'Đại lý xử lý', headerTooltip: 'Đại lý xử lý', field: 'supplierReception'},
        ],
      },
      {
        headerName: 'Thông tin khách hàng', children: [
          {headerName: 'Người liên hệ', headerTooltip: 'Người liên hệ', field: 'contacter'},
          {headerName: 'Chủ xe', headerTooltip: 'Chủ xe', field: 'customerName'},
          {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'customerPhone'},
          {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'customerAddress'},
          {
            headerName: 'Thông tin thêm về KH (Nghề nghiệp, tuổi, sở thích, thói quen sử dụng, ...)',
            headerTooltip: 'Thông tin thêm về KH (Nghề nghiệp, tuổi, sở thích, thói quen sử dụng, ...)',
            field: 'otherCustomerInfo',
          },
        ],
      },
      {
        headerName: 'Thông tin xe', children: [
          {headerName: 'Model', headerTooltip: 'Model', field: 'model'},
          {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'licensePlate'},
          {headerName: 'Số VIN', headerTooltip: 'Số VIN', field: 'vin'},
          {headerName: 'Ngày bán', headerTooltip: 'Ngày bán', field: 'dateSell'},
          {headerName: 'Số Km', headerTooltip: 'Số Km', field: 'km'},
          {headerName: 'Đại lý bán', headerTooltip: 'Đại lý bán', field: 'supplierSell'},
          {headerName: 'Đại lý làm dịch vụ', headerTooltip: 'Đại lý làm dịch vụ', field: 'supplierService'},
        ],
      },
      {
        headerName: 'Thông tin khiếu nại - yêu cầu', children: [
          {headerName: 'Nội dung khiếu nại', headerTooltip: 'Nội dung khiếu nại', field: 'contentComplain'},
          {headerName: 'Lĩnh vực', headerTooltip: 'Lĩnh vực', field: 'complainField'},
          {headerName: 'Nhóm vấn đề', headerTooltip: 'Nhóm vấn đề', field: 'problemGroup'},
          {headerName: 'Bộ phận hư hỏng/Loại công việc/Khu vực', headerTooltip: 'Bộ phận hư hỏng/Loại công việc/Khu vực', field: 'partsDamaged'},
          {headerName: 'Chi tiết vấn đề', headerTooltip: 'Chi tiết vấn đề', field: 'problemDetail'},
          {headerName: 'Mức độ', headerTooltip: 'Mức độ', field: 'level'},
          {headerName: 'Khiếu nại lặp lại', headerTooltip: 'Khiếu nại lặp lại', field: 'complainRepeat'},
          {headerName: 'Trường hợp Non-Fix', headerTooltip: 'Trường hợp Non-Fix', field: 'nonFix'},
          {headerName: 'Thông tin cần thiết', headerTooltip: 'Thông tin cần thiết', field: 'necessaryInfo'},
          {headerName: 'Nguyên nhân khiếu nại', headerTooltip: 'Nguyên nhân khiếu nại', field: 'reasonComplain'},
          {headerName: 'Trách nhiệm', headerTooltip: 'Trách nhiệm', field: 'responsibility'},
          {headerName: 'Tiến trình giải quyết', headerTooltip: 'Tiến trình giải quyết', field: 'resolutionProcess'},
          {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
          {headerName: 'Ngày hoàn thành', headerTooltip: 'Ngày hoàn thành', field: 'dateFinish'},
        ],
      },
      {
        headerName: 'Thời gian giải quyết', children: [
          {headerName: 'Tổng số ngày', headerTooltip: 'Tổng số ngày', field: 'totalDate'},
          {headerName: 'Đánh giá thời gian giải quyết', headerTooltip: 'Đánh giá thời gian giải quyết', field: 'evaluateSettlementTime'},
          {headerName: 'Lý do không đạt', headerTooltip: 'Lý do không đạt', field: 'reasonFail'},
          {headerName: 'Thời gian thu thập TT', headerTooltip: 'Thời gian thu thập TT', field: 'timeCollectInfo'},
        ],
      },
      {
        headerName: 'Đánh giả của khách hàng', children: [
          {headerName: 'Liên hệ thành công', headerTooltip: 'Liên hệ thành công', field: 'contactSuccess'},
          {headerName: 'Mức độ hài lòng', headerTooltip: 'Mức độ hài lòng', field: 'satisfied'},
          {headerName: 'Lý do', headerTooltip: 'Lý do', field: 'reasonSatisfied'},
        ],
      },
      {
        headerName: 'Nhân viên đại lý có liên quan', children: [
          {headerName: 'Nhân viên bán hàng', headerTooltip: 'Nhân viên bán hàng', field: 'salesStaff'},
          {headerName: 'Tổ bán hàng', headerTooltip: 'Tổ bán hàng', field: 'salesTeam'},
          {headerName: 'Cố vấn dịch vụ', headerTooltip: 'Cố vấn dịch vụ', field: 'cvdv'},
          {headerName: 'Kĩ thuật viên', headerTooltip: 'Kĩ thuật viên', field: 'technicians'},
          {headerName: 'Tổ kĩ thuật viên', headerTooltip: 'Tổ kĩ thuật viên', field: 'techniciansTeam'},
        ],
      },
      {
        headerName: 'Hỗ trợ thiện chí', children: [
          {headerName: 'Có hỗ trợ thiện chí', headerTooltip: 'Có hỗ trợ thiện chí', field: 'supportGoodwill'},
          {headerName: 'Ngày đề xuất', headerTooltip: 'Ngày đề xuất', field: 'dateSuggest'},
          {headerName: 'Ngày phê duyệt', headerTooltip: 'Ngày phê duyệt', field: 'dateApproved'},
          {headerName: 'Tổng số ngày chờ phê duyệt', headerTooltip: 'Tổng số ngày chờ phê duyệt', field: 'dateWaitApproved'},
          {headerName: 'Nội dung chi tiết', headerTooltip: 'Nội dung chi tiết', field: 'detailContant'},
        ],
      },
      {
        headerName: 'Tổng kết rút kinh nghiệm', children: [
          {headerName: 'Nội dung', headerTooltip: 'Nội dung', field: 'contentEXP'},
          {headerName: 'Thực hiện', headerTooltip: 'Thực hiện', field: 'performEXP'},
        ],
      },
      {
        headerName: 'Đánh giá của TMV', children: [
          {headerName: 'Thông tin ban đầu đầy đủ', headerTooltip: 'Thông tin ban đầu đầy đủ', field: 'infoFull'},
          {headerName: 'Cập nhật tiến độ đầu đủ, kịp thời', headerTooltip: 'Cập nhật tiến độ đầu đủ, kịp thời', field: 'modifyProcessFull'},
          {headerName: 'Làm tổng kết đầy đủ, kịp thời', headerTooltip: 'Làm tổng kết đầy đủ, kịp thời', field: 'summaryFull'},
          {headerName: 'Làm rõ được vấn đề', headerTooltip: 'Làm rõ được vấn đề', field: 'clarifyProblem'},
        ],
      },
      {
        headerName: 'TMV Handle', children: [
          {headerName: 'VOC Handle', headerTooltip: 'VOC Handle', field: 'vocHandle'},
          {headerName: 'Related Dept', headerTooltip: 'Related Dept', field: 'relatedDept'},
        ],
      },
    ];
    this.fieldGridPotential = [
      {
        headerName: 'Thông tin chung', children: [
          {headerName: 'Người tạo', headerTooltip: 'Người tạo', field: 'creat'},
          {headerName: 'Ngày tiếp nhận', headerTooltip: 'Ngày tiếp nhận', field: 'dateReception'},
          {headerName: 'Nguồn tiếp nhận', headerTooltip: 'Nguồn tiếp nhận', field: 'peopleReception'},
          {headerName: 'Ngày gửi OCR', headerTooltip: 'Ngày gửi OCR', field: 'dateSendOCR'},
          {headerName: 'Đại lý xử lý', headerTooltip: 'Đại lý xử lý', field: 'supplierReception'},
        ],
      },
      {
        headerName: 'Thông tin khách hàng', children: [
          {headerName: 'Người liên hệ', headerTooltip: 'Người liên hệ', field: 'contacter'},
          {headerName: 'Chủ xe', headerTooltip: 'Chủ xe', field: 'customerName'},
          {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'customerPhone'},
          {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'customerAddress'},
          {
            headerName: 'Thông tin thêm về KH (Nghề nghiệp, tuổi, sở thích, thói quen sử dụng, ...)',
            headerTooltip: 'Thông tin thêm về KH (Nghề nghiệp, tuổi, sở thích, thói quen sử dụng, ...)',
            field: 'otherCustomerInfo',
          },
        ],
      },
      {
        headerName: 'Thông tin xe', children: [
          {headerName: 'Model', headerTooltip: 'Model', field: 'model'},
          {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'licensePlate'},
          {headerName: 'Số VIN', headerTooltip: 'Số VIN', field: 'vin'},
          {headerName: 'Ngày bán', headerTooltip: 'Ngày bán', field: 'dateSell'},
          {headerName: 'Số Km', headerTooltip: 'Số Km', field: 'km'},
          {headerName: 'Đại lý bán', headerTooltip: 'Đại lý bán', field: 'supplierSell'},
          {headerName: 'Đại lý làm dịch vụ', headerTooltip: 'Đại lý làm dịch vụ', field: 'supplierService'},
        ],
      },
      {
        headerName: 'Thông tin khiếu nại - yêu cầu', children: [
          {headerName: 'Nội dung khiếu nại', headerTooltip: 'Nội dung khiếu nại', field: 'contentComplain'},
          {headerName: 'Lĩnh vực', headerTooltip: 'Lĩnh vực', field: 'complainField'},
          {headerName: 'Nhóm vấn đề', headerTooltip: 'Nhóm vấn đề', field: 'problemGroup'},
          {headerName: 'Bộ phận hư hỏng/Loại công việc/Khu vực', headerTooltip: 'Bộ phận hư hỏng/Loại công việc/Khu vực', field: 'partsDamaged'},
          {headerName: 'Chi tiết vấn đề', headerTooltip: 'Chi tiết vấn đề', field: 'problemDetail'},
          {headerName: 'Mức độ', headerTooltip: 'Mức độ', field: 'level'},
          {headerName: 'Khiếu nại lặp lại', headerTooltip: 'Khiếu nại lặp lại', field: 'complainRepeat'},
          {headerName: 'Trường hợp Non-Fix', headerTooltip: 'Trường hợp Non-Fix', field: 'nonFix'},
          {headerName: 'Thông tin cần thiết', headerTooltip: 'Thông tin cần thiết', field: 'necessaryInfo'},
          {headerName: 'Nguyên nhân khiếu nại', headerTooltip: 'Nguyên nhân khiếu nại', field: 'reasonComplain'},
          {headerName: 'Trách nhiệm', headerTooltip: 'Trách nhiệm', field: 'responsibility'},
          {headerName: 'Tiến trình giải quyết', headerTooltip: 'Tiến trình giải quyết', field: 'resolutionProcess'},
          {headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'status'},
          {headerName: 'Ngày hoàn thành', headerTooltip: 'Ngày hoàn thành', field: 'dateFinish'},
        ],
      },
      {
        headerName: 'Thời gian giải quyết', children: [
          {headerName: 'Tổng số ngày', headerTooltip: 'Tổng số ngày', field: 'totalDate'},
          {headerName: 'Đánh giá thời gian giải quyết', headerTooltip: 'Đánh giá thời gian giải quyết', field: 'evaluateSettlementTime'},
          {headerName: 'Lý do không đạt', headerTooltip: 'Lý do không đạt', field: 'reasonFail'},
          {headerName: 'Thời gian thu thập TT', headerTooltip: 'Thời gian thu thập TT', field: 'timeCollectInfo'},
        ],
      },
      {
        headerName: 'Đánh giả của khách hàng', children: [
          {headerName: 'Liên hệ thành công', headerTooltip: 'Liên hệ thành công', field: 'contactSuccess'},
          {headerName: 'Mức độ hài lòng', headerTooltip: 'Mức độ hài lòng', field: 'satisfied'},
          {headerName: 'Lý do', headerTooltip: 'Lý do', field: 'reasonSatisfied'},
        ],
      },
      {
        headerName: 'Nhân viên đại lý có liên quan', children: [
          {headerName: 'Nhân viên bán hàng', headerTooltip: 'Nhân viên bán hàng', field: 'salesStaff'},
          {headerName: 'Tổ bán hàng', headerTooltip: 'Tổ bán hàng', field: 'salesTeam'},
          {headerName: 'Cố vấn dịch vụ', headerTooltip: 'Cố vấn dịch vụ', field: 'cvdv'},
          {headerName: 'Kĩ thuật viên', headerTooltip: 'Kĩ thuật viên', field: 'technicians'},
          {headerName: 'Tổ kĩ thuật viên', headerTooltip: 'Tổ kĩ thuật viên', field: 'techniciansTeam'},
        ],
      },
      {
        headerName: 'Hỗ trợ thiện chí', children: [
          {headerName: 'Có hỗ trợ thiện chí', headerTooltip: 'Có hỗ trợ thiện chí', field: 'supportGoodwill'},
          {headerName: 'Ngày đề xuất', headerTooltip: 'Ngày đề xuất', field: 'dateSuggest'},
          {headerName: 'Ngày phê duyệt', headerTooltip: 'Ngày phê duyệt', field: 'dateApproved'},
          {headerName: 'Tổng số ngày chờ phê duyệt', headerTooltip: 'Tổng số ngày chờ phê duyệt', field: 'dateWaitApproved'},
          {headerName: 'Nội dung chi tiết', headerTooltip: 'Nội dung chi tiết', field: 'detailContant'},
        ],
      },
      {
        headerName: 'Tổng kết rút kinh nghiệm', children: [
          {headerName: 'Nội dung', headerTooltip: 'Nội dung', field: 'contentEXP'},
          {headerName: 'Thực hiện', headerTooltip: 'Thực hiện', field: 'performEXP'},
        ],
      },
      {
        headerName: 'TMV Handle', children: [
          {headerName: 'VOC Handle', headerTooltip: 'VOC Handle', field: 'vocHandle'},
          {headerName: 'Related Dept', headerTooltip: 'Related Dept', field: 'relatedDept'},
        ],
      },
    ];
  }

  getParams() {
    const selectedRows = this.gridParams.api.getSelectedRows();
    if (selectedRows) {
      this.selectedRowData = selectedRows[0];
    }
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  openAddModal() {
    this.addModal.open(this.manageComplainPotential);
  }

  openUpdateModal() {
    this.selectedRowData
      ? this.addModal.open(this.manageComplainPotential, true)
      : this.swalAlert.openWarningToast('Hãy chọn dòng cần cập nhật', 'Thông báo!');
  }

  search() {
    const blankComplain = {};
    this.gridParams.api.updateRowData({add: [blankComplain]});
  }

  deleteRow() {
    !this.selectedRowData
      ? this.swalAlert.openWarningToast('Hãy chọn dòng cần xóa', 'Thông báo!')
      : this.confirm.openConfirmModal('Question?', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        this.gridParams.api.updateRowData({remove: [this.selectedRowData]});
      });
  }

  copy() {
    (!this.selectedRowData)
      ? this.swalAlert.openWarningToast('Hãy chọn một dòng để sao chép', 'Thông báo')
      : this.confirm.openConfirmModal('Question', 'Bạn có muốn sao chép dòng này?').subscribe(() => {
        this.gridParams.api.updateRowData({add: [this.selectedRowData]});
      });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      supplierReception: [undefined],
      dateReception: [undefined],
      toDateReception: [undefined],
      licensePlate: [undefined],
      status: [undefined],
      dateFinish: [undefined],
      toDateFinish: [undefined],
      contacter: [undefined],
      complainField: [undefined],
      complainProblem: [undefined],
    });
  }
}
