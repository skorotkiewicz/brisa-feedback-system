import { navigate, type WebContext } from "brisa";

export default function FeedbackControls(
  { status, projectId, sort, type }: any,
  {}: WebContext,
) {
  // console.log(sort, type);

  return (
    <div class="feedback-controls">
      <div class="filter-group">
        <a
          href={`/feedback?project_id=${projectId}&sort=${sort}&status=all&type=${type}`}
          class={`filter-btn ${status === "all" ? "active" : ""}`}
        >
          All
        </a>
        <a
          href={`/feedback?project_id=${projectId}&sort=${sort}&status=pending&type=${type}`}
          class={`filter-btn ${status === "pending" ? "active" : ""}`}
        >
          Pending
        </a>
        <a
          href={`/feedback?project_id=${projectId}&sort=${sort}&status=done&type=${type}`}
          class={`filter-btn ${status === "done" ? "active" : ""}`}
        >
          Done
        </a>
      </div>
      <select
        onChange={(e: any) =>
          navigate(
            `/feedback?project_id=${projectId}&sort=${sort}&status=${status}&type=${e.target.value}`,
          )
        }
        class="select-control"
        value={type}
        // defaultValue={type}
      >
        <option value="all">All Feedback</option>
        <option value="like">Likes</option>
        <option value="suggestion">Suggestions</option>
        <option value="bug">Bugs</option>
      </select>
      <select
        onChange={(e: any) =>
          navigate(
            `/feedback?project_id=${projectId}&sort=${e.target.value}&status=${status}&type=${type}`,
          )
        }
        class="select-control"
        value={sort}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
}
