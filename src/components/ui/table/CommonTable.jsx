import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import DynamicRowComponent from "./DynamicRowComponent";
import DynamicOption from "./DynamicOption";
import { AddCircle, MoreVert } from "@mui/icons-material";
import DataNotFoundDynamicTable from "./DataNotFoundDynamicTable";
import { renderTableAction } from "../../../features/ui/uiSlice";

function CommonTable({
  getData,
  header,
  headCells,
  menuOptions,
  data,
  totalDataCount,
  baseRoute,
  style = {},
  limitDropdown,
  textLabel,
  buttonRoute,
  query,
}) {
  const dispatch = useDispatch();
  const { renderTable } = useSelector((state) => state.ui);
  const { countTotalData } = useSelector((state) => state.dataCount);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let pageNumber = searchParams.get("page");
  let offset = searchParams.get("offset");
  let limit = searchParams.get("limit");

  if (
    !pageNumber ||
    !offset ||
    !limit ||
    isNaN(parseInt(pageNumber)) ||
    isNaN(parseInt(offset)) ||
    isNaN(parseInt(limit))
  ) {
    pageNumber = 1;
    offset = 0;
    limit = limitDropdown?.[0] || 5;
  } else {
    pageNumber = parseInt(pageNumber);
    offset = parseInt(offset);
    limit = parseInt(limit);
  }

  const pageCount = Math.ceil(totalDataCount / limit);
  const [pageState, setPageState] = useState({
    page: pageNumber,
    offset: (pageNumber - 1) * limit,
    limit: limit,
    total: 0,
    condition: "change_page",
    data: [],
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedData, setSelectedData] = React.useState({});
  const open = Boolean(anchorEl);

  const [menuRowIndex, setMenuRowIndex] = React.useState(null);
  const [menuCellIndex, setMenuCellIndex] = React.useState(null);

  const handleClick = (event, rowIndex, cellIndex) => {
    setAnchorEl(event.currentTarget);
    setMenuRowIndex(rowIndex);
    setMenuCellIndex(cellIndex);
    setSelectedData(cellIndex);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuRowIndex(null);
    setMenuCellIndex(null);
  };

  const updateURL = (values) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(values).forEach(([key, val]) => params.set(key, val));
    navigate(`${baseRoute}?${params.toString()}`);
  };

  const onChangeLimit = async (event) => {
    const tempLimit = parseInt(event.target.value);
    const newOffset = 0;
    const newPage = 1;
    updateURL({
      page: newPage,
      limit: tempLimit,
      offset: newOffset,
    });
    setPageState((prev) => ({
      ...prev,
      limit: tempLimit,
      page: newPage,
      offset: newOffset,
      condition: "change_limit",
    }));
  };

  const onChangePage = async (event, pageNumber) => {
    const newOffset = (pageNumber - 1) * limit;
    updateURL({
      page: pageNumber,
      limit: pageState.limit,
      offset: newOffset,
    });
    setPageState((prev) => ({
      ...prev,
      page: pageNumber,
      offset: newOffset,
      condition: "change_page",
    }));
  };

  useEffect(() => {
    (async () => {
      const offset = (pageState.page - 1) * pageState.limit;
      navigate(
        `${baseRoute}?offset=${offset}&page=${pageState.page}&limit=${pageState.limit}`
      );
      if (pageState.condition === "change_limit") {
        await getData(pageState.limit, offset, query);
      }
      if (pageState.condition === "change_page") {
        await getData(pageState.limit, offset, query);
      }
    })();
  }, [pageState]);

  useEffect(() => {
    if (renderTable) {
      const offset = (pageState.page - 1) * pageState.limit;

      getData(pageState.limit, offset, query);

      dispatch(renderTableAction({ renderTable: false }));
    }
  }, [renderTable]);

  if (data.length === 0)
    return (
      <DataNotFoundDynamicTable
        showSimple={true}
        textLabel={textLabel}
        buttonRoute={buttonRoute}
        countTotalData={countTotalData}
      />
    );

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: "74vw",
        }}
      >
        <Paper sx={{ mb: 2, width: "100%", overflow: "hidden" }}>
          <TableContainer
            sx={{
              width: "100%",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <Table
              sx={{
                minWidth: { xs: 800, sm: "100%" },
                whiteSpace: "nowrap",
              }}
              aria-labelledby="tableTitle"
              size={"small"}
            >
              <TableHead>
                <TableRow>
                  {header?.map((headCell) => (
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #1e2896ff",
                        color: "primary.main",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        letterSpacing: "0.5px",
                      }}
                      key={headCell}
                    >
                      {headCell}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((p1, i1) => (
                  <TableRow
                    key={i1}
                    role="checkbox"
                    sx={{
                      cursor: "pointer",
                      "& > td, & > th": {
                        paddingX: 2,
                      },
                    }}
                  >
                    {p1.map((p2, i2) => {
                      if (typeof p2 === "object" && !Array.isArray(p2)) {
                        return (
                          <TableCell
                            key={i2}
                            component="th"
                            scope="row"
                            padding="none"
                          >
                            <IconButton
                              aria-label="more"
                              id="long-button"
                              aria-controls={open ? "long-menu" : undefined}
                              aria-expanded={open ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={(e) => handleClick(e, p1, p2)}
                            >
                              <MoreVert />
                            </IconButton>
                            <Menu
                              id="long-menu"
                              anchorEl={anchorEl}
                              open={
                                open &&
                                menuRowIndex === p1 &&
                                menuCellIndex === p2
                              }
                              onClose={handleClose}
                              slotProps={{
                                paper: {
                                  style: {
                                    maxHeight: 48 * 4.5,
                                    width: "20ch",
                                    boxShadow: "2px 2px 5px 0px #b0b0b0",
                                  },
                                },
                                list: {
                                  "aria-labelledby": "long-button",
                                },
                              }}
                            >
                              {menuOptions.map((p3, i3) => (
                                <DynamicOption
                                  key={i3}
                                  MenuItem={MenuItem}
                                  selectedData={selectedData}
                                  handleClose={handleClose}
                                  {...p3}
                                />
                              ))}
                            </Menu>
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell
                            key={i2}
                            component="th"
                            scope="row"
                            padding="none"
                          >
                            <DynamicRowComponent
                              val={p2}
                              i2={i2}
                              headCells={headCells}
                            >
                              {p2}
                            </DynamicRowComponent>
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div
            style={{
              borderTop: "1px solid #1e2896ff",
              height: "49px",
              padding: "5px",
              width: "100%",
            }}
          >
            <Pagination
              count={pageCount}
              page={pageState.page}
              sx={{ ...style.paginateStyle.sx, marginTop: "3px" }}
              onChange={onChangePage}
            />
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={pageState.limit}
              label="limit"
              onChange={onChangeLimit}
              sx={{ ...style.limitDropdownStyle.sx }}
            >
              {limitDropdown.map((p3, i3) => (
                <MenuItem key={i3} value={p3}>
                  {p3}
                </MenuItem>
              ))}
            </Select>
          </div>
        </Paper>
      </Box>
    </>
  );
}

export default CommonTable;
