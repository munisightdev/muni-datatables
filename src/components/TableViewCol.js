import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormControl, Typography, FormGroup, Checkbox, FormControlLabel, ListSubheader } from '@mui/material';
import { columnSelectionStyles as getStyles } from './styles';
import TableViewColSearchBar from './TableViewColSearchBar';

function parseColumns(columns) {
  return columns.reduce((acc, { label, name, display }, dataIndex) => {
    if (display !== 'excluded') acc.push({ label, dataIndex, name, display });
    return acc;
  }, []);
}
function parseGroupedColumns(groupedColumns) {
  let index = 0;
  return groupedColumns.reduce((acc, cur) => {
    const header = { name: cur.groupName, type: 'header' };
    const columns = cur.groupItems.reduce((acc1, cur1) => {
      if (cur1.options.display === 'excluded' || cur1.viewColumns === false) {
        return acc1;
      }
      return [...acc1, { ...cur1, type: 'column', dataIndex: index++, display: cur1.options.display }];
    }, []);
    return columns.length > 0 ? [...acc, header, ...columns] : acc;
  }, []);
}

export default function TableViewCol({ columns, groupedColumns, onColumnUpdate, onSelectAllColumns, onDeselectAllColumns, components, options }) {
  const defaultColumns =
    groupedColumns.length > 0
      ? useMemo(() => parseGroupedColumns(groupedColumns), [groupedColumns])
      : useMemo(() => parseColumns(columns), [columns]);
  const [displayColumns, setDisplayColumns] = useState(defaultColumns);
  const classes = getStyles();

  const textLabels = options.textLabels.viewColumns;
  const showSearch = options.viewColumnsSearch || false;
  const CheckboxComponent = components.Checkbox || Checkbox;

  const handleColumnSearchBarChange = (value, previous) => {
    // if the input is the same or builds on top of the previous we can just search inside the same dataset
    const dataSet = value.includes(previous) ? displayColumns : defaultColumns;
    const searchValue = value.toLowerCase();
    const columns = dataSet.reduce((acc, cur) => {
      if (cur.type === 'header' && acc.length > 0 && acc.slice(-1)[0]?.type === 'header') {
        acc.pop();
      }
      if (cur.type === 'header' || (cur.type === 'column' && cur.label.toLowerCase().includes(searchValue)))
        acc.push(cur);
      return acc;
    }, []);
    if (columns.slice(-1)[0]?.type === 'header') {
      columns.pop();
    }
    setDisplayColumns(columns);
  };

  const onCheck = (index, name) => {
    setDisplayColumns(prev => [
      ...prev.map(c => {
        if (c.dataIndex === index) {
          const tmp = c;
          tmp.display = c.display === 'true' ? 'false' : 'true';
        }
        return c;
      }),
    ]);
    onColumnUpdate(
      groupedColumns.length > 0 ? parseColumns(columns).find(column => column.name === name).dataIndex : index,
    );
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
      {options.selectAll && (
          <FormControlLabel
          key={'selectAll'}
          classes={{
            root: classes.formControl,
            label: classes.label,
          }}
          control={
            <CheckboxComponent
              color="primary"
              data-description="table-view-col"
              className={classes.checkbox}
              classes={{
                root: classes.checkboxRoot,
                checked: classes.checked,
              }}
              onChange={() => onSelectAllColumns()}
              checked={columns.every(column => column.display === 'true')}
              value="selectAll"
            />
          }
          label='Select All'
        />
        )}
        {options.deselectAll && (
          <FormControlLabel
            key={'deselectAll'}
            classes={{
              root: classes.formControl,
              label: classes.label,
            }}
            control={
              <CheckboxComponent
                color="primary"
                data-description="table-view-col"
                className={classes.checkbox}
                classes={{
                  root: classes.checkboxRoot,
                  checked: classes.checked,
                }}
                onChange={() => onDeselectAllColumns()}
                checked={columns.every(column => column.display === 'false')}
                value="deselectAll"
              />
            }
            label='Deselect All'
          />
        )}
        {displayColumns.map(({ display, label, name, dataIndex, type = 'column' }) => {
          return type === 'header' ? (
            <ListSubheader disableSticky className={classes.listSubheader}>
              {name}
            </ListSubheader>
          ) : (
            <FormControlLabel
              classes={{ label: classes.checkboxLabel }}
              key={name}
              control={
                <CheckboxComponent
                  color="primary"
                  className={classes.checkbox}
                  data-description="column display option"
                  onChange={() => onCheck(dataIndex, name)}
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
  groupedColumns: PropTypes.array,
  /** Options used to describe table */
  options: PropTypes.object.isRequired,
  /** Callback to trigger View column update */
  onColumnUpdate: PropTypes.func,
  /** Extend the style applied to components */
  classes: PropTypes.object,
};