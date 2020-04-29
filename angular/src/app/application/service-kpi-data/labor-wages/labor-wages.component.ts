import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { ServiceKpiDataModel } from '../../../core/models/service-kpi-data/service-kpi-data.model';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'labor-wages',
  templateUrl: './labor-wages.component.html',
  styleUrls: ['./labor-wages.component.scss'],
})
export class LaborWagesComponent implements OnInit {
  @ViewChild('newLaborWages', {static: false}) newLaborWages;
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  fieldGrid;
  form: FormGroup;
  gridParams;
  selectedRowGrid: ServiceKpiDataModel;
  modalHeight;
  dataGrid = [
    {
      packageName: 'Gói 1',
      isFunds: '1000$',
    },
    {
      packageName: 'Gói 2',
      isFunds: '1500$',
    },
    {
      packageName: 'Gói 3',
      isFunds: '2200$',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private confirm: ConfirmService,
    private setModalHeight: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Tên gói', headerTooltip: 'Tên gói', field: 'packageName', editable: true},
      {headerName: 'Khoảng tiền', headerTooltip: 'Khoảng tiền', field: 'isFunds', editable: true},
    ];
  }

  open() {
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  reset() {
    this.form = undefined;
  }

  refresh() {
    this.selectedRowGrid = undefined;
    this.gridParams.api.setRowData(this.dataGrid);
  }

  addNew(data) {
    this.dataGrid.push(data);
    this.refresh();
  }

  editRow() {
    if (this.selectedRowGrid) {
      this.newLaborWages.open(this.selectedRowGrid);
    } else {
      this.swalAlertService.openWarningToast('Bạn phải chọn 1 dòng');
    }
  }

  update(selectedData) {
    this.dataGrid = this.dataGrid.map(data => {
      return data === this.selectedRowGrid ? selectedData : data;
    });
    this.refresh();
  }

  deleteRow() {
    if (this.selectedRowGrid) {
      this.confirm.openConfirmModal('Question?', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        this.dataGrid = this.dataGrid.filter(data => data !== this.selectedRowGrid);
        this.refresh();
      });
    } else {
      this.swalAlertService.openWarningToast('Bạn phải chọn 1 dòng');
    }
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData(this.dataGrid);
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedRowGrid = selectedData[0];
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      sortAgency: [undefined],
      isType: [undefined],
    });
  }
}
