import {
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
  Container,
  Paper,
  Divider,
  Box,
} from "@mui/material";

export default function ShippingPolicy() {
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
        {/* Title */}
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
          Shipping Policy
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

        {/* SECTION 1 */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            🚚 No Physical Shipping
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            Maestro Music Classes does not ship any physical products. All our
            offerings are service-based.
          </Typography>
        </Box>

        {/* SECTION 2 */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            📌 How Services Are Delivered
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            Our services are provided through one of the following modes:
          </Typography>

          <List sx={{ listStyleType: "disc", pl: 3 }}>
            <ListItem sx={{ display: "list-item", pl: 0 }}>
              <ListItemText primary="In-person at our academy" />
            </ListItem>

            <ListItem sx={{ display: "list-item", pl: 0 }}>
              <ListItemText primary="Digitally (online classes or digital content)" />
            </ListItem>
          </List>
        </Box>

        {/* SECTION 3 */}
        <Box sx={{ mb: 0 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            📦 No Shipping Required
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            Since no tangible items are sold, shipping or physical delivery is
            not applicable for any of our services.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
