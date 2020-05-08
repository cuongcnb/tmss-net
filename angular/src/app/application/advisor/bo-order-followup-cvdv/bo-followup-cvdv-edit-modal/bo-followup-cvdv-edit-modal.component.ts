import { Component, EventEmitter, OnInit, Output, ViewChild, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import {
  AdvisorEditedDataModel,
  BoPartsFollowupCvdvModel,
} from '../../../../core/models/parts-management/bo-parts-followup-cvdv.model';
import { CurrentUserModel } from '../../../../core/models/base.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { BoOrderFollowupApi } from '../../../../api/parts-management/bo-order-followup.api';
import { AgCheckboxRendererComponent } from '../../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import { AgDatepickerRendererComponent } from '../../../../shared/ag-datepicker-renderer/ag-datepicker-renderer.component';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bo-followup-cvdv-edit-modal',
  templateUrl: './bo-followup-cvdv-edit-modal.component.html',
  styleUrls: ['./bo-followup-cvdv-edit-modal.component.scss']
})
export class BoFollowupCvdvEditModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  selectedBo: BoPartsFollowupCvdvModel;
  // currentUser: CurrentUserModel = CurrentUser;

  form: FormGroup;

  fieldGrid;
  params;
  frameworkComponents;
  displayedData: Array<AdvisorEditedDataModel> = [];
  selectedData: AdvisorEditedDataModel;

  constructor(
    injector: Injector,
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private gridTableService: GridTableService,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private boOrderFollowupApi: BoOrderFollowupApi,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.onResize();
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent,
      agDatepickerRendererComponent: AgDatepickerRendererComponent,
    };
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt'
      },
      {
        headerName: 'Ngày liên hệ',
        headerTooltip: 'Ngày liên hệ',
        field: 'contactDate',
        cellRenderer: 'agDatepickerRendererComponent',
      },
      {
        headerName: 'Ngày liên hệ',
        headerTooltip: 'Ngày liên hệ',
        field: 'appointmentDate',
        cellRenderer: 'agDatepickerRendererComponent',
      },
      {
        headerName: 'Xe trong xưởng',
        headerTooltip: 'Xe trong xưởng',
        field: 'isInGarage',
        cellRenderer: 'agCheckboxRendererComponent',
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'note',
        editable: true,
      }
    ];
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedBo) {
    this.modal.show();
    this.selectedBo = selectedBo;
    this.buildForm();
  }

  reset() {
    this.form = undefined;
  }

  callbackGrid(params) {
    this.params = params;
    this.getEditData();
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  onAddRow() {
    const blankPart = {
      stt: this.displayedData.length + 1,
      appointmentDate: null,
      contactDate: null,
      id: this.selectedBo.reqId,
      isInGarage: null,
      note: null,
      ro: this.selectedBo.soRo,
    };
    this.params.api.updateRowData({ add: [blankPart] });
    this.displayedData = this.gridTableService.getAllData(this.params);
  }

  removeSelectedRow() {
    this.gridTableService.removeSelectedRow(this.params, this.selectedData);
    this.selectedData = undefined;
    this.displayedData = this.gridTableService.getAllData(this.params);
  }

  getEditData() {
    // this.loadingService.setDisplay(true);
    // this.boOrderFollowupApi.getEditDataCvdv(this.selectedBo.reqId).subscribe(data => {
    //   this.displayedData = data;
    //   this.params.api.setRowData(this.displayedData);
    //   this.loadingService.setDisplay(true);
    // });
  }

  save() {
    this.displayedData = this.gridTableService.getAllData(this.params);
    this.loadingService.setDisplay(true);
    this.boOrderFollowupApi.editBoForCvdv(this.displayedData).subscribe(() => {
      this.swalAlertService.openSuccessToast();
      this.modal.hide();
      this.close.emit();
      this.loadingService.setDisplay(false);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      soRo: [{ value: undefined, disabled: true }],
    });

    if (this.selectedBo) {
      this.form.patchValue(this.selectedBo);
    }
  }
}
