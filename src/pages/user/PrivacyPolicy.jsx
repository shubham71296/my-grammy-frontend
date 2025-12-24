import { Container, Typography, Box, Paper, Divider } from "@mui/material";

export default function PrivacyPolicy() {
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
          Privacy Policy
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
            🔒 Your Privacy Matters
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            Grammy Music India respects your privacy and is committed to
            safeguarding your personal information.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            📌 Information We Collect
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            We collect personal details such as your name, email, phone number,
            and payment information solely to process orders and deliver our
            services effectively.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            💳 Secure Payment Handling
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            All payments are securely processed through Razorpay. We do not
            store your card or banking details on our servers.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            🚫 No Data Sharing
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            We do not sell, trade, or rent users’ personal identification
            information to anyone.
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
            If you have any privacy-related questions or concerns, feel free to
            reach out:
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
