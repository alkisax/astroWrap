// src/App.tsx
import { useMediaQuery } from '@mui/material'
import { useHome } from '../hooks/componentHooks/useHome'
import AstroChart from '../components/AstroChart'
import BasicControls from '../components/controls/BasicControls'
import BasicChartInfo from '../components/BasicChartInfo'
import { mapToChartData } from '../utils/mapToChart'

const Home = () => {

  // ολη η λογική του component έχει μεταφερθεί σε hook
  const {
    data,
    visiblePlanets,
    setVisiblePlanets,
    date,
    setDate,
    coords,
    userOrb,
    setUserOrb,
    handleSubmit,
    shaken,
    handleLLMInterpretation,
    llmLoading,
    llmError,

    // ολα αυτά τα custom είναι συμπτύξεις των διάφορων reports για να φτιαχτεί ένα απλοποιημένο json, γινονται expose απο το hook για να περαστουν στα διαφορα αρχεία οι setters και να μπορώ να έχω ένα ενιαίο state useHome όπου και κατασκευάζεται το json
    setCustomPlanetInfo,
    setCustomChartRuler,
    setCustomBalance,
    setCustomHouseRulers,
    customAspects,
    setCustomAspects,
    setCustomDignities,
    setCustomDispositors,
    setCustomDynamics,
  } = useHome();

  // shaken → ενα απλοποιημένο json για να στέλνετε σε gpt για αναλυση
  console.log("shaken", shaken);
  console.log(data);

  // του MUI boolean υπολογίζει αν είμαι σε mobile
  const isMobile = useMediaQuery("(max-width:768px)");

  if (!data) return <div>Loading...</div>;

  // Μετατρέπει ChartSummary → format που θέλει το AstroChart, φιλτράροντας και τους πλανήτες.
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
            flexDirection: "column",
            gap: "20px",
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          {/* 🔝 TOP PANEL */}
          {/* θέλουμε αν mobile το ένα κάτω απο το άλλο controls απο κάτω. Και αν desktop το ένα δίπλα στο άλλο controls αριστερα. το πετυχαινουμε με το `flexDirection: isMobile ? 'column' : 'row'` και την σειρά που τα βάζουμε */}
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
                {/* 
                αυτό είναι ένα hook που συνεργάζεται με το AstroChart.tsx και κάνουν render το chart σε svg. Περα απο την βιβλιοθήκη έχουμε προσθεσει στο svg και δικά μας render
                */}
                <AstroChart
                  {...chartData}
                  data={data}
                  userOrb={userOrb}
                  customAspects={customAspects}
                />
              </div>
            )}

            {/* MOBILE: controls κάτω */}
            {isMobile && (
              // in: ημερομηνια/συντεταγμένες (default "τώρα"/αθήνα)
              // out: ημερομηνία/συντεταγμένες με +- ωρες/μερες/μηνες/χρονια 
              // και render των αντίστοιχων btns 
              // TimeControls
              // in: λίστα διαλεγμένων πλανητών (στην αρχή όλοι) και setter
              // κάνει toggle τους διαλεγμένους πλανήτες και render το ui 
              // PlanetSelector
              // in: παίρνει μια onSubmit με date/lat/lang τα οποία οταν αλλαχθούν εδώ προκαλούν trigger να δείξει το chart
              // ChartForm
              <BasicControls
                onSubmit={handleSubmit}
                visiblePlanets={visiblePlanets}
                setVisiblePlanets={setVisiblePlanets}
                date={date}
                setDate={setDate}
                coords={coords}
                userOrb={userOrb}
                setUserOrb={setUserOrb}
              />
            )}

            {/* DESKTOP: controls αριστερά */}
            {!isMobile && (
              <BasicControls
                onSubmit={handleSubmit}
                visiblePlanets={visiblePlanets}
                setVisiblePlanets={setVisiblePlanets}
                date={date}
                setDate={setDate}
                coords={coords}
                userOrb={userOrb}
                setUserOrb={setUserOrb}
              />
            )}

            {/* DESKTOP: chart  δεξια */}
            {!isMobile && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <AstroChart
                  {...chartData}
                  data={data}
                  userOrb={userOrb}
                  customAspects={customAspects}
                />
              </div>
            )}
          </div>

          {/* 🔽 BOTTOM PANEL (ALWAYS SAME WIDTH) */}
          {/* το data change προκαλεί rerender του chart και επανυπολογισμό των διάφορων reports  */}
          <BasicChartInfo
            data={data}
            userOrb={userOrb}
            handleLLMInterpretation={handleLLMInterpretation}
            llmLoading={llmLoading}
            llmError={llmError}
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

      {/* προέβαλε το json προς το llm. μόνο για dev */}
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