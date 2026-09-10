import "../App.css";

import SettingsPageMobile from "./SettingsPageLayouts/SettingsPageMobile";

function SettingsPage() {
  // const settingsContext = useContext(SettingsContext);
  if (window.innerWidth > 430) {
    return <SettingsPageMobile/>
  } else {
    return <SettingsPageMobile/>
  }
}

export default SettingsPage;