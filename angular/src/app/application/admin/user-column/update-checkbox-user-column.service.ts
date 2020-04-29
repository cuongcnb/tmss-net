import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class UpdateCheckboxUserColumnService {
  paramsData;
  onViewChange = new EventEmitter<any>();
  onUpdateChange = new EventEmitter<any>();

  setParamsData(paramsData) {
    this.paramsData = paramsData;
  }

  isViewChange(isViewData) {
    this.onViewChange.emit();
    if (!isViewData) {
      this.paramsData.isUpdate = false;
    }
  }

  isUpdateChange(isUpdateData) {
    this.onUpdateChange.emit();
    if (isUpdateData) {
      this.paramsData.isView = true;
    }
  }
}
