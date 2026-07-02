export default function ScanPage({ exhibits, onOpenExhibit }) {
  return (
    <div className="page scan-page">
      <div className="page-heading">
        <span className="section-kicker">QR SIMULATION</span>
        <h1>扫码探索</h1>
        <p>请扫描展区二维码，进入对应交互展示。</p>
      </div>

      <section className="scan-layout">
        <div className="scan-visual">
          <div className="scan-frame">
            <span />
            <span />
            <span />
            <span />
            <i />
          </div>
          <p>将展区二维码置于识别框内</p>
        </div>

        <div className="scan-buttons">
          <span className="section-kicker">MOCK QR ENTRIES</span>
          <h2>模拟二维码按钮</h2>
          {exhibits.map((exhibit) => (
            <button key={exhibit.id} type="button" onClick={() => onOpenExhibit(exhibit.id)}>
              <small>{exhibit.zone}</small>
              <strong>{exhibit.name}</strong>
              <span>{exhibit.completed ? "已完成" : "进入展示"}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
