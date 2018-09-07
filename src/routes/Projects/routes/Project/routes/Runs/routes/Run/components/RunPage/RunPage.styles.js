export default theme => ({
  root: {
    ...theme.mixins.gutters(),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2
  },
  titleBar: {
    display: 'grid',
    gridTemplateColumns: '[back] 56px [title] 1fr',
    alignItems: 'center',
    marginTop: '1rem',
    width: '100%',
    marginBottom: theme.spacing.unit * 2
  },
  title: {
    textAlign: 'center'
  }
})
