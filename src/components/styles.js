import { makeStyles } from '@material-ui/core/styles';

export const columnSelectionStyles = makeStyles(theme => ({
  root: { padding: '16px 24px 16px 24px', fontFamily: 'Roboto' },
  title: {
    marginLeft: '-7px',
    marginRight: '24px',
    fontSize: '14px',
    color: theme.palette.text.secondary,
    textAlign: 'left',
    fontWeight: 500,
    lineHeight: '200%',
  },
  formGroup: {
    marginTop: '8px',
  },

  checkbox: {
    height: 35,
  },
  checkboxLabel: {
    fontSize: '15px',
  },
  listSubheader: {
    marginLeft: '0px',
  },
}));

export const columnSearchBarStyles = makeStyles(theme => ({
  searchBar: {
    marginTop: theme.spacing(1),
  },
  searchClearAdornment: {
    '&:hover': { cursor: 'pointer' },
  },
  searchAdornment: {
    color: theme.palette.text.secondary,
  },
}));
