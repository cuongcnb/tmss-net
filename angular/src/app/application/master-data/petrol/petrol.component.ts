import { Component, OnInit, ViewChild } from '@angular/core';
import { PetrolService} from '../../../api/master-data/petrol.service';
import { DealerListService} from '../../../api/master-data/dealer-list.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'petrol',
  templateUrl: './petrol.component.html',
  styleUrls: ['./petrol.component.scss']
})
export class PetrolComponent implements OnInit {
  @ViewChild('petrolModal', {static: false}) petrolModal;

  fieldGrid;
  petrolParams;
  petrols;
  dealers;
  dealerId: number;
  selectedPetrol;

  constructor(
    private petrolService: PetrolService,
    private dealerService: DealerListService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmationService: ConfirmService,
  ) {
    this.fieldGrid = [
      {headerName: 'Grade Production', field: 'produceCode', width: 150},
      {field: 'quantityAmount', width: 100, cellClass: ['cell-border', 'text-center'], filter: 'agNumberColumnFilter', },
    ];
  }

  ngOnInit() {
    this.getDealers();
  }

  getDealers() {
    this.loadingService.setDisplay(true);
    this.dealerService.getDealers().subscribe(dealers => {
      this.dealers = dealers;
      if (!this.dealerId) {
        if (dealers && dealers.length) {
          this.dealerId = dealers[0].id;
        }
        this.getPetrols();
      }
      this.loadingService.setDisplay(false);
    });
  }

  onDealerChange() {
    this.getPetrols();
  }

  getPetrols() {
    this.selectedPetrol = undefined;
    this.loadingService.setDisplay(true);
    this.petrolService.getPetrolTable(this.dealerId).subscribe(petrols => {
      this.petrols = petrols;
      this.petrolParams.api.setRowData(this.petrols);
      this.loadingService.setDisplay(false);
    });
  }

  callbackGridPetrol(params) {
    this.petrolParams = params;
  }

  refreshList() {
    this.getPetrols();
  }

  getParamsPetrol() {
    const selectedPetrol = this.petrolParams.api.getSelectedRows();
    if (selectedPetrol) {
      this.selectedPetrol = selectedPetrol[0];
    }
  }

  updatePetrol() {
    if (this.selectedPetrol) {
      this.petrolModal.open(this.selectedPetrol);
    } else {
      this.swalAlertService.openWarningForceSelectData();
    }
  }

  deletePetrol() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.petrolService.deletePetrol(this.selectedPetrol.id).subscribe(() => {
          this.refreshList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
