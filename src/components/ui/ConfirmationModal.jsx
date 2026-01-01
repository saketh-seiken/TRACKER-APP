import React from "react";
import { THEME } from "./theme";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`${THEME.card} p-6 rounded-2xl max-w-sm w-full mx-4`}>
        <h3 className={`text-lg font-bold ${THEME.text} mb-4`}>Confirm</h3>
        <p className={`${THEME.subText} mb-6`}>{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-xl ${THEME.cyanBg} text-black font-bold`}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationModal;
