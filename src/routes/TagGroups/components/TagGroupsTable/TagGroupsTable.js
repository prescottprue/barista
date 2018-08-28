import React from 'react'
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import { get } from 'lodash'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

// Column cofiguration
const tagGroupTableColumns = [
  {
    value: 'name',
    label: 'Group Name'
  },
  {
    value: 'projects',
    format: projects => (projects ? Object.keys(projects).join(', ') : 'Global')
  },
  {
    value: 'tags',
    format: tags => tags.map(tag => tag.value).join(', ')
  },
  { value: 'createdAt' }
]

export const TagGroupsTable = ({ tagGroups, classes }) => (
  <Paper className={classes.root}>
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {tagGroupTableColumns.map((column, columnInd) => (
            <TableCell key={`${column.value}-${columnInd}`}>
              {column.label || column.value}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {tagGroups.map((row, rowIndex) => {
          return (
            <TableRow key={`${row.value}-${rowIndex}`}>
              {tagGroupTableColumns.map((column, columnInd) => (
                <TableCell
                  component="th"
                  scope="row"
                  key={`${row.value}-${rowIndex}-${column.value}-${columnInd}`}>
                  {column.format
                    ? column.format(get(row, column.value), row)
                    : get(row, column.value, '-')}
                </TableCell>
              ))}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  </Paper>
)

TagGroupsTable.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  tagGroups: PropTypes.array // from enhancer (firestoreConnect + connect)
}

export default TagGroupsTable
