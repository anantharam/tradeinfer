import React from "react";
import { TitleComponent, TradeFormComponent } from "./components";
import { Container, Grid } from "@mui/material";

function App() {
  return (
    <div className="App">
      <header className="App-header"> </header>
      <TitleComponent title="Trade Inference System" />
      <main>
        <Container maxWidth="sm">
          <Grid container flexDirection={"column"} py={4}>
            <Grid item xs>
              <TradeFormComponent />
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

export default App;
