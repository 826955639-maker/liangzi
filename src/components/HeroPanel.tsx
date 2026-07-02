import QuantumCanvas from "./QuantumCanvas";

export default function HeroPanel() {
  return (
    <section className="hero-panel" aria-labelledby="hero-title">
      <QuantumCanvas />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-copy">
        <p className="museum-name">安徽省科技馆</p>
        <h1 id="hero-title">
          <span>量子探微馆</span>
          智慧导览
        </h1>
        <p className="hero-subtitle">用 iPad 开启你的量子探索之旅</p>
      </div>
    </section>
  );
}
