import Icon from "./Icon";

export default function DeviceReturnCard() {
  return (
    <button
      className="action-card device-return-card"
      type="button"
      onClick={() => console.log("设备归还")}
    >
      <span className="action-icon" aria-hidden="true">
        <Icon name="return" />
      </span>
      <span className="action-copy">
        <strong>设备归还</strong>
        <small>归还地点提示与流程</small>
      </span>
      <span className="action-arrow" aria-hidden="true">
        <Icon name="arrow-right" />
      </span>
    </button>
  );
}
