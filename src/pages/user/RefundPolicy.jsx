import { Container, Typography, Box, Paper, Divider } from "@mui/material";

export default function RefundPolicy() {
  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 1.5, sm: 2 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 5 },
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffff, #f5f7fa)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          sx={{
            textAlign: "center",
            color: "primary.main",
            mb: 2,
            fontSize: { xs: "1.5rem", sm: "2.2rem" },
          }}
        >
          Refund & Cancellation Policy
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: "center",
            mb: 4,
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
          }}
        >
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* Sections */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            🛑 No Cancellation After Purchase
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            All sales are final. Once a purchase is completed, it cannot be
            cancelled or refunded unless explicitly stated.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            💼 Refunds for Duplicate or Failed Payments
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            In case of duplicate payments or technical errors, refunds will be
            processed within 7–10 working days.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            💳 Refund Processing Method
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Refunds, if approved, will be credited back to the original payment
            method used at the time of purchase.
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            📞 Contact for Refund Queries
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            For any refund-related questions, reach out to us at:
            <br />
            <strong>Email:</strong>{" "}
            <a
              href="mailto:grammymusicindia@gmail.com"
              style={{
                color: "#1976d2",
                textDecoration: "none",
                wordBreak: "break-word",
              }}
            >
              grammymusicindia@gmail.com
            </a>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
