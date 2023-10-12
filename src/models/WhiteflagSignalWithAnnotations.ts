import { WhiteflagSignal } from "./WhiteflagSignal";

export class Annotations {
  name?: string;
  text?: string;
}

export class WhiteflagSignalWithAnnotations {
  public signal_body: WhiteflagSignal;
  // public annotations: Annotations;

  // public signal_body: string;
  public annotations: string;

  constructor(signal_body: WhiteflagSignal, annotations: Annotations) {
    this.signal_body = signal_body;
    this.annotations = JSON.stringify(annotations);
  }
}
