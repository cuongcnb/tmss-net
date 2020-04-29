import { Component, OnInit } from '@angular/core';
import { GridExportService } from '../../../shared/common-service/grid-export.service';
import { NationwideSellingListService} from '../../../api/swapping/nationwide-selling-list.service';
import { GradeListService} from '../../../api/master-data/grade-list.service';
import { ColorListService} from '../../../api/master-data/color-list.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { LookupService} from '../../../api/lookup/lookup.service';
import { LookupDataModel } from '../../../core/models/base.model';
import { LookupCodes } from '../../../core/constains/lookup-codes';
import { FormStoringService } from '../../../shared/common-service/form-storing.service';
import { StorageKeys } from '../../../core/constains/storageKeys';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { FilterFormCode } from '../../../core/constains/filter-form-code';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nationwide-selling-list',
  templateUrl: './nationwide-selling-list.component.html',
  styleUrls: ['./nationwide-selling-list.component.scss']
})
export class NationwideSellingListComponent implements OnInit {
  searchForm: FormGroup;
  nationwideSellFieldGrid;
  nationwideSellParams;
  nationwideSellData;
  selectedNationwideSell;
  total: number;
  gradeList;
  allColors;
  regionList: Array<LookupDataModel>;
  currentUser;
  filterFormCode = FilterFormCode;
  fieldGradeList;
  fieldColorList;
  filterDataList = [];

  constructor(
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private formStoringService: FormStoringService,
    private gridExportService: GridExportService,
    private nationwideSellingListService: NationwideSellingListService,
    private gradeListService: GradeListService,
    private colorListService: ColorListService,
    private lookupService: LookupService,
    private dataFormatService: DataFormatService,
    private formBuilder: FormBuilder,
  ) {
    this.nationwideSellFieldGrid = [
      {
        headerName: 'Grade',
        field: 'grade'
      },
      {
        headerName: 'Color',
        field: 'color'
      },
      {
        headerName: 'Color Deadline',
        field: 'dealerColorDeadline',

        cellClass: ['cell-border']
      },
      {
        headerName: 'Dealer Dispatch Plan', //
        field: 'dlrDispatchPlan',

        cellClass: ['cell-border']
      },
      {
        headerName: 'Invoice Date',
        field: 'payActualInvoiceDate',

        cellClass: ['cell-border']
      },
      {
        headerName: 'TMSS No',
        field: 'tmssNo'
      },
      {
        headerName: 'Region',
        field: 'region'
      },
      {
        field: 'carStatus'
      }
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
    this.getGradeList();
    this.colorListService.getColors().subscribe(allColors => {
      this.allColors = allColors;
    });
    this.lookupService.getDataByCode(LookupCodes.regions).subscribe(regionList => {
      this.regionList = regionList;
    });
    this.buildForm();
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

  getGrade(params) {
    params.api.setRowData(this.gradeList);
  }

  getColor(params) {
    params.api.setRowData(this.allColors);
  }

  callbackGrid(params) {
    this.nationwideSellParams = params;
    this.search();
  }

  getParams() {
    const selected = this.nationwideSellParams.api.getSelectedRows();
    if (selected) {
      this.selectedNationwideSell = selected[0];
    }
  }

  searchWithSaleFilter(filterDataList) {
    this.filterDataList = filterDataList;
    this.search();
  }

  search() {
    this.loadingService.setDisplay(true);
    this.nationwideSellingListService.searchNationWideSellingList(this.searchForm.value, this.filterDataList).subscribe(nationwideSellData => {
      this.nationwideSellData = nationwideSellData;
      this.nationwideSellParams.api.setRowData(this.nationwideSellData);
      this.loadingService.setDisplay(false);
    });
  }

  export() {
    this.gridExportService.export(this.nationwideSellParams, 'Nationwide Sell List', 'Nationwide Sell');
  }

  private buildForm() {
    this.searchForm = this.formBuilder.group({
      dealerId: [this.currentUser.dealerId],
      quickSearch: [undefined],
      regionId: [undefined],
      gradeControl: [undefined],
      gradeId: [undefined],
      colorControl: [undefined],
      colorId: [undefined]
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
          gradeId: value.id,
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
}

