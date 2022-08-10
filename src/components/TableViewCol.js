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
function parseGroupedColumns(groupedColumns /*, displayColumns*/) {
  let index = 0;
  return groupedColumns.reduce((acc, cur) => {
    const header = { name: cur.groupName, type: 'header' };
    const columns = cur.groupItems.reduce((acc1, cur1) => {
      if (
        // !displayColumns.some(column => column.name === cur1.name) ||
        cur1.options.display === 'excluded' ||
        cur1.viewColumns === false
      ) {
        return acc1;
      }
      return { ...cur, type: 'column', dataIndex: index++ };
    }, []);
    return columns.length > 0 ? [...acc, header, ...columns] : acc;
  });
}

export default function TableViewCol({ columns, groupedColumns, onColumnUpdate, components, options }) {
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
    setDisplayColumns(
      dataSet.reduce((acc, cur) => {
        if (cur.type === 'column' && cur.label.toLowerCase().includes(searchValue)) acc.push(cur);
        return acc;
      }, []),
    );
  };

  const onCheck = index => {
    setDisplayColumns(prev => {
      [
        ...prev.map(c => {
          if (c.dataIndex === index) {
            const tmp = c;
            tmp.display = c.display === 'true' ? 'false' : 'true';
          }
          return c;
        }),
      ];
    });
    onColumnUpdate(index);
  };

  const onCheckGrouped = name => {
    setDisplayColumns(prev => {
      [
        ...prev.map(c => {
          if (c.name === name) {
            const tmp = c;
            tmp.display = c.display === 'true' ? 'false' : 'true';
          }
          return c;
        }),
      ];
    });
    onColumnUpdate(displayColumns.find(column => column.name === name).dataIndex);
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
                  onChange={() => onCheck(dataIndex)}
                  checked={display === 'true'}
                  value={name}
                />
              }
              label={label}
            />
          );
        })}

        {/*{groupedColumns?.length > 0*/}
        {/*  ? groupedColumns.map(group => {*/}
        {/*      return [*/}
        {/*        group.groupItems.length > 0 && (*/}
        {/*          <ListSubheader disableSticky className={classes.listSubheader}>*/}
        {/*            {group.groupName}*/}
        {/*          </ListSubheader>*/}
        {/*        ),*/}
        {/*        group.groupItems.reduce((acc, cur) => {*/}
        {/*          if (*/}
        {/*            !displayColumns.some(column => column.name === cur.name) ||*/}
        {/*            cur.options.display === 'excluded' ||*/}
        {/*            cur.viewColumns === false*/}
        {/*          ) {*/}
        {/*            return acc;*/}
        {/*          }*/}
        {/*          return [*/}
        {/*            ...acc,*/}
        {/*            <FormControlLabel*/}
        {/*              classes={{ label: classes.checkboxLabel }}*/}
        {/*              key={cur.name}*/}
        {/*              control={*/}
        {/*                <CheckboxComponent*/}
        {/*                  color="primary"*/}
        {/*                  className={classes.checkbox}*/}
        {/*                  data-description="column display option"*/}
        {/*                  onChange={() => onCheckGrouped(cur.name)}*/}
        {/*                  checked={displayColumns.find(column => column.name === cur.name).display === 'true'}*/}
        {/*                  value={cur.name}*/}
        {/*                />*/}
        {/*              }*/}
        {/*              label={cur.label}*/}
        {/*            />,*/}
        {/*          ];*/}
        {/*        }, []),*/}
        {/*      ];*/}
        {/*    })*/}
        {/*  : displayColumns.map(({ display, label, name, dataIndex }) => {*/}
        {/*      return (*/}
        {/*        <FormControlLabel*/}
        {/*          classes={{ label: classes.checkboxLabel }}*/}
        {/*          key={name}*/}
        {/*          control={*/}
        {/*            <CheckboxComponent*/}
        {/*              color="primary"*/}
        {/*              className={classes.checkbox}*/}
        {/*              data-description="column display option"*/}
        {/*              onChange={() => onCheck(dataIndex)}*/}
        {/*              checked={display === 'true'}*/}
        {/*              value={name}*/}
        {/*            />*/}
        {/*          }*/}
        {/*          label={label}*/}
        {/*        />*/}
        {/*      );*/}
        {/*  })}*/}
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
