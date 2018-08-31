export default theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    width: '100%',
    alignItems: 'center'
  },
  paper: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%'
  },
  inputs: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem'
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: '100%'
  }
})
