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
  },
  empty: {
    ...theme.mixins.gutters(),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: theme.spacing.unit * 20
  }
})
