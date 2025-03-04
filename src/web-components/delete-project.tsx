import { Icons } from "@/utils/icons";
import { navigate, type WebContext } from "brisa";

export default function DeleteProject(
  {
    projectName,
    onDeleteProject,
  }: { projectName: string; onDeleteProject: () => void },
  {}: WebContext,
) {
  //   const theme = state(currentTheme);

  async function deleteProject() {
    const userInput = prompt(
      `Are you sure you want to delete the project "${projectName}" and all its feedback? This action cannot be undone. To confirm, type: DELETE`,
    );
    if (userInput === "DELETE") {
      return onDeleteProject();
    } else {
      return false;
    }
  }

  return (
    <button
      type="submit"
      class="btn btn-danger"
      style={{
        backgroundColor: "#dc3545",
        borderColor: "#dc3545",
        color: "white",
      }}
      onClick={deleteProject}
    >
      {Icons(16).Delete || "🗑️"} Delete Project
    </button>
  );
}
