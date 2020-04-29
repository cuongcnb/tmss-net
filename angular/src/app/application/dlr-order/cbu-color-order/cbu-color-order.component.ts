import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {DlrOrderService} from '../../../api/dealer-order/dlr-order.service';
import {SwalAlertService} from '../../../shared/swal-alert/swal-alert.service';
import {ImportService} from '../../../api/import/import.service';
import {ImportTemplate} from '../../../core/constains/import-types';
import {UploadService} from '../../../api/dealer-order/upload.service';
import {ToastService} from '../../../shared/common-service/toast.service';
import {ModelListService} from "../../../api/master-data/model-list.service";
// import {NumericEditor} from '../../../shared/ag-grid-table/numeric-editor/numeric-editor.component';

// const numericEditor = 'numericEditor';

@Component({
  selector: 'dlr-cbu-color-order',
  templateUrl: './cbu-color-order.component.html',
  styleUrls: ['./cbu-color-order.component.scss']
})
export class CbuColorOrderComponent implements OnInit {
  @ViewChild('forceDifferentSelection', {static: false}) forceDifferentSelection;
  fielGridOrder;
  selectedDate: Date;
  form: FormGroup;
  isResetForm: boolean;
  OrderParam;
  dealers;
  models;
  currentDealerId;
  dealerId;
  modelId;
  showSuccessMessage;
  // searchClicked: boolean;
  importTemplate = ImportTemplate;
  currentUser: any;
  isTmv = false;
  frameworkComponents;
  excelStyles;
  saveClicked: boolean = false;
  errorMessage;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private dealerListService: DealerListService,
    private modelListService: ModelListService,
    private formStoringService: FormStoringService,
    private dataFormatService: DataFormatService,
    private dlrOrderService: DlrOrderService,
    private swalAlertService: SwalAlertService,
    private importService: ImportService,
    private uploadService: UploadService,
    private toastService: ToastService
  ) {
    this.frameworkComponents = {
      // [`${numericEditor}`]: NumericEditor
    }
    //
    this.errorMessage = 'Tổng đặt màu phải bằng tổng phân xe';
  }

  ngOnInit() {
    this.loadingService.setDisplay(true);
    this.currentDealerId = this.formStoringService.get(StorageKeys.currentUser).dealerId;
    this.dealers = [];
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.isTmv = this.currentUser.isAdmin;
    this.dealerId = this.currentDealerId;
    if (this.isTmv) {
      this.dealerListService.getAvailableDealers().subscribe(dealers => {
        this.dealers = dealers;
        this.buildForm();
        this.search();
      });
    } else {
      this.dealerListService.getDealerChild(this.dealerId).subscribe(res => {
        this.dealers = this.dealers.concat({
          id: -1,
          abbreviation: ''
        });
        this.dealers = this.dealers.concat(res);
        this.buildForm();
        this.search();
      });
    }
    this.generateDay();
    this.excelStyles = [
      {
        id: 'ExcelDate',
        dataType: 'dateTime',
        numberFormat: {format: 'yyyy-mm-dd;@'}
      },
      {
        id: 'ExcelString',
        dataType: 'string'
      }
    ];
    //
    this.fielGridOrder = [
      {
        headerName: 'Đại lý',
        field: 'dealer',
        width: 90,
        cellClass: this.mergeCellClass
      },
      {
        headerName: 'Tháng sản xuất',
        field: 'monthText',
        width: 90,
        cellClass: this.mergeCellClass
        // cellClass: ['ExcelDate', 'cell-border']
      },
      {
        headerName: 'Model',
        field: 'model',
        width: 90,
        cellClass: this.mergeCellClass
      },
      {
        headerName: 'Int Color',
        field: 'interior_Color',
        width: 90,
        cellClass: this.mergeCellClass
        // cellClass: 'ExcelString'
      },
      {
        headerName: '',
        field: 'interior_Color_Name',
        width: 90,
        cellClass: this.mergeCellClass
      },
      {
        headerName: 'Grade',
        field: 'grade',
        width: 90,
        cellClass: this.mergeCellClass
      },
      {
        headerName: 'Ext Color',
        field: 'exterior_Color',
        width: 90,
        cellClass: ['ExcelString', 'cell-border']
      },
      {
        headerName: '',
        field: 'exterior_Color_Name',
        width: 90,
        cellClass: 'cell-border'
      },
      {
        headerName: 'Order',
        field: 'order_Qty',
        width: 90,
        cellClass: this.mergeCellClass
      },
      {
        headerName: 'Allocation',
        field: 'allocation',
        width: 90,
        cellClass: this.mergeCellClass
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 90,
        cellClass: this.mergeCellClass
      },
      {
        headerName: 'Sum',
        field: 'sum_Qty',
        width: 90,
        cellClass: ['cell-border', 'align-right']
      },
      {
        headerName: 'Retail',
        field: 'qty',
        editable: true,
        width: 90,
        cellClass: ['cell-clickable', 'cell-border', 'align-right'],
        valueParser: this.numberParser,
        // cellEditor: `${numericEditor}`
      },
      {
        headerName: 'Biglot',
        field: 'biglot_Qty',
        editable: true,
        width: 90,
        cellClass: ['cell-clickable', 'cell-border', 'align-right'],
        valueParser: this.numberParser,
        // cellEditor: `${numericEditor}`
      },
      {
        headerName: 'Note',
        field: 'note',
        width: 90,
        cellClass: this.mergeCellClass
      }
    ];
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealerId: this.currentDealerId,
      modelId: undefined
    });
  }

  callbackGridOrder(params) {
    this.OrderParam = params;
  }

  getDayFromLocalStorage() {
    const selectedDate = this.formStoringService.get(StorageKeys.orderDate);
    return selectedDate;
  }

  generateDay(dtChange?) {
    this.isResetForm = false;
    !dtChange ? this.selectedDate = this.getDayFromLocalStorage() ? new Date(this.getDayFromLocalStorage()) : new Date()
      : this.selectedDate = new Date(dtChange);
    this.formStoringService.set(StorageKeys.orderDate, this.selectedDate);
    //get model
    this.modelListService.getCbuByAllocation({importDate: this.selectedDate}).subscribe((data) => {
      this.models = data;
    })
  }

  downloadFile() {
    this.loadingService.setDisplay(true);
    this.dealerId = (this.form && this.form.value.dealerId > 0) ? this.form.value.dealerId : this.currentDealerId;
    const currentDate = new Date(this.selectedDate);

    const dlrOrderParam = {
      currentDate: currentDate,
      dlrId: this.dealerId
    };
    this.uploadService.downloadFileDealerColorOrder(dlrOrderParam).subscribe((data) => {
      this.loadingService.setDisplay(false);
      if (data.status === 204) {
        this.toastService.openFailModal("Không có dữ liệu");
      } else {
        this.importService.downloadFile(data);
      }
    });
  }

  downloadReport() {
    this.loadingService.setDisplay(true);
    this.dealerId = (this.form && this.form.value.dealerId > 0) ? this.form.value.dealerId : this.currentDealerId;
    const currentDate = new Date(this.selectedDate);

    const dlrOrderColorParam = {
      currentDate: currentDate,
      dlrId: this.dealerId
    };
    this.dlrOrderService.getOrderColorCbuReport(dlrOrderColorParam).subscribe((data) => {
      this.loadingService.setDisplay(false);
      if (data.status === 204) {
        this.toastService.openFailModal('Không có dữ liệu');
      } else {
        this.importService.downloadFile(data);
      }
    });
  }

  numberParser(params) {
    if (!params.newValue) {
      return 0;
    }
    const value = parseInt(params.newValue)
    return isNaN(value) ? params.oldValue : value;
  }

  search() {
    this.loadingService.setDisplay(true);
    //
    const currentDate = new Date(this.selectedDate);
    const orderMonth = this.dataFormatService.formatEngDate(currentDate, false);
    //
    this.dealerId = (this.form && this.form.value.dealerId) ? this.form.value.dealerId : 0;
    this.modelId = (this.form && this.form.value.modelId) ? this.form.value.modelId : 0;
    const dlrOrderParam = {
      currentDate: currentDate,
      dlrId: this.dealerId,
      modelId: this.modelId,
      forSave: this.saveClicked ? 'Y' : 'N'
    };
    this.dlrOrderService.getDealerCbuColorOrderData(dlrOrderParam).subscribe(data => {
      this.OrderParam.api.setRowData(data);
      setTimeout(() => {
        const allColumnIds = this.OrderParam.columnApi.getAllDisplayedColumns().map(column => column.colId);
        this.OrderParam.columnApi.autoSizeColumns(allColumnIds);
      }, 200);
      //
      this.loadingService.setDisplay(false);
      //
      if (this.showSuccessMessage) {
        this.showSuccessMessage = false;
        this.toastService.openSuccessModal();
      }
      //
      if (this.saveClicked) {
        let hasError = false;
        let errorNode;
        this.OrderParam.api.forEachNode(function (node, index) {
          if (node.data['note']) {
            if (!hasError) {
              hasError = true;
              errorNode = node;
            }
          }
        });
        if (hasError) {
          errorNode.setSelected(true);
          this.OrderParam.api.ensureIndexVisible(errorNode.childIndex);
        }
      }
      // this.searchClicked = true;
      this.saveClicked = false;
    });
  }

  mergeCellClass(params) {
    let classes = new Array();
    classes.push('cell-border');
    switch (params.colDef.field) {
      case 'dealer':
        classes.push(params.data['model_Rank'] === 1 ? 'top-row-span' : 'bottom-row-span');
        break;
      case 'monthText':
        classes.push('ExcelDate');
        classes.push(params.data['model_Rank'] === 1 ? 'top-row-span' : 'bottom-row-span');
        break;
      case 'model':
        classes.push(params.data['model_Rank'] === 1 ? 'top-row-span' : 'bottom-row-span');
        break;
      case 'interior_Color':
      case 'interior_Color_Name':
        classes.push('ExcelString');
        classes.push(params.data['interior_Color_Rank'] === 1 ? 'top-row-span' : 'bottom-row-span');
        break;
      case 'grade':
        classes.push(params.data['grade_Rank'] === 1 ? 'top-row-span' : 'bottom-row-span');
        break;
      case 'order_Qty':
      case 'allocation':
      case 'total':
        classes.push('align-right');
        classes.push(params.data['grade_Rank'] === 1 ? 'top-row-span' : 'bottom-row-span');
        break;
      case 'note':
        classes.push('text-red');
        classes.push(params.data['grade_Rank'] === 1 ? 'top-row-span' : 'bottom-row-span');
        break;
    }
    return classes;
  }

  agCellValueChanged(params) {
    if (params.colDef.field === 'qty' || params.colDef.field === 'biglot_Qty') {
      if (params.oldValue === params.newValue) {
        return;
      }
      params.data['sum_Qty'] = params.data['qty'] + params.data['biglot_Qty'];
      params.node.setData(params.data);
      //
      const gradeId = params.data['grade'];
      const dealerId = params.data['dealer'];
      let total = 0;
      this.OrderParam.api.forEachNode(function (node, index) {
        if (node.data['grade'] === gradeId && node.data['dealer'] === dealerId) {
          total += node.data['sum_Qty'];
        }
      });
      this.OrderParam.api.forEachNode(function (node, index) {
        if (node.data['grade'] === gradeId && node.data['dealer'] === dealerId) {
          node.data['total'] = total;
          node.setData(node.data);
        }
      });
      //so sanh voi allocation
      const allocation = params.data['allocation'];
      const errorMessage = this.errorMessage;
      this.OrderParam.api.forEachNode(function (node, index) {
        if (node.data['grade'] === gradeId && node.data['dealer'] === dealerId) {
          if (total !== allocation) {
            node.data['note'] = errorMessage;
          } else {
            node.data['note'] = '';
          }
          node.setData(node.data);
        }
      });
      this.OrderParam.columnApi.autoSizeColumn('note');
    }
  }

  getImportTemplate() {
    this.loadingService.setDisplay(true);
    this.dealerId = (this.form && this.form.value.dealerId) ? this.form.value.dealerId : 0;
    const currentDate = new Date(this.selectedDate);
    const dlrOrderParam = {
      currentDate: currentDate,
      dlrId: this.dealerId
    };
    this.dlrOrderService.getDealerColorOrderTemplate(dlrOrderParam).subscribe((data) => {
      this.loadingService.setDisplay(false);
      this.importService.downloadFile(data);
    });
  }

  exportData() {
    this.OrderParam.api.exportDataAsExcel();
  }

  exportSummaryData(){
    this.loadingService.setDisplay(true);
    this.dealerId = (this.form && this.form.value.dealerId) ? this.form.value.dealerId : 0;
    this.modelId = (this.form && this.form.value.modelId) ? this.form.value.modelId : 0;
    const currentDate = new Date(this.selectedDate);
    const dlrOrderParam = {
      currentDate: currentDate,
      dlrId: this.dealerId,
      modelId: this.modelId
    };
    this.dlrOrderService.getSummaryDealerColorOrderTemplate(dlrOrderParam).subscribe((data) => {
      this.loadingService.setDisplay(false);
      this.importService.downloadFile(data);
    });
  }

  save() {
    let hasError = false;
    let errorNode;
    let hasData = false;
    const errorMessage = this.errorMessage;
    this.OrderParam.api.forEachNode(function (node, index) {
      if (node.data['note'] === errorMessage) {
        if (!hasError) {
          hasError = true;
          errorNode = node;
        }
      }
      if (node.data['total']) {
        hasData = true;
      }
    });
    if (hasError) {
      this.toastService.openFailModal('Kiểm tra lại dữ liệu không hợp lệ');
      errorNode.setSelected(true);
      this.OrderParam.api.ensureIndexVisible(errorNode.childIndex);
      return;
    }
    if (!hasData) {
      this.toastService.openFailModal('Không có dữ liệu');
      return;
    }
    this.loadingService.setDisplay(true);
    this.saveClicked = true;
    const orderData = [];
    this.OrderParam.api.forEachNode(function (node, index) {
      orderData.push(node.data);
    });
    this.dlrOrderService.saveTempCbuColorOrder(orderData).subscribe(() => {
        this.dlrOrderService.saveCbuColorOrder().subscribe((response) => {
            this.loadingService.setDisplay(false);
            if (response.message) {
              this.toastService.openFailModal(response.message);
            }
            else {
              this.showSuccessMessage = true;
              this.saveClicked = false;
            }
            this.search();
          }, (response) => {
            this.loadingService.setDisplay(false);
          }
        )
      }
    );
  }
}
