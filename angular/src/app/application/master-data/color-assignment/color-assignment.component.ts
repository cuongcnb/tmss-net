import { Component, ViewChild } from '@angular/core';
import { ColorAssignmentService} from '../../../api/master-data/color-assignment.service';
import { GradeProductionService} from '../../../api/master-data/grade-production.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { InteriorAssignmentService} from '../../../api/master-data/interior-assignment.service';
import { ColorListService} from '../../../api/master-data/color-list.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'color-assignment',
  templateUrl: './color-assignment.component.html',
  styleUrls: ['./color-assignment.component.scss']
})
export class ColorAssignmentComponent {
  @ViewChild('colorAssignmentModal', {static: false}) colorAssignmentModal;
  @ViewChild('colorInteriorModal', {static: false}) colorInteriorModal;

  gradeGridField;
  interiorGridField;
  colorAssignmentGridField;

  paramGradeProduction;
  paramColorInterior;
  paramColorAssignment;

  selectedGrade;
  selectedInterior;
  selectedColorAssignment;

  constructor(
    private gradeProductionService: GradeProductionService,
    private colorAssignmentService: ColorAssignmentService,
    private interiorColorListService: InteriorAssignmentService,
    private colorListService: ColorListService,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmService,
  ) {
    this.gradeGridField = [
      {field: 'marketingCode'},
      {field: 'productionCode'},
      {field: 'enName'},
      {field: 'shortModel'},
      {field: 'fullModel', minWidth: 130},
      {
        field: 'frameNoLength',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Order',
        field: 'ordering',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'status',
        cellRenderer: params => `${params.data.status === 'Y' ? 'Enable' : 'Disable'}`,
      },
    ];
    this.colorAssignmentGridField = [
      {
        headerName: 'Color',
        field: 'code'
      },
      {
        field: 'ordering',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'status',
        cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        },
      },
      {field: 'description'}
    ];
    this.interiorGridField = [
      {
        headerName: 'Color',
        field: 'code'
      },
      {
        headerName: 'Vietnamese Name',
        field: 'vnName'
      },
      {
        field: 'ordering',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'status', cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {field: 'description'}
    ];
  }


  callbackGridGradeProductions(params) {
    this.paramGradeProduction = params;
    this.loadingService.setDisplay(true);
    this.gradeProductionService.getAllGradeProduction().subscribe(gradeProductions => {
      gradeProductions = this.sortByABC(gradeProductions, 'marketingCode', 'status');
      params.api.setRowData(gradeProductions);
      this.loadingService.setDisplay(false);
    });
  }

  callbackGridColorAssignment(params) {
    this.paramColorAssignment = params;
  }

  callbackGridInteriorColor(params) {
    this.paramColorInterior = params;
  }

  refreshGradeProductionList() {
    this.selectedGrade = undefined;
    this.selectedColorAssignment = undefined;
    this.selectedInterior = undefined;
    this.paramColorAssignment.api.setRowData();
    this.paramColorInterior.api.setRowData();
    this.callbackGridGradeProductions(this.paramGradeProduction);
  }

  refreshColorAssignmentList() {
    this.selectedColorAssignment = undefined;
    this.getAssignmentDataOfGrade();
  }

  refreshColorInteriorList() {
    this.selectedInterior = undefined;
    this.getAssignmentInteriorDataOfGrade();
  }

  getParamsGradeProduction(params) {
    this.paramGradeProduction = params;
    const selectedGrade = this.paramGradeProduction.api.getSelectedRows();


    this.selectedColorAssignment = undefined;
    this.selectedInterior = undefined;
    if (selectedGrade) {
      this.selectedGrade = selectedGrade[0];
      if (this.selectedGrade.cbu) {
        this.getAssignmentInteriorDataOfGrade();
      }
      this.getAssignmentDataOfGrade();
    }
  }

  getAssignmentDataOfGrade() {
    if (this.selectedGrade) {
      this.loadingService.setDisplay(true);
      this.colorAssignmentService.getColors(this.selectedGrade.id)
        .subscribe(assignment => {
          this.paramColorAssignment.api.setRowData(assignment);
          this.loadingService.setDisplay(false);
        });
    }
  }

  getAssignmentInteriorDataOfGrade() {
    if (this.selectedGrade) {
      this.loadingService.setDisplay(true);
      this.interiorColorListService.getColors(this.selectedGrade.id)
        .subscribe(interiorColor => {
          this.paramColorInterior.api.setRowData(interiorColor);
          this.loadingService.setDisplay(false);
        });
    }
  }

  getParamsColorAssignment(params) {
    this.paramColorAssignment = params;
    const selectedColorAssignment = this.paramColorAssignment.api.getSelectedRows();
    if (selectedColorAssignment) {
      this.selectedColorAssignment = selectedColorAssignment[0];
    }
  }

  getParamsInteriorColor(params) {
    this.paramColorInterior = params;
    const selectedInterior = this.paramColorInterior.api.getSelectedRows();
    if (selectedInterior) {
      this.selectedInterior = selectedInterior[0];
    }
  }

  addColor(type: string) {
    if (this.selectedGrade) {
      if (type === 'assignment') {
        this.colorAssignmentModal.open(this.selectedGrade.id);
      }
      if (type === 'interior') {
        this.colorInteriorModal.open(this.selectedGrade.id);
      }
    } else {
      this.swalAlertService.openWarningForceSelectData('You haven\'t selected any Grade Production, please select one to add Color', 'Select a Grade Production to add Color');
    }
  }

  updateColorAssignment() {
    this.selectedColorAssignment
      ? this.colorAssignmentModal.open(this.selectedGrade.id, this.selectedColorAssignment)
      : this.swalAlertService.openWarningForceSelectData('You haven\'t selected any color, please select one to update', 'Select a color to update');
  }

  updateColorInterior() {
    this.selectedInterior
      ? this.colorInteriorModal.open(this.selectedGrade.id, this.selectedInterior)
      : this.swalAlertService.openWarningForceSelectData('You haven\'t selected any color, please select one to update', 'Select a color to update');
  }

  deleteColorAssigment() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.colorAssignmentService.deleteColorAssigment(this.selectedColorAssignment.id).subscribe(() => {
          this.refreshColorAssignmentList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }

  deleteColorInterior() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.interiorColorListService.deleteColor(this.selectedInterior.id).subscribe(() => {
          this.refreshColorInteriorList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
  sortByABC(arr: any, field, status) {
    arr.sort((a, b) => {
     if (a[status] > b[status]) {
       return -1;
     } else if (a[status] < b[status]) {
       return 1;
     } else if (a[field] < b[field]) {
       return -1;
     } else if (a[field] > b[field]) {
       return 1;
     } else {
       return 0;
     }
    });
    return arr;
  }
}
