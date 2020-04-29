import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SsiCsiSurveyModel } from '../../../core/models/ssi-csi-survey/ssi-csi.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'csi-survey-result',
  templateUrl: './csi-survey-result.component.html',
  styleUrls: ['./csi-survey-result.component.scss']
})
export class CsiSurveyResultComponent implements OnInit {
  @Input() csiSurveyResult: boolean;
  form: FormGroup;
  gridParam;
  selectRowData;
  fieldGridCsiSurvey;
  selectedData: SsiCsiSurveyModel;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGridCsiSurvey = [
      {
        headerName: 'THÔNG TIN KHÁCH HÀNG',
        headerTooltip: 'THÔNG TIN KHÁCH HÀNG',
        children: [
          {headerName: 'STT', headerTooltip: 'Số thứ tự', field: 'stt'},
          {headerName: 'Ngày khảo sát', headerTooltip: 'Ngày khảo sát', field: 'daySurvey'},
          {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'agency'},
          {headerName: 'Nhân viên khảo sát', headerTooltip: 'Nhân viên khảo sát', field: 'staffSurvey'},
          {headerName: 'Tên người liên hệ', headerTooltip: 'Tên người liên hệ', field: 'contactName'},
          {headerName: 'Tên khách hàng', headerTooltip: 'Tên khách hàng', field: 'customerName'},
          {headerName: 'Địa chỉ khách hàng', headerTooltip: 'Địa chỉ khách hàng', field: 'customerAdd'},
          {headerName: 'Điện thoại liên hệ', headerTooltip: 'Điện thoại liên hệ', field: 'contactPhoneNumber'},
          {headerName: 'IDD', headerTooltip: 'IDD', field: 'idd'},
          {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'licensePlate'},
          {headerName: 'Model', headerTooltip: 'Model', field: 'model'},
          {headerName: 'Doanh thu', headerTooltip: 'Doanh thu', field: 'amount'},
          {headerName: 'Yêu cầu sửa chữa', headerTooltip: 'Yêu cầu sửa chữa', field: 'repairRequest'},
          {headerName: 'Ngày mang xe đến', headerTooltip: 'Ngày mang xe đến', field: 'dayCarCome'},
          {headerName: 'Ngày nhận xe', headerTooltip: 'Ngày nhận xe', field: 'receiveDate'},
          {headerName: 'CVSV', headerTooltip: 'CVSV', field: 'serviceAdviser'},
        ]
      },
      {
        headerName: 'Không thành công nhưng đã liên hệ được với KH',
        headerTooltip: 'Không thành công nhưng đã liên hệ được với KH',
        children: [
          {headerName: 'Từ chối ngay ban đầu', headerTooltip: 'Từ chối ngay ban đầu', field: 'refuseFirst'},
          {headerName: 'Từ chối trong quá trình khảo sát', headerTooltip: 'Từ chối trong quá trình khảo sát', field: 'refuseInSurvey'},
          {headerName: 'Người khác', headerTooltip: 'Người khác', field: 'otherPeople'},
          {headerName: 'Trường hợp khác', headerTooltip: 'Trường hợp khác', field: 'otherCase'},
        ]
      },
      {
        headerName: 'Không thành công và chưa liên hệ được với khách hàng',
        headerTooltip: 'Không thành công và chưa liên hệ được với khách hàng',
        children: [
          {headerName: 'Máy bận', headerTooltip: 'Máy bận', field: 'phoneBusy'},
          {headerName: 'Sai số', headerTooltip: 'Sai số', field: 'errorNumber'},
          {headerName: 'Tắt máy', headerTooltip: 'Tắt máy', field: 'turnOffPhone'},
          {headerName: 'Không nghe máy', headerTooltip: 'Không nghe máy', field: 'unHeard'},
        ]
      },
      {
        headerName: 'Thành công',
        headerTooltip: 'Thành công',
        children: [
          {headerName: '1/0', headerTooltip: '1/0', field: 'result'},
          {headerName: 'Lý do', headerTooltip: 'Lý do', field: 'reason'},
        ]
      },
      {
        headerName: 'Câu hỏi khảo sát',
        headerTooltip: 'Câu hỏi khảo sát',
        children: [
          {
            headerName: 'Câu 1. Anh chị có đồng ý giới thiệu bạn bè/người thân đến ĐL làm dịch vụ hay không ? Thàng điểm từ 1-10 mình đồng ý ở mức mấy ?',
            headerTooltip: 'Câu 1. Anh chị có đồng ý giới thiệu bạn bè/người thân đến ĐL làm dịch vụ hay không ? Thàng điểm từ 1-10 mình đồng ý ở mức mấy ?',
            field: 'questionOne'
          },
          {
            headerName: 'Câu 2. A/C có thể chia sẻ lý do mình lựa chọn như vậy không ?',
            headerTooltip: 'Câu 2. A/C có thể chia sẻ lý do mình lựa chọn như vậy không ?',
            field: 'questionTwo'
          },
          {
            headerName: 'Câu 3. Với lần làm dịch vụ vừa rồi , A/C thấy hài lòng với ĐL dịch vụ nào nhất ?',
            headerTooltip: 'Câu 3. Với lần làm dịch vụ vừa rồi , A/C thấy hài lòng với ĐL dịch vụ nào nhất ?',
            field: 'questionThree'
          },
          {
            headerName: 'Câu 4. Điểm nào của ĐL mà A/C chưa thấy tốt và cần cải thiện ?',
            headerTooltip: 'Câu 4. Điểm nào của ĐL mà A/C chưa thấy tốt và cần cải thiện ?',
            field: 'questionFour'
          },
          {headerName: 'Comment', headerTooltip: 'Comment', field: 'comment'},
        ]
      },
      {
        headerName: '1. Trong lần làm dịch vụ vừa rồi , A/C có làm bồi thường bảo hiểm cho xe không ?',
        headerTooltip: '1. Trong lần làm dịch vụ vừa rồi , A/C có làm bồi thường bảo hiểm cho xe không ?',
        children: [
          {headerName: '1/0', headerTooltip: '1/0', field: 'result'}
        ]
      },
      {
        headerName: '2. Khi đến Đại lý làm bồi thường bảo hiểm , A/C có liên lạc trước với hotline của đơn vị bảo hiểm mà mình mua không ?',
        headerTooltip: '2. Khi đến Đại lý làm bồi thường bảo hiểm , A/C có liên lạc trước với hotline của đơn vị bảo hiểm mà mình mua không ?',
        children: [
          {headerName: '1/0', headerTooltip: '1/0', field: 'result'},
          {headerName: 'Lý do', headerTooltip: 'Lý do', field: 'reason'},
        ]
      },
      {
        headerName: '3. A/C có hài lòng với sự hỗ trợ của hotline bảo hiểm không  ?',
        headerTooltip: '3. A/C có hài lòng với sự hỗ trợ của hotline bảo hiểm không  ?',
        children: [
          {headerName: '1/0', headerTooltip: '1/0', field: 'result'},
          {headerName: 'Lý do', headerTooltip: 'Lý do', field: 'reason'},
        ]
      },
      {
        headerName: '4. A/C có hài lòng với sự hướng dẫn cũng như thái độ phục vụ của nhân viên giám định về quy trình bồi thường bảo hiểm không ?',
        headerTooltip: '4. A/C có hài lòng với sự hướng dẫn cũng như thái độ phục vụ của nhân viên giám định về quy trình bồi thường bảo hiểm không ?',
        children: [
          {headerName: '1/0', headerTooltip: '1/0', field: 'result'},
          {headerName: 'Lý do', headerTooltip: 'Lý do', field: 'reason'},
        ]
      },
      {
        headerName: '5. A/C đánh giá mứa độ hài lòng với sự tư vấn của cố vấn dịch vụ trong sự đánh giá hư hỏng và báo giá sửa chữa ' +
          'ở mức điểm bảo nhiêu trong thang điểm dưới đây ?',
        headerTooltip: '5. A/C đánh giá mứa độ hài lòng với sự tư vấn của cố vấn dịch vụ trong sự đánh giá hư hỏng và báo giá sửa chữa ' +
          'ở mức điểm bảo nhiêu trong thang điểm dưới đây ?',
        children: [
          {headerName: '1/0', headerTooltip: '1/0', field: 'result'},
          {headerName: 'Lý do', headerTooltip: 'Lý do', field: 'reason'},
        ]
      },
      {
        headerName: '6. A/C có hài lòng với chất lượng sửa chữa  ?',
        headerTooltip: '6. A/C có hài lòng với chất lượng sửa chữa  ?',
        children: [
          {headerName: '1/0', headerTooltip: '1/0', field: 'result'},
          {headerName: 'Lý do', headerTooltip: 'Lý do', field: 'reason'},
        ]
      },
      {
        headerName: '7. A/C thấy thời gian sửa chữa ở đại lý có nhanh chóng không ?',
        headerTooltip: '7. A/C thấy thời gian sửa chữa ở đại lý có nhanh chóng không ?',
        children: [
          {headerName: '1/0', headerTooltip: '1/0', field: 'result'},
          {headerName: 'Thời gian sửa chữa', headerTooltip: 'Thời gian sửa chữa', field: 'repairTime'},
        ]
      },
      {
        headerName: '8. A/C có thấy giấy tờ thủ tục làm bồi thường rườm rà và phức tạp không ?',
        headerTooltip: '8. A/C có thấy giấy tờ thủ tục làm bồi thường rườm rà và phức tạp không ?',
        children: [
          {headerName: '1/0', headerTooltip: '1/0', field: 'result'},
          {headerName: 'Thời gian sửa chữa', headerTooltip: 'Thời gian sửa chữa', field: 'repairTime'},
        ]
      },
      {
        headerName: '9. A/C có góp ý gì khác về quy trình làm bồi thường bảo hiểm để khách hàng hài lòng hơn ?',
        headerTooltip: '9. A/C có góp ý gì khác về quy trình làm bồi thường bảo hiểm để khách hàng hài lòng hơn ?',
        children: [
          {headerName: '1/0', headerTooltip: '1/0', field: 'result'},
        ]
      },
      {
        headerName: ' ',
        headerTooltip: ' ',
        children: [
          {headerName: 'Comment', headerTooltip: 'Comment', field: 'comment'},
        ]
      },
    ];
  }

  search() {
  }

  callBackGrid(params) {
    this.gridParam = params;
    this.gridParam.api.setRowData();
  }

  getParams() {
    const selectData = this.gridParam.api.getSelectedRows();
    if (selectData) {
      this.selectRowData = selectData[0];
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      agency: [undefined],
      daySurvey: [undefined],
      dayEnd: [undefined]
    });
  }

}
