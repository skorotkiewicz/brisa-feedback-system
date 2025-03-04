import { navigate, type RequestContext } from "brisa";
import { renderPage } from "brisa/server";
import { prisma, FBStatus as FeedbackStatus } from "@/utils/prisma";
import { Icons } from "@/utils/icons";
// import { FeedbackStatus } from "@prisma/client";

export default async function FeedbackPage({}, req: RequestContext) {
  const { token, userId, isAuthenticated } = req.store.get("authContext");

  const projectId = Number.parseInt(req.route.query?.project_id || "0");
  const sort = req.route.query?.sort || "newest";
  const status = req.route.query?.status || "all";
  const type = req.route.query?.type || "all";
  const page = Number.parseInt(req.route.query?.page || "1");
  const perPage = 10;

  // Verify project ownership
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    navigate("/dashboard");
    return null;
  }

  // Build query based on filters and sorting
  const where = { projectId };

  if (status !== "all") {
    where.status =
      status === "done" ? FeedbackStatus.DONE : FeedbackStatus.PENDING;
  }

  if (type !== "all") {
    where.type = type;
  }

  // Add sorting
  const orderBy =
    sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

  // Add pagination
  const skip = (page - 1) * perPage;

  // Get feedback items
  const feedbackItems = await prisma.feedback.findMany({
    where,
    orderBy,
    skip,
    take: perPage,
  });

  // Get total count for pagination
  const totalItems = await prisma.feedback.count({ where });
  const totalPages = Math.ceil(totalItems / perPage);

  // Get feedback stats
  const stats = await prisma.feedback.groupBy({
    by: ["type"],
    where: { projectId },
    _count: {
      id: true,
    },
  });

  const likesCount = stats.find((item) => item.type === "like")?._count.id || 0;
  const suggestionsCount =
    stats.find((item) => item.type === "suggestion")?._count.id || 0;
  const bugsCount = stats.find((item) => item.type === "bug")?._count.id || 0;

  // Handle feedback status update
  // async function updateStatus(e: any) {
  async function updateStatus(
    e: any,
    perPage: number,
    totalItems: number,
    stats: any,
  ) {
    // e.preventDefault();
    // onAction(e);

    try {
      const feedbackId = Number.parseInt(e.formData.get("feedback_id"));
      const newStatus =
        e.formData.get("status") === "done"
          ? FeedbackStatus.DONE
          : FeedbackStatus.PENDING;

      // Verify feedback belongs to this project
      const feedback = await prisma.feedback.findUnique({
        where: {
          id: feedbackId,
          project: {
            id: projectId,
            userId,
          },
        },
      });

      if (feedback) {
        await prisma.feedback.update({
          where: { id: feedbackId },
          data: {
            status: newStatus,
            statusUpdatedAt: new Date(),
          },
        });

        // navigate(`/feedback?project_id=${projectId}`);
        // navigate(
        //   `/feedback?project_id=${projectId}&sort=${sort}&status=${status}&type=${type}&page=${page}`,
        // );
        // return;
      }
    } catch (error) {
      console.error("Update error:", error);
    }
    renderPage();
  }

  return (
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <a href="/dashboard" class="logo">
            {Icons(24).Feedback}
            Feedback
          </a>
        </div>

        <div class="sidebar-footer">
          <a href="/dashboard" class="nav-item">
            {Icons(18).Dashboard}
            Dashboard
          </a>
          <a href="/logout" class="nav-item">
            {Icons(18).Logout}
            Logout
          </a>
        </div>
      </aside>

      <main class="main-content">
        <div class="feedback-header">
          <div>
            <h1>{project.name} Feedback</h1>
            <p class="feedback-stats">
              <span class="stat-item">
                {Icons(16).Likes}
                {likesCount} Likes
              </span>
              <span class="stat-item">
                {Icons(16).Feedback}
                {suggestionsCount} Suggestions
              </span>
              <span class="stat-item">
                {Icons(16).Bugs}
                {bugsCount} Bugs
              </span>
            </p>

            <feedback-controls
              status={status}
              projectId={projectId}
              sort={sort}
              type={type}
            />
          </div>
        </div>

        {feedbackItems.length === 0 ? (
          <div class="empty-state">
            {Icons(64).Feedback}

            <h3>No feedback yet</h3>
            <p>When users submit feedback, it will appear here.</p>
          </div>
        ) : (
          <>
            <div class="feedback-list">
              {feedbackItems.map((item) => (
                <div
                  class={`feedback-item ${item.status === FeedbackStatus.DONE ? "done" : ""}`}
                  key={item.id}
                >
                  <div class={`feedback-type ${item.type}`}>
                    {item.type === "like" ? (
                      <>{Icons(20).Likes}</>
                    ) : item.type === "suggestion" ? (
                      <>{Icons(20).Feedback}</>
                    ) : (
                      <>
                        <>{Icons(20).Bugs}</>
                      </>
                    )}
                  </div>
                  <div class="feedback-content">
                    <div class="feedback-message">{item.message}</div>
                    <div class="feedback-meta">
                      <div class="meta-left">
                        <span class="feedback-date">
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            },
                          )}
                        </span>
                        {item.pageUrl && (
                          <>
                            <span class="meta-separator">•</span>
                            <a
                              href={item.pageUrl}
                              target="_blank"
                              class="view-page-link"
                            >
                              View Page
                            </a>
                          </>
                        )}
                        {item.email && (
                          <>
                            <span class="meta-separator">•</span>
                            <span class="feedback-email">
                              {Icons(14).Email}
                              {item.email}
                            </span>
                          </>
                        )}
                      </div>
                      {item.type !== "like" &&
                        item.status !== FeedbackStatus.DONE && (
                          // <form onSubmit={updateStatus}>
                          <form
                            onSubmit={async (e) => {
                              await updateStatus(e, perPage, totalItems, stats);
                            }}
                          >
                            <input
                              type="hidden"
                              name="feedback_id"
                              value={item.id}
                            />
                            <input type="hidden" name="status" value="done" />
                            <button type="submit" class="mark-done-btn">
                              {Icons(14).Done}
                              Done
                            </button>
                          </form>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div class="pagination">
                {page > 1 && (
                  <a
                    href={`/feedback?project_id=${projectId}&sort=${sort}&status=${status}&type=${type}&page=${page - 1}`}
                    class="pagination-btn"
                  >
                    Previous
                  </a>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <a
                      href={`/feedback?project_id=${projectId}&sort=${sort}&status=${status}&type=${type}&page=${p}`}
                      class={`pagination-btn ${p === page ? "active" : ""}`}
                      key={p}
                    >
                      {p}
                    </a>
                  ),
                )}

                {page < totalPages && (
                  <a
                    href={`/feedback?project_id=${projectId}&sort=${sort}&status=${status}&type=${type}&page=${page + 1}`}
                    class="pagination-btn"
                  >
                    Next
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
