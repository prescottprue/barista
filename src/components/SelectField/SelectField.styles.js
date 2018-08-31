export default theme => ({
  root: {
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap'
  },
  field: {
    width: '100%',
    maxWidth: theme.spacing.unit * 30
  },
  multiField: {
    margin: theme.spacing.unit,
    minWidth: 120,
    width: '100%',
    maxWidth: theme.spacing.unit * 30
  }
})
