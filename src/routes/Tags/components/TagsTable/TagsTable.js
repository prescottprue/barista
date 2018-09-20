import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { get } from 'lodash'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import ArrowForward from '@material-ui/icons/ArrowForward'
import { formatDateTime } from 'utils/formatters'
import { TAGS_PATH } from 'constants'

// Column cofiguration
const tagsTableColumns = [
  {
    value: 'name',
    label: 'Tag Name'
  },
  {
    value: 'value',
    label: 'Tag Value'
  },
  {
    value: 'projects',
    format: projects => (projects ? Object.keys(projects).join(', ') : 'Global')
  },
  { value: 'createdAt', format: dateObj => formatDateTime(dateObj) }
]

export const TagsTable = ({ tags, classes }) => (
  <Paper className={classes.root}>
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {tagsTableColumns.map((column, columnInd) => (
            <TableCell key={`${columnInd}-${column.value}`}>
              {column.label || column.value}
            </TableCell>
          ))}
          <TableCell component="th">Edit</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tags.map((row, rowIndex) => {
          return (
            <TableRow key={`${row.value}-${rowIndex}`}>
              {tagsTableColumns.map((column, columnInd) => (
                <TableCell
                  component="th"
                  scope="row"
                  key={`${rowIndex}-${row.value}-${columnInd}-${column.value}`}>
                  {column.format
                    ? column.format(get(row, column.value), row)
                    : get(row, column.value, '-')}
                </TableCell>
              ))}
              <TableCell scope="row">
                <Tooltip title="View Details">
                  <Button
                    variant="fab"
                    color="primary"
                    aria-label="go-to-details"
                    component={Link}
                    to={`${TAGS_PATH}/${row.id}`}
                    mini>
                    <ArrowForward />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  </Paper>
)

TagsTable.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  tags: PropTypes.array // from enhancer (firestoreConnect + connect)
}

export default TagsTable
