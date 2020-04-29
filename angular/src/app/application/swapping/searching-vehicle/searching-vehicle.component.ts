import { Component, OnInit } from '@angular/core';
import { GradeListService} from '../../../api/master-data/grade-list.service';
import { ColorListService} from '../../../api/master-data/color-list.service';
import { SwappingVehicleService} from '../../../api/swapping/swapping-vehicle.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirefoxDate } from '../../../core/firefoxDate/firefoxDate';
import { StorageKeys } from '../../../core/constains/storageKeys';
import { FormStoringService } from '../../../shared/common-service/form-storing.service';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'searching-vehicle',
  templateUrl: './searching-vehicle.component.html',
  styleUrls: ['./searching-vehicle.component.scss']
})
export class SearchingVehicleComponent implements OnInit {
  searchForm: FormGroup;

  searchingVehicleGridField;
  searchingVehicleParams;
  gradeList;
  colorList;
  fieldGradeList;
  fieldColorList;
  currentUser;

  constructor(
    private gradeListService: GradeListService,
    private colorListService: ColorListService,
    private swappingVehicleService: SwappingVehicleService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private formBuilder: FormBuilder,
    private formStoringService: FormStoringService,
  ) {
    this.searchingVehicleGridField = [
      {
        headerName: 'Dealer Code',
        field: 'abbreviation',
        minWidth: 150
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
        headerName: 'Code',
        field: 'code'
      }
    ];
    // this.gradeListService.getAllGrade().subscribe(gradeList => this.gradeList = gradeList);
    // this.colorListService.getColors().subscribe(colorList => this.colorList = colorList);
  }

  ngOnInit() {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.getGrade();
    this.getColor();
    this.buildForm();
  }

  getGrade() {
    const gradeApi = this.currentUser.isAdmin ? this.gradeListService.getGrades(true) : this.currentUser.isLexus
      ? this.gradeListService.getGrades(true, 'lexusOnly')
      : this.gradeListService.getGrades(true, 'notLexus');
    this.loadingService.setDisplay(true);
    gradeApi.subscribe(grades => {
      this.gradeList = grades;
      this.loadingService.setDisplay(false);
    });
  }

  getColor() {
    this.loadingService.setDisplay(true);
    this.colorListService.getColors().subscribe(colorList => {
      this.colorList = colorList;
      this.loadingService.setDisplay(false);
    });
  }

  callbackGrid(params) {
    this.searchingVehicleParams = params;
  }

  search() {
    const { fromDate, toDate } = this.searchForm.value;
    if (new FirefoxDate(fromDate).getTime() > new FirefoxDate(toDate).getTime()) {
      this.swalAlertService.openFailModal('From date must be less than To date', 'Wrong input value');
      return;
    }
    this.loadingService.setDisplay(true);
    this.swappingVehicleService.searchDealerToSwap(this.searchForm.value).subscribe(dealer => {
      this.searchingVehicleParams.api.setRowData(dealer);
      this.loadingService.setDisplay(false);
    });
  }

  private buildForm() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    this.searchForm = this.formBuilder.group({
      gradeControl: [undefined],
      gradeId: [undefined],
      colorControl: [undefined],
      colorId: [undefined],
      fromDate: [new Date(year, month - 1, 1)],
      toDate: [new Date(year, month + 2, 0)],
      searchKey: ['Latest line off date']
    });
    this.searchForm.get('gradeControl').valueChanges.subscribe(value => {
      if (value) {
        this.loadingService.setDisplay(true);
        this.gradeListService.getGradeColor(value.id).subscribe(colorsOfGrade => {
          this.loadingService.setDisplay(false);
          this.colorList = colorsOfGrade;
        });
        this.searchForm.patchValue({
          colorId: undefined,
          gradeId: value.id,
          colorControl: undefined,
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
          this.colorList = colors;
        });
      }
    });

    this.searchForm.get('colorControl').valueChanges.subscribe(value => {
      this.searchForm.patchValue({
        colorId: value ? value.id : undefined
      });
    });
  }
}
