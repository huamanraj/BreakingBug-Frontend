import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, styled, tableCellClasses, TablePagination, Button } from '@mui/material';

// ERROR:: 'ButtonHaver' is not defined
const ButtonHaver = ({ row }) => (
  <>
    <Button variant="contained" color="primary" size="small" onClick={() => console.log('Edit', row)}>
      Edit
    </Button>
    <Button variant="contained" color="secondary" size="small" onClick={() => console.log('Delete', row)} style={{ marginLeft: '8px' }}>
      Delete
    </Button>
  </>
);

const TableTemplate = ({ columns, rows }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  return (
    <>
      <TableContainer>
        <Table aria-label="sticky table">
          <TableBody>
            <StyledTableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
              <StyledTableCell align="center">
                Actions
              </StyledTableCell>
            </StyledTableRow>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <StyledTableCell key={column.id} align={column.align}>
                        {
                          column.format && typeof value === 'number'
                            ? column.format(value)
                            : value
                        }
                      </StyledTableCell>
                    );
                  })}
                  <StyledTableCell align="center">
                    <ButtonHaver row={row} />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </>
  );
}

export default TableTemplate;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: { // Ensure correct import for 'tableCellClasses'
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: { // Ensure correct import for 'tableCellClasses'
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));