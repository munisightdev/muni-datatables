import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormControl, Typography, FormGroup, Checkbox, FormControlLabel, ListSubheader } from '@material-ui/core';
import { columnSelectionStyles as getStyles } from './styles';
import TableViewColSearchBar from './TableViewColSearchBar';

function parseColumns(columns) {
  return columns.reduce((acc, { label, name, display }, dataIndex) => {
    if (display !== 'excluded') acc.push({ label, dataIndex, name, display });
    return acc;
  }, []);
}

export default function TableViewCol({ columns, groupColumns, onColumnUpdate, components, options }) {
  const defaultColumns = useMemo(() => parseColumns(columns), [columns]);
  const [displayColumns, setDisplayColumns] = useState(defaultColumns);
  const classes = getStyles();

  const textLabels = options.textLabels.viewColumns;
  const showSearch = options.viewColumnsSearch || false;
  const CheckboxComponent = components.Checkbox || Checkbox;

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

  const handleClearSearchBar = () => {
    setDisplayColumns(defaultColumns);
  };

  return (
    <FormControl className={classes.root} component="fieldset" aria-label="view columns dialog title">
      <Typography variant="overline" className={classes.title}>
        {textLabels.title}
      </Typography>
      {showSearch && (
        <TableViewColSearchBar
          handleSearchBarChange={handleColumnSearchBarChange}
          handleClearSearchBar={handleClearSearchBar}
        />
      )}

      <FormGroup className={classes.formGroup}>
        {groupColumns
          ? columns.map(group => {
              return [
                group.groupItems.length > 0 && <ListSubheader disableSticky>{group.groupName}</ListSubheader>,
                group.groupItems.reduce((acc, item) => {
                  if (column.display === 'excluded' || column.viewColumns === false) {
                    return acc;
                  }
                  return [
                    ...acc,
                    <FormControlLabel
                      classes={{ label: classes.checkboxLabel }}
                      key={column.name}
                      control={
                        <CheckboxComponent
                          color="primary"
                          className={classes.checkbox}
                          data-description="column display option"
                          onChange={() => onCheck(column.dataIndex)}
                          checked={column.display === 'true'}
                          value={column.name}
                        />
                      }
                      label={column.label}
                    />,
                  ];
                }, []),
              ];
            })
          : displayColumns.map(({ display, label, name, dataIndex }) => {
              return (
                <FormControlLabel
                  classes={{ label: classes.checkboxLabel }}
                  key={name}
                  control={
                    <CheckboxComponent
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
  );
}

TableViewCol.propTypes = {
  /** Columns used to describe table */
  columns: PropTypes.array.isRequired,
  /** Specify if columns are to be grouped */
  groupColumns: PropTypes.bool,
  /** Options used to describe table */
  options: PropTypes.object.isRequired,
  /** Callback to trigger View column update */
  onColumnUpdate: PropTypes.func,
  /** Extend the style applied to components */
  classes: PropTypes.object,
};
