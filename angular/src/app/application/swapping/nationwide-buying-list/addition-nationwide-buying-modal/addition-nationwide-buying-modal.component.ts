import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {GradeListService} from '../../../../api/master-data/grade-list.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {NationwideBuyingListService} from '../../../../api/swapping/nationwide-buying-list.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'addition-nationwide-buying-modal',
  templateUrl: './addition-nationwide-buying-modal.component.html',
  styleUrls: ['./addition-nationwide-buying-modal.component.scss']
})
export class AdditionNationwideBuyingModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('editAdditionalBuying', {static: false}) editAdditionalBuying;
  @Input() gradeList;
  @Input() allColors;
  @Input() currentUser;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  displayedData = [];
  fieldGridBuyingItem;
  buyingItemParams;
  selectedBuyingItem;

  constructor(
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private gradeListService: GradeListService,
    private nationwideBuyingListService: NationwideBuyingListService,
    private dataFormatService: DataFormatService,
  ) {
  }

  ngOnInit() {
    this.fieldGridBuyingItem = [
      {
        headerName: 'Grade',
        field: 'gradeId',
        valueFormatter: params => this.dataFormatService.formatGradeCode(params.value, this.gradeList)
      },
      {
        headerName: 'Color',
        field: 'colorId',
        valueFormatter: params => this.dataFormatService.formatAggridCode(params.value, this.allColors)
      },
      {
        headerName: 'Expected Arrival Date',
        field: 'expectedArrivalDate',
        valueFormatter: params => this.dataFormatService.formatDateSale(params.value),
      },
      {
        headerName: 'Remark',
        field: 'remark',
      }
    ];
  }

  open() {
    this.modal.show();
  }

  reset() {
    this.buyingItemParams.api.setRowData([]);
    this.displayedData = [];
  }

  callbackGridBuyingItem(params) {
    this.buyingItemParams = params;
  }

  getParamsBuyingItem() {
    const selectedBuyingItem = this.buyingItemParams.api.getSelectedRows();
    if (selectedBuyingItem) {
      this.selectedBuyingItem = selectedBuyingItem[0];
    }
  }

  setRowData(buyingItem) {
    if (buyingItem.isUpdate) {
      const index = this.displayedData.indexOf(this.selectedBuyingItem);
      this.displayedData[index] = buyingItem.value;
    } else {
      this.displayedData.push(buyingItem.value);
    }
    this.buyingItemParams.api.setRowData(this.displayedData);
    this.selectedBuyingItem = undefined;
    this.getDisplayedData();
  }

  getDisplayedData() {
    const displayedData = [];
    this.buyingItemParams.api.forEachNode(node => {
      displayedData.push(node.data);
    });
    this.displayedData = displayedData;
  }

  updateSelectedRow() {
    if (!this.selectedBuyingItem) {
      this.swalAlertService.openFailModal('Please select an item to update');
      return;
    }
    this.editAdditionalBuying.open(this.selectedBuyingItem);
  }

  removeSelectedRow() {
    if (!this.selectedBuyingItem) {
      this.swalAlertService.openFailModal('Please select an item to delete');
      return;
    }
    this.buyingItemParams.api.updateRowData({ remove: [this.selectedBuyingItem] });
    this.selectedBuyingItem = undefined;
    this.getDisplayedData();
  }

  save() {
    const newBuyingList = this.displayedData;
    let isSubmit: boolean;
    const check = newBuyingList.find(item => !item.gradeId || !item.colorId || !item.expectedArrivalDate);
    if (check) {
      const swalMessage = `Please fill all required field before submit`;
      const swalTitle = 'Required field (*) are empty';
      this.swalAlertService.openFailModal(swalMessage, swalTitle);
      isSubmit = false;
    } else {
      isSubmit = true;
    }
    if (isSubmit) {
      newBuyingList.forEach(data => {
        this.gradeList.filter(grade => data.gradeId = (data.gradeId === grade.marketingCode ? grade.id : data.gradeId));
        this.allColors.filter(color => data.colorId = (data.colorId === color.code ? color.id : data.colorId));
      });
      this.loadingService.setDisplay(true);
      this.nationwideBuyingListService.addNewBuyingList(newBuyingList).subscribe(() => {
        this.modal.hide();
        this.close.emit();
        this.swalAlertService.openSuccessModal();
        this.loadingService.setDisplay(false);
      });
    }
  }
}
