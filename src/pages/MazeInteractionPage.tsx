import Icon from "../components/Icon";

type MazeInteractionPageProps = {
  onBack: () => void;
};

export default function MazeInteractionPage({ onBack }: MazeInteractionPageProps) {
  return (
    <div className="maze-interaction-layout">
      <button className="maze-back-btn" type="button" onClick={onBack} aria-label="返回展区总览">
        <Icon name="return" />
        <span>返回展区总览</span>
      </button>
      <iframe
        src="/maze.html"
        className="maze-iframe"
        title="量子迷宫 — 手势互动体验"
        allow="camera"
      />
    </div>
  );
}
