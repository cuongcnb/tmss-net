import { Component, OnInit, ViewChild } from '@angular/core';
import { AudioManagementService} from '../../../api/master-data/audio-management.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'audio-management',
  templateUrl: './audio-management.component.html',
  styleUrls: ['./audio-management.component.scss']
})
export class AudioManagementComponent implements OnInit {
  @ViewChild('audioManagementModal', {static: false}) audioManagementModal;

  fieldGrid;
  audioList;
  audioParams;
  selectedAudio;

  constructor(
    private audioManagementService: AudioManagementService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmService,
    private swalAlertService: ToastService,
  ) {
    this.fieldGrid = [
      {field: 'name', minWidth: 200},
      {
        headerName: 'Order',
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
        autoHeight: true,
        minWidth: 300
      },
    ];
  }

  ngOnInit() {
  }

  callbackGridAudio(params) {
    this.loadingService.setDisplay(true);
    this.audioManagementService.getAudioTable().subscribe(audioList => {
      this.audioList = audioList;
      params.api.setRowData(this.audioList);
      this.loadingService.setDisplay(false);
    });
    this.audioParams = params;
  }

  getParamsAudio() {
    const selectedAudio = this.audioParams.api.getSelectedRows();
    if (selectedAudio) {
      this.selectedAudio = selectedAudio[0];
    }
  }

  refreshAudio() {
    this.selectedAudio = undefined;
    this.callbackGridAudio(this.audioParams);
  }

  updateAudio() {
    if (this.selectedAudio) {
      this.audioManagementModal.open(this.selectedAudio);
    } else {
      this.swalAlertService.openWarningForceSelectData();
    }
  }

  deleteAudio() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.audioManagementService.deleteAudio(this.selectedAudio.id).subscribe(() => {
          this.refreshAudio();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
