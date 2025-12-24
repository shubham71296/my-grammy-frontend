import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Avatar,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { CloseRounded, ReceiptLong } from "@mui/icons-material";
import { closeDialog } from "../../../features/ui/uiSlice";

export default function OrderDialog() {
  const dispatch = useDispatch();
  const { selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);
  const order = selectedData || {};
  console.log("selected data", order);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => dispatch(closeDialog());

  const formattedDate = useMemo(() => {
    if (!order.createdAt) return "—";
    return new Date(order.createdAt).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [order.createdAt]);

  if (dialogInfo?.check !== "view_order") return null;

  return (
    <>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: { xs: 26, sm: 34, md: 36 },
              height: { xs: 26, sm: 34, md: 36 },
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <ReceiptLong
              sx={{
                fontSize: { xs: 16, sm: 18, md: 20 },
              }}
            />
          </Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "0.75rem",
                sm: "1.1rem",
                md: "1.25rem",
              },
            }}
            variant="h6"
          >
            Order Details - {order._id}
          </Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ bgcolor: "#f5f7fb", px: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              }}
              gap={2}
            >
              <Info label="Customer Email" value={order.userEmail} />
              <Info
                label="Payment Status"
                value={order.paymentStatus?.toUpperCase()}
              />
              <Info label="Order Date" value={formattedDate} />
              <Info label="Currency" value={order.currency} />
            </Box>
          </Paper>

          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
            <Typography
              fontWeight={700}
              mb={2}
              sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
            >
              Items
            </Typography>

            <Stack spacing={2}>
              {order.items?.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#fafafa",
                  }}
                >
                  <Avatar
                    variant="rounded"
                    src={item.thumbnail?.[0]?.url}
                    sx={{
                      width: { xs: "100%", sm: 64 },
                      height: { xs: 160, sm: 64 },
                      objectFit: "cover",
                    }}
                  />

                  <Box flex={1}>
                    <Typography
                      fontWeight={600}
                      sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
                    >
                      {item.productType.replace("_", " ").toUpperCase()}
                    </Typography>
                  </Box>

                  <Stack
                    direction={{ xs: "row", sm: "column" }}
                    alignItems={{ xs: "center", sm: "flex-end" }}
                    justifyContent="space-between"
                    gap={1}
                  >
                    <Chip
                      label={item.price === 0 ? "FREE" : `₹${item.price}`}
                      color={item.price === 0 ? "success" : "primary"}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      }}
                    >
                      Qty: {item.qty}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Box display="flex" justifyContent="space-between">
              <Typography
                fontWeight={700}
                sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
              >
                Total Amount
              </Typography>
              <Typography
                fontWeight={800}
                color="primary.main"
                sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
              >
                ₹{order.amount}
              </Typography>
            </Box>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          fullWidth={isMobile}
          sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
          variant="outlined"
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </>
  );
}

const Info = ({ label, value }) => (
  <Box>
    <Typography
      variant="caption"
      color="text.secondary"
      fontWeight={700}
      sx={{
        fontSize: { xs: "0.7rem", sm: "0.75rem" },
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: { xs: "0.75rem", sm: "0.75rem" },
      }}
      fontWeight={600}
    >
      {value || "—"}
    </Typography>
  </Box>
);
