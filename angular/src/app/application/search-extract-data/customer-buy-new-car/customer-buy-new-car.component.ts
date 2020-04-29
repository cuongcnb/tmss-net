import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchExtractDataModel } from '../../../core/models/search-extract-data/search-extract-data.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'customer-buy-new-car',
  templateUrl: './customer-buy-new-car.component.html',
  styleUrls: ['./customer-buy-new-car.component.scss'],
})
export class CustomerBuyNewCarComponent implements OnInit {
  @Input() isCriteria;
  fieldGrid;
  form: FormGroup;
  gridParams;
  selectedRowGrid: SearchExtractDataModel;
  data = [
    {
      sortAgency: 'test1',
      errorVin: 'test1',
      saleConsultant: 'test1',
      isName: 'test1',
      isNisCityame: 'test1',
      companyEmail: 'test1',
      driverAddress: 'test1',
      contentCall: 'test1',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'KHÁCH HÀNG QUAY LẠI/CHƯA QUAY LẠI', headerTooltip: 'KHÁCH HÀNG QUAY LẠI/CHƯA QUAY LẠI', children: [
          {
            headerName: 'Thông tin xe', headerTooltip: 'Thông tin xe', children: [
              {headerName: '1. Đại lý bán xe', headerTooltip: '1. Đại lý bán xe', field: 'sortAgency'},
              {headerName: '2. Model', headerTooltip: '2. Model', field: 'errorModel'},
              {headerName: '3. Số Vin', headerTooltip: '3. Số Vin', field: 'errorVin'},
              {headerName: '4. Biển số', headerTooltip: '4. Biển số', field: 'licensePlates'},
              {headerName: '5. Ngày giao xe', headerTooltip: '5. Ngày giao xe', field: 'dealDate'},
              {headerName: '6. Tư vấn bán hàng', headerTooltip: '6. Tư vấn bán hàng', field: 'saleConsultant'},
            ],
          },
          {
            headerName: 'Thông tin khách hàng', headerTooltip: 'Thông tin khách hàng', children: [
              {headerName: '7. Tên chủ xe', headerTooltip: '7. Tên chủ xe', field: 'isName'},
              {headerName: '8. Địa chỉ', headerTooltip: '8. Địa chỉ', field: 'isDistrict'},
              {headerName: '9. Quận/huyện', headerTooltip: '9. Quận/huyện', field: 'isAddress'},
              {headerName: '10. Tỉnh/TP', headerTooltip: '10. Tỉnh/TP', field: 'isCity'},
              {headerName: '11. Điện thoại', headerTooltip: '11. Điện thoại', field: 'isPhone'},
              {headerName: '12. Email chủ xe', headerTooltip: '12. Email chủ xe', field: 'isEmail'},
              {headerName: '13. Tên công ty', headerTooltip: '13. Tên công ty', field: 'companyName'},
              {headerName: '14. Địa chỉ công ty', headerTooltip: '14. Địa chỉ công ty', field: 'companyAddress'},
              {headerName: '15. Quận/huyện', headerTooltip: '15. Quận/huyện', field: 'isAddressCompany'},
              {headerName: '16. Tỉnh/TP', headerTooltip: '16. Tỉnh/TP', field: 'isAddressCompany'},
              {headerName: '17. Điện thoại công ty', headerTooltip: '17. Điện thoại công ty', field: 'companyPhone'},
              {headerName: '18. Email công ty', headerTooltip: '18. Email công ty', field: 'companyEmail'},
              {headerName: '19. Fax', headerTooltip: '19. Fax', field: 'isFax'},
              {headerName: '20. Họ tên người nhận xe', headerTooltip: '20. Họ tên người nhận xe', field: 'isFax'},
              {headerName: '21. Địa chỉ lái xe', headerTooltip: '21. Địa chỉ lái xe', field: 'driverAddress'},
              {headerName: '22. Quận/huyện', headerTooltip: '22. Quận/huyện', field: 'isDistrictDriver'},
              {headerName: '23. Tỉnh/TP', headerTooltip: '23. Tỉnh/TP', field: 'isCityDriver'},
              {headerName: '24. Điện thoại lái xe', headerTooltip: '24. Điện thoại lái xe', field: 'driverPhone'},
              {headerName: '25. Email lái xe', headerTooltip: '25. Email lái xe', field: 'driverEmail'},
            ],
          },
          {
            headerName: 'Nội dung liên hệ', headerTooltip: 'Nội dung liên hệ', children: [
              {
                headerName: 'D+15', headerTooltip: 'D+15', children: [
                  {headerName: '26. Ngày liên hệ dự kiến', headerTooltip: '26. Ngày liên hệ dự kiến', field: 'expectedDate'},
                  {headerName: '27. Ngày liên hệ thực tế', headerTooltip: '27. Ngày liên hệ thực tế', field: 'dayReality'},
                  {headerName: '28. Trạng thái liên hệ', headerTooltip: '28. Trạng thái liên hệ', field: 'contactStatus'},
                  {headerName: '29. ND cuộc gọi', headerTooltip: '29. ND cuộc gọi', field: 'contentCall'},
                  {headerName: '30. Lý do không quay lại', headerTooltip: '30. Lý do không quay lại', field: 'reasonKH'},
                  {headerName: '31. Ghi chú không quay lại', headerTooltip: '31. Ghi chú không quay lại', field: 'noteReason'},
                  {headerName: '32. Số Km cập nhật', headerTooltip: '32. Số Km cập nhật', field: 'updateKm'},
                ],
              },
              {
                headerName: 'D1K-3', headerTooltip: 'D1K-3', children: [
                  {headerName: '33. Ngày liên hệ dự kiến', headerTooltip: '33. Ngày liên hệ dự kiến', field: 'expectedDate'},
                  {headerName: '34. Ngày liên hệ thực tế', headerTooltip: '34. Ngày liên hệ thực tế', field: 'dayReality'},
                  {headerName: '35. Trạng thái liên hệ', headerTooltip: '35. Trạng thái liên hệ', field: 'contactStatus'},
                  {headerName: '36. ND cuộc gọi', headerTooltip: '36. ND cuộc gọi', field: 'contentCall'},
                  {headerName: '37. Lý do không quay lại', headerTooltip: '37. Lý do không quay lại', field: 'reasonKH'},
                  {headerName: '38. Ghi chú không quay lại', headerTooltip: '38. Ghi chú không quay lại', field: 'noteReason'},
                  {headerName: '39. Số Km cập nhật', headerTooltip: '39. Số Km cập nhật', field: 'updateKm'},
                ],
              },
              {
                headerName: 'D+55', headerTooltip: 'D+55', children: [
                  {headerName: '40. Ngày liên hệ dự kiến', headerTooltip: '40. Ngày liên hệ dự kiến', field: 'expectedDate'},
                  {headerName: '41. Ngày liên hệ thực tế', headerTooltip: '41. Ngày liên hệ thực tế', field: 'dayReality'},
                  {headerName: '42. Trạng thái liên hệ', headerTooltip: '42. Trạng thái liên hệ', field: 'contactStatus'},
                  {headerName: '43. ND cuộc gọi', headerTooltip: '43. ND cuộc gọi', field: 'contentCall'},
                  {headerName: '44. Lý do không quay lại', headerTooltip: '44. Lý do không quay lại', field: 'reasonKH'},
                  {headerName: '45. Ghi chú không quay lại', headerTooltip: '45. Ghi chú không quay lại', field: 'noteReason'},
                  {headerName: '46. Số Km cập nhật', headerTooltip: '46. Số Km cập nhật', field: 'updateKm'},
                ],
              },
            ],
          },
          {
            headerName: 'Dịch vụ ngày quay lại', headerTooltip: 'Dịch vụ ngày quay lại', children: [
              {headerName: '47. Số RO', headerTooltip: '47. Số RO', field: 'isRo'},
              {headerName: '48. Ngày vào DV', headerTooltip: '48. Ngày vào DV', field: 'dateDV'},
              {headerName: '49. Ngày ra DV', headerTooltip: '49. Ngày ra DV', field: 'dateDVout'},
              {headerName: '50. Nội dung DV', headerTooltip: '50. Nội dung DV', field: 'contentDV'},
              {headerName: '51. LHDV', headerTooltip: '51. LHDV', field: 'isLHDV'},
              {headerName: '52. Số km', headerTooltip: '52. Số km', field: 'Km'},
              {headerName: '53. CVDV', headerTooltip: '53. CVDV', field: 'CVDV'},
              {headerName: '54. KTV', headerTooltip: '54. KTV', field: 'isTechnicians'},
            ],
          },
        ],
      },
    ];
    this.buildForm();
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData(this.data);
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowGrid = selectedData[0];
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      criteria: [undefined],
      criteriaOne: [undefined],
      criteriaTwo: [undefined],
    });
    this.form.get('criteria').valueChanges.subscribe(val => {
    });
  }
}
