export default theme => ({
  root: {
    ...theme.mixins.gutters(),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  titleBar: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
    width: '100%'
  },
  title: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
})
