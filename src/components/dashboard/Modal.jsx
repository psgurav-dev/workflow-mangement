import { useEffect } from "react";
import { CloseIcon } from "../ui/icons";

const Modal = ({ isOpen, onClose, children }) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/40  flex justify-center items-center w-full">
			<div className="p-10 rounded-lg shadow-lg  relative bg-foreground">
				<button className="absolute top-10 right-10  cursor-pointer zp-40" onClick={onClose}>
					<CloseIcon />
				</button>
				{children}
			</div>
		</div>
	);
};

export default Modal;
