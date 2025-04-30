import React from 'react';
import { Table } from 'react-bootstrap';
import { useAdvanceTableContext } from '../../providers/AdvanceTableProvider';

const AdvanceTable = ({ children, className, ...rest }) => {
  // Version simplifiée qui affiche simplement un tableau basique
  return (
    <Table className={className} {...rest}>
      {children}
    </Table>
  );
};

export default AdvanceTable;
