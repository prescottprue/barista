export default theme => ({
  root: {
    marginLeft: '1rem',
    marginRight: '1rem'
  },
  summaryRoot: {
    padding: 0
  },
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)'
  },
  data: {
    display: 'block',
    alignSelf: 'center'
  },
  dateWords: {
    textAlign: 'left'
  },
  fail: {
    color: 'red'
  },
  pass: {
    color: 'green'
  },
  pending: {
    color: 'grey',
  },
  buttonContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    justifySelf: 'center',
    paddingRight: '0 !important'
  },
  button: {
    margin: theme.spacing.unit
  },
  reRunButton: {
    gridColumnStart: 1
  },
  detailsButton: {
    gridColumnStart: 2
  },
})
