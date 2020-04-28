export class TmssDate {
  // tslint:disable-next-line:variable-name
  private _date: Date;

  constructor(date: string) {
    if (date) {
      const dateFormats = date.split('/');
      const newDate = `${dateFormats[1]}/${dateFormats[0]}/${dateFormats[2]}`;
      this._date = new Date(newDate);
    }
  }

  get date() {
    return this._date;
  }

  set date(value) {
    this._date = value;
  }

  getDate() {
    return this._date.getDate();
  }
}
