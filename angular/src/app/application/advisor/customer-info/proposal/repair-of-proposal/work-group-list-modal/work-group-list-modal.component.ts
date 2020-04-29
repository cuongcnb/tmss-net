import { Component, OnInit, ViewChild } from '@angular/core';
import { ITreeOptions } from 'angular-tree-component';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'work-group-list-modal',
  templateUrl: './work-group-list-modal.component.html',
  styleUrls: ['./work-group-list-modal.component.scss'],
})
export class WorkGroupListModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  selectedData;
  modalHeight: number;

  workGridField;
  workGridParams;

  accessoryGridField;
  accessoryGridParams;

  data: any[] = [
    {
      code: 'CBU',
      children: [
        {
          code: 'Corolla',
          children: [
            {
              code: 'ZZ01',
              children: [
                {
                  code: 'Bảo dưỡng',
                  children: [
                    {
                      code: 'BD5K',
                      name: 'Bảo dưỡng 5K',
                      group: 'Bảo dưỡng',
                      note: '',
                    },
                    {
                      code: 'BD10K',
                      name: 'Bảo dưỡng 10K',
                      group: 'Bảo dưỡng',
                      note: '',
                    },
                    {
                      code: 'BD20K',
                      name: 'Bảo dưỡng 20K',
                      group: 'Bảo dưỡng',
                      note: '',
                    },
                    {
                      code: 'BD40K',
                      name: 'Bảo dưỡng 40K',
                      group: 'Bảo dưỡng',
                      note: '',
                    },
                  ],
                },
                {
                  code: 'Sửa chữa chung',
                  children: [
                    {
                      code: 'Khac',
                      children: [
                        {
                          code: 'ZZE142L-GEMGKH-Vỏ (New)',
                        },
                        {
                          code: 'ZZE142L-GEMGKH-Vỏ 2008',
                        },
                      ],
                    },
                    {
                      code: 'Dien',
                      children: [
                        {
                          code: 'ZZE142L-GEMGKH-Điện (New)',
                        },
                        {
                          code: 'ZZE142L-GEMGKH-Điện 2008',
                        },
                      ],
                    },
                    {
                      code: 'Gam',
                      children: [
                        {
                          code: 'ZZE142L-GEMGKH-Gầm (New)',
                        },
                        {
                          code: 'ZZE142L-GEMGKH-Gầm 2008',
                        },
                      ],
                    },
                    {
                      code: 'May',
                      children: [
                        {
                          code: 'ZZE142L-GEMGKH-Máy (New)',
                        },
                        {
                          code: 'ZZE142L-GEMGKH-Máy 2008',
                        },
                      ],
                    },
                  ],
                },
              ],
            }],
        }],
    },
    {
      code: 'CKD',
      children: [
        {
          code: 'BD5K',
          name: 'CKD 1',
          group: 'Bảo dưỡng',
          note: '',
        },
      ],
    },
    {
      code: 'Non Toyota',
      children: [],
    },
  ];
  options: ITreeOptions = {
    displayField: 'code',
  };

  constructor(
    private setModalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.workGridField = [
      {
        headerName: '',
        headerTooltip: '',
        field: 'checked',
        minWidth: 50,
      },
      {
        headerName: 'Mã CV',
        headerTooltip: 'Mã công việc',
        field: 'workCode',
        minWidth: 100,
      },
      {
        headerName: 'Tên CV',
        headerTooltip: 'Tên công việc',
        field: 'workName',
        minWidth: 100,
      },
      {
        headerName: 'Đ/m CV',
        headerTooltip: 'Đ/m CV',
        field: 'workLimit',
        minWidth: 100,
      },
      {
        headerName: 'TT',
        headerTooltip: 'TT',
        field: 'tt',
        minWidth: 100,
      },
      {
        headerName: 'Thuế(%)',
        headerTooltip: 'Thuế(%)',
        field: 'tax',
        minWidth: 100,
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'payment',
        minWidth: 100,
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'note',
        minWidth: 100,
      },
    ];
    this.accessoryGridField = [
      {
        headerName: '',
        headerTooltip: '',
        field: 'checked',
        minWidth: 50,
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'accessoryCode',
        minWidth: 100,
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'accessoryName',
        minWidth: 100,
      },
      {
        headerName: 'Đơn vị',
        headerTooltip: 'Đơn vị',
        field: 'unit',
        minWidth: 100,
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        minWidth: 100,
      },
      {
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        field: 'amount',
        minWidth: 100,
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'tax',
        minWidth: 100,
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'payment',
        minWidth: 100,
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'note',
        minWidth: 100,
      },
    ];
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  callbackWorkGrid(params) {
    this.workGridParams = params;
  }

  callbackAccessoryGrid(params) {
    this.accessoryGridParams = params;
  }

  open() {
    this.onResize();
    this.modal.show();
  }

  active(e) {
    this.selectedData = e.node.data;
  }
}
