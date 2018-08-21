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
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: '100%'
  },
  title: {
    alignSelf: 'center'
  },
  reRunButton: {
    alignSelf: 'flex-end'
  },
  columnLabels: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    marginLeft: '1rem',
    width: '100%',
    marginRight: '1rem'
  },
  columnLabel: {
    fontWeight: 200,
    fontSize: '.9rem'
  },
  status: {
    paddingLeft: '1rem'
  }
})
