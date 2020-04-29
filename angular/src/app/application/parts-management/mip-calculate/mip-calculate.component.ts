import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {LoadingService} from '../../../shared/loading/loading.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MipCalculateApi} from '../../../api/parts-management/mip-calculate.api';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {PartsMipModel} from '../../../core/models/parts-management/parts-mip.model';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {AgCheckboxHeaderRendererComponent} from '../../../shared/ag-checkbox-header-renderer/ag-checkbox-header-renderer.component';
import {AgCheckboxRendererComponent} from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import {DownloadService} from '../../../shared/common-service/download.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mip-calculate',
  templateUrl: './mip-calculate.component.html',
  styleUrls: ['./mip-calculate.component.scss']
})
export class MipCalculateComponent implements OnInit {
  selectedTab;
  fieldGrid;
  fieldMonthList;
  partsParams;
  selectedPartsNodes;
  paginationParams;
  fieldGroup;
  partsList: PartsMipModel[];
  selectedDate = new Date();
  searchForm: FormGroup;
  paginationTotalsData;
  checkedData;
  month;
  year;
  date;
  fieldGridExport;
  exportParams;
  excelStyles;
  frameworkComponents = {
    agCheckboxRendererComponent: AgCheckboxRendererComponent
  };

  constructor(private loadingService: LoadingService,
              private formBuilder: FormBuilder,
              private mipCalculateApi: MipCalculateApi,
              private dataFormatService: DataFormatService,
              private gridTableService: GridTableService,
              private swalAlertService: ToastService,
              private downloadService: DownloadService) {
    this.fieldGridExport = [
      {
        headerName: 'Mã PT', cellClass: ['excelStringType'],
        headerTooltip: 'Mã phụ tùng', field: 'partsCode', width: 100
      },
      {headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }, width: 150},
      {
        headerName: 'Mã thay thế',
        headerTooltip: 'Mã thay thế',
        children: [
          {headerName: 'Mới', headerTooltip: 'Mới', cellClass: ['excelStringType'], field: 'newPart', width: 100},
          {headerName: 'Cũ', headerTooltip: 'Cũ', cellClass: ['excelStringType'], field: 'oldPart', width: 100}
        ]
      },
      {headerName: 'ĐVT', headerTooltip: 'Đơn vị tính', field: 'unit', width: 30},
      {headerName: 'Giá Nhập', headerTooltip: 'Giá Nhập', field: 'price', width: 80},
      {headerName: 'Thuế (%)', headerTooltip: 'Thuế (%)', field: 'rate', width: 30},
      {headerName: 'Tổng', headerTooltip: 'Tổng', field: 'qty', width: 30},
      {headerName: 'Instock Type', headerTooltip: 'Instock Type', field: 'instockType', width: 80},
      {headerName: 'MIP', headerTooltip: 'MIP', field: 'mip', width: 30},
      {
        headerName: moment().subtract(6, 'months').format('MM-YYYY'),
        headerTooltip: moment().subtract(6, 'months').format('MM-YYYY'),
        children: [
          {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'last1Qty', width: 30},
          {headerName: 'Số lần', headerTooltip: 'Số lần', field: 'last1Number', width: 30}
        ]
      },
      {
        headerName: moment().subtract(5, 'months').format('MM-YYYY'),
        headerTooltip: moment().subtract(5, 'months').format('MM-YYYY'),
        children: [
          {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'last2Qty', width: 30},
          {headerName: 'Số lần', headerTooltip: 'Số lần', field: 'last2Number', width: 30}
        ]
      },
      {
        headerName: moment().subtract(4, 'months').format('MM-YYYY'),
        headerTooltip: moment().subtract(4, 'months').format('MM-YYYY'),
        children: [
          {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'last3Qty', width: 30},
          {headerName: 'Số lần', headerTooltip: 'Số lần', field: 'last3Number', width: 30}
        ]
      },
      {
        headerName: moment().subtract(3, 'months').format('MM-YYYY'),
        headerTooltip: moment().subtract(3, 'months').format('MM-YYYY'),
        children: [
          {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'last4Qty', width: 30},
          {headerName: 'Số lần', headerTooltip: 'Số lần', field: 'last4Number', width: 30}
        ]
      },
      {
        headerName: moment().subtract(2, 'months').format('MM-YYYY'),
        headerTooltip: moment().subtract(2, 'months').format('MM-YYYY'),
        children: [
          {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'last5Qty', width: 30},
          {headerName: 'Số lần', headerTooltip: 'Số lần', field: 'last5Number', width: 30}
        ]
      },
      {
        headerName: moment().subtract(1, 'months').format('MM-YYYY'),
        headerTooltip: moment().subtract(1, 'months').format('MM-YYYY'),
        children: [
          {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'last6Qty', width: 30},
          {headerName: 'Số lần', headerTooltip: 'Số lần', field: 'last6Number', width: 30}
        ]
      },
      {headerName: 'TBTX', headerTooltip: 'TBTX', field: 'tbtx', width: 30},
      {headerName: 'Bộ', headerTooltip: 'Bộ', field: 'pair', width: 30},
      {
        headerName: 'MIP',
        headerTooltip: 'MIP',
        children: [
          {headerName: 'TT', headerTooltip: 'TT', field: 'mipTT', width: 30},
          {headerName: 'LT', headerTooltip: 'LT', field: 'mipLT', width: 30},
          {headerName: 'TT', headerTooltip: 'TT', field: 'mipReal', width: 30}
        ]
      }
    ];
    this.fieldGroup = [
      ['partsName', 'oldPart', 'newPart', 'unit', 'price', 'rate', 'qty', 'instockType', 'mad', 'mip'],
      [
        'last1Qty', 'last1Number', 'last2Qty', 'last2Number', 'last3Qty', 'last3Number', 'last4Qty', 'last4Number',
        'last5Qty', 'last5Number', 'last6Qty', 'last6Number', 'tbtx', 'pair', 'madTT', 'madLT', 'mipTT', 'mipLT',
        'mipReal', 'icc'
      ]
    ];
    this.fieldMonthList = [
      {
        headerName: moment().subtract(6, 'months').format('MM-YYYY'),
        headerTooltip: moment().subtract(6, 'months').format('MM-YYYY'),
        colId: 'T1',
        children: [
          {
            headerName: 'Qty',
            headerTooltip: 'Qty',
            field: 'last1Qty',
            cellClass: ['text-right', 'cell-border', 'cell-green']
          },
          {
            headerName: 'Number',
            headerTooltip: 'Number',
            field: 'last1Number',
            cellClass: ['text-right', 'cell-border', 'cell-clickable']
          }
        ]
      },
      {
        headerName: moment().subtract(5, 'months').format('MM-YYYY'),
        headerTooltip: moment().subtract(5, 'months').format('MM-YYYY'),
        children: [
          {
            headerName: 'Qty',
            headerTooltip: 'Qty',
            field: 'last2Qty',
            cellClass: ['text-right', 'cell-border', 'cell-green']
          },
          {
            headerName: 'Number',
            headerTooltip: 'Number',
            field: 'last2Number',
            cellClass: ['text-right', 'cell-border', 'cell-clickable']
          }
        ]
      },
      {
        headerName: moment().subtract(4, 'months').format('MM-YYYY'),
        headerTooltip: moment().subtract(4, 'months').format('MM-YYYY'),
        children: [
          {
            headerName: 'Qty',
            headerTooltip: 'Qty',
            field: 'last3Qty',
            cellClass: ['text-right', 'cell-border', 'cell-green']
          },
          {
            headerName: 'Number',
            headerTooltip: 'Number',
            field: 'last3Number',
            cellClass: ['text-right', 'cell-border', 'cell-clickable']
          }
        ]
      },
      {
        headerName: moment().subtract(3, 'months').format('MM-YYYY'),
        headerTooltip: moment().subtract(3, 'months').format('MM-YYYY'),
        children: [
          {
            headerName: 'Qty',
            headerTooltip: 'Qty',
            field: 'last4Qty',
            cellClass: ['text-right', 'cell-border', 'cell-green']
          },
          {
            headerName: 'Number',
            headerTooltip: 'Number',
            field: 'last4Number',
            cellClass: ['text-right', 'cell-border', 'cell-clickable']
          }
        ]
      },
      {
        headerName: moment().subtract(2, 'months').format('MM-YYYY'),
        headerTooltip: moment().subtract(2, 'months').format('MM-YYYY'),
        children: [
          {
            headerName: 'Qty',
            headerTooltip: 'Qty',
            field: 'last5Qty',
            cellClass: ['text-right', 'cell-border', 'cell-green']
          },
          {
            headerName: 'Number',
            headerTooltip: 'Number',
            field: 'last5Number',
            cellClass: ['text-right', 'cell-border', 'cell-clickable']
          }
        ]
      },
      {
        headerName: moment().subtract(1, 'months').format('MM-YYYY'),
        headerTooltip: moment().subtract(1, 'months').format('MM-YYYY'),
        children: [
          {
            headerName: 'Qty',
            headerTooltip: 'Qty',
            field: 'last6Qty',
            cellClass: ['text-right', 'cell-border', 'cell-green']
          },
          {
            headerName: 'Number',
            headerTooltip: 'Number',
            field: 'last6Number',
            cellClass: ['text-right', 'cell-border', 'cell-clickable']
          }
        ]
      }
    ];
    this.fieldGrid = [
      {
        // ***** THÔNG TIN PHỤ TÙNG
        children: [
          {

            headerName: '',
            headerTooltip: '',
            field: 'checked',
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            checkboxSelection: true,
            width: 30,
            suppressSizeToFit: true

          },
          {
            headerName: 'STT',
            headerTooltip: 'Số thứ tự',
            field: 'stt',
            suppressSizeToFit: true,
            width: 30,
            cellClass: ['cell-white', 'cell-border']

          },
          {
            headerName: 'Mã PT',
            headerTooltip: 'Mã phụ tùng',
            field: 'partsCode',
            suppressSizeToFit: true,
            width: 90

          },
          {
            headerName: 'Tên PT',
            headerTooltip: 'Tên phụ tùng',
            valueGetter: params => {
               return params.data && params.data.partsNameVn && !!params.data.partsNameVn
                 ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
            },
            suppressSizeToFit: true,
            width: 200
          }
        ]
      },
      {
        headerName: 'Mã thay thế',
        headerTooltip: 'Mã thay thế',
        children: [
          {
            headerName: 'Mới',
            headerTooltip: 'Mới',
            field: 'newPart',
            width: 90,
            suppressSizeToFit: true
          },
          {
            headerName: 'Cũ',
            headerTooltip: 'Cũ',
            field: 'oldPart',
            width: 90,
            suppressSizeToFit: true
          }
        ]
      },
      {
        children: [
          {
            headerName: 'ĐVT',
            headerTooltip: 'Đơn vị tính',
            field: 'unit',
            width: 100
          },
          {
            headerName: 'Giá Nhập',
            headerTooltip: 'Giá Nhập',
            field: 'price',
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
            cellClass: ['text-right', 'cell-border', 'cell-readonly'],
            width: 70,
            suppressSizeToFit: true
          },
          {
            headerName: 'Thuế (%)',
            headerTooltip: 'Thuế (%)',
            field: 'rate',
            cellClass: ['text-right', 'cell-border', 'cell-readonly'],
            width: 60,
            suppressSizeToFit: true

          },
          {
            headerName: 'Tổng',
            headerTooltip: 'Tổng',
            field: 'qty',
            cellClass: ['text-right', 'cell-border', 'cell-readonly'],
            width: 50,
            suppressSizeToFit: true
          },
          {
            headerName: 'Instock Type',
            headerTooltip: 'Instock Type',
            field: 'instockType',
            width: 80,
            suppressSizeToFit: true
          },
          {
            headerName: 'MIP',
            headerTooltip: 'MIP',
            field: 'mip'
          }
        ]
      },
      // ***** THONG TIN MIP
      {
        headerName: 'Tần suất bán hàng trong 6 tháng',
        headerTooltip: 'Tần suất bán hàng trong 6 tháng',
        children: this.fieldMonthList
      },
      {
        children: [
          {
            headerName: 'MAX',
            headerTooltip: 'MAX',
            field: 'max',
            suppressSizeToFit: true,
            width: 50
          },
          {
            headerName: 'TBTX',
            headerTooltip: 'TBTX',
            field: 'tbtx',
            cellClass: ['text-right', 'cell-border', 'cell-orange']
          },
          {
            headerName: 'Bộ',
            headerTooltip: 'Bộ',
            field: 'pair'

          },
          {
            headerName: 'DAD',
            headerTooltip: 'DAD',
            field: 'dad',
            suppressSizeToFit: true,
            width: 50

          }
        ]
      },
      {
        headerName: 'MIP',
        headerTooltip: 'MIP',
        children: [
          {
            headerName: 'TT',
            headerTooltip: 'Tháng trước',
            field: 'mipTT',
            cellClass: ['text-right', 'cell-border', 'cell-readonly']
          },
          {
            headerName: 'LT',
            headerTooltip: 'Lý thuyết',
            field: 'mipLT',
            cellClass: ['text-right', 'cell-border', 'cell-orange']
          },
          {
            headerName: 'TT',
            headerTooltip: 'Thực tế',
            field: 'mipReal',
            editable: true,
            validators: ['number'],
            cellClass: ['cell-clickable', 'cell-border', 'text-right']
          }
        ]
      }
    ];
  }

  ngOnInit() {
    this.checkedData = {};
    this.buildForm();
  }

  callbackGrid(params) {
    this.partsParams = params;
    this.changeTab(0);
  }

  changeTab(i?) {
    // Switch tab and re-render column on click button
    if (i !== undefined) {
      this.selectedTab = i;
    }
    this.partsParams.columnApi.setColumnsVisible(this.fieldGroup[0], this.selectedTab === 0);
    this.partsParams.columnApi.setColumnsVisible(this.fieldGroup[1], this.selectedTab === 1);
    this.partsParams.api.sizeColumnsToFit();
  }

  getParams() {
    this.selectedPartsNodes = this.partsParams.api.getSelectedNodes();
  }

  search(reset?) {
    this.loadingService.setDisplay(true);
    this.mipCalculateApi.search(this.searchForm.value, this.paginationParams).subscribe((val: { total: number, list: PartsMipModel[] }) => {

      if (val) {
        if (reset) {
          this.resetPaginationParams();
        }
        this.paginationTotalsData = val.total;
        this.month = this.searchForm.value.month;
        this.year = this.searchForm.value.year;
        this.date = this.searchForm.value.date;
        this.partsList = val.list;
        this.partsList = this.gridTableService.addSttToData(this.partsList, this.paginationParams);
        this.partsParams.api.setRowData(this.partsList);
        this.selectedPartsNodes = undefined;
        this.fieldMonthList.forEach((item, i) => {
          item.headerName = moment(this.searchForm.get('date').value)
            .subtract(6 - i, 'months').format('MM-YYYY');
        });
        this.partsParams.api.setColumnDefs(this.fieldGrid);
        this.changeTab();
      }
      setTimeout(() => {
        this.loadingService.setDisplay(false);
      }, 300);
    });
  }

  calculateMip() {
    if (!this.selectedPartsNodes) {
      this.swalAlertService.openWarningToast('Chọn một hoặc nhiều bản ghi để tính Mip', 'Chưa chọn bản ghi');
      return;
    }
    this.loadingService.setDisplay(true);
    this.mipCalculateApi.calculate(this.month, this.year, this.selectedPartsNodes.map(node => node.data)).subscribe((val: PartsMipModel[]) => {
      this.selectedPartsNodes.forEach((node, index) => {
        node.setData(Object.assign(node.data, val[index]));
      });
      this.loadingService.setDisplay(false);
    });
  }

  buildForm() {
    const date = new Date();
    this.searchForm = this.formBuilder.group({
      partsCode: [undefined],
      partsName: [undefined],
      instockType: [undefined],
      month: [date.getMonth() + 1],
      year: [date.getFullYear()],
      date: [date],
      fieldSort: [undefined],
      filters: [undefined]
    });
  }

  fillMonthPicker(selectedDate) {
    const date = new Date(selectedDate);
    this.searchForm.patchValue({
      date,
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });
  }

  changePaginationParams(paginationParams) {
    if (!this.partsList) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  resetPaginationParams() {
    this.partsList = undefined;
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  save() {
    if (!this.partsList) {
      this.swalAlertService.openFailToast('Dữ liệu rỗng');
      return;
    }
    this.loadingService.setDisplay(true);
    this.mipCalculateApi.save(this.month, this.year, this.selectedPartsNodes.map(node => node.data))
      .subscribe(() => {
        this.swalAlertService.openSuccessToast('Lưu thành công');
        this.loadingService.setDisplay(false);
      });
  }

  export() {
    // for (let i = 11, j = 0; i < 17; i++) {
    //   this.fieldGridExport[i].headerName = moment(this.date)
    //     .subtract(6 - j, 'months').format('MM-YYYY');
    //   j++;
    // }
    if (!this.selectedPartsNodes) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn dữ liệu để Export');
      return;
    }
    this.exportParams.api.setColumnDefs(this.fieldGridExport);
    this.exportParams.api.setRowData(this.selectedPartsNodes.map(item => item.data));
    this.gridTableService.export(this.exportParams, 'export', 'export');
  }

  exportAPI() {
    if (!this.selectedPartsNodes) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn dữ liệu để Export');
      return;
    }
    this.mipCalculateApi.exportMip(this.selectedPartsNodes.map(node => node.data)).subscribe(data => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(data);
    });
  }
}
