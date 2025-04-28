import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import ProgressBar from './ProgressBar';

const PreviewModal = ({
  show,
  product,
  handleClose,
  handleEdit
}) => (
  <Modal show={show} onHide={handleClose} size="lg" centered>
    {/* TODO: Layout from previous PreviewModal section */}
  </Modal>
);

PreviewModal.propTypes = {
  show: PropTypes.bool.isRequired,
  product: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired
};

export default PreviewModal;
