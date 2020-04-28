export class FirefoxDate {
  private date: string;
  private Date: Date;

  constructor(date: string) {
    this.date = date;
    this.calc();
  }

  calc() {
    const isFirefox = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
    if (isFirefox && typeof this.date === 'string') {
      const dateArr = this.date.split('-');
      this.date = (`${dateArr[1]} ${dateArr[0]}, ${dateArr[2]}`).toString();
    }
    this.Date = new Date(this.date);
    return this.Date;
  }

  newDate() {
    return this.Date;
  }

  getTime() {
    return this.Date.getTime();
  }

  getDate() {
    return this.Date.getDate();
  }

  getDay() {
    return this.Date.getDay();
  }

  getMonth() {
    return this.Date.getMonth();
  }

  getFullYear() {
    return this.Date.getFullYear();
  }

}
