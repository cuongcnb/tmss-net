import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ssi-survey-result',
  templateUrl: './ssi-survey-result.component.html',
  styleUrls: ['./ssi-survey-result.component.scss']
})
export class SsiSurveyResultComponent implements OnInit {
  @Input() ssiSurveyResult: boolean;
  form: FormGroup;
  fieldGrid;
  gridParam;
  selectRowData;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {
        headerName: 'THÔNG TIN KHÁCH HÀNG',
        headerTooltip: 'THÔNG TIN KHÁCH HÀNG',
        children: [
          {headerName: 'STT', headerTooltip: 'Số thứ tự', field: 'stt'},
          {headerName: 'Ngày khảo sát', headerTooltip: 'Ngày khảo sát', field: 'daySurvey'},
          {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'agency'},
          {headerName: 'Nhân viên khảo sát', headerTooltip: 'Nhân viên khảo sát', field: 'staffSurvey'},
          {headerName: 'Tên khách hàng', headerTooltip: 'Tên khách hàng', field: 'customerName'},
          {headerName: 'Người đứng tên hợp đồng', headerTooltip: 'Người đứng tên hợp đồng', field: 'contractOwner'},
          {headerName: 'Địa chỉ khách hàng', headerTooltip: 'Địa chỉ khách hàng', field: 'customerAdd'},
          {headerName: 'Điện thoại liên hệ', headerTooltip: 'Điện thoại liên hệ', field: 'customerPhoneNumber'},
          {headerName: 'Tên người liên hệ', headerTooltip: 'Tên người liên hệ', field: 'contactName'},
          {headerName: 'Điện thoại liên hệ', headerTooltip: 'Điện thoại liên hệ', field: 'contactPhoneNumber'},
          {headerName: 'Ngày báo bán', headerTooltip: 'Ngày báo bán', field: 'saleDate'},
          {headerName: 'Ngày giao xe', headerTooltip: 'Ngày giao xe', field: 'deliveryDate'},
          {headerName: 'IDD', headerTooltip: 'IDD', field: 'idd'},
          {headerName: 'NVBH', headerTooltip: 'NVBH', field: 'warrantyStaff'},
          {headerName: 'Model', headerTooltip: 'Model', field: 'model'},
          {headerName: 'Số khung', headerTooltip: 'Số khung', field: 'frameNumber'},
        ]
      },
      {
        headerName: 'Không thành công nhưng đã liên hệ được với KH.',
        headerTooltip: 'Không thành công nhưng đã liên hệ được với KH.',
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
        headerName: 'Thành công', headerTooltip: 'Thành công', children: [
          {headerName: '1/0', headerTooltip: '1/0', field: 'result'},
          {headerName: 'Lý do', headerTooltip: 'Lý do', field: 'reasonSuccess'},
        ]
      },
      {
        headerName: 'GIỚI THIỆU BẠN BÈ', headerTooltip: 'GIỚI THIỆU BẠN BÈ', children: [
          {
            headerName: 'Sau lần sửa chữa vừa rồi, A/C  có muốn giới thiệu bạn bè , người thân đén ĐL mua xe hay không ? Thang điểm từ 1-10 , A/C đồng ý ở mức điểm mấy ?',
            headerTooltip: 'Sau lần sửa chữa vừa rồi, A/C  có muốn giới thiệu bạn bè , người thân đén ĐL mua xe hay không ? Thang điểm từ 1-10 , A/C đồng ý ở mức điểm mấy ?',
            children: [
              {headerName: 'Điểm', headerTooltip: 'Điểm', field: 'point'},
              {headerName: 'Note', headerTooltip: 'Note', field: 'notePoint'},
            ]
          }
        ]
      },
      {
        headerName: 'ĐỐI TƯỢNG KHÁCH HÀNG', headerTooltip: 'ĐỐI TƯỢNG KHÁCH HÀNG', children: [
          {
            headerName: 'câu 1', headerTooltip: 'câu 1', children: [
              {headerName: 'KH mua xe lần đầu', headerTooltip: 'KH mua xe lần đầu', field: 'firstBuyCar'},
              {headerName: 'KH mua xe thay thế cho xe cũ', headerTooltip: 'KH mua xe thay thế cho xe cũ', field: 'replaceOldCar'},
              {headerName: 'KH mua thêm xe', headerTooltip: 'KH mua thêm xe', field: 'buyMore'},
            ]
          },
          {
            headerName: 'câu 1.1', headeheaderTooltiprName: 'câu 1.1', children: [
              {headerName: 'Chiếc xe A/C sử dụng trước đây là xe gì', headerTooltip: 'Chiếc xe A/C sử dụng trước đây là xe gì', field: 'questionOneOne'},
            ]
          },
          {
            headerName: 'câu 1.2', headerTooltip: 'câu 1.2', children: [
              {
                headerName: 'A/C bán chiếc xe cũ cho người quen, môi giới , NVBH hay ĐL xe cũ của TMV ?',
                headerTooltip: 'A/C bán chiếc xe cũ cho người quen, môi giới , NVBH hay ĐL xe cũ của TMV ?',
                field: 'questionOneTwo'
              },
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteQuestionOneTwo'},
            ]
          },
          {
            headerName: 'Câu 1.2.1', headerTooltip: 'Câu 1.2.1', children: [
              {headerName: 'A/C có biết đến hệ thống ĐL xe cũ của Toyota không?', headerTooltip: 'A/C có biết đến hệ thống ĐL xe cũ của Toyota không?', field: 'questionOldCar'},
              {
                headerName: 'Trước khi bán xe , A/C có liên hệ đến ĐL xe cũ để định giá xe không ?',
                headerTooltip: 'Trước khi bán xe , A/C có liên hệ đến ĐL xe cũ để định giá xe không ?',
                field: 'questionForPrice'
              },
              {
                headerName: 'Lý do không bán xe cho ĐL TMV/Không liên hệ định giá',
                headerTooltip: 'Lý do không bán xe cho ĐL TMV/Không liên hệ định giá',
                field: 'questionForReason'},
            ]
          },
          {
            headerName: 'Câu 1.2.2', headerTooltip: 'Câu 1.2.2', children: [
              {
                headerName: 'A/C có điểm nào muốn góp ý để khâu thu mua xe cũ của bên em cải thiện tốt hơn không ạ ?',
                headerTooltip: 'A/C có điểm nào muốn góp ý để khâu thu mua xe cũ của bên em cải thiện tốt hơn không ạ ?',
                field: 'opinion'
              },
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteOpinion'},
            ]
          },
          {
            headerName: 'Câu 1.3', headerTooltip: 'Câu 1.3', chilren: [
              {
                headerName: 'Mẫu xe A/C đang sử dụng song song với chiếc xe mới mua là xe gì ?',
                headerTooltip: 'Mẫu xe A/C đang sử dụng song song với chiếc xe mới mua là xe gì ?',
                field: 'modelOldCar'
              }
            ]
          }
        ]
      },
      {
        headerName: 'Mục đích sử dụng', headerTooltip: 'Mục đích sử dụng', children: [
          {
            headerName: 'Câu 2', headerTooltip: 'Câu 2', children: [
              {
                headerName: 'A/C mua chiếc xe này là mua cho cá nhân/Gia đình hay mình mua để kinh doanh ạ ?',
                headerTooltip: 'A/C mua chiếc xe này là mua cho cá nhân/Gia đình hay mình mua để kinh doanh ạ ?',
                field: 'questionPurpose'
              },
            ]
          }
        ]
      },
      {
        headerName: 'TÀI CHÍNH', headerTooltip: 'TÀI CHÍNH', children: [
          {
            headerName: 'Câu 3', headerTooltip: 'Câu 3', children: [
              {
                headerName: 'Khi mua chiếc xe này  , A/C có sử dụng dịch vụ hỗ trợ tài chính nào không ạ ?',
                headerTooltip: 'Khi mua chiếc xe này  , A/C có sử dụng dịch vụ hỗ trợ tài chính nào không ạ ?',
                field: 'questionFinanceOne'
              },
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteFinanceOne'},
            ]
          },
          {
            headerName: 'Câu 3.1', headerTooltip: 'Câu 3.1', children: [
              {
                headerName: 'A/C sử dụng dịch vụ hỗ trợ tài chính ở ĐL mình mua xe không ạ ?',
                headerTooltip: 'A/C sử dụng dịch vụ hỗ trợ tài chính ở ĐL mình mua xe không ạ ?',
                field: 'questionFinanceTwo'
              },
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteFinanceTwo'},
            ]
          },
          {
            headerName: 'Câu 3.3', headerTooltip: 'Câu 3.3', children: [
              {headerName: 'A/C sử dụng sự hỗ trợ từ ngân hàng nào vậy ạ ?', headerTooltip: 'A/C sử dụng sự hỗ trợ từ ngân hàng nào vậy ạ ?', field: 'questionFinanceThree'},
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteFinanceThree'},
            ]
          }
        ]
      },
      {
        headerName: 'BẢO HIỂM', headerTooltip: 'BẢO HIỂM', children: [
          {
            headerName: 'Câu 4', headerTooltip: 'Câu 4', children: [
              {headerName: 'Lần vừa rồi , A/C có mua bảo hiểm cho xe không ?', headerTooltip: 'Lần vừa rồi , A/C có mua bảo hiểm cho xe không ?', field: 'buyInsurance'},
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteInsuranceOne'}
            ]
          },
          {
            headerName: 'Câu 4.1', headerTooltip: 'Câu 4.1', children: [
              {headerName: 'A/C có mua bảo hiểm tại ĐL không ?', headerTooltip: 'A/C có mua bảo hiểm tại ĐL không ?', field: 'buyInsurance'},
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteInsuranceTwo'}
            ]
          },
          {
            headerName: 'Câu 4.1.1', headerTooltip: 'Câu 4.1.1', children: [
              {
                headerName: 'Khi A/C mua xe  , NVBH bên em có tư vấn về bảo hiểm cho mình không ?',
                headerTooltip: 'Khi A/C mua xe  , NVBH bên em có tư vấn về bảo hiểm cho mình không ?',
                field: 'insuranceConsultants'
              },
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteInsuranceConsultants'},
            ]
          },
          {
            headerName: 'Câu 4.1.2: A/C có thể chia sẻ lý do mình mua bảo hiểm ở bên ngoài chứ không phải trong ĐL được không ạ ?',
            headerTooltip: 'Câu 4.1.2: A/C có thể chia sẻ lý do mình mua bảo hiểm ở bên ngoài chứ không phải trong ĐL được không ạ ?',
            children: [
              {headerName: 'Bạn bè/Người thân bán bảo hiểm', headerTooltip: 'Bạn bè/Người thân bán bảo hiểm', field: 'reasonBuyInsuranceOne'},
              {headerName: 'Giá BH tại ĐL cao hơn ở ngoài ', headerTooltip: 'Giá BH tại ĐL cao hơn ở ngoài ', field: 'reasonBuyInsuranceTwo'},
              {headerName: 'Ở tỉnh khách/Ở xa ĐL', headerTooltip: 'Ở tỉnh khách/Ở xa ĐL', field: 'reasonBuyInsuranceThree'},
              {headerName: 'NVBH tư vấn nên mua bên ngoài ĐL ', headerTooltip: 'NVBH tư vấn nên mua bên ngoài ĐL ', field: 'reasonBuyInsuranceFour'},
              {headerName: 'Chưa mua , chờ đăng kí xong mới mua ', headerTooltip: 'Chưa mua , chờ đăng kí xong mới mua ', field: 'reasonBuyInsuranceFive'},
              {headerName: 'Khác ', headerTooltip: 'Khác ', field: 'otherReasonBuyInsuranceTwo'},
            ]
          },
          {
            headerName: 'Câu 4.2', headerTooltip: 'Câu 4.2', children: [
              {headerName: 'A/C mua bảo hiểm thường hay bảo hiểm Toyota', headerTooltip: 'A/C mua bảo hiểm thường hay bảo hiểm Toyota', field: 'typeInsurance'},
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteTypeInsurance'},
            ]
          },
          {
            headerName: 'Câu 4.2.1', headerTooltip: 'Câu 4.2.1', children: [
              {headerName: 'A/C có được tư vấn bảo hiểm Toyota hay không ?', headerTooltip: 'A/C có được tư vấn bảo hiểm Toyota hay không ?', field: 'advisoryInsurance'},
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteAdvisoryInsurance'},
            ]
          },
          {
            headerName: 'Câu 4.2.2', headerTooltip: 'Câu 4.2.2', children: [
              {headerName: 'Lý do không mua bảo hiểm Toyota', headerTooltip: 'Lý do không mua bảo hiểm Toyota', field: 'reasonNotBuyInsuranceToyota'},
            ]
          },
          {
            headerName: 'Câu 4.2.3', headerTooltip: 'Câu 4.2.3', children: [
              {
                headerName: 'A/C có được NV tư vấn rõ về sản phẩm phù hợp với phạm vi bảo hiểm không ?',
                headerTooltip: 'A/C có được NV tư vấn rõ về sản phẩm phù hợp với phạm vi bảo hiểm không ?',
                field: 'advisoryInsuranceTwo'
              },
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteAdvisoryInsuranceTwo'},
            ]
          },
          {
            headerName: 'Câu 4.2.4', headerTooltip: 'Câu 4.2.4', children: [
              {
                headerName: 'Mức độ hài lòng về việc tư vấn bảo hiểm tại ĐL',
                headerTooltip: 'Mức độ hài lòng về việc tư vấn bảo hiểm tại ĐL',
                field: 'satisfactionAdvisoryInsuranceTwo'
              },
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteSatisfactionAdvisoryInsuranceTwo'},
            ]
          },
          {
            headerName: 'Câu 4.2.5', headerTooltip: 'Câu 4.2.5', children: [
              {headerName: 'A/C có góp ý gì để dịch vụ bảo hiểm hoàn thiện hơn', headerTooltip: 'A/C có góp ý gì để dịch vụ bảo hiểm hoàn thiện hơn', field: 'feedBackInsurance'},
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteFeedBackInsurance'},
            ]
          },
        ]
      },
      {
        headerName: 'PHỤ KIỆN', headerTooltip: 'PHỤ KIỆN', children: [
          {
            headerName: 'Câu 5', headerTooltip: 'Câu 5', children: [
              {
                headerName: 'Lâu lắm rồi , A/C có mua thêm phụ kiện cho xe không ?',
                headerTooltip: 'Lâu lắm rồi , A/C có mua thêm phụ kiện cho xe không ?',
                field: 'accessoriesOne'
              },
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteAccessoriesOne'}
            ]
          },
          {
            headerName: 'Câu 5.1', headerTooltip: 'Câu 5.1', children: [
              {headerName: 'Mình có hay đi mua phụ kiện ở ĐL không A/C ?', headerTooltip: 'Mình có hay đi mua phụ kiện ở ĐL không A/C ?', field: 'accessoriesTwo'},
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteAccessoriesTwo'}
            ]
          },
          {
            headerName: 'Câu 5.2: Tại sao A/C lại mua phụ kiện bên ngoài vậy ạ',
            headerTooltip: 'Câu 5.2: Tại sao A/C lại mua phụ kiện bên ngoài vậy ạ',
            children: [
              {headerName: 'Có mối quen bên ngoài', headerTooltip: 'Có mối quen bên ngoài', field: 'accessoriesTwoOne'},
              {headerName: 'NVBH hỗ trợ giới thiệu mua bên ngoài', headerTooltip: 'NVBH hỗ trợ giới thiệu mua bên ngoài', field: 'noteAccessoriesTwoTwo'},
              {headerName: 'Giá phụ kiện ở ĐL cao hơn bên ngoài', headerTooltip: 'Giá phụ kiện ở ĐL cao hơn bên ngoài', field: 'noteAccessoriesTwoThree'},
              {headerName: 'ĐL không có phụ kiện KH cần ', headerTooltip: 'ĐL không có phụ kiện KH cần ', field: 'noteAccessoriesTwoFour'},
              {headerName: 'Khác', headerTooltip: 'Khác', field: 'noteAccessoriesOther'},
            ]
          },
        ]
      },
      {
        headerName: ' LÁI THỬ XE', children: [
          {
            headerName: 'Câu 6', children: [
              {
                headerName: 'A/C có tham gia lái thử xe trước khi quyết định mua xe không ?',
                headerTooltip: 'A/C có tham gia lái thử xe trước khi quyết định mua xe không ?',
                field: 'testCarBefore'
              },
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteTestCarBefore'},
            ]
          },
          {
            headerName: 'Câu 6.1', children: [
              {
                headerName: 'Việc lái xe thử có quan trọng đối với việc quyết định mua xe của A/C ?',
                headerTooltip: 'Việc lái xe thử có quan trọng đối với việc quyết định mua xe của A/C ?',
                field: 'testCarBeforeForDecision'
              },
              {headerName: 'Note', headerTooltip: 'Note', field: 'noteTestCarBeforeDecision'},
            ]
          },
          {
            headerName: 'Câu 6.2: Lý do không lái thử xe ', children: [
              {headerName: 'Không biết ĐL có xe lái thử', headerTooltip: 'Không biết ĐL có xe lái thử', field: 'reasonNotTestCarBeforeOne'},
              {headerName: 'Mẫu xe không có tại ĐL', headerTooltip: 'Mẫu xe không có tại ĐL', field: 'reasonNotTestCarBeforeTwo'},
              {headerName: 'Đã trải nghiệm nhiều xe nên không cần thiết', headerTooltip: 'Đã trải nghiệm nhiều xe nên không cần thiết', field: 'reasonNotTestCarBeforeThree'},
              {headerName: 'Không có thời gian lái thử', headerTooltip: 'Không có thời gian lái thử', field: 'reasonNotTestCarBeforeFour'},
              {headerName: 'Khác', headerTooltip: 'Khác', field: 'reasonNotTestCarBeforeOther'},
            ]
          },
        ]
      },
      {
        headerName: '', children: [
          {
            headerName: '', children: [
              {headerName: 'COMMENT', headerTooltip: 'COMMENT', field: 'commentGeneral'},
            ]
          }
        ]
      },
      {
        headerName: 'Xác nhận NVBH', children: [
          {
            headerName: '', children: [
              {headerName: 'Đúng', headerTooltip: 'Đúng', field: 'confirmTrue'},
              {headerName: 'Sai', headerTooltip: 'Sai', field: 'confirmFail'},
              {headerName: 'KH không nhớ ', headerTooltip: 'KH không nhớ ', field: 'otherConfirm'},
            ]
          }
        ]
      }
    ];
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

  search() {}

  private buildForm() {
    this.form = this.formBuilder.group({
      agency: [undefined],
      daySurvey: [undefined],
      dayEnd: [undefined],
    });
  }

}
