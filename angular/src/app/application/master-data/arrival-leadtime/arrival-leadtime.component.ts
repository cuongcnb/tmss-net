import { Component, OnInit, ViewChild } from '@angular/core';
import { ArrivalLeadtimeService} from '../../../api/master-data/arrival-leadtime.service';
import { DealerListService} from '../../../api/master-data/dealer-list.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LookupService} from '../../../api/lookup/lookup.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'arrival-leadtime',
  templateUrl: './arrival-leadtime.component.html',
  styleUrls: ['./arrival-leadtime.component.scss']
})
export class ArrivalLeadtimeComponent implements OnInit {
  @ViewChild('arrivalLeadtimeModal', {static: false}) arrivalLeadtimeModal;
  fieldGrid;
  params;
  selectedData;
  dealerList;
  transportFormList;
  fromDealerId;
  toDealerId;
  form: FormGroup;

  constructor(
    private arrivalLeatimeService: ArrivalLeadtimeService,
    private dealerListService: DealerListService,
    private loadingService: LoadingService,
    private lookupService: LookupService,
    private swalAlertService: ToastService,
    private confirmationService: ConfirmService,
    private formBuilder: FormBuilder) {
    this.fieldGrid = [
      {
        headerName: 'Transport From',
        field: 'dealerFrom'
      },
      {
        headerName: 'To Dealer',
        field: 'dealerTo'
      },
      {field: 'transportationType'},
      {
        headerName: 'Number of Days',
        field: 'dayAmount',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'timeAmount',
        cellClass: ['cell-border', 'text-right'],
      },
      {
        field: 'fromExceptionAmount',
        cellClass: ['cell-border', 'text-right'],
      },
      {
        field: 'toExceptionAmount',
        cellClass: ['cell-border', 'text-right'],
      },
    ];
  }

  ngOnInit() {
    this.getDealerList();
  }

  private getDealerList() {
    this.loadingService.setDisplay(true);
    this.lookupService.getDataByCode('transport_from').subscribe(transportFormList => {
      this.transportFormList = transportFormList;
      this.dealerListService.getDealers().subscribe(dealerList => {
        this.dealerList = dealerList;
        this.loadingService.setDisplay(false);
      });
    });

    this.buildForm();
  }

  search() {
    const fromDealerId = this.form.value.fromDealer;
    const toDealerId = this.form.value.toDealerId;
    this.loadingService.setDisplay(true);
    this.arrivalLeatimeService.search(fromDealerId, toDealerId).subscribe(list => {
      this.params.api.setRowData(list);
      this.loadingService.setDisplay(false);
    });

  }

  private buildForm() {
    this.form = this.formBuilder.group({
      fromDealer: [''],
      toDealerId: [''],
    });
  }

  callbackGrid(params) {
    // this.arrivalLeatimeService.getArrivalLeadtime().subscribe(arrivalLeadtimes => {
    //   this.arrivalLeadtimes = arrivalLeadtimes;
    //   params.api.setRowData(this.arrivalLeadtimes);
    // });
    this.params = params;
    this.search();
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  refreshList() {
    this.getDealerList();
    this.callbackGrid(this.params);
    this.selectedData = undefined;
  }

  updateLeadtime() {
    if (this.selectedData) {
      this.arrivalLeadtimeModal.open(this.selectedData);
    } else {
      this.swalAlertService.openWarningForceSelectData();
    }
  }

  deleteLeadTime() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.arrivalLeatimeService.deleteArivalLeadTime(this.selectedData.id).subscribe(() => {
          this.refreshList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
