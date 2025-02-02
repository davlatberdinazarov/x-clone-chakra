import { X } from "lucide-react";
import {
  DialogCloseTrigger,
  DialogContent,
  DialogRoot,
} from "@/components/ui/dialog";
import { ReactElement } from "react";
import { DialogBody } from "@chakra-ui/react";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  body?: ReactElement;
  footer?: ReactElement;
  step?: number;
  totalSteps?: number;
  isEditing?: boolean;
}

const Modal = ({
  body,
  footer,
  isOpen,
  onClose,
  step,
  totalSteps,
  isEditing,
}: ModalProps) => {
  return (
    <DialogRoot placement={"center"} open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`
          "bg-black p-1"
          ${isEditing && "h-[80vh] overflow-x-hidden overflow-y-auto"}
        `}
      >
        <div className="flex items-center gap-6">
          <button className="p-1 border-0 text-white hover:opacity-70 transition w-fit">
            <X size={28} onClick={onClose} />
          </button>
          {step && totalSteps && (
            <div className="text-xl font-bold">
              Step {step} of {totalSteps}
            </div>
          )}
        </div>
        <DialogBody>
          <div className="mt-4">{body}</div>
        </DialogBody>

        {footer && <div>{footer}</div>}
      </DialogContent>
    </DialogRoot>
  );
};

export default Modal;
