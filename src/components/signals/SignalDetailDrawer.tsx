import { Drawer } from "antd";
import { Signal } from "../../models/Signal";
import { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<Signal | undefined>>;
  signal: Signal | undefined;
}

export const SignalDetailDrawer: React.FC<Props> = ({
  open,
  setOpen,
  signal,
}) => {
  return (
    <Drawer
      title={`${signal?.name}`}
      width={"100%"}
      height={"100%"}
      open={open}
      placement={"bottom"}
      closable={true}
      onClose={() => {
        setOpen(undefined);
      }}
      destroyOnClose
    ></Drawer>
  );
};
