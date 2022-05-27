import { makeStyles } from '@material-ui/core/styles';

export const columnSelectionStyles = makeStyles(theme => ({
  popoverBody: {
    padding: theme.spacing(2),
  },
  formBody: {
    marginTop: theme.spacing(0.5),
  },
  title: {
    color: theme.palette.text.secondary,
    fontWeight: 500,
    lineHeight: '200%',
  },
  checkbox: {
    height: 35,
  },
  checkboxLabel: {
    fontSize: '15px',
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
