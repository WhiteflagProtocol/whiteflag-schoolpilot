import { SignalBodyText } from "./SignalBodyText";
import { WhiteflagSignal } from "./WhiteflagSignal";

export class WhiteflagSignalWithAnnotations {
  public signal_body: WhiteflagSignal;
  // public annotations: SignalBodyText;

  public annotations: string;

  constructor(signal_body: WhiteflagSignal, annotations: SignalBodyText) {
    this.signal_body = signal_body;
    this.annotations = JSON.stringify(annotations);
  }
}
