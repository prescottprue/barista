const baseIcon = {
  height: '1rem',
  width: '1rem',
  marginRight: '.25rem',
  position: 'relative',
  top: '-1px'
}

export default theme => ({
  root: {
    width: '100%',
    marginBottom: '3.5rem'
  },
  content: {
    display: 'grid',
    gridTemplateColumns:
      '[statusIcon] 36px [testTitle] 1fr [skipped] 4rem [passed] 4rem [failed] 4rem',
    marginRight: '1.5rem',
    alignItems: 'center'
  },
  detailsRoot: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 64px 0 32px'
  },
  title: {
    marginBottom: '1.5rem'
  },
  cardTitle: {
    marginBottom: '0',
    textTransform: 'capitalize',
    display: 'flex',
    alignItems: 'center'
  },
  titleIcon: {
    position: 'relative',
    top: '-2px'
  },
  failedIcon: {
    color: theme.palette.error.main,
    ...baseIcon
  },
  passedIcon: {
    color: theme.palette.success.main,
    ...baseIcon
  },
  baseIcon,
  skipIcon: baseIcon,
  iconData: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem'
  }
})
