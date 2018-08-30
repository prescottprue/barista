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
  inputs: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  instructions: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center'
  },
  testGroups: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing.unit / 4
  }
})
