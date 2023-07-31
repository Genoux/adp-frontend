import { Button } from "@/app/components/ui/button";
import clsx from "clsx";

type ConfirmButtonProps = {
  onClick: () => void;
  disabled: boolean;
  text: string;
};

const ConfirmButton = ({ onClick, disabled, text }: ConfirmButtonProps) => (
  <div className="py-10">
    <Button
      size="lg"
      className={clsx("py-2 px-4", {
        "pointer-events-none": disabled,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </Button>
  </div>
);

export default ConfirmButton;
