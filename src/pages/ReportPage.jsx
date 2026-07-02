export default function ReportPage({ exhibits, selectedRoute }) {
  const completed = exhibits.filter((item) => item.completed);
  const collected = exhibits.filter((item) => item.collected);
  const badges = [
    completed.length >= 1 && "量子初探徽章",
    completed.length >= 3 && "探微同行徽章",
    completed.length >= 5 && "全馆完成徽章",
    collected.length >= 1 && "知识收藏徽章"
  ].filter(Boolean);
  const reviewItems = exhibits.filter((item) => !item.completed).slice(0, 3);

  return (
    <div className="page report-page">
      <div className="page-heading">
        <span className="section-kicker">VISIT REPORT</span>
        <h1>我的探索报告</h1>
        <p>实时汇总本次参观完成度、收藏内容和路线摘要。</p>
      </div>

      <section className="report-layout">
        <div className="report-stats">
          <article>
            <span>已完成展项数量</span>
            <strong>{completed.length}</strong>
          </article>
          <article>
            <span>已收藏知识卡片</span>
            <strong>{collected.length}</strong>
          </article>
          <article>
            <span>获得徽章</span>
            <strong>{badges.length}</strong>
          </article>
        </div>

        <div className="report-detail">
          <section>
            <h2>已收藏知识卡片</h2>
            <div className="chip-list">
              {(collected.length ? collected : exhibits.slice(0, 2)).map((item) => (
                <span key={item.id}>{item.name}</span>
              ))}
            </div>
          </section>
          <section>
            <h2>获得徽章</h2>
            <div className="badge-list">
              {(badges.length ? badges : ["等待解锁"]).map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
          </section>
          <section>
            <h2>推荐回顾知识点</h2>
            <div className="chip-list">
              {(reviewItems.length ? reviewItems : exhibits.slice(-2)).map((item) => (
                <span key={item.id}>{item.name}</span>
              ))}
            </div>
          </section>
          <section>
            <h2>参观路线摘要</h2>
            <p>
              当前路线为 {selectedRoute.title}，预计 {selectedRoute.duration}，重点覆盖 {selectedRoute.stops.join("、")}。
            </p>
          </section>
        </div>

        <aside className="share-card">
          <span>分享卡片</span>
          <h2>我在安徽省科技馆发现了量子世界</h2>
          <div className="share-metrics">
            <p>
              <strong>{completed.length}</strong>
              完成展项
            </p>
            <p>
              <strong>{badges.length}</strong>
              获得徽章
            </p>
          </div>
          <div className="keyword-strip">
            <span>波粒之争</span>
            <span>量子隧道</span>
            <span>量子通信</span>
            <span>合肥量子成果</span>
          </div>
          <button className="primary-button" type="button">
            生成分享视觉
          </button>
        </aside>
      </section>
    </div>
  );
}
