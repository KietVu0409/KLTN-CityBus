import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';

import './index.scss';

const style = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '15px',
};

const ModalAlert = (props) => {
  const {
    open,
    handleClose,
    handleCancel,
    handleConfirm,
    title,
    description,
    type,
    btnCancelText,
    btnConfirmText,
    hideBtnConfirm,
    renderContentModal,
    isButton,
    icon = false,
  } = props;
  return (
    <Modal
      className="modal-main"
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={`container ${type}`} sx={style}>
        {icon && (
          <div className="icon">
            <ErrorOutlineIcon className="error" />
            <InfoIcon className="information" />
            <CheckIcon className="confirm" />
          </div>
        )}
        <div className="content">
          <Typography id="modal-modal-title" className="title" variant="h6" component="h3">
            {title}
            <IconButton onClick={handleClose} className="close" aria-label="close">
              <CloseIcon />
            </IconButton>
          </Typography>
          {renderContentModal}

          <Typography id="modal-modal-description" className="description" sx={{ mt: 1 }}>
            {description}
          </Typography>
          {!isButton && (
            <div className="action">
              <Button onClick={handleCancel} className={'cancel-btn'} size="small">
                {btnCancelText || 'Hủy bỏ'}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleConfirm}
                className={`confirm-btn ${hideBtnConfirm ? 'd-none' : 'd-block'}`}
              >
                {btnConfirmText || 'Xác nhận'}
              </Button>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default ModalAlert;
