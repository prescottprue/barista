export default theme => ({
  detailsRoot: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  repo: {
    display: 'grid',
    gridTemplateColumns: '96px 1fr',
    gridColumnGap: '.75rem',
    gridRowGap: '.75rem',
    padding: '32px'
  },
  label: {
    gridColumnStart: 1,
    gridColumnEnd: 2,
    alignSelf: 'center',
    '&:after': {
      content: ':'
    }
  },
  value: {
    display: 'flex',
    alignItems: 'center',
    gridColumnStart: 2,
    gridColumnEnd: 3,
    fontSize: '16px',
    alignSelf: 'center'
  },
  link: {
    fontSize: '16px',
    '&:hover': {
      color: theme.palette.primary.light,
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  copyButton: {
    width: '24px',
    height: '24px',
    marginLeft: '.5rem'
  },
  copyIcon: {
    width: '16px',
    height: '16px'
  }
})
