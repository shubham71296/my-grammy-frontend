import React, { useEffect, useState } from "react";
import CommonTable from "../../components/ui/table/CommonTable";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { filterData } from "../../utils/common-util";
import { headCells, menuOptions } from "../../utils/my-instruments-columns";
import MyInstrumentsFilterInputs from "../../utils/myinstruments-filter-inputs";
import FilterForm from "../../components/ui/FilterForm";
import { useSearchParams } from "react-router-dom";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { LibraryMusic } from "@mui/icons-material";
import { setTotalCount } from "../../features/dataCountSlice";
import AppDialog from "../../components/ui/dialog/AppDialog";
import api from "../../api/axios";

function MyInstrumentsList() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { countTotalData } = useSelector((state) => state.dataCount);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [inputs, setInputs] = useState(MyInstrumentsFilterInputs);
  const [activeQuery, setActiveQuery] = useState({});

  const [state, setState] = useState({
    limit: 5,
    limitDropdown: [5, 10, 20, 50],
    header: [],
    data: [],
    totalDataCount: 0,
    query: {},
  });

  const getCurrentLimitFromUrl = () => {
    const l = searchParams.get("limit");
    const parsed = parseInt(l, 10);
    return !isNaN(parsed) && parsed > 0 ? parsed : state.limit;
  };

  const handleFilterSubmit = () => {
    const newQuery = {};
    inputs.forEach((input) => {
      if (input._value) {
        newQuery[input._key] = { $regex: input._value, $options: "i" };
      }
    });
    setActiveQuery(newQuery);
    const currentLimit = getCurrentLimitFromUrl();
    getData(currentLimit, 0, newQuery);
  };

  const handleFilterReset = () => {
    const resetInputs = inputs.map((i) => ({ ...i, _value: "" }));
    setInputs(resetInputs);
    setActiveQuery({});
    getData(state.limit, 0, {});
  };

  const getData = async (limit, offset, query = activeQuery) => {
    const body = {
      query,
      projection: { pwd: 0 },
      options: { skip: offset, limit, sort: { createdAt: -1 } },
    };

    const response = await api.post("/admin/allinstumnts", body);
    const res = response.data;
    if (res.success) {
      let fd = filterData(res.data, headCells);
      setState((prev) => ({
        ...prev,
        header: fd.header,
        totalDataCount: res.totalDataCount,
        data: fd.rows,
        rawData: res.data,
      }));
      if (isInitialLoad) {
        dispatch(setTotalCount({ countTotalData: res.totalDataCount }));
        setIsInitialLoad(false);
      }
    }
  };

  const config = {
    getData,
    data: state.data,
    totalDataCount: state.totalDataCount,
    limit: state.limit,
    limitDropdown: state.limitDropdown,
    headCells: headCells,
    header: state.header,
    menuOptions,
    query: activeQuery,
    style: {
      paginateStyle: {
        sx: { float: "right" },
      },
      limitDropdownStyle: {
        sx: { float: "right" },
      },
    },
    baseRoute: "/admin/myinstrumentslist",
    textLabel: "Instrument",
    buttonRoute: "/admin/addinstruments",
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 2,
      }}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontSize: {
              xs: "1rem",
              sm: "1.2rem",
              md: "1.5rem",
            },
            fontWeight: 600,
            letterSpacing: "0.5px",
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <LibraryMusic
            sx={{
              fontSize: {
                xs: "1.1rem",
                sm: "1.4rem",
                md: "1.6rem",
              },
              flexShrink: 0,
            }}
          />
          My Instruments
        </Typography>

        <Divider
          sx={{
            mt: 1.5,
            mb: 1.5,
            borderColor: "#1976d2",
            borderWidth: "1px",
            borderRadius: 1,
          }}
        />
      </Box>
      {countTotalData > 0 && (
        <FilterForm
          title="Filter Instruments"
          inputs={inputs}
          setInputs={setInputs}
          onSubmit={handleFilterSubmit}
          onReset={handleFilterReset}
        />
      )}
      <CommonTable {...config} />
      <AppDialog />
    </Paper>
  );
}

export default MyInstrumentsList;
