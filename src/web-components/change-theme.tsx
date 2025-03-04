import type { WebContext } from "brisa";

export default function ChangeTheme(
  { themes, currentTheme }: any,
  { state, store }: WebContext,
) {
  const theme = state(currentTheme);

  return (
    <div class="customization-section">
      <h4>Theme</h4>
      <div class="form-group">
        <label>Select Theme</label>
        <div class="theme-selector">
          {Object.keys(themes).map((themeName) => (
            <div
              class={`theme-option ${theme.value === themeName ? "active" : ""}`}
              onClick={() => {
                theme.value = themeName;
                store.set("newTheme", themeName);
              }}
              data-theme={themeName}
            >
              <input
                type="radio"
                name="theme"
                value={themeName}
                checked={theme.value === themeName}
                style={{ display: "none" }}
              />
              <div class={`theme-preview ${themeName}`}>
                <div class="preview-button"></div>
                <div class="preview-widget"></div>
              </div>
              <span>
                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
