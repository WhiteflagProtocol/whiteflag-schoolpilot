import dayjs from "dayjs";

export class Signal {
  public id: number;
  public type: string;
  public name: string;
  public latitude: number;
  public longitude: number;
  public lastUpdate: string;
  public lastUpdateBy: string;

  constructor(
    id: number,
    type: string,
    name: string,
    latitude: number,
    longitude: number
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.lastUpdate = dayjs().toString();
  }
}

export enum SIGNAL_TYPE {
  school = "School",
  test = "Test",
}
