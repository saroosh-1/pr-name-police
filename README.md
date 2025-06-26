# PR Name Police 🚨

**Enforce consistent pull request naming conventions with ease**

PR Name Police is a lightweight, powerful VS Code extension designed to ensure your GitHub pull request titles adhere to your team's naming conventions. Perfect for teams working in sprints, following semantic versioning, or aiming for cleaner Git hygiene.

---

## ✨ Features

- Smart PR Title Detection: Automatically detects open GitHub pull requests for your current branch.
- Rule Enforcement: Validates PR titles against configurable naming patterns (e.g., `fix/`, `feature/`, `hotfix/`).
- Inline Feedback: Displays warnings in VS Code when PR titles don't comply with your team's rules.
- Fix Suggestions: Offers corrected title suggestions or auto-generates titles with a single click.
- Fully Configurable: Customize naming rules, prefixes, Jira integration, and more.
- Preview Mode: Preview your PR title before pushing changes.

---

## 🔍 How It Works

1. Push a new branch or open a pull request on GitHub.
2. PR Name Police checks the PR title against your team's naming policy.
3. If the title is invalid or incomplete:
   - Receive an alert in VS Code.
   - Get suggestions for corrected titles, such as:
     - `fix/login-button-not-responding`
     - `chore/update-readme-dependencies`
4. Auto-rename your PR based on the branch name, ticket ID, or commit messages.

---

## 🧪 Supported Naming Patterns

PR Name Police validates and supports naming conventions like:

- `fix/<short-description>`
- `feature/<module>-<new-thing>`
- `hotfix/<prod-issue>`
- `bugfix/<issue-description>`
- `release/<version>`
- Custom prefixes (e.g., `chore/`, `docs/`)

### Example
- **Branch**: `fix/login-crash`
- **❌ Invalid PR Title**: "Fix bug"
- **✅ Suggested Title**: `fix/login-crash-on-empty-password`

---

## 🚀 Installation

1. Open VS Code.
2. Go to **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`).
3. Search for **PR Name Police**.
4. Click **Install**.
5. If the GitHub CLI (`gh`) is not installed, PR Name Police will prompt you to install it.
6. Authorize `gh` when prompted to enable PR management.
7. Reload VS Code to start using the extension.

> **Note**: PR Name Police creates a configuration file to manage your PR naming rules.

---

## ⚙️ Configuration

Customize PR Name Police to fit your team's workflow:

- Define custom prefixes (e.g., `feature/`, `hotfix/`, `docs/`).
- Integrate with Jira for ticket-based naming.
- Set up patterns to enforce specific formats (e.g., `feature/<ticket-id>-<description>`).
- Enable preview mode to test PR titles before submission.

To configure, open the VS Code settings (`Ctrl+,` / `Cmd+,`) and search for `PR Name Police`.

---

📖 Usage
- Create a new branch (e.g., git checkout -b fix/login-crash).
- Push your changes and create a PR using gh pr create or directly on GitHub.
- PR Name Police will check the PR title and notify you in VS Code if it doesn't match your team's rules.
- Accept a suggested title or manually update the PR title using the provided feedback.
🤝 Contributing
- We welcome contributions! To contribute:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Submit a pull request with a title that follows our naming conventions (ironic, right? 😉).
📜 License
- PR Name Police is licensed under the MIT License.

📬 Support
- For issues, feature requests, or questions, please open an issue on our GitHub repository or reach out via the VS Code Marketplace.

Keep your PRs clean and consistent with PR Name Police! 🚨