import { Container, Typography, Box, Paper, Divider } from "@mui/material";

export default function TermsConditions() {
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
          Terms & Conditions
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
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            📘 Agreement to Terms
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            By accessing and using Grammy Music India, you agree to comply with
            and be bound by these Terms & Conditions.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            🛒 Product & Service Availability
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            All products and services offered are subject to availability. Prices
            may change at any time without prior notice.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            ⚠️ Unauthorized Use
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            Unauthorized use of this website may give rise to claims for damages
            and/or may be a criminal offense.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            🚫 Right to Refuse Service
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            We reserve the right to refuse service to anyone for any reason at
            any time.
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            📞 Contact Us
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            For any questions or concerns regarding these Terms & Conditions,
            reach out to us:
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
