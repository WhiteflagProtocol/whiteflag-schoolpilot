import { useNavigate } from "react-router-dom";
import { Drawer } from "antd";
import { useContext } from "react";
import WhiteFlagContext from "../../helpers/Context";

interface DrawerProps extends React.PropsWithChildren {
  className: string;
  open: boolean;
  setOpen: (state: boolean) => void;
  title: React.ReactNode;
}

export const WhiteflagDrawer = ({
  className,
  open,
  setOpen,
  title,
  children,
}: DrawerProps) => {
  const navigate = useNavigate();
  const ctx = useContext(WhiteFlagContext);

  return (
    <Drawer
      title={title}
      width={"100%"}
      height={"100%"}
      open={open}
      placement={"bottom"}
      closable={true}
      onClose={() => {
        setOpen(false);
      }}
      destroyOnClose
    >
      <div className={className}>{children}</div>
    </Drawer>
  );
};
