// src/App.tsx
import AstroChart from "../components/AstroChart";
import { mapToChartData } from "../utils/mapToChart";
import BasicControls from "../components/BasicControlls";
import { useMediaQuery } from "@mui/material";
import BasicChartInfo from "../components/BasicChartInfo";
import { useHome } from "../hooks/componentHooks/useHome";

const Home = () => {

  const {
    data,
    visiblePlanets,
    setVisiblePlanets,
    date,
    setDate,
    coords,
    handleSubmit,
    shaken,

    setCustomPlanetInfo,
    setCustomChartRuler,
    setCustomBalance,
    setCustomHouseRulers,
    setCustomAspects,
    setCustomDignities,
    setCustomDispositors,
    setCustomDynamics,
  } = useHome();

  console.log("shaken", shaken);
  // console.log(data);

  const isMobile = useMediaQuery("(max-width:768px)");

  if (!data) return <div>Loading...</div>;

  const chartData = mapToChartData(data, visiblePlanets);

  return (

    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          padding: isMobile ? "10px" : "0px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column", // 🔥 σημαντικό
            gap: "20px",
            width: "100%",
            maxWidth: "1000px", // 🔥 1 source of truth
          }}
        >
          {/* 🔝 TOP PANEL */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "20px",
              padding: "20px",
              borderRadius: "16px",
              background: "rgba(20,20,30,0.6)",
              backdropFilter: "blur(1px)",
              border: "1px solid rgba(255,255,255,0.1)",
              alignItems: "stretch",
              width: "100%",
            }}
          >
            {/* MOBILE: chart FIRST */}
            {isMobile && (
              <div style={{ width: "100%" }}>
                <AstroChart {...chartData} />
              </div>
            )}

            {/* DESKTOP: controls */}
            {!isMobile && (
              <BasicControls
                onSubmit={handleSubmit}
                visiblePlanets={visiblePlanets}
                setVisiblePlanets={setVisiblePlanets}
                date={date}
                setDate={setDate}
                coords={coords}
              />
            )}

            {/* DESKTOP: chart */}
            {!isMobile && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <AstroChart {...chartData} />
              </div>
            )}

            {/* MOBILE: controls κάτω */}
            {isMobile && (
              <BasicControls
                onSubmit={handleSubmit}
                visiblePlanets={visiblePlanets}
                setVisiblePlanets={setVisiblePlanets}
                date={date}
                setDate={setDate}
                coords={coords}
              />
            )}
          </div>

          {/* 🔽 BOTTOM PANEL (ALWAYS SAME WIDTH) */}
          <BasicChartInfo
            data={data}
            setCustomPlanetInfo={setCustomPlanetInfo}
            setCustomChartRuler={setCustomChartRuler}
            setCustomBalance={setCustomBalance}
            setCustomHouseRulers={setCustomHouseRulers}
            setCustomAspects={setCustomAspects}
            setCustomDignities={setCustomDignities}
            setCustomDispositors={setCustomDispositors}
            setCustomDynamics={setCustomDynamics}
          />
        </div>
      </div>

      {/* <ChartDataDebug
        data={data}
        visiblePlanets={visiblePlanets}
        date={date}
        coords={coords}
        customPlanetInfo={customPlanetInfo}
        customChartRuler={customChartRuler}
        customBalance={customBalance}
        customHouseRulers={customHouseRulers}
        customAspects={customAspects}
        customDignities={customDignities}
        customDispositors={customDispositors}
        customDynamics={customDynamics}
        // setShaken={setShaken}
      /> */}
    </>
  );
}

export default Home;