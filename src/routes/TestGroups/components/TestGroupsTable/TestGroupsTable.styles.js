export default theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  chipRoot: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    maxWidth: 200
  },
  chip: {
    margin: theme.spacing.unit
  },
  table: {
    minWidth: 700
  }
})
