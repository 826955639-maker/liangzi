import { lazy, Suspense, useState } from "react";
import HeroPanel from "./components/HeroPanel";
import InfoPanel from "./components/InfoPanel";
import Sidebar, { type NavigationId } from "./components/Sidebar.tsx";
import TopBar from "./components/TopBar";
import Icon from "./components/Icon";
import ExhibitionOverviewPage from "./pages/ExhibitionOverviewPage";
import SettingsPage from "./pages/SettingsPage";
import ExplorationReportPage from "./pages/ExplorationReportPage";

const PerceptionInteractionPage = lazy(() => import("./pages/PerceptionInteractionPage"));
const CreationInteractionPage = lazy(() => import("./pages/CreationInteractionPage"));
const MazeInteractionPage = lazy(() => import("./pages/MazeInteractionPage"));
const MapGuidePage = lazy(() => import("./pages/MapGuidePage"));

type CurrentPage = "standard" | "creationInteraction" | "perceptionInteraction" | "mazeInteraction";

export default function App() {
  const [selectedNav, setSelectedNav] = useState<NavigationId>("home");
  const [currentPage, setCurrentPage] = useState<CurrentPage>("standard");

  const selectNavigation = (navigation: NavigationId) => {
    setSelectedNav(navigation);
    setCurrentPage("standard");
  };

  const returnToOverview = () => {
    setSelectedNav("zones");
    setCurrentPage("standard");
  };

  return (
    <main className="viewport-stage">
      <section className="app-shell" aria-label="量子探微馆智慧导览">
        {currentPage === "creationInteraction" ? (
          <Suspense fallback={<section className="perception-route-loading">正在加载量子黑箱实验...</section>}>
            <CreationInteractionPage onBack={returnToOverview} />
          </Suspense>
        ) : currentPage === "perceptionInteraction" ? (
          <Suspense fallback={<section className="perception-route-loading">正在加载光波实验...</section>}>
            <PerceptionInteractionPage onBack={returnToOverview} />
          </Suspense>
        ) : currentPage === "mazeInteraction" ? (
          <Suspense fallback={<section className="perception-route-loading">正在加载量子迷宫...</section>}>
            <MazeInteractionPage onBack={returnToOverview} />
          </Suspense>
        ) : (
          <>
            <div className="ambient ambient-one" aria-hidden="true" />
            <div className="ambient ambient-two" aria-hidden="true" />
            <TopBar />
            <Sidebar selected={selectedNav} onSelect={selectNavigation} />

            {selectedNav === "zones" ? (
              <ExhibitionOverviewPage
                onOpenCreation={() => setCurrentPage("creationInteraction")}
                onOpenPerception={() => setCurrentPage("perceptionInteraction")}
                onOpenMaze={() => setCurrentPage("mazeInteraction")}
              />
            ) : selectedNav === "settings" ? (
              <SettingsPage />
            ) : selectedNav === "map" ? (
              <Suspense fallback={<section className="map-guide-load-shell">正在准备三维导览...</section>}>
                <MapGuidePage />
              </Suspense>
            ) : selectedNav === "record" ? (
              <ExplorationReportPage onReturnToMap={() => selectNavigation("map")} />
            ) : (
              <section className="home-layout">
                <HeroPanel />
                <InfoPanel />

                <button
                  className="guide-hint"
                  type="button"
                  onClick={() => console.log("查看地图导览")}
                >
                  <span className="guide-hint__icon" aria-hidden="true">
                    <Icon name="location" />
                  </span>
                  <span>请跟随地图前往展区，扫描展项二维码开启互动体验</span>
                  <Icon name="chevron-right" />
                </button>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
