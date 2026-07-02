import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import { exhibits as initialExhibits, recommendedRoutes, zones as initialZones } from "./data/mockData.js";
import ExhibitPage from "./pages/ExhibitPage.jsx";
import Home from "./pages/Home.jsx";
import KnowledgePage from "./pages/KnowledgePage.jsx";
import MapPage from "./pages/MapPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import ScanPage from "./pages/ScanPage.jsx";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedRouteId, setSelectedRouteId] = useState(recommendedRoutes[0].id);
  const [activeZoneId, setActiveZoneId] = useState(initialZones[0].id);
  const [activeExhibitId, setActiveExhibitId] = useState(initialExhibits[0].id);
  const [focusKnowledgeId, setFocusKnowledgeId] = useState(null);
  const [exhibits, setExhibits] = useState(() => initialExhibits.map((item) => ({ ...item })));

  const selectedRoute = useMemo(
    () => recommendedRoutes.find((route) => route.id === selectedRouteId) || recommendedRoutes[0],
    [selectedRouteId]
  );
  const activeExhibit = exhibits.find((item) => item.id === activeExhibitId);
  const completedCount = exhibits.filter((item) => item.completed).length;
  const collectedCount = exhibits.filter((item) => item.collected).length;

  const navigate = (page) => {
    setCurrentPage(page);
    if (page !== "knowledge") {
      setFocusKnowledgeId(null);
    }
  };

  const openExhibit = (id) => {
    if (!id) return;
    setActiveExhibitId(id);
    const exhibit = exhibits.find((item) => item.id === id);
    const zone = initialZones.find((item) => item.name === exhibit?.zone);
    if (zone) {
      setActiveZoneId(zone.id);
    }
    setCurrentPage("exhibit");
  };

  const completeExhibit = (id) => {
    setExhibits((items) => items.map((item) => (item.id === id ? { ...item, completed: true } : item)));
  };

  const toggleCollect = (id) => {
    setExhibits((items) => items.map((item) => (item.id === id ? { ...item, collected: !item.collected } : item)));
  };

  const openKnowledge = (id) => {
    setFocusKnowledgeId(id);
    setCurrentPage("knowledge");
  };

  const renderPage = () => {
    if (currentPage === "map") {
      return (
        <MapPage
          zones={initialZones}
          exhibits={exhibits}
          activeZoneId={activeZoneId}
          onSelectZone={setActiveZoneId}
          onOpenExhibit={openExhibit}
          onNavigate={navigate}
        />
      );
    }

    if (currentPage === "scan") {
      return <ScanPage exhibits={exhibits} onOpenExhibit={openExhibit} />;
    }

    if (currentPage === "exhibit") {
      return <ExhibitPage exhibit={activeExhibit} onComplete={completeExhibit} onNavigate={navigate} onOpenKnowledge={openKnowledge} />;
    }

    if (currentPage === "knowledge") {
      return <KnowledgePage exhibits={exhibits} focusExhibitId={focusKnowledgeId} onToggleCollect={toggleCollect} />;
    }

    if (currentPage === "report") {
      return <ReportPage exhibits={exhibits} selectedRoute={selectedRoute} />;
    }

    return (
      <Home
        routes={recommendedRoutes}
        selectedRouteId={selectedRouteId}
        completedCount={completedCount}
        totalCount={exhibits.length}
        collectedCount={collectedCount}
        onSelectRoute={setSelectedRouteId}
        onNavigate={navigate}
      />
    );
  };

  return (
    <main className="app-shell">
      <div className="ambient-grid" />
      <Sidebar currentPage={currentPage} onNavigate={navigate} completedCount={completedCount} totalCount={exhibits.length} />
      <section className="main-stage">{renderPage()}</section>
    </main>
  );
}
