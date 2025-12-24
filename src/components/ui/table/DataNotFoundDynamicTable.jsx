import { Button, Typography, Box } from "@mui/material";
import { AddCircleOutlineOutlined, Inbox } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function DataNotFoundDynamicTable({
  textLabel,
  buttonRoute,
  countTotalData,
  showSimple = false,
}) {
  const navigate = useNavigate();
  const isGlobalEmpty = countTotalData === 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        borderRadius: 3,
        backgroundColor: "#f7f7fb",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      <Inbox sx={{ fontSize: 40, mb: 1 }} />

      <Typography
        variant="h6"
        sx={{ color: "#4a4a4a", fontWeight: 600, mb: 0.5 }}
      >
        {isGlobalEmpty ? `No ${textLabel} Found` : "No data found"}
      </Typography>

      {!showSimple && (
        <>
          <Typography variant="body1" sx={{ color: "primary.main", mb: 3 }}>
            {isGlobalEmpty
              ? `Please add a new ${textLabel} to get started`
              : "Try adjusting your filter to see more results"}
          </Typography>

          {isGlobalEmpty && (
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(buttonRoute)}
              startIcon={<AddCircleOutlineOutlined />}
              sx={{
                px: 2.5,
                py: 1,
                fontSize: "0.8rem",
                borderRadius: "8px",
              }}
            >
              {`Add ${textLabel}`}
            </Button>
          )}
        </>
      )}
    </Box>
  );
}
