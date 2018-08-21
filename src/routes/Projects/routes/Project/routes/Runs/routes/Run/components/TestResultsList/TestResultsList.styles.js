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
  }
})
