import { Component, OnInit, ViewChild } from '@angular/core';
import { GridExportService } from '../../../shared/common-service/grid-export.service';
import { NationwideBuyingListService} from '../../../api/swapping/nationwide-buying-list.service';
import { GradeListService} from '../../../api/master-data/grade-list.service';
import { ColorListService} from '../../../api/master-data/color-list.service';
import { LookupService} from '../../../api/lookup/lookup.service';
import { LookupCodes } from '../../../core/constains/lookup-codes';
import { LoadingService } from '../../../shared/loading/loading.service';
import { FormStoringService } from '../../../shared/common-service/form-storing.service';
import { StorageKeys } from '../../../core/constains/storageKeys';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nationwide-buying-list',
  templateUrl: './nationwide-buying-list.component.html',
  styleUrls: ['./nationwide-buying-list.component.scss']
})
export class NationwideBuyingListComponent implements OnInit {
  @ViewChild('buyingInformation', {static: false}) buyingInformation;
  searchForm: FormGroup;
  nationwideBuyingData;
  nationwideBuyingFieldGrid;
  nationwideBuyingParams;
  selectedNationwideBuying;
  total: number;
  gradeList;
  allColors;
  regionArr;
  currentUser;
  fieldGradeList;
  fieldColorList;
  grades;
  colors;

  constructor(
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private formBuilder: FormBuilder,
    private formStoringService: FormStoringService,
    private gridExportService: GridExportService,
    private nationwideBuyingListService: NationwideBuyingListService,
    private gradeListService: GradeListService,
    private colorListService: ColorListService,
    private lookupService: LookupService,
    private confirmationService: ConfirmService,
  ) {
    this.nationwideBuyingFieldGrid = [
      {
        field: 'transStatus',
        minWidth: 150
      },
      {
        field: 'grade',
        minWidth: 110
      },
      {
        field: 'color',
        minWidth: 110
      },
      {
        field: 'expectedArrivalDate',
        cellClass: ['cell-border', 'text-right'],
        minWidth: 150
      },
      {
        field: 'dealer',
        minWidth: 110
      },
      {
        field: 'registerDate',
        cellClass: ['cell-border', 'text-right'],
        minWidth: 150
      },
      {
        field: 'sellingColor',
        minWidth: 110
      },
      {
        headerName: 'Selling LOD',
        field: 'sellingLod',
        cellClass: ['cell-border', 'text-right'],
        minWidth: 150
      },
      {
        headerName: 'Selling DLR',
        field: 'sellingDealer',
        minWidth: 110
      },
      {
        headerName: 'TMV Approved Date',
        field: 'tmvApprovedDate',
        cellClass: ['cell-border', 'text-right'],
        minWidth: 150
      },
      {
        headerName: 'DLR Approved Date',
        field: 'dealerApprovedDate',
        cellClass: ['cell-border', 'text-right'],
        minWidth: 150
      },
    ];
    this.fieldGradeList = [
      {
        headerName: 'marketing code',
        field: 'marketingCode'
      }
    ];
    this.fieldColorList = [
      {
        headerName: 'marketing code',
        field: 'code'
      }
    ];
  }

  ngOnInit() {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.buildForm();
    this.loadingService.setDisplay(true);
    this.getGradeList();
    this.colorListService.getColors().subscribe(allColors => {
      this.allColors = allColors;
    });
    this.lookupService.getDataByCode(LookupCodes.regions).subscribe(regionArr => {
      this.regionArr = regionArr;
      this.loadingService.setDisplay(false);
    });
  }

  getGradeList() {
    const gradeApi = this.currentUser.isAdmin ? this.gradeListService.getGrades(true) : this.currentUser.isLexus
      ? this.gradeListService.getGrades(true, 'lexusOnly')
      : this.gradeListService.getGrades(true, 'notLexus');
    this.loadingService.setDisplay(true);
    gradeApi.subscribe(grades => {
      this.gradeList = grades;
      this.loadingService.setDisplay(false);
    });
  }

  private buildForm() {
    this.searchForm = this.formBuilder.group({
      dealerId: [this.currentUser.dealerId],
      quickSearch: [undefined],
      region: [undefined],
      gradeId: [undefined],
      gradeControl: [undefined],
      colorControl: [undefined],
      colorId: [undefined],
    });
    this.searchForm.get('gradeControl').valueChanges.subscribe(value => {
      if (value) {
        this.loadingService.setDisplay(true);
        this.gradeListService.getGradeColor(value.id).subscribe(colorsOfGrade => {
          this.loadingService.setDisplay(false);
          this.allColors = colorsOfGrade;
        });
        this.searchForm.patchValue({
          colorId: undefined,
          colorControl: undefined,
          gradeId: value.id
        });
      } else {
        this.searchForm.patchValue({
          colorId: undefined,
          colorControl: undefined,
          gradeId: undefined
        });
        this.loadingService.setDisplay(true);
        this.colorListService.getColorsAvailable().subscribe(colors => {
          this.loadingService.setDisplay(false);
          this.allColors = colors;
        });
      }
    });
    this.searchForm.get('colorControl').valueChanges.subscribe(val => {
      this.searchForm.patchValue({
        colorId: val ? val.id : undefined
      });
    });

  }

  getGrade(params) {
    params.api.setRowData(this.gradeList);
  }

  getColor(params) {
    params.api.setRowData(this.allColors);
  }

  callbackGrid(params) {
    this.nationwideBuyingParams = params;
    this.search();
  }

  getParams() {
    const selected = this.nationwideBuyingParams.api.getSelectedRows();
    if (selected) {
      this.selectedNationwideBuying = selected[0];
    }
  }

  search() {
    this.loadingService.setDisplay(true);
    this.nationwideBuyingListService.headerSearch(this.searchForm.value).subscribe(nationwideSellData => {
      this.nationwideBuyingData = nationwideSellData;
      this.nationwideBuyingParams.api.setRowData(this.nationwideBuyingData);
      this.nationwideBuyingParams.api.forEachNode(node => {
        if (node.childIndex === 0) {
          node.setSelected(true);
        }
      });
      this.loadingService.setDisplay(false);
    }, (response) => {
      this.swalAlertService.openFailModal(response.error.mesage);
      this.loadingService.setDisplay(false);
    });
  }

  deleteBuyingItem() {
    if (this.disableDeleteBtn) {
      this.swalAlertService.openFailModal('This vehicle belongs to other Dealer or have been Approved/Rejected');
      return;
    }
    if (!this.selectedNationwideBuying) {
      this.swalAlertService.openFailModal('You have not selected any Buying Item, please select one before delete', 'Please select a Buying Item to delete');
      return;
    } else {
      this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to Delete this request?')
        .subscribe(() => {
          this.nationwideBuyingListService.deleteBuyingItem(this.selectedNationwideBuying.id).subscribe(() => {
            this.swalAlertService.openSuccessModal();
            this.loadingService.setDisplay(false);
            this.selectedNationwideBuying = undefined;
            this.search();
          }, (response) => {
            this.swalAlertService.openFailModal(response.error.mesage);
            this.loadingService.setDisplay(false);
          });
        });
    }
  }

  agreeBuyingItem() {
    if (this.disableAgreeBtn) {
      this.swalAlertService.openFailModal('This vehicle belongs to other Dealer or have been Approved/Rejected');
      return;
    }
    if (!this.selectedNationwideBuying) {
      this.swalAlertService.openFailModal('You have not selected any Buying Item, please select one before agree', 'Please select a Buying Item to agree');
      return;
    } else {
      this.loadingService.setDisplay(true);
      this.nationwideBuyingListService.agreeBuyingItem(this.selectedNationwideBuying.id).subscribe(() => {
        this.swalAlertService.openSuccessModal();
        this.loadingService.setDisplay(false);
        this.selectedNationwideBuying = undefined;
        this.search();
      }, (response) => {
        this.swalAlertService.openFailModal(response.error.mesage);
        this.loadingService.setDisplay(false);
      });
    }
  }

  openBuyingInformation() {
    if (this.buyingInformation) {
      this.buyingInformation.open();
    }
  }

  disagreeBuyingItem() {
    if (!this.selectedNationwideBuying) {
      this.swalAlertService.openFailModal('You have not selected any Buying Item, please select one before disagree', 'Please select a Buying Item to disagree');
      return;
    } else {
      this.loadingService.setDisplay(true);
      this.nationwideBuyingListService.disagreeBuyingItem(this.selectedNationwideBuying.id).subscribe(() => {
        this.swalAlertService.openSuccessModal();
        this.loadingService.setDisplay(false);
        this.selectedNationwideBuying = undefined;
        this.search();
      }, (response) => {
        this.swalAlertService.openFailModal(response.error.mesage);
        this.loadingService.setDisplay(false);
      });
    }
  }

  export() {
    this.gridExportService.export(this.nationwideBuyingParams, 'Nationwide Buying List', 'Nationwide Buying');
  }

  get disableDeleteBtn() {
    let val = true;
    if (this.selectedNationwideBuying && this.selectedNationwideBuying.dealer) {
      if (this.selectedNationwideBuying && this.selectedNationwideBuying.transStatus === 'PENDING') {
        val = null;
      } else if (!this.selectedNationwideBuying) {
        val = true;
      }
    }
    return val;
  }

  get disableAgreeBtn() {
    let val = true;
    if (this.selectedNationwideBuying && this.selectedNationwideBuying.dealer) {
      val = !this.selectedNationwideBuying || (this.selectedNationwideBuying && this.selectedNationwideBuying.transStatus !== 'TMV APPROVE')
        ? true : null;
    }
    return val;
  }

}
