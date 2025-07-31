// App.jsx
import React from "react";
import ProductPage from "./components/ProductTable";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Container, Typography } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";

const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "'Cairo', sans-serif"
  }
});

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin]
});

function App() {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <Typography variant="h4" gutterBottom align="center">
            نظام إدارة مكونات الأثاث
          </Typography>
          <ProductPage />
        </Container>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
