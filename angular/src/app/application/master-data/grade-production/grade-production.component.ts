import { Component, OnInit, ViewChild } from '@angular/core';
import { GradeProductionService} from '../../../api/master-data/grade-production.service';
import { GradeListService} from '../../../api/master-data/grade-list.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ModelListService} from '../../../api/master-data/model-list.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import {GradeListModel, ModelListModel} from '../../../core/models/sales/model-list.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'grade-production',
  templateUrl: './grade-production.component.html',
  styleUrls: ['./grade-production.component.scss']
})
export class GradeProductionComponent implements OnInit {
  @ViewChild('gradeProductionModal', {static: false}) gradeProductionModal;

  fieldGridGrade;
  fieldGridProduction;
  models: Array<ModelListModel>;
  grades: Array<GradeListModel>;
  gradeParams;
  gradeProductionParams;
  modelId = '';
  selectedGrade: GradeListModel;
  selectedGradeProduction;
  constructor(
    private modelListService: ModelListService,
    private gradeListService: GradeListService,
    private gradeProductionService: GradeProductionService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmService,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService
  ) {
    this.fieldGridGrade = [
      {field: 'marketingCode'},
      {field: 'enName'},
      {field: 'vnName'}
    ];
    this.fieldGridProduction = [
      {field: 'productionCode'},
      {field: 'shortModel'},
      {field: 'fullModel'},
      {
        headerName: 'Frame Length',
        field: 'frameNoLength',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'status',
        valueFormatter: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {
        headerName: 'WMI',
        field: 'wmi'
      },
      {
        headerName: 'VDS',
        field: 'vds'
      },
      {
        headerName: 'CBU/CKD',
        field: 'cbuCkd',
        valueFormatter: params => this.renderCkdCbuLexus(params)
      },
      {
        headerName: 'Fuel',
        field: 'gasolineType'
      },
      {
        headerName: 'Audio Installation',
        field: 'isHasAudio'
      },
      {field: 'isFirmColor'},
      {
        field: 'ordering',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'fromDate',

      },
      {
        field: 'toDate',

      },
    ];
  }

  ngOnInit() {
    this.getModels();
  }

  private getModels() {
    this.loadingService.setDisplay(true);
    this.modelListService.getModelTable().subscribe(models => {
      this.models = models;
      this.loadingService.setDisplay(false);
    });
  }

  private renderCkdCbuLexus(params) {
    const cbuCkdLexusKey = [{name: 'CBU', key: 'Y'}, {name: 'CKD', key: 'N'}, {name: 'Lexus', key: 'L'}];
    const val = cbuCkdLexusKey.find(item => params.value === item.key);
    return val ? val.name : null;
  }

  onModelChange() {
    this.refreshGradeList();
  }

  callbackGradeList(params) {
    this.loadingService.setDisplay(true);
    this.gradeListService.getGrades().subscribe(grades => {
      setTimeout(() => {
        this.gradeParams.api.setRowData(grades);
      }, 100);
      params.api.setRowData(grades);
      this.loadingService.setDisplay(false);
    });
    this.gradeParams = params;
  }

  refreshGradeList() {
    this.getModels();
    this.selectedGrade = undefined;
    this.selectedGradeProduction = undefined;
    setTimeout(() => {
      this.gradeProductionParams.api.setRowData();
    }, 500);
    this.loadingService.setDisplay(true);
    const apiCall = this.modelId !== ''
      ? this.gradeListService.getGradeTable(this.modelId)
      : this.gradeListService.getGrades();

    apiCall.subscribe(grades => {
      this.gradeParams.api.setRowData(grades);
      this.loadingService.setDisplay(false);
    });
  }

  getParamsGradeList() {
    const selectedGrade = this.gradeParams.api.getSelectedRows();
    this.selectedGradeProduction = undefined;
    if (selectedGrade) {
      this.selectedGrade = selectedGrade[0];
      this.refreshGradeProductionList();
    }
  }

  callbackGradeProduction(params) {
    this.gradeProductionParams = params;
  }

  getParamsGradeProduction() {
    const selectedGradeProduction = this.gradeProductionParams.api.getSelectedRows();
    if (selectedGradeProduction) {
      this.selectedGradeProduction = selectedGradeProduction[0];
    }
  }

  refreshGradeProductionList() {
    this.gradeProductionService.getGradeProductionTable(this.selectedGrade.id).subscribe(gradeProductions => {
      setTimeout(() => {
        this.gradeProductionParams.api.setRowData(gradeProductions);
      });
    });
    this.selectedGradeProduction = undefined;
  }

  updateProduction() {
    this.selectedGradeProduction
      ? this.gradeProductionModal.open(this.selectedGrade, this.selectedGradeProduction)
      : this.swalAlertService.openWarningForceSelectData('You haven\'t selected any Grade Production, please select one to update', 'Select a Grade Production');
  }

  addProduction() {
    this.selectedGrade
      ? this.gradeProductionModal.open(this.selectedGrade)
      : this.swalAlertService.openWarningForceSelectData('You haven\'t selected any Grade, please select one to add Production to it', 'Select a Grade');
  }

  deleteGradeProduct() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.gradeProductionService.deleteGradeProduction(this.selectedGradeProduction.id).subscribe(() => {
          this.refreshGradeProductionList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
