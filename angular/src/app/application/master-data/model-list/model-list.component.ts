import {Component, ViewChild} from '@angular/core';
import {ModelListService} from '../../../api/master-data/model-list.service';
import {GradeListService} from '../../../api/master-data/grade-list.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss']
})
export class ModelListComponent {
  @ViewChild('modelListModal', {static: false}) modelListModal;
  @ViewChild('gradeListModal', {static: false}) gradeListModal;

  fieldGridModel;
  fieldGridGrade;
  modelParams;
  gradeParams;
  selectedModel;
  selectedGrade;

  constructor(private modelListService: ModelListService,
              private gradeListService: GradeListService,
              private confirmationService: ConfirmService,
              private loadingService: LoadingService,
              private swalAlertService: ToastService,
  ) {
    this.fieldGridModel = [
      {
        headerName: 'Marketing Code',
        field: 'marketingCode',
      },
      {
        headerName: 'Production Code',
        field: 'productionCode',
      },
      {
        field: 'enName',
      },
      {
        field: 'vnName',
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
        }
      },
      {
        field: 'description',
        cellClass: ['cell-border', 'cell-wrap-text'],
        autoHeight: true
      },
    ];
    this.fieldGridGrade = [
      {
        headerName: 'Marketing Code',
        field: 'marketingCode',
      },
      {
        field: 'enName',
      },
      {
        field: 'vnName',
      },
      {
        headerName: 'CBU/CKD',
        field: 'cbuCkd',
        cellRenderer: params => this.renderCkdCbuLexus(params)
      },
      {
        headerName: 'Request color in Firm order',
        field: 'isFirmColor',
        cellRenderer: params => params.value === 'Y' ? 'Yes' : 'No'
      },
      {
        headerName: 'Audio',
        field: 'isHasAudio',
        cellRenderer: params => params.value === 'Y' ? 'Yes' : 'No'
      },
      {
        headerName: 'Gasoline Type',
        field: 'gasolineType',
      },
      {
        field: 'status',
        cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {
        headerName: 'Order',
        field: 'ordering',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      }
    ];
  }

  private renderCkdCbuLexus(params) {
    const cbuCkdLexusKey = [{name: 'CBU', key: 'Y'}, {name: 'CKD', key: 'N'}, {name: 'Lexus', key: 'L'}];
    const val = cbuCkdLexusKey.find(item => params.value === item.key);
    return val ? val.name : null;
  }

  callbackGridModel(params) {
    this.loadingService.setDisplay(true);
    this.modelListService.getModelTable().subscribe(models => {
      params.api.setRowData(models);
      this.loadingService.setDisplay(false);
    });
    this.modelParams = params;
  }

  getParamsModel() {
    const selectedModel = this.modelParams.api.getSelectedRows();
    this.selectedGrade = undefined;
    this.loadingService.setDisplay(true);
    if (selectedModel) {
      this.selectedModel = selectedModel[0];
      this.refreshGradeList();
      this.loadingService.setDisplay(false);
    }
  }

  refreshModelList() {
    this.selectedModel = undefined;
    this.selectedGrade = undefined;
    this.gradeParams.api.setRowData();
    this.callbackGridModel(this.modelParams);
    // this.modelParams.setRowData();
  }

  callbackGridGrade(params) {
    this.gradeParams = params;
  }

  getParamsGrade() {
    const selectedGrade = this.gradeParams.api.getSelectedRows();
    if (selectedGrade) {
      this.selectedGrade = selectedGrade[0];
    }
  }

  refreshGradeList() {
    this.gradeListService.getGradeTable(this.selectedModel.id).subscribe(grades => {
      setTimeout(() => {
        this.gradeParams.api.setRowData(grades);
      });
    });
    this.selectedGrade = undefined;
  }

  updateModelData() {
    if (this.selectedModel) {
      this.modelListModal.open(this.selectedModel);
    } else {
      this.swalAlertService.openWarningModal('You haven\'t selected any Model, please select one', 'Select a Model');
    }
  }

  deleteModel() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.modelListService.deleteModel(this.selectedModel.id).subscribe(() => {
          this.refreshModelList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
      }

  updateGrade() {
    if (this.selectedGrade) {
      this.gradeListModal.open(this.selectedModel.id, this.selectedGrade);
    } else {
      this.swalAlertService.openWarningModal('You haven\'t selected any row, please select one to update', 'Select a Grade');
    }
  }

  addGrade() {
    if (this.selectedModel) {
      this.gradeListModal.open(this.selectedModel.id);
    } else {
      this.swalAlertService.openWarningModal('You haven\'t selected any Model, please select one', 'Select a Model');
    }
  }

  deleteGrade() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.gradeListService.deleteGrade(this.selectedGrade.id).subscribe(() => {
          this.refreshGradeList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
