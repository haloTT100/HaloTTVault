# Automatic Issue-to-Project Board Setup

This repository includes a GitHub Actions workflow that automatically adds newly created issues to a specified project board.

## Setup Instructions

### 1. Create a Project Board

1. Go to your GitHub repository or organization
2. Navigate to the "Projects" tab
3. Click "New Project" and create your project board
4. Note the project URL (e.g., `https://github.com/users/haloTT100/projects/1`)

### 2. Configure Repository Variables

1. Go to your repository Settings → Secrets and variables → Actions
2. Click on the "Variables" tab
3. Add a new repository variable:
   - **Name**: `PROJECT_URL`
   - **Value**: Your project board URL (e.g., `https://github.com/users/haloTT100/projects/1`)

### 3. Alternative Configuration Methods

#### Option A: Using Project URL (Recommended)
```yaml
project-url: ${{ vars.PROJECT_URL }}
```

#### Option B: Using Project Number (for organization projects)
```yaml
project-number: 123  # Replace with your project number
```

#### Option C: Using Repository Secrets (for private projects)
Instead of repository variables, you can use secrets:
1. Add `PROJECT_URL` as a repository secret
2. Reference it as `${{ secrets.PROJECT_URL }}`

### 4. Permissions

The workflow uses `${{ secrets.GITHUB_TOKEN }}` which has the necessary permissions for public repositories. For private repositories or organization projects, you may need to:

1. Create a Personal Access Token (classic) with `project` and `repo` scopes
2. Add it as a repository secret named `PROJECT_TOKEN`
3. Update the workflow to use `github-token: ${{ secrets.PROJECT_TOKEN }}`

## How It Works

- **Trigger**: The workflow runs automatically when a new issue is created (`issues: [opened]`)
- **Action**: Uses the official `actions/add-to-project` action to add the issue to the specified project
- **Permissions**: Uses the built-in `GITHUB_TOKEN` for authentication

## Customization

You can extend this workflow by:

1. **Adding labels**: Automatically assign labels to issues when added to the project
2. **Filtering issues**: Only add issues with specific labels or titles
3. **Setting project fields**: Automatically set status, priority, or other project fields

Example with filtering:
```yaml
if: contains(github.event.issue.labels.*.name, 'bug') || contains(github.event.issue.labels.*.name, 'feature')
```

## Troubleshooting

- **Permission denied errors**: Ensure the `PROJECT_URL` is correct and the repository has access to the project
- **Workflow not triggering**: Check that the workflow file is in the correct location (`.github/workflows/`)
- **Project not found**: Verify the project URL format and accessibility

## Testing

To test the automation:
1. Create a new issue in your repository
2. Check the Actions tab to see if the workflow ran successfully
3. Verify the issue appears in your project board