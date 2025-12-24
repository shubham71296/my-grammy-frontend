import React, { useState, useCallback, useMemo, useEffect } from "react";
import MyInstrumentsFilterInputs from "../../utils/myinstruments-filter-inputs";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import InputText from "../../components/ui/inputs/InputText";
import { Filter, Refresh } from "@mui/icons-material";
import { resetInputs } from "../../utils/common-util";

function FilterForm({ title, inputs, setInputs, onSubmit, onReset }) {
  const hasValue = (val) => {
    if (val === null || val === undefined) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "boolean") return val === true;
    if (typeof val === "number") return !Number.isNaN(val);
    if (typeof val === "string") return val.trim() !== "";
    if (typeof val === "object") {
      return Object.keys(val).length > 0;
    }
    return false;
  };
  const anyInputFilled = useMemo(() => {
    return inputs.some((inp) => hasValue(inp._value));
  }, [inputs]);

  const handleChange = (e, i1) => {
    const tempInputs = [...inputs];
    tempInputs[i1]._value = e.target.value;
    tempInputs[i1]._errorMsg = "";
    setInputs(tempInputs);
  };

  useEffect(() => {
    setInputs(resetInputs(inputs));
  }, []);

  return (
    <Paper
      sx={{
        backgroundColor: "white",
        width: "100%",
        padding: { xs: 2, sm: 3, md: 4 },
        mb: 2,
      }}
      elevation={3}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontSize: {
            xs: "1rem",
            sm: "1.2rem",
            md: "1.5rem",
          },
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        {title}
      </Typography>

      <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {inputs.map((p1, i1) => (
          <Grid key={`grid-${p1._key}-${i1}`} size={{ xs: 12, md: 12, lg: 6 }}>
            <InputText {...p1} onChange={(event) => handleChange(event, i1)} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 1 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Button
            label="Apply Filter"
            onClick={onSubmit}
            startIcon={<Filter />}
            color="primary"
            variant="contained"
            sx={{
              fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
              "& .MuiButton-startIcon > *": {
                fontSize: { xs: 18, sm: 20, md: 22 },
              },
              minWidth: 140,
              transition: "0.3s",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#0a3b6cff",
              },
            }}
            disabled={!anyInputFilled}
          >
            Apply Filter
          </Button>

          <Button
            onClick={onReset}
            startIcon={<Refresh />}
            variant="outlined"
            sx={{
              fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
              "& .MuiButton-startIcon > *": {
                fontSize: { xs: 18, sm: 20, md: 22 },
              },
              minWidth: 140,
              transition: "0.3s",
              backgroundColor: "#dcdbf9ff",
              "&:hover": {
                backgroundColor: "#7ba3ccff",
                color: "white",
              },
            }}
            disabled={!anyInputFilled}
          >
            Reset
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

export default FilterForm;
