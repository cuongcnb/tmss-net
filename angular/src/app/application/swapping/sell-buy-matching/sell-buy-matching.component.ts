import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingService} from '../../../shared/loading/loading.service';
import {SellBuyMatchingService} from '../../../api/swapping/sell-buy-matching.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {GridExportService} from '../../../shared/common-service/grid-export.service';
import {GradeListService} from '../../../api/master-data/grade-list.service';
import {ColorListService} from '../../../api/master-data/color-list.service';
import {ModelListService} from '../../../api/master-data/model-list.service';
import {isEqual} from 'lodash';
import {FirefoxDate} from '../../../core/firefoxDate/firefoxDate';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sell-buy-matching',
  templateUrl: './sell-buy-matching.component.html',
  styleUrls: ['./sell-buy-matching.component.scss']
})
export class SellBuyMatchingComponent implements OnInit {
  fieldGridMatchedList;
  matchedListParam;
  selectedMatchedList;
  dataMatching = [];

  fieldGridBuyRequestList;
  buyRequestParam;
  selectedBuyRequest;
  buyRequestPint = [];

  fieldGridSellingList;
  sellingListParam;
  selectedSellingItem;
  sellingListPint = [];

  gradeList;
  allColors;
  modelsList;

  rowClassRules;
  rowClassRulesBuy;

  ordering = 0;

  sellingListView;  // danh sach selling list truy chinh tren grid
  buyRequestView; // danh sach buy request sort tuy chinh tren grid
  sellBuyMatchingForm: FormGroup;
  sellingListConst; // danh sach mac dinh
  buyRequestConst; // danh sach buy request
  fieldModelList;
  fieldGradeList;

  constructor(
    private sellBuyMatchingService: SellBuyMatchingService,
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private gradeListService: GradeListService,
    private colorListService: ColorListService,
    private modelListService: ModelListService,
    private gridExportService: GridExportService,
    private dataFormatService: DataFormatService,
    private loadingService: LoadingService
  ) {
    this.fieldGridMatchedList = [
      {
        headerName: 'BUY REQUEST',
        children: [
          {
            headerName: 'Grade',
            field: 'buyingGrade',
            minWidth: 80
          },
          {
            headerName: 'Color',
            field: 'buyingColor',
            minWidth: 100,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'ETA',
            field: 'buyPortEta',
            minWidth: 120
          },
          {
            headerName: 'Expecting Arrival Date',
            field: 'expectedArrivalDate',
            minWidth: 150
          },
          {
            headerName: 'Buying DLR',
            field: 'buyingDealer',
            minWidth: 120
          }
        ]
      },
      {
        headerName: 'SELLING LIST',
        children: [
          {
            headerName: 'Grade',
            field: 'sellingGrade',
            minWidth: 120
          },
          {
            headerName: 'Color',
            field: 'sellingColor',
            minWidth: 120,
            cellClass: ['cell-border', 'text-right']
          },
          {
            headerName: 'ETA',
            field: 'sellPortEta',
            minWidth: 120
          },
          {
            headerName: 'LO Date',
            field: 'lineOffDate',
            minWidth: 100

          },
          {
            headerName: 'Selling DLR',
            field: 'sellingDealer',
            minWidth: 120
          },
          {
            headerName: 'Status',
            field: 'status',
            minWidth: 150
          },
          {
            headerName: 'TMSS No',
            field: 'tmssNo',
            minWidth: 100
          }
        ]
      },
      {
        headerName: 'MATCHING STATUS',
        children: [
          {
            headerName: 'Matching status',
            field: 'matchingStatus',
            minWidth: 130
          },
          {
            headerName: 'DLR Aprrove Date',
            field: 'dealerApproveDate',
            minWidth: 120
          }
        ]
      }
    ];
    this.fieldGridBuyRequestList = [
      {
        headerName: 'Grade',
        field: 'grade',
        minWidth: 100
      },
      {
        headerName: 'Color',
        field: 'color',
        minWidth: 100,
        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'ETA',
        field: 'portEta',
        minWidth: 120
      },
      {
        headerName: 'Expecting arrival date',
        field: 'expectedDate',
        minWidth: 100
      },
      {
        headerName: 'Buying DLR',
        field: 'dealer',
        minWidth: 100
      }
    ];
    this.fieldGridSellingList = [
      {
        headerName: 'Grade',
        field: 'grade',
        minWidth: 100
      },
      {
        headerName: 'Color',
        field: 'color',
        minWidth: 100
      },
      {
        headerName: 'ETA',
        field: 'portEta',
        minWidth: 120
      },
      {
        headerName: 'LO Date',
        field: 'lineOffDate',
        minWidth: 100
      },
      {
        headerName: 'Selling DLR',
        field: 'dealer',
        minWidth: 100
      },
      {
        headerName: 'Status',
        field: 'status',
        minWidth: 100
      },
      {
        headerName: 'Tmss No',
        field: 'tmssNo',
        minWidth: 100
      }
    ];
    this.rowClassRules = {
      'is-edited': (params) => {
        return this.sellingListPint.length > 0 && this.sellingListPint.find(data => data.id === params.data.id);
      }
    };
    this.rowClassRulesBuy = {
      'is-edited': (params) => {
        return this.buyRequestPint.length > 0 && this.buyRequestPint.find(data => data.id === params.data.id);
      }
    };
    this.colorListService.getColors().subscribe(allColors => {
      this.allColors = allColors;
    });
    this.fieldModelList = [
      {
        headerName: 'Model',
        field: 'marketingCode'
      }
    ];
    this.fieldGradeList = [
      {
        headerName: 'marketing code',
        field: 'marketingCode'
      }
    ];
  }

  ngOnInit() {
    this.buildForm();
    this.gradeListService.getGrades(true).subscribe(gradeList => {
      this.gradeList = gradeList;
    });
    this.modelListService.getModelTable().subscribe(models => {
      this.modelsList = models;
    });
  }

  getModel(params) {
    params.api.setRowData(this.modelsList);
  }

  getGrade(params) {
    params.api.setRowData(this.gradeList);
  }

  // ======***** MATCHED LIST *****======
  callbackMatchedList(params) {
    this.matchedListParam = params;
    this.searchMatchedList();
  }

  getParamMatchedList() {
    const selectedMatchedList = this.matchedListParam.api.getSelectedRows();
    if (selectedMatchedList) {
      this.selectedMatchedList = selectedMatchedList[0];
    }
  }

  searchMatchedList() {
    this.sellBuyMatchingForm.value.approve_from = this.dataFormatService.formatDateSale(this.sellBuyMatchingForm.value.approve_from);
    this.sellBuyMatchingForm.value.approve_to = this.dataFormatService.formatDateSale(this.sellBuyMatchingForm.value.approve_to);
    this.loadingService.setDisplay(true);
    this.sellBuyMatchingService.getMatchedListData(this.sellBuyMatchingForm.value).subscribe(searchData => {
      this.matchedListParam.api.setRowData(searchData);
      this.loadingService.setDisplay(false);
    });
  }

  search() {
    this.loadingService.setDisplay(true);
    this.sellBuyMatchingService.getMatchedListData(this.sellBuyMatchingForm).subscribe(matchedListData => {
      this.sellingListParam.api.setRowData(matchedListData);
      this.loadingService.setDisplay(true);
    });
  }

  clearDate(from?) {
    from ? this.sellBuyMatchingForm.patchValue({approve_from: null})
      : this.sellBuyMatchingForm.patchValue({approve_to: null});
  }

  // ======***** BUYING LIST *****======
  callbackBuyRequestList(params) {
    this.buyRequestParam = params;
    this.searchBuyingList();
  }

  getParamsBuyRequestList() {
    const selectedBuyRequest = this.buyRequestParam.api.getSelectedRows();
    let sortData;
    if (selectedBuyRequest) {
      this.selectedBuyRequest = selectedBuyRequest[0];
      if (this.selectedBuyRequest) {
        sortData = {
          colorId: this.selectedBuyRequest.colorId,
          expectedDate: this.selectedBuyRequest.expectedDate,
          gradeId: this.selectedBuyRequest.gradeId,
          listMappedSellId: this.sellingListPint.map(data => data.id)
        };
        this.loadingService.setDisplay(true);
        this.sellBuyMatchingService.sortMatching(sortData).subscribe(sellingListData => {
          if (sellingListData) {
            this.selectedSellingItem = undefined;
            this.sellingListParam.api.setRowData(sellingListData);
            this.loadingService.setDisplay(false);
          }
        });
      }
    }
  }

  searchBuyingList() {
    this.loadingService.setDisplay(true);
    this.sellBuyMatchingService.getData().subscribe(buyRequestData => {
      this.buyRequestView = buyRequestData.buyRequestList;
      this.buyRequestParam.api.setRowData(this.buyRequestView);
      this.buyRequestConst = buyRequestData.buyRequestList;
      this.loadingService.setDisplay(false);
    });
  }

  // ======***** SELLING LIST *****======
  callbackSellingList(params) {
    this.sellingListParam = params;
    this.searchSellingList();
  }

  getParamsSellingList() {
    const selectedSellingItem = this.sellingListParam.api.getSelectedRows();
    if (selectedSellingItem) {
      this.selectedSellingItem = selectedSellingItem[0];
    }
  }

  searchSellingList() {
    this.loadingService.setDisplay(true);
    this.sellBuyMatchingService.getData().subscribe(sellingListData => {
      this.sellingListParam.api.setRowData(sellingListData.sellingList);
      this.sellingListView = sellingListData.sellingList;
      this.sellingListConst = sellingListData.sellingList;
      this.loadingService.setDisplay(false);
    });
  }

  // ======*****  *****======
  get validateSearchDay() {
    let invalid = false;
    if ((!this.sellBuyMatchingForm.value.approve_from && this.sellBuyMatchingForm.value.approve_to)
      || (this.sellBuyMatchingForm.value.approve_from && !this.sellBuyMatchingForm.value.approve_to)) {
      invalid = true;
      this.swalAlertService.openFailModal('Fill in both "From Date" and "To date" or leave all blank', 'Data search error!!!');
    }
    if (new FirefoxDate(this.sellBuyMatchingForm.value.approve_from).getTime() > new FirefoxDate(this.sellBuyMatchingForm.value.approve_to).getTime()) {
      invalid = true;
      this.swalAlertService.openFailModal('Dlr approve from date must be greater than to date', 'Data search error!!!');
    }
    return invalid;
  }

  onBtnSearch(isRefresh?) {
    if (!isRefresh && this.validateSearchDay) {
      return;
    }
    this.sellingListPint = [];
    this.sellingListView = [];
    this.buyRequestPint = [];
    this.buyRequestView = [];
    this.dataMatching = [];
    this.searchMatchedList();
    this.loadingService.setDisplay(true);
    this.sellBuyMatchingService.getData().subscribe(data => {
      this.sellingListParam.api.setRowData(data.sellingList);
      this.sellingListView = data.sellingList;
      this.buyRequestParam.api.setRowData(data.buyRequestList);
      this.buyRequestView = data.buyRequestList;

      this.sellingListParam.api.setPinnedTopRowData(this.sellingListPint);
      this.buyRequestParam.api.setPinnedTopRowData(this.buyRequestPint);
      this.loadingService.setDisplay(false);
    });
  }

  match() {
    if (this.selectedSellingItem.dealerId === this.selectedBuyRequest.dealerId) {
      this.swalAlertService.openFailModal('Can not match Buy Request and Vehicle from the same Dealer', 'Match error');
      return;
    }

    if (this.selectedSellingItem.id > 0) {
      this.selectedSellingItem.buyId = this.selectedBuyRequest.id;
    } else {
      this.swalAlertService.openFailModal('Can not swap with empty row. Choose another field in selling list to swap!!!', 'Match error');
      return;
    }
    this.sortSellingList();
    this.sortBuyRequest();
    if (this.sellingListPint.length === this.sellingListConst.length) {
      this.sellingListParam.api.setRowData([]);
      this.sellingListParam.api.hideOverlay();
    }

    if (isEqual(this.buyRequestPint, this.buyRequestConst)) {
      this.buyRequestParam.api.setRowData([]);
      this.buyRequestParam.api.hideOverlay();
    }
  }

  sendData() {
    if (this.sellingListPint.length > 0) {
      this.sellingListPint.forEach(data => {
        this.dataMatching.push({swappingBuyId: data.buyId, swappingSellId: data.id});
      });
      this.loadingService.setDisplay(true);
      this.sellBuyMatchingService.sendDataMatching(this.dataMatching).subscribe(() => {
        this.searchMatchedList();
        this.onBtnSearch(true);
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessModal();
      });
    }
  }

  sortSellingList() {
    if (this.selectedSellingItem) {
      this.loadingService.setDisplay(true);
      this.sellingListPint.push(this.selectedSellingItem);
      this.sellingListParam.api.setPinnedTopRowData(this.sellingListPint);
      this.sellingListParam.api.updateRowData({remove: [this.selectedSellingItem]});
      this.loadingService.setDisplay(false);
    }
  }

  sortBuyRequest() {
    if (this.selectedBuyRequest) {
      this.buyRequestPint.push(this.selectedBuyRequest);
      this.buyRequestParam.api.setPinnedTopRowData(this.buyRequestPint);
      this.buyRequestParam.api.updateRowData({remove: [this.selectedBuyRequest]});
    }
  }

  exportMatched() {
    this.gridExportService.export(this.matchedListParam, 'Matched List', 'Sell Buy Matching');
  }

  exportMatchingList() {
    this.sellBuyMatchingService.exportMatchingList().subscribe((matchingListData) => {
      this.downloadFile(matchingListData);
    });
  }

  downloadFile(data) {
    const fileName = data.headers.get('content-disposition').replace('attachment;filename=', '');
    const link = document.createElement('a');
    const url = URL.createObjectURL(data.body);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  get changeStateButtonMatch() {
    return this.selectedBuyRequest && this.selectedSellingItem ? null : true;
  }

  get changeStateButtonSend() {
    return this.sellingListPint.length > 0 ? null : true;
  }

  private buildForm() {
    this.sellBuyMatchingForm = this.formBuilder.group({
      modelControl: [undefined],
      model: [undefined],
      gradeControl: [undefined],
      grade: [undefined],
      approve_from: [undefined],
      approve_to: [undefined],
      includePending: [true]
    });
    this.sellBuyMatchingForm.get('modelControl').valueChanges.subscribe(val => {
      if (val) {
        this.loadingService.setDisplay(true);
        this.gradeListService.getGradeTable(val.id).subscribe(gradeList => {
          this.loadingService.setDisplay(false);
          this.gradeList = gradeList;
        });
        this.sellBuyMatchingForm.patchValue({
          gradeControl: undefined,
          grade: undefined,
          model: val.id
        });
      } else {
        this.sellBuyMatchingForm.patchValue({
          model: undefined,
          gradeControl: undefined,
          grade: undefined
        });
        this.loadingService.setDisplay(true);
        this.gradeListService.getGrades(true).subscribe(gradeList => {
          this.loadingService.setDisplay(false);
          this.gradeList = gradeList;
        });
      }
    });

    this.sellBuyMatchingForm.get('gradeControl').valueChanges.subscribe(val => {
      this.sellBuyMatchingForm.patchValue({
        grade: val ? val.id : undefined
      });
    });
  }
}
