import { WhiteflagSignal } from "./WhiteflagSignal";

export class Annotations {
  name?: string;
  text?: string;
}

export class WhiteflagSignalWithAnnotations {
  public signal_body: WhiteflagSignal;
  public annotations: Annotations;

  constructor(signal_body: WhiteflagSignal, annotations: Annotations) {
    this.signal_body = signal_body;
    this.annotations = annotations;
  }
}
