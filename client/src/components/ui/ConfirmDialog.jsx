import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmVariant = 'danger', loading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm"
    footer={
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>{confirmText}</Button>
      </div>
    }
  >
    <p className="text-text-secondary">{message}</p>
  </Modal>
);
export default ConfirmDialog;
