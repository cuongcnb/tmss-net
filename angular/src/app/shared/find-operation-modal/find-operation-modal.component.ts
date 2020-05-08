import { Component, EventEmitter, Input, OnInit, Output, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../common-service/set-modal-height.service';
import { ServiceCodeApi } from '../../api/common-api/service-code.api';
import { PaginationParamsModel } from '../../core/models/base.model';
import { CarFamilyApi } from '../../api/common-api/car-family.api';
import { RepairBodyApi } from '../../api/common-api/repair-body.api';
import { TCodeApi } from '../../api/common-api/t-code.api';
import { LoadingService } from '../loading/loading.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'find-operation-modal',
  templateUrl: './find-operation-modal.component.html',
  styleUrls: ['./find-operation-modal.component.scss'],
})
export class FindOperationModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('modal', {static: false}) modal;
  @Input() modalClass;
  fieldGeneralRepair;
  generalRepairParams;
  grList;
  keyword;
  paginationParams: PaginationParamsModel;
  paginationTotalsData: number;

  fieldBodyRepair;
  bodyParams;

  fieldPaint;
  paintParams;
  paintList;
  cmId;
  srvCode;
  form: FormGroup;
  searchForm: FormGroup;
  selectForm: FormGroup;
  selected;
  modalHeight;
  option;
  carFamilyList;
  roType;
  // currentUser = CurrentUser;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter<any>();

  constructor(injector: Injector,
    private formBuilder: FormBuilder,
              private serviceCodeApi: ServiceCodeApi,
              private setModalHeightService: SetModalHeightService,
              private carFamilyApi: CarFamilyApi,
              private repairBodyApi: RepairBodyApi,
              private tCodeApi: TCodeApi,
              private loadingService: LoadingService) {
                super(injector);
    this.fieldGeneralRepair = [
      {
        headerName: 'Mã CV',
        field: 'srvcode',
      }, {
        headerName: 'Model',
        field: 'modelcode',
      }, {
        headerName: 'T/g',
        field: 'dealtime',
      }, {
        headerName: 'Tên CV',
        field: 'srvname',
      },
    ];
    this.fieldBodyRepair = [
      {
        headerName: 'Mã CV',
        field: 'srvcode',
      }, {
        headerName: 'T/g',
        field: 'dealtime',
      }, {
        headerName: 'Tên CV',
        field: 'srvname',
      },
    ];
    this.fieldPaint = [
      {
        headerName: 'Srvcode',
        field: 'tcode',
      },
      {
        headerName: 'Srvname',
        field: 'desceng',
      },
    ];
  }

  ngOnInit() {
    this.onResize();
    if (this.currentUser.isAdmin && !this.carFamilyList) {
      this.carFamilyApi.findAll().subscribe(val => {
        this.carFamilyList = val;
      });
    }
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(roType, cmId, srvCode) {
    this.roType = roType;
    this.cmId = cmId;
    this.srvCode = srvCode;
    if (this.currentUser.isAdmin) {
      switch (roType) {
        case '1':
          this.option = 2;
          break;
        case '2':
          this.option = 1;
          break;
        default:
          this.option = 3;
      }
    } else {
      this.option = 1;
    }
    this.buildForm();
    this.modal.show();
    this.onResize();
    this.form.patchValue({
      type: this.option,
    });
  }

  reset() {
    this.selected = undefined;
    this.form = undefined;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      type: [{value: undefined, disabled: !this.currentUser.isAdmin ? true : null}],
    });
    this.searchForm = this.formBuilder.group({
      keyword: [this.srvCode ? this.srvCode : undefined],
    });
    this.selectForm = this.formBuilder.group({
      option: [undefined],
    });
    this.form.get('type').valueChanges.subscribe(val => {
      this.option = val;
    });
    this.selectForm.get('option').valueChanges.subscribe(val => {
      this.searchBodyRepair(val);
    });
  }

  callbackGeneralRepair(params) {
    this.generalRepairParams = params;
    this.searchGeneralRepair();
  }

  getParamsGeneralRepair() {
    const selected = this.generalRepairParams.api.getSelectedRows();
    if (selected) {
      this.selected = selected[0];
    }
  }

  callbackBody(params) {
    this.bodyParams = params;
    this.searchBodyRepair();
  }

  getParamsBody() {
    const selected = this.bodyParams.api.getSelectedRows();
    if (selected) {
      this.selected = selected[0];
    }
  }

  callbackPaint(params) {
    this.paintParams = params;
    this.paintParams.api.sizeColumnsToFit();
    if (this.paintList) {
      this.paintParams.api.setRowData(this.paintList);
    } else {
      this.searchPaint();
    }

  }

  getParamsPaint() {
    const selected = this.paintParams.api.getSelectedRows();
    if (selected) {
      this.selected = {srvcode: selected[0].tcode};
    }
  }

  searchGeneralRepair(getKeyword?) {
    if (getKeyword) {
      this.keyword = this.searchForm.get('keyword').value;
      this.resetPaginationParams();
    } else {
      this.keyword = this.srvCode;
    }
    this.loadingService.setDisplay(true);
    this.serviceCodeApi.geSrvCodeList(this.paginationParams, this.keyword, this.cmId).subscribe((val: { total: number, list: Array<any> }) => {
      if (val) {
        this.paginationTotalsData = val.total;
        this.grList = val.list;
        this.generalRepairParams.api.setRowData(this.grList);
        this.loadingService.setDisplay(false);
      }
    });
  }

  searchBodyRepair(data?) {
    this.repairBodyApi.find(data).subscribe(val => {
      if (val) {
        this.bodyParams.api.setRowData(val);
      }
    });
  }

  searchPaint() {
    if (!this.paintList) {
      this.tCodeApi.getPaintList().subscribe(val => {
        if (val) {
          this.paintList = val;
          this.paintParams.api.setRowData(this.paintList);
        }
      });
    }
  }

  save() {
    this.close.emit(this.selected);
    this.reset();
    this.modal.hide();
  }

  changePaginationParamsGeneralRepair(paginationParams) {
    if (!this.grList) {
      return;
    }
    this.paginationParams = paginationParams;
    this.searchGeneralRepair();
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  onCancelBtn() {
    this.modal.hide();
  }
}
