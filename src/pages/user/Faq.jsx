// src/pages/Faq.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const faqData = [
  {
    question: "What is Grammy?",
    answer:
      "Grammy is a platform where you can explore musical instruments and enroll in high-quality music courses.",
  },
  {
    question: "How do I purchase a course?",
    answer:
      "Simply browse courses, add them to your cart, and complete the checkout process securely.",
  },
  {
    question: "Are courses free with instruments?",
    answer:
      "Yes! Some courses are automatically added for free when you purchase a related instrument.",
  },
  {
    question: "Can I access my courses anytime?",
    answer:
      "Absolutely. Once purchased, your courses are available anytime from your dashboard.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach us through the Contact page or email our support team anytime.",
  },
];

const Faq = () => {
  return (
    <Box sx={{ backgroundColor: "#f4f7fb", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 5,
            textAlign: "center",
            borderRadius: 3,
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            color: "white",
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: 50, mb: 1 }} />
          <Typography variant="h4" fontWeight={700}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
            Find answers to common questions about Grammy
          </Typography>
        </Paper>

        {faqData.map((faq, index) => (
          <Accordion
            key={index}
            sx={{
              mb: 2,
              borderRadius: 2,
              "&:before": { display: "none" },
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                fontWeight: 600,
                backgroundColor: "#ffffff",
                borderRadius: 2,
              }}
            >
              <Typography fontWeight={600}>{faq.question}</Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ backgroundColor: "#fafafa" }}>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};

export default Faq;
