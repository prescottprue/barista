export default theme => ({
  root: {
    ...theme.mixins.gutters(),
    display: 'flex',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  titleBar: {
    display: 'grid',
    justifyContents: 'flex-start',
    marginTop: '2rem',
    marginBottom: '2rem',
    marginLeft: '1rem',
    marginRight: '1rem',
    gridTemplateColumns: '[title] auto 150px [actions]'
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
