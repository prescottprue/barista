import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { get, map } from 'lodash'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import ArrowForward from '@material-ui/icons/ArrowForward'
import { formatDateTime } from 'utils/formatters'
import { TEST_GROUPS_PATH } from 'constants'

// Column cofiguration
const tagGroupTableColumns = [
  {
    value: 'name',
    label: 'Group Name'
  },
  {
    value: 'projects',
    format: (projectKeys, { projects, classes }) => {
      return projectKeys ? (
        <div className={classes.chipRoot}>
          {map(projectKeys, (_, projectKey) => {
            return (
              <Chip
                className={classes.chip}
                key={`Project-${projectKey}`}
                label={get(projects, `${projectKey}.name`, projectKey)}
              />
            )
          })}
        </div>
      ) : (
        'Global'
      )
    }
  },
  {
    value: 'tags',
    format: (tagKeys, { tags, classes }) => {
      return tagKeys ? (
        <div className={classes.chipRoot}>
          {map(tagKeys, (_, tagKey) => {
            return (
              <Chip
                className={classes.chip}
                key={`Project-${tagKey}`}
                label={get(tags, `${tagKey}.name`, tagKey)}
              />
            )
          })}
        </div>
      ) : (
        'No Tags'
      )
    }
  },
  {
    value: 'createdAt',
    format: dateObj => formatDateTime(dateObj)
  }
]

export const TestGroupsTable = ({ testGroups, tags, projects, classes }) => (
  <Paper className={classes.root}>
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {tagGroupTableColumns.map((column, columnInd) => (
            <TableCell component="th" key={`${column.value}-${columnInd}`}>
              {column.label || column.value}
            </TableCell>
          ))}
          <TableCell component="th">Edit</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {testGroups &&
          testGroups.map((row, rowIndex) => {
            return (
              <TableRow key={`${row.value}-${rowIndex}`}>
                {tagGroupTableColumns.map((column, columnInd) => (
                  <TableCell
                    scope="row"
                    key={`${row.value}-${rowIndex}-${
                      column.value
                    }-${columnInd}`}>
                    {column.format
                      ? column.format(get(row, column.value), {
                          projects,
                          row,
                          tags,
                          classes
                        })
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
                      to={`${TEST_GROUPS_PATH}/${row.id}`}
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

TestGroupsTable.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  testGroups: PropTypes.array, // from enhancer (firestoreConnect + connect)
  tags: PropTypes.object, // from enhancer (firestoreConnect + connect)
  projects: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default TestGroupsTable
