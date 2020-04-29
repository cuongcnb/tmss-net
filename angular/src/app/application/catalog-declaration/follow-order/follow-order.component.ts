import { Component, ViewChild } from '@angular/core';

import { ToastService } from '../../../shared/swal-alert/toast.service';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { FollowOrderModel } from '../../../core/models/catalog-declaration/follow-order.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'follow-order',
  templateUrl: './follow-order.component.html',
  styleUrls: ['./follow-order.component.scss']
})
export class FollowOrderComponent {
  @ViewChild('updateFollowOrder', {static: false}) updateFollowOrder;

  gridField;
  gridParams;
  selectedData: FollowOrderModel;

  data = [
    {
      stt: '1',
      fixNo: 'Fix now',
      license: '34-B1 22154',
      service: 'Nguyen Cong Thang',
      eta: '',
      invoice: 'Yes',
      etaEarly: '',
      ata: '',
      time: '10-12-2017',
      outDate: 'Yes',
      inShop: '',
      noteTmv: 'Đại lý phải bán đủ chỉ tiêu tháng này',
      noteAgency: 'Bên Toyata đã bán đươc 100 xe trong vòng 1 tháng',
      follow: 'No',
    }
  ];

  constructor(
    private swalAlertService: ToastService,
    private gridTableService: GridTableService,
  ) {
    this.gridField = [
      {headerName: 'STT', headerTooltip: 'Số thứ tự', field: 'stt', },
      {headerName: 'Số lệnh sửa chữa', headerTooltip: 'Số lệnh sửa chữa', field: 'fixNo', minWidth: 130},
      {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'license', minWidth: 130},
      {headerName: 'Cố vấn dịch vụ', headerTooltip: 'Cố vấn dịch vụ', field: 'service', minWidth: 130},
      {headerName: 'ETA', headerTooltip: 'ETA', field: 'eta', minWidth: 90},
      {headerName: 'Đã có Invoice hàng về', headerTooltip: 'Đã có Invoice hàng về', field: 'invoice', minWidth: 90},
      {
        headerName: 'ETA sớm >= 5N',
        headerTooltip: 'ETA sớm >= 5N',
        field: 'etaEarly',
        cellRenderer: () => `<input type="checkbox"/>`,
        minWidth: 90
      },
      {
        headerName: 'Muộn >=1A',
        headerTooltip: 'Muộn >=1A',
        children: [{headerName: 'ATA', field: 'ata', minWidth: 90} ]
      },
      {
        headerName: `ATA/ETA >`,
        headerTooltip: `ATA/ETA >`,
        children: [{headerName: 'Thời gian hẹn khách', field: 'time', minWidth: 90}]
      },
      {
        headerName: 'Hôm nay -ATA>=15',
        headerTooltip: 'Hôm nay -ATA>=15',
        children: [
          {headerName: 'Phụ tùng quá hạn', headerTooltip: 'Phụ tùng quá hạn', field: 'outDate', minWidth: 90},
          {
            headerName: 'Xe trong xưởng',
            headerTooltip: 'Xe trong xưởng',
            field: 'inShop',
            cellRenderer: () => `<input type="checkbox"/>`,
            minWidth: 90
          },
          {
            headerName: 'Ghi chú(TMV)',
            headerTooltip: 'Ghi chú(TMV)',
            field: 'noteTmv',
            minWidth: 250,
            cellClass: 'cell-wrap-text',
            autoHeight: true
          },
          {
            headerName: 'Ghi chú(Đại lý)',
            headerTooltip: 'Ghi chú(Đại lý)',
            field: 'noteAgency',
            minWidth: 250,
            cellClass: 'cell-wrap-text',
            autoHeight: true
          },
          {headerName: 'Theo dõi đặc biệt', headerTooltip: 'Theo dõi đặc biệt', field: 'follow', minWidth: 90},
        ]
      },
    ];
  }

  refreshFollow() {
    this.selectedData = undefined;
    this.callbackFollow(this.gridParams);
  }

  callbackFollow(params) {
    params.api.setRowData(this.data);
    this.gridParams = params;
  }

  getParamsFollow() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.selectedData = selected[0];
    }
  }

  updateFollow() {
    this.selectedData
      ? this.updateFollowOrder.open(this.selectedData)
      : this.swalAlertService.openWarningToast('Hãy chọn dòng cần sửa!', 'Thông báo!');
  }

  export() {
    this.gridTableService.export(this.gridParams.api, 'Test Bo Followup CVDV');
  }
}
