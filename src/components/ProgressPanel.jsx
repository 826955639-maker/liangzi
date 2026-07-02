export default function ProgressPanel({ completedCount, totalCount, collectedCount }) {
  const percent = Math.round((completedCount / totalCount) * 100);

  return (
    <section className="progress-panel">
      <div>
        <span className="section-kicker">LIVE PROGRESS</span>
        <h2>
          已完成 {completedCount} / {totalCount} 个展项
        </h2>
      </div>
      <div className="progress-ring" style={{ "--progress": `${percent}%` }}>
        <strong>{percent}%</strong>
        <span>探索率</span>
      </div>
      <div className="progress-lines">
        <p>
          <span>收藏卡片</span>
          <strong>{collectedCount}</strong>
        </p>
        <p>
          <span>推荐徽章</span>
          <strong>{completedCount >= 5 ? 3 : completedCount >= 3 ? 2 : completedCount >= 1 ? 1 : 0}</strong>
        </p>
      </div>
    </section>
  );
}
