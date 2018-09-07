export default theme => ({
  detailsRoot: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  repo: {
    display: 'grid',
    gridTemplateColumns: '112px 1fr',
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
    gridColumnStart: 2,
    gridColumnEnd: 3,
    fontSize: '16px',
    alignSelf: 'center'
  },
  link: {
    '&:hover': {
      color: theme.palette.primary.light,
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  }
})
