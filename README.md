🚨 PR Name Police – Enforce Pull Request Naming Conventions with Ease
PR Name Police is a lightweight yet powerful VS Code extension that ensures your pull request titles follow consistent naming rules. Whether you're working in sprints, following semantic versioning, or just want cleaner Git hygiene, PR Name Police has your back!

✨ Features
🧠 Smart PR Title Detection – Detects active GitHub pull requests right from your branch

📝 Rule Enforcement – Checks your PR title against configurable patterns (e.g., fix/, feature/, hotfix/)

📛 Inline Feedback – Warns when your PR title doesn't comply with team rules

💬 Fix Suggestions – Suggests corrected titles or lets you generate one with a click

⚙️ Fully Configurable – Customize naming rules, prefix sets, Jira integration, and more

🧪 Preview Mode – See what your PR name will look like before pushing

🔍 How It Works
You push a new branch or open a PR in GitHub

PR Name Police checks the PR title against your team's naming policy

If the title is invalid or incomplete:

It alerts you in VS Code

Offers corrected suggestions like:

fix/login-button-not-responding

chore/update-readme-dependencies

You can auto-rename your PR based on the branch name, ticket ID, or commit messages

🧪 Supported Naming Patterns
Supports and validates formats like:

fix/<short-desc>

feature/<module>-<new-thing>

hotfix/<prod-issue>

Custom prefixes (hotfix/, feature/, bugix/)

Branch: fix/login-crash

❌ PR Title: "Fix bug"
✅ Suggested: "fix/login-crash-on-empty-password"

🚀 Installation
From VS Code Marketplace
Open VS Code

Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)

Search for PR Name Police

Click Install

Reload VS Code

⚙️ Configuration
In your project’s .vscode/settings.json or global VS Code settings:
{
  "prnamepolice.rules": {
    "prefixes": ["fix", "feature", "chore", "hotfix"],
    "requireJira": true,
    "jiraPattern": "[A-Z]{2,5}-\\d+",
    "case": "kebab"
  }
}