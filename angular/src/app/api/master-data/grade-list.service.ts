import {Injectable, Injector} from '@angular/core';
import {BaseApiSaleService} from '../base-api-sale.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class GradeListService extends BaseApiSaleService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('tmss/grades', true);
  }

  getGrades(searchAvailable?, listType?) {
    let searchType;
    if (!listType) {
      searchType = ['Y', 'N', 'L'];
    } else {
      if (listType === 'notLexus') {
        searchType = ['Y', 'N'];
      } else if (listType === 'lexusOnly' || listType === 'L') {
        searchType = ['L'];
      } else {
        searchType = listType === 'Y' ? ['Y'] : listType === 'N' ? ['N'] : [];
      }
    }
    const searchObj = {listType: searchType, status: searchAvailable ? 'Y' : undefined};
    return this.post(`/find_grade`, searchObj);
  }

  getGradesByForm(formName) {
    return this.get(`/form/${formName}`);
  }

  getGradeTable(modelId) {
    return this.get(`/${modelId}`);
  }

  getGradeColor(gradeId, isGetAvailable?) {
    const condition = isGetAvailable ? `?status=Y` : '';
    return this.get(`/color/${gradeId}${condition}`);
  }

  getGradeColorArr(gradeIdArr) {
    return this.post('/color', gradeIdArr);
  }

  createNewGrade(grade) {
    return this.post('', grade);
  }

  updateGrade(grade) {
    return this.put(`/${grade.id}`, grade);
  }

  deleteGrade(gradeId) {
    return this.delete(`/${gradeId}`);
  }

}
