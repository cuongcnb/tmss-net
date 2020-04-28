import { Injectable, Injector } from "@angular/core";
import { BaseApiService } from "../base-api.service";
import { EnvConfigService } from "../../env-config.service";

@Injectable()
export class CampaignFollowUpApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl("/warranty");
  }

  getListCampaignFollowUp(data, paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, data, paginationParams);
    return this.post("/campaign-follow-up", searchBody);
  }

  getListCampainVehCompleted(data, paginationParams) {
    paginationParams = paginationParams || {
      page: 1,
      size: 20,
    };
    const searchBody = Object.assign({}, data, paginationParams);
    return this.post("/campaign-veh-completed", searchBody);
  }
}
