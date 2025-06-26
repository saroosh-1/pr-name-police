import * as vscode from "vscode";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

export async function activate(context: vscode.ExtensionContext) {
  console.log("✅ PR Name Fixer activated");

  const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspacePath) {
    vscode.window.showErrorMessage("No workspace folder detected.");
    return;
  }

  if (!fs.existsSync(path.join(workspacePath, ".git"))) {
    vscode.window.showWarningMessage("No Git repository detected in the workspace.");
    return;
  }

  // Step 1: Create stub pre-push hook (non-executable initially)
  createStubPrePushHook(workspacePath);

  // Step 2: Prompt and handle gh install + auth flow
  const ghReady = await ensureGhInstalledAndAuthenticated(workspacePath);

  if (ghReady) {
    // Step 3: Make hook executable and overwrite with full script
    installPrePushHook(workspacePath);
    vscode.window.showInformationMessage("✅ PR Name Fixer: pre-push hook installed and activated.");
  } else {
    vscode.window.showWarningMessage("GitHub CLI setup incomplete. Pre-push hook remains a stub.");
  }

  // Register manual command to retry installation/auth and hook setup
  const disposable = vscode.commands.registerCommand("pr-name-fixer.executeTask", async () => {
    if (!fs.existsSync(path.join(workspacePath, ".git"))) {
      vscode.window.showWarningMessage("No Git repository detected in the workspace.");
      return;
    }

    const ready = await ensureGhInstalledAndAuthenticated(workspacePath);

    if (ready) {
      installPrePushHook(workspacePath);
      vscode.window.showInformationMessage("✅ PR Name Fixer: pre-push hook installed and activated.");
    }
  });

  context.subscriptions.push(disposable);
}

function createStubPrePushHook(workspacePath: string) {
  const hookDir = path.join(workspacePath, ".git", "hooks");
  const hookPath = path.join(hookDir, "pre-push");

  if (!fs.existsSync(hookDir)) {
    vscode.window.showWarningMessage("Could not find .git/hooks directory.");
    return;
  }

  const stubScript = `#!/bin/bash
# Stub pre-push hook created by PR Name Fixer extension
echo "⚠️ PR Name Fixer pre-push hook placeholder - waiting for GitHub CLI setup."
exit 0
`;

  try {
    fs.writeFileSync(hookPath, stubScript);
    // Set as non-executable initially (e.g., 644 permissions)
    fs.chmodSync(hookPath, 0o644);
    console.log("Stub pre-push hook created (non-executable).");
  } catch (err) {
    console.error("Failed to write stub pre-push hook:", err);
  }
}

async function ensureGhInstalledAndAuthenticated(workspacePath: string): Promise<boolean> {
  // Initial check if already installed and authenticated
  const ghInstalled = await new Promise<boolean>((resolve) => {
    exec("gh --version", (err) => resolve(!err));
  });
  const isAuthenticated = await new Promise<boolean>((resolve) => {
    exec("gh auth status", (err, stdout) => resolve(!err && stdout.includes("Logged in to github.com")));
  });

  if (ghInstalled && isAuthenticated) {
    vscode.window.showInformationMessage("✅ GitHub CLI is already installed and authenticated.");
    return true;
  }

  // Prompt user to proceed with full setup
  const setupChoice = await vscode.window.showInformationMessage(
    "GitHub CLI (gh) is required to fix PR titles. Would you like to install and authenticate it now?",
    "Yes",
    "No"
  );
  if (setupChoice !== "Yes") {
    vscode.window.showWarningMessage("GitHub CLI setup skipped. Pre-push hook remains a stub.");
    return false;
  }

  const terminal = vscode.window.createTerminal("PR Name Fixer Setup");
  terminal.show();

  vscode.window.showInformationMessage("Setting up GitHub CLI. Please follow the terminal prompts...");

  const hookDir = path.join(workspacePath, ".git", "hooks");
  const hookPath = path.join(hookDir, "pre-push");

  let authCommand = `gh auth login && chmod +x "${hookPath}"`;
  
  if (!ghInstalled) {
    const installCommand = process.platform === "win32" ? "choco install gh" : "brew install gh";
    authCommand = `${installCommand} && ${authCommand}`;
  }
  
  terminal.show();
  terminal.sendText(authCommand);
  
  vscode.window.showInformationMessage(
    "Please complete GitHub CLI installation and login in the terminal. Pre-push hook will be made executable after login."
  );
  

  vscode.window.showInformationMessage(
    "Please complete the GitHub CLI installation and authentication in the terminal. Press Enter when done, or Cancel to skip."
  );
  const input = await vscode.window.showInputBox({ prompt: "Press Enter after installation and authentication, or Cancel to skip." });
  if (input === undefined) { // User canceled
    vscode.window.showWarningMessage("GitHub CLI setup canceled. Pre-push hook remains a stub.");
    return false;
  }

  // Verify installation and authentication
  const finalInstalled = await new Promise<boolean>((resolve) => {
    exec("gh --version", (err) => resolve(!err));
  });
  const finalAuthenticated = await new Promise<boolean>((resolve) => {
    exec("gh auth status", (err, stdout) => resolve(!err && stdout.includes("Logged in to github.com")));
  });

  if (finalInstalled && finalAuthenticated) {
    vscode.window.showInformationMessage("✅ GitHub CLI installed and authenticated.");
    return true;
  } else {
    vscode.window.showErrorMessage("GitHub CLI setup failed. Please verify installation and authentication manually.");
    return false;
  }
}

const fixPRTitleScript = `#!/bin/bash
# Auto-generated by PR Name Fixer VS Code Extension

# Check if gh is installed
if ! command -v gh &> /dev/null; then
  echo "⚠️ GitHub CLI (gh) not installed. Skipping PR title fix."
  exit 0
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
  echo "⚠️ GitHub CLI not authenticated. Skipping PR title fix."
  exit 0
fi

BASE_BRANCH="main"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

PR_NUMBER=$(gh pr list --head "$CURRENT_BRANCH" --state open --json number -q '.[0].number')

if [[ -z "$PR_NUMBER" || "$PR_NUMBER" == "null" ]]; then
  echo "❌ No open PR found for branch: $CURRENT_BRANCH"
  exit 0
fi

PR_TITLE=$(gh pr view "$PR_NUMBER" --json title -q '.title')
TITLE_LOWER=$(echo "$PR_TITLE" | tr '[:upper:]' '[:lower:]')

if [[ "$TITLE_LOWER" =~ ^(feature|hotfix|bugfix|release)/[0-9]+ ]]; then
  echo "✅ PR title already follows convention. Skipping."
  exit 0
fi

NEW_TITLE="\${CURRENT_BRANCH//_/ }"
echo "🛠️ Updating PR #$PR_NUMBER title to: $NEW_TITLE"
gh pr edit "$PR_NUMBER" --title "$NEW_TITLE"
`;

function installPrePushHook(workspacePath: string) {
  const hookDir = path.join(workspacePath, ".git", "hooks");
  const hookPath = path.join(hookDir, "pre-push");

  if (!fs.existsSync(hookDir)) {
    vscode.window.showWarningMessage("Could not find .git/hooks directory.");
    return;
  }

  try {
    // Overwrite with full script and make executable
    fs.writeFileSync(hookPath, fixPRTitleScript);
    fs.chmodSync(hookPath, 0o755);
    console.log("Full pre-push hook installed and made executable.");
  } catch (err) {
    console.error("Failed to write full pre-push hook:", err);
  }
}

export function deactivate() {}