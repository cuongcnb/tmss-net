import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { ManageQuestionRequestModel } from '../../../core/models/manage-voc/manage-question-request.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'manage-question-request',
  templateUrl: './manage-question-request.component.html',
  styleUrls: ['./manage-question-request.component.scss'],
})
export class ManageQuestionRequestComponent implements OnInit {
  @ViewChild('addMQRModal', {static: false}) addMQRModal;
  fieldGrid;
  form: FormGroup;
  editModal = true;
  selectedData: ManageQuestionRequestModel;
  gridParams;
  dataTest;

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
          {headerName: 'Đại lý xử lý', headerTooltip: 'Đại lý xử lý', field: 'supplierHandling'},
          {headerName: 'Người tạo', headerTooltip: 'Người tạo', field: 'creat'},
          {headerName: 'Ngày tiếp nhận', headerTooltip: 'Ngày tiếp nhận', field: 'dateReception'},
          {headerName: 'Nguồn tiếp nhận', headerTooltip: 'Nguồn tiếp nhận', field: 'source'},
          {headerName: 'Phương tiện tiếp cận Hotline', headerTooltip: 'Phương tiện tiếp cận Hotline', field: 'approachMeans'},
        ],
      },
      {
        headerName: 'Thông tin khách hàng', children: [
          {headerName: 'Khách hàng', headerTooltip: 'Khách hàng', field: 'customerName'},
          {headerName: 'Điện thoại', headerTooltip: 'Điện thoại', field: 'customerPhone'},
          {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'customerAddress'},
        ],
      },
      {
        headerName: 'Thông tin xe', children: [
          {headerName: 'Tên model', headerTooltip: 'Tên model', field: 'model'},
          {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'licensePlate'},
          {headerName: 'Số Vin', headerTooltip: 'Số Vin', field: 'vin'},
          {headerName: 'Ngày bán', headerTooltip: 'Ngày bán', field: 'sellDate'},
          {headerName: 'Số km', headerTooltip: 'Số km', field: 'km'},
          {headerName: 'Đại lý bán xe', headerTooltip: 'Đại lý bán xe', field: 'supplierSell'},
          {headerName: 'Đại lý làm dịch vụ', headerTooltip: 'Đại lý làm dịch vụ', field: 'supplierService'},
        ],
      },
      {
        headerName: 'Thông tin thắc mắc', children: [
          {headerName: 'Nội dung thắc mắc', headerTooltip: 'Nội dung thắc mắc', field: 'questionContent'},
          {headerName: 'Lĩnh vực thắc mắc (VN/EN)', headerTooltip: 'Lĩnh vực thắc mắc (VN/EN)', field: 'questionField'},
          {headerName: 'Mã vấn đề', headerTooltip: 'Mã vấn đề', field: 'problemCode'},
          {headerName: 'Vấn đề thắc mắc (VN/EN)', headerTooltip: 'Vấn đề thắc mắc (VN/EN)', field: 'questionProblem'},
          {headerName: 'Nội dung trả lời', headerTooltip: 'Nội dung trả lời', field: 'answerContent'},
          {headerName: 'Tình trạng', headerTooltip: 'Tình trạng', field: 'status'},
        ],
      },
      {
        headerName: 'Thời gian giải quyết', children: [
          {headerName: 'Cuộc gọi đầu', headerTooltip: 'Cuộc gọi đầu', field: 'firstCall'},
          {headerName: 'Trong 4 giờ', headerTooltip: 'Trong 4 giờ', field: 'inFourHours'},
          {headerName: 'Khác', headerTooltip: 'Khác', field: 'another'},
          {headerName: 'Thắc mắc khó', headerTooltip: 'Thắc mắc khó', field: 'hardQuestion'},
          {headerName: 'Chuyển tới phòng ban liên quan', headerTooltip: 'Chuyển tới phòng ban liên quan', field: 'transferToRelaventDepartment'},
        ],
      },
      {
        headerName: 'Đánh giá của khách hàng', children: [
          {headerName: 'Hài lòng', headerTooltip: 'Hài lòng', field: 'satisfied'},
          {headerName: 'Lý do', headerTooltip: 'Lý do', field: 'reasonSatisfied'},
        ],
      },
    ];

    this.dataTest = [{
      supplierHandling: 'TMV',
      creat: 'Nguyen van a',
      dateReception: '5/12/1969',
      source: 'Nguon 1123',
      approachMeans: 'Email',

      customerName: 'hqhqhqhq',
      customerPhone: '0426716548',
      customerAddress: 'HQT@gmail.com',

      model: 'MOdel 123',
      licensePlate: '26A6 44856',
      vin: 'ZC54WQEc45aAS',
      sellDate: '11/25/1996',
      km: '10000',
      supplierSell: 'TMV BD',
      supplierService: 'TMV CC',
    }];
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  openAddModal() {
    this.addMQRModal.open();
  }

  openEditModal() {
    this.selectedData
      ? this.addMQRModal.open(this.selectedData, this.editModal)
      : this.swalAlert.openWarningToast('Hãy chọn một dòng để cập nhật', 'Thông báo');
  }

  search() {
    this.gridParams.api.setRowData(this.dataTest);
  }

  deleteRow() {
    (!this.selectedData)
      ? this.swalAlert.openWarningToast('Hãy chọn dòng cần xóa', 'Thông báo!')
      : this.confirm.openConfirmModal('Question?', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        this.gridParams.api.updateRowData({remove: [this.selectedData]});
      });
  }

  copy() {
    (!this.selectedData)
      ? this.swalAlert.openWarningToast('Hãy chọn một dòng để sao chép', 'Thông báo')
      : this.confirm.openConfirmModal('Question', 'Bạn có muốn sao chép dòng này?').subscribe(() => {
        this.gridParams.api.updateRowData({add: [this.selectedData]});
      });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      supplier: [undefined],
      dateReception: [undefined],
      toDateReception: [undefined],
      licensePlate: [undefined],
      status: [undefined],
      dateFinish: [undefined],
      toDateFinish: [undefined],
      customerName: [undefined],
      questionField: [undefined],
      questionProblem: [undefined],
      supplierReception: [undefined],
    });
  }
}
