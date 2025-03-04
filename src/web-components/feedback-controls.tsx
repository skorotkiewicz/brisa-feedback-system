import { navigate, type WebContext } from "brisa";

export default function FeedbackControls(
  { status, projectId, sort, types }: any,
  {}: WebContext,
) {
  // console.log(sort, type);

  return (
    <div class="feedback-controls">
      <div class="filter-group">
        <a
          href={`/feedback?project_id=${projectId}&sort=${sort}&status=all&type=${types}`}
          class={`filter-btn ${status === "all" ? "active" : ""}`}
        >
          All
        </a>
        <a
          href={`/feedback?project_id=${projectId}&sort=${sort}&status=pending&type=${types}`}
          class={`filter-btn ${status === "pending" ? "active" : ""}`}
        >
          Pending
        </a>
        <a
          href={`/feedback?project_id=${projectId}&sort=${sort}&status=done&type=${types}`}
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
        value={types}
        // defaultValue={types}
      >
        <option value="all">All Feedback</option>
        <option value="like">Likes</option>
        <option value="suggestion">Suggestions</option>
        <option value="bug">Bugs</option>
      </select>
      <select
        onChange={(e: any) =>
          navigate(
            `/feedback?project_id=${projectId}&sort=${e.target.value}&status=${status}&type=${types}`,
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
