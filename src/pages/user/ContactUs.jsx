import { Typography, Stack, Paper, Box, Divider, Container } from "@mui/material";

export default function ContactUs() {
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
        {/* Page Title */}
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            textAlign: "center",
            color: "primary.main",
            mb: 2,
            fontSize: { xs: "1.5rem", sm: "2.2rem" },
          }}
        >
          Contact Us
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: "center",
            mb: 4,
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
          }}
        >
          We’d love to hear from you. Contact us anytime!
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Stack spacing={4}>
          {/* Business Name */}
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              🏢 Business Name
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                ml: 1,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Maestro Music Classes
            </Typography>
          </Box>

          {/* Email */}
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              📧 Email
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                ml: 1,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                wordBreak: "break-word",
              }}
            >
              <a
                href="mailto:grammymusicindia@gmail.com"
                style={{ color: "#1976d2", textDecoration: "none" }}
              >
                grammymusicindia@gmail.com
              </a>
            </Typography>
          </Box>

          {/* Phone */}
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              ☎️ Phone
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                ml: 1,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              +91 78802 22377
            </Typography>
          </Box>

          {/* Address */}
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              📍 Address
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                ml: 1,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                lineHeight: 1.6,
                wordBreak: "break-word",
              }}
            >
              H16, Keshar Bagh Rd, Near Charming Kidz School,
              <br />
              Nalanda Parisar, Indore, Madhya Pradesh – 452009
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
