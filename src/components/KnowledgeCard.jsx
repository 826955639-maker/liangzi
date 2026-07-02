import { useState } from "react";

export default function KnowledgeCard({ exhibit, onToggleCollect }) {
  const [expanded, setExpanded] = useState(Boolean(exhibit.highlighted));

  return (
    <article className={["knowledge-card", expanded ? "expanded" : "", exhibit.highlighted ? "highlighted" : ""].filter(Boolean).join(" ")}>
      <button className="knowledge-summary" type="button" onClick={() => setExpanded((value) => !value)}>
        <span>{exhibit.zone}</span>
        <h3>{exhibit.name}</h3>
        <p>{exhibit.shortIntro}</p>
      </button>

      {expanded && (
        <div className="knowledge-detail">
          <dl>
            <div>
              <dt>儿童版解释</dt>
              <dd>{exhibit.childExplanation}</dd>
            </div>
            <div>
              <dt>普通版解释</dt>
              <dd>{exhibit.normalExplanation}</dd>
            </div>
            <div>
              <dt>深度版解释</dt>
              <dd>{exhibit.deepExplanation}</dd>
            </div>
            <div>
              <dt>关联生活应用</dt>
              <dd>{exhibit.application}</dd>
            </div>
          </dl>
        </div>
      )}

      <div className="knowledge-actions">
        <button type="button" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "收起" : "展开"}
        </button>
        <button className={exhibit.collected ? "collected" : ""} type="button" onClick={() => onToggleCollect(exhibit.id)}>
          {exhibit.collected ? "已收藏" : "收藏"}
        </button>
      </div>
    </article>
  );
}
