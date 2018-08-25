export default theme => ({
  root: {
    width: '100%'
  },
  title: {
    marginBottom: '1.5rem'
  },
  notFound: {
    display: 'flex',
    justifyContent: 'center',
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4
  },
  empty: {
    ...theme.mixins.gutters(),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: theme.spacing.unit * 20
  },
  progressMsg: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  }
})
