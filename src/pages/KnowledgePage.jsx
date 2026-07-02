import KnowledgeCard from "../components/KnowledgeCard.jsx";

export default function KnowledgePage({ exhibits, focusExhibitId, onToggleCollect }) {
  return (
    <div className="page knowledge-page">
      <div className="page-heading">
        <span className="section-kicker">KNOWLEDGE CARDS</span>
        <h1>知识卡片</h1>
        <p>点击卡片展开不同层级解释，收藏后会进入“我的报告”。</p>
      </div>

      <section className="knowledge-grid">
        {exhibits.map((exhibit) => (
          <KnowledgeCard
            key={exhibit.id}
            exhibit={{ ...exhibit, highlighted: exhibit.id === focusExhibitId }}
            onToggleCollect={onToggleCollect}
          />
        ))}
      </section>
    </div>
  );
}
