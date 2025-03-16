# Contributing to SimplCMS

Thank you for your interest in contributing to **SimplCMS**! We appreciate your help in improving our project. Before you start, please take a moment to read through our contribution guidelines.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Setting Up the Development Environment](#setting-up-the-development-environment)
- [Development Workflow](#development-workflow)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Community and Support](#community-and-support)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful to others and create a positive environment for collaboration.

## How to Contribute

You can contribute in several ways:

- **Report bugs** by creating an issue.
- **Suggest new features** or enhancements.
- **Submit pull requests** for bug fixes or improvements.
- **Improve documentation**.

## Setting Up the Development Environment

### Prerequisites

Ensure you have the following installed:

- **Node.js** (Latest LTS version recommended)
- **npm** or **yarn**
- **Git**
- **Docker** (Optional, for testing with containers)

### Clone the Repository

```sh
 git clone https://github.com/simplcms/simplcms.git
 cd simplcms
```

### Install Dependencies

```sh
npm install  # or yarn install
```

### Running the Project

To start the development server:

```sh
npm run dev  # or yarn dev
```

## Development Workflow

1. **Create a Branch**

   - For features: `feature/short-description`
   - For bug fixes: `fix/short-description`

   Example:

   ```sh
   git checkout -b feature/improve-dashboard
   ```

2. **Write Clean and Well-Documented Code**

   - Follow the existing project structure and style.
   - Write meaningful commit messages.
   - Add tests if applicable.

3. **Run Tests Before Submitting a PR**
   ```sh
   npm run test  # or yarn test
   ```

## Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```sh
feat: add new user authentication
fix: resolve issue with API response
chore: update dependencies
```

## Pull Request Process

1. Ensure your branch is **up to date** with the `main` branch.
2. Submit a pull request with a **clear description**.
3. The team will review your PR, and you may need to make changes.
4. Once approved, the PR will be merged.

## Reporting Issues

If you find a bug, please check if it has already been reported in the [Issues](https://github.com/simplcms/simplcms/issues) section. If not, create a new issue with:

- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots or logs (if applicable)**

## Community and Support

If you have any questions, join our discussions on:

- **GitHub Discussions**: [simplcms discussions](https://github.com/simplcms/simplcms/discussions)
- **Discord/Slack (if applicable)**

Happy coding! 🚀
