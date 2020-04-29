import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {Form, FormBuilder, FormGroup} from '@angular/forms';
import {UpdateKmModel} from '../../../core/models/warranty/update-km.model';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import {RepairOrderApi} from '../../../api/quotation/repair-order.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'update-km',
  templateUrl: './update-km.component.html',
  styleUrls: ['./update-km.component.scss']
})
export class UpdateKmComponent implements OnInit {
  @ViewChild('editKmForm', {static: false}) editKmForm;
  form: FormGroup;

  fieldGrid;
  params;
  selectedData: UpdateKmModel;
  data: Array<UpdateKmModel>;
  paginationParams;
  paginationTotalsData: number;
  dlrList;

  constructor(
    private loadingService: LoadingService,
    private dealerListService: DealerListService,
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private repaiOrderApi: RepairOrderApi
  ) {
    this.fieldGrid = [
      {
        headerName: 'Dealer',
        headerTooltip: 'Dealer',
        field: 'dlrId',
        cellRenderer: params => {
          const index = this.dlrList.findIndex(c => c.id === params.data.dlrId);
          return this.dlrList[index].abbreviation;
        },
        pinned: true,
        resizable: true,
      },
      {
        headerName: 'Repair Oder No',
        headerTooltip: 'Repair Oder No',
        field: 'roNo',
        pinned: true,
        resizable: true
      },
      {
        headerName: 'Register No',
        headerTooltip: 'Register No',
        field: 'registerNo',
        pinned: true,
        resizable: true,
      },
      {
        headerName: 'Vin',
        headerTooltip: 'Vin',
        field: 'vinno',
        pinned: true,
        resizable: true,
      },
      {
        headerName: 'Km',
        headerTooltip: 'Km',
        field: 'km',
        pinned: true,
        resizable: true,
      },
      {
        headerName: 'Meet Customer',
        headerTooltip: 'Meet Customer',
        field: 'meetCus',
        pinned: true,
        resizable: true,
      },
      {
        headerName: 'Open RO Date',
        headerTooltip: 'Open RO Date',
        field: 'openRoDate',
        pinned: true,
        resizable: true,
      },
    ];
  }

  ngOnInit() {
    this.buildForm();
    this.getDealerList();
  }

  private getDealerList() {
    this.loadingService.setDisplay(true);
    this.dealerListService.getAvailableDealers().subscribe(dealerList => {
        this.dlrList = dealerList;
        this.loadingService.setDisplay(false);
        this.dlrList.shift();
      }, () => this.swalAlertService.openFailToast('Đã có lỗi xảy ra'),
      () => this.search());
  }

  callbackGrid(params) {
    params.api.setRowData([]);
    this.params = params;
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows()[0];
    if (selectedData) {
      this.selectedData = selectedData;
    }
  }

  refreshData() {
    this.search();
  }

  search() {
    const formValue = this.form.getRawValue();
    const searchData = {
      dlrId: formValue.dlrId,
      roNo: formValue.roNo
    };
    this.selectedData = undefined;
    this.loadingService.setDisplay(true);
    this.repaiOrderApi.getUpdateKm(searchData, this.paginationParams).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.data = res.list;
      this.paginationTotalsData = res.total;
      this.params.api.setRowData(this.data);
    });
  }

  changePaginationParams(paginationParams) {
    if (!this.data) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dlrId: [414],
      roNo: ['']
    });
  }
}
