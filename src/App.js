import {
  AppBar,
  Box,
  Divider,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { HowLongToBeatService } from "howlongtobeat";
import React, { useEffect, useState } from "react";
import Footer from "./components/Footer";
import GameBox from "./components/GameBox";
import GameBoxSkeleton from "./components/GameBoxSkeleton";
import Logo from "./components/navbar/Logo";
import SearchBar from "./components/navbar/SearchBar";
import gaSearchKey from "./utils/gaSearchKey";

const hltbService = new HowLongToBeatService();

const App = () => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(Boolean);
  const [searchResults, setSearchResults] = useState([]);

  // Displays initial set of games on page load
  useEffect(() => {
    searchInput ? handleSearch(searchInput) : handleSearch("");
  }, []);

  const handleChange = (event) => {
    if (event.keyCode === 13) {
      // Enter key
      handleSearch(event.target.value);
      gaSearchKey("enter");
    } else if (event.type === "click") {
      // Mouse click
      handleSearch(searchInput);
      gaSearchKey("click");
    }
  };

  const handleSearch = (value) => {
    setLoading(true);
    window.gtag("event", "search", {
      search_term: value,
    });
    hltbService.search(value).then((result) => {
      setLoading(false);
      setSearchResults(result);
    });
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "#242A43",
          backgroundImage: "none",
          boxShadow: "0px 2px 40px 0px rgb(0 0 0 / 40%)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Logo />
          <SearchBar handleChange={handleChange} onChange={setSearchInput} />
        </Toolbar>
      </AppBar>

      <Box
        p={mobile ? "8px 8px 32px 8px" : "16px 16px 32px 16px"}
        display={"flex"}
        flexWrap={"wrap"}
        justifyContent={"center"}
        alignContent={"flex-start"}
        minHeight={{
          xs: "calc(100vh - 342px)",
          mobileCard: "calc(100vh - 345px)",
          sm: "calc(100vh - 321px)",
        }}
      >
        {loading ? (
          <GameBoxSkeleton />
        ) : searchResults.length ? (
          searchResults.map((gameData, index) => {
            return <GameBox data={gameData} key={index} />;
          })
        ) : (
          <Typography variant="h5" padding={3}>
            No Results
          </Typography>
        )}
      </Box>

      <Divider flexItem />

      <Footer />
    </Box>
  );
};

export default App;
