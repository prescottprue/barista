export default theme => ({
  container: {
    ...theme.mixins.gutters(),
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    alignSelf: 'flex-start'
  }
})
