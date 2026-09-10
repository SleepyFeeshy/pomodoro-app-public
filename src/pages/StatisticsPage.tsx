import "../App.css";

import StatisticsPageDesktop from "./StatisticsPageLayouts/StatisticsPageDesktop";
import StatisticsPageMobile from "./StatisticsPageLayouts/StatisticsPageMobile";

function StatisticsPage() {
  // const settingsContext = useContext(SettingsContext);
  if (window.innerWidth > 430) {
    return <StatisticsPageDesktop/>
  } else {
    return <StatisticsPageMobile/>
  }
}

export default StatisticsPage;