# Contributing to Movami Screen Recorder

Thank you for your interest in contributing to Movami Screen Recorder! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **Bug Reports** - Help us identify and fix issues
- **Feature Requests** - Suggest new features or improvements
- **Code Contributions** - Submit pull requests with code changes
- **Documentation** - Improve or add documentation
- **Testing** - Test the application and report issues
- **Design** - Help improve the user interface and experience

### Before You Start

1. **Check Existing Issues** - Search existing issues to avoid duplicates
2. **Read the Documentation** - Familiarize yourself with the codebase
3. **Set Up Development Environment** - Follow the setup instructions in README.md

## 🚀 Development Setup

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Git
- Basic knowledge of React, Electron, and JavaScript

### Quick Start

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/movami-screen-recorder.git
   cd movami-screen-recorder
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Setup Script**
   ```bash
   node scripts/setup.js
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## 📝 Code Style Guidelines

### JavaScript/React

- Use **ES6+** features
- Follow **functional component** patterns with hooks
- Use **destructuring** for props and state
- Prefer **const** and **let** over **var**
- Use **arrow functions** for consistency
- Add **JSDoc comments** for complex functions

### Styling

- Use **styled-components** for component styling
- Follow the **theme system** defined in `GlobalStyles.js`
- Use **CSS Grid** and **Flexbox** for layouts
- Maintain **responsive design** principles
- Follow **BEM-like naming** conventions

### File Organization

- Keep components **small and focused**
- Use **descriptive file names**
- Group related components in **feature folders**
- Export components as **named exports**

## 🐛 Bug Reports

### Before Submitting

1. **Search existing issues** to avoid duplicates
2. **Test on the latest version** of the application
3. **Check system requirements** and compatibility
4. **Try to reproduce** the issue consistently

### Bug Report Template

```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [Windows/macOS/Linux]
- Version: [App version]
- Node.js: [Version]
- Electron: [Version]

## Additional Information
- Screenshots/videos if applicable
- Console errors if any
- System specifications
```

## 💡 Feature Requests

### Before Submitting

1. **Check existing feature requests** for similar ideas
2. **Consider the impact** on existing functionality
3. **Think about implementation** complexity
4. **Ensure alignment** with project goals

### Feature Request Template

```markdown
## Feature Description
Brief description of the requested feature

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Use Cases
- Use case 1
- Use case 2
- Use case 3

## Implementation Ideas
Any technical implementation suggestions

## Additional Information
- Mockups/wireframes if available
- Related features or dependencies
```

## 🔧 Pull Requests

### Before Submitting

1. **Create a feature branch** from `main`
2. **Write clear commit messages**
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Follow the coding guidelines**

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on Windows
- [ ] Tested on macOS
- [ ] Tested on Linux
- [ ] Unit tests added/updated

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Performance impact considered

## Screenshots
If applicable, add screenshots of UI changes
```

### Commit Message Guidelines

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

Examples:
```
feat(recorder): add countdown timer before recording
fix(audio): resolve microphone not detected on Linux
docs(readme): update installation instructions
```

## 🧪 Testing

### Manual Testing

Test the following scenarios:
- **Recording functionality** on all platforms
- **Audio recording** with different devices
- **Quality settings** and their impact
- **Hotkey functionality** across applications
- **Export features** with different formats
- **Settings persistence** across app restarts

### Automated Testing

- Write **unit tests** for utility functions
- Add **integration tests** for critical workflows
- Test **cross-platform compatibility**
- Verify **performance benchmarks**

## 📚 Documentation

### Code Documentation

- Add **JSDoc comments** for functions and classes
- Document **complex algorithms** and business logic
- Explain **state management** patterns
- Document **API interfaces** and data structures

### User Documentation

- Update **README.md** for new features
- Add **screenshots** for UI changes
- Document **configuration options**
- Provide **troubleshooting guides**

## 🎨 Design Contributions

### UI/UX Guidelines

- Follow **material design principles**
- Maintain **accessibility standards**
- Ensure **responsive design**
- Use **consistent spacing** and typography
- Follow **color scheme** from theme

### Design Process

1. **Create mockups** for new features
2. **Get feedback** from the community
3. **Implement designs** with proper components
4. **Test usability** across different screen sizes
5. **Iterate based on feedback**

## 🔒 Security

### Security Guidelines

- **Never commit sensitive data** (API keys, passwords)
- **Validate user inputs** thoroughly
- **Use secure communication** protocols
- **Follow OWASP guidelines** for web security
- **Report security issues** privately

### Reporting Security Issues

If you discover a security vulnerability:

1. **Do not create a public issue**
2. **Email security@movami.com** (if available)
3. **Provide detailed information** about the vulnerability
4. **Wait for acknowledgment** before public disclosure

## 🏷️ Release Process

### Versioning

We follow **semantic versioning** (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes prepared
- [ ] Cross-platform builds tested

## 🤝 Community Guidelines

### Code of Conduct

- **Be respectful** and inclusive
- **Help newcomers** learn and contribute
- **Provide constructive feedback**
- **Focus on the code**, not the person
- **Celebrate contributions** and achievements

### Communication

- Use **clear and concise language**
- **Ask questions** when unsure
- **Provide context** for issues
- **Be patient** with responses
- **Use appropriate channels** for different topics

## 📞 Getting Help

### Resources

- **README.md** - Project overview and setup
- **Issues** - Search existing issues and discussions
- **Discussions** - Community forum for questions
- **Documentation** - In-depth guides and references

### Contact

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and general discussion
- **Email** - For security issues or private matters

## 🎉 Recognition

### Contributors

All contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page
- **Project documentation**

### Special Recognition

- **First-time contributors** get special badges
- **Major feature contributors** get featured in releases
- **Long-term contributors** get maintainer status
- **Security researchers** get special acknowledgment

---

Thank you for contributing to Movami Screen Recorder! Your contributions help make professional screen recording accessible to everyone.
