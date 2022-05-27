import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormControl, Typography, FormGroup, Checkbox, FormControlLabel } from '@material-ui/core';
import { columnSelectionStyles as getStyles } from './styles';
import TableViewColSearchBar from './TableViewColSearchBar';

function parseColumns(columns) {
  return columns.reduce((acc, { label, name, display }, dataIndex) => {
    if (display !== 'excluded') acc.push({ label, dataIndex, name, display });
    return acc;
  }, []);
}

export default function TableViewCol({ columns, onColumnUpdate, options }) {
  const defaultColumns = useMemo(() => parseColumns(columns), []);
  const [displayColumns, setDisplayColumns] = useState(defaultColumns);
  const classes = getStyles();

  const handleColumnSearchBarChange = (value, previous) => {
    // if the input is the same or builds on top of the previous we can just search inside the same dataset
    const dataSet = value.includes(previous) ? displayColumns : defaultColumns;
    const searchValue = value.toLowerCase();
    setDisplayColumns(
      dataSet.reduce((acc, cur) => {
        if (cur.label.toLowerCase().includes(searchValue)) acc.push(cur);
        return acc;
      }, []),
    );
  };

  const onCheck = index => {
    setDisplayColumns([
      ...displayColumns.map(c => {
        if (c.dataIndex === index) {
          const tmp = c;
          tmp.display = c.display === 'true' ? 'false' : 'true';
        }
        return c;
      }),
    ]);
    onColumnUpdate(index);
  };

  return (
    <div className={classes.popoverBody}>
      <FormControl component="fieldset" aria-label="view columns dialog title">
        <Typography variant="overline" className={classes.title}>
          {options.textLabels.viewColumns.title}
        </Typography>
        <TableViewColSearchBar setSearchBarText={handleColumnSearchBarChange} />

        <FormGroup className={classes.formBody}>
          {displayColumns.map(({ display, label, name, dataIndex }) => {
            return (
              <FormControlLabel
                classes={{ label: classes.checkboxLabel }}
                key={name}
                control={
                  <Checkbox
                    color="primary"
                    className={classes.checkbox}
                    data-description="column display option"
                    onChange={() => onCheck(dataIndex)}
                    checked={display === 'true'}
                    value={name}
                  />
                }
                label={label}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    </div>
  );
}

TableViewCol.propTypes = {
  columns: PropTypes.array,
  onColumnUpdate: PropTypes.func,
  options: PropTypes.object,
};
