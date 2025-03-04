// Feedback Widget JavaScript
class FeedbackWidget {
  constructor() {
    this.apiKey = null;
    this.settings = {
      theme: "classic",
      buttonText: "Feedback",
      headerText: "Help us improve",
      feedbackOptions: {
        like: true,
        suggestion: true,
        bug: true,
      },
    };
    this.isOpen = false;
    this.currentType = null;
    this.apiServer = "http://localhost:3000";
    this.recaptchaLoaded = false;
    this.recaptchaEnabled = false;
    this.recaptchaSiteKey = "";
  }

  static async init(apiKey) {
    const widget = new FeedbackWidget();
    widget.apiKey = apiKey;
    await widget.loadSettings();
    widget.render();
    return widget;
  }

  loadRecaptcha() {
    if (this.recaptchaLoaded) return;

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${this.recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    this.recaptchaLoaded = true;
  }

  async loadSettings() {
    try {
      const response = await fetch(
        `${this.apiServer}/api/widget-settings?api_key=${this.apiKey}`,
      );
      if (response.ok) {
        const settings = await response.json();
        this.settings = {
          ...this.settings,
          ...settings,
        };
        this.recaptchaEnabled = settings.recaptcha_enabled;
        this.recaptchaSiteKey = settings.recaptcha_key;
      }
    } catch (error) {
      console.error("Failed to load widget settings:", error);
    }
  }

  render() {
    // Create button
    const button = document.createElement("div");
    button.id = "feedback-widget-button";
    button.innerHTML = this.settings.buttonText;
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.backgroundColor = this.settings.primaryColor || "#4A90E2";
    button.style.color = this.settings.buttonTextColor || "#FFFFFF";
    button.style.padding = "10px 15px";
    button.style.borderRadius = "4px";
    button.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    button.style.cursor = "pointer";
    button.style.zIndex = "9999";
    button.style.fontFamily =
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    // Create widget container (initially hidden)
    const container = document.createElement("div");
    container.id = "feedback-widget-container";
    container.style.position = "fixed";
    container.style.bottom = "80px";
    container.style.right = "20px";
    container.style.width = "300px";
    container.style.backgroundColor =
      this.settings.backgroundColor || "#FFFFFF";
    container.style.color = this.settings.widgetTextColor || "#333333";
    container.style.borderRadius = "8px";
    container.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
    container.style.zIndex = "10000";
    container.style.overflow = "hidden";
    container.style.display = "none";
    container.style.fontFamily =
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    // Create widget header
    const header = document.createElement("div");
    header.className = "feedback-widget-header";
    header.innerHTML = this.settings.headerText;
    header.style.padding = "15px";
    header.style.fontWeight = "bold";
    header.style.borderBottom = "1px solid rgba(0, 0, 0, 0.1)";

    // Create close button
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "×";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "15px";
    closeButton.style.fontSize = "20px";
    closeButton.style.cursor = "pointer";

    // Create content area
    const content = document.createElement("div");
    content.className = "feedback-widget-content";
    content.style.padding = "15px";

    // Add elements to DOM
    header.appendChild(closeButton);
    container.appendChild(header);
    container.appendChild(content);
    document.body.appendChild(button);
    document.body.appendChild(container);

    // Event listeners
    button.addEventListener("click", () => this.toggleWidget());
    closeButton.addEventListener("click", () => this.toggleWidget());

    // Initial render of feedback options
    this.renderFeedbackOptions(content);
  }

  renderFeedbackOptions(contentElement) {
    contentElement.innerHTML = "";
    const options = [];

    if (this.settings.feedbackOptions.like) {
      options.push({
        id: "like",
        text: "I like something",
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',
      });
    }

    if (this.settings.feedbackOptions.suggestion) {
      options.push({
        id: "suggestion",
        text: "I have a suggestion",
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>',
      });
    }

    if (this.settings.feedbackOptions.bug) {
      options.push({
        id: "bug",
        text: "Something's not working",
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M15 9l-6 6 M9 9l6 6"></path></svg>',
      });
    }

    for (const option of options) {
      const button = document.createElement("button");
      button.id = `feedback-option-${option.id}`;
      button.style.display = "flex";
      button.style.alignItems = "center";
      button.style.width = "100%";
      button.style.padding = "10px";
      button.style.marginBottom = "10px";
      button.style.border = "1px solid rgba(0, 0, 0, 0.1)";
      button.style.borderRadius = "4px";
      button.style.backgroundColor = "transparent";
      button.style.cursor = "pointer";
      button.style.textAlign = "left";
      button.style.color = "inherit";
      button.style.fontSize = "14px";
      button.style.transition = "background-color 0.2s";

      button.innerHTML = `<span style="margin-right: 10px;">${option.icon}</span> ${option.text}`;

      button.addEventListener("mouseenter", () => {
        button.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
      });

      button.addEventListener("mouseleave", () => {
        button.style.backgroundColor = "transparent";
      });

      button.addEventListener("click", () =>
        this.selectFeedbackType(option.id),
      );

      contentElement.appendChild(button);
    }
  }

  renderFeedbackForm(contentElement, type) {
    contentElement.innerHTML = "";

    // Back button
    const backBtn = document.createElement("button");
    backBtn.innerHTML = "&larr; Back";
    backBtn.style.background = "none";
    backBtn.style.border = "none";
    backBtn.style.padding = "0";
    backBtn.style.marginBottom = "15px";
    backBtn.style.color = "inherit";
    backBtn.style.cursor = "pointer";
    backBtn.style.fontSize = "14px";

    // Form elements
    const form = document.createElement("div");

    const messageLabel = document.createElement("label");
    messageLabel.htmlFor = "feedback-message";
    messageLabel.innerText = "Tell us more";
    messageLabel.style.display = "block";
    messageLabel.style.marginBottom = "5px";
    messageLabel.style.fontWeight = "500";

    const messageInput = document.createElement("textarea");
    messageInput.id = "feedback-message";
    messageInput.style.width = "100%";
    messageInput.style.minHeight = "100px";
    messageInput.style.padding = "8px";
    messageInput.style.marginBottom = "15px";
    messageInput.style.border = "1px solid rgba(0, 0, 0, 0.2)";
    messageInput.style.borderRadius = "4px";
    messageInput.style.resize = "vertical";

    const emailLabel = document.createElement("label");
    emailLabel.htmlFor = "feedback-email";
    emailLabel.innerText = "Email (optional)";
    emailLabel.style.display = "block";
    emailLabel.style.marginBottom = "5px";
    emailLabel.style.fontWeight = "500";

    const emailInput = document.createElement("input");
    emailInput.id = "feedback-email";
    emailInput.type = "email";
    emailInput.style.width = "100%";
    emailInput.style.padding = "8px";
    emailInput.style.marginBottom = "15px";
    emailInput.style.border = "1px solid rgba(0, 0, 0, 0.2)";
    emailInput.style.borderRadius = "4px";

    const submitBtn = document.createElement("button");
    submitBtn.innerText = "Submit feedback";
    submitBtn.style.width = "100%";
    submitBtn.style.padding = "10px";
    submitBtn.style.backgroundColor =
      this.settings.widgetButtonColor || "#4A90E2";
    submitBtn.style.color = this.settings.widgetButtonTextColor || "#FFFFFF";
    submitBtn.style.border = "none";
    submitBtn.style.borderRadius = "4px";
    submitBtn.style.cursor = "pointer";

    // Add elements to form
    form.appendChild(messageLabel);
    form.appendChild(messageInput);
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(submitBtn);

    // Add elements to content
    contentElement.appendChild(backBtn);
    contentElement.appendChild(form);

    // Event listeners
    backBtn.addEventListener("click", () => {
      this.currentType = null;
      const content = document.querySelector(".feedback-widget-content");
      this.renderFeedbackOptions(content);
    });

    submitBtn.addEventListener("click", () => {
      const message = messageInput.value.trim();
      const email = emailInput.value.trim();

      if (!message) {
        messageInput.style.borderColor = "#E74C3C";
        return;
      }

      this.submitFeedback({
        type,
        message,
        email,
        page_url: window.location.href,
      });
    });
  }

  renderThankYou(contentElement) {
    contentElement.innerHTML = "";

    const icon = document.createElement("div");
    icon.innerHTML =
      '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#27AE60" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg>';
    icon.style.textAlign = "center";
    icon.style.margin = "15px 0";

    const thankYouText = document.createElement("h3");
    thankYouText.innerText = "Thank you for your feedback!";
    thankYouText.style.textAlign = "center";
    thankYouText.style.marginBottom = "10px";

    const message = document.createElement("p");
    message.innerText = "Your feedback helps us improve our service.";
    message.style.textAlign = "center";
    message.style.fontSize = "14px";
    message.style.color = "rgba(0, 0, 0, 0.6)";

    contentElement.appendChild(icon);
    contentElement.appendChild(thankYouText);
    contentElement.appendChild(message);

    // Auto-close after a delay
    setTimeout(() => {
      this.toggleWidget();
      setTimeout(() => {
        this.currentType = null;
        const content = document.querySelector(".feedback-widget-content");
        this.renderFeedbackOptions(content);
      }, 300);
    }, 3000);
  }
  
  renderErrorMessage(contentElement, errorMessage) {
    contentElement.innerHTML = "";

    const icon = document.createElement("div");
    icon.innerHTML =
      '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    icon.style.textAlign = "center";
    icon.style.margin = "15px 0";

    const errorTitle = document.createElement("h3");
    errorTitle.innerText = "Error";
    errorTitle.style.textAlign = "center";
    errorTitle.style.marginBottom = "10px";
    errorTitle.style.color = "#E74C3C";

    const message = document.createElement("p");
    message.innerText = errorMessage;
    message.style.textAlign = "center";
    message.style.fontSize = "14px";
    message.style.marginBottom = "15px";

    const backBtn = document.createElement("button");
    backBtn.innerText = "Try Again";
    backBtn.style.width = "100%";
    backBtn.style.padding = "10px";
    backBtn.style.backgroundColor = this.settings.widgetButtonColor || "#4A90E2";
    backBtn.style.color = this.settings.widgetButtonTextColor || "#FFFFFF";
    backBtn.style.border = "none";
    backBtn.style.borderRadius = "4px";
    backBtn.style.cursor = "pointer";

    contentElement.appendChild(icon);
    contentElement.appendChild(errorTitle);
    contentElement.appendChild(message);
    contentElement.appendChild(backBtn);

    // Event listener for the back button
    backBtn.addEventListener("click", () => {
      if (this.currentType) {
        this.renderFeedbackForm(contentElement, this.currentType);
      } else {
        this.renderFeedbackOptions(contentElement);
      }
    });
  }

  toggleWidget() {
    const container = document.getElementById("feedback-widget-container");
    this.isOpen = !this.isOpen;
    container.style.display = this.isOpen ? "block" : "none";

    // Load reCAPTCHA only when widget is opened
    if (this.isOpen && this.recaptchaEnabled) {
      this.loadRecaptcha();
    }
  }

  selectFeedbackType(type) {
    this.currentType = type;
    const content = document.querySelector(".feedback-widget-content");
    this.renderFeedbackForm(content, type);
  }

  async submitFeedback(data) {
    try {
      // Execute reCAPTCHA and get token
      if (!window.grecaptcha && this.recaptchaEnabled) {
        console.error("reCAPTCHA not loaded");
        return;
      }

      let recaptchaToken = "";

      if (this.recaptchaEnabled) {
        recaptchaToken = await new Promise((resolve) => {
          grecaptcha.ready(() => {
            grecaptcha
              .execute(this.recaptchaSiteKey, { action: "submit_feedback" })
              .then((token) => resolve(token))
              .catch((err) => {
                console.error("reCAPTCHA error:", err);
                resolve("");
              });
          });
        });
      }

      const response = await fetch(`${this.apiServer}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          api_key: this.apiKey,
          recaptcha_token: recaptchaToken,
        }),
      });

      if (response.ok) {
        const content = document.querySelector(".feedback-widget-content");
        this.renderThankYou(content);
      } else {
        console.error("Failed to submit feedback");
        const responseData = await response.json();
        if (responseData.error) {
          const content = document.querySelector(".feedback-widget-content");
          this.renderErrorMessage(content, responseData.error);
        }
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  }
}

// Make it available globally
window.FeedbackWidget = FeedbackWidget;
