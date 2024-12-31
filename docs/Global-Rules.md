# Global Rules for AI Assistance

## Implementation Protocol
1. **Automatic Reference**: The rules, project structure, and configuration will be automatically loaded and referenced at the start of each session
2. **Configuration Check**: Before each task, I will verify the current configuration against .cascade-config.json
3. **Project Structure Check**: Before each task, I will verify the current project structure against project-structure.md
4. **Compliance Check**: Before executing any task, I will verify compliance with relevant rules
5. **Rule Updates**: Any changes to the rules will be immediately incorporated into my workflow
6. **Documentation**: All decisions will reference the applicable rules, project structure, and configuration

## Core Rules
### 1. Code Formatting
- Always follow project's existing style (indentation, quotes, etc.)
- Use TypeScript types where applicable
- Prefer functional components over class components
- Use consistent import ordering

### 2. Error Handling
- Add proper error boundaries
- Include meaningful error messages
- Log errors with context
- Handle edge cases gracefully

### 3. Documentation
- Document all new components
- Add JSDoc comments for functions
- Keep README files updated
- Maintain changelogs for major changes

### 4. Testing
- Write unit tests for new features
- Include test cases for edge scenarios
- Use testing-library for React components
- Maintain good test coverage

### 5. Security
- Validate all user inputs
- Sanitize data before rendering
- Use secure authentication methods
- Follow OWASP security guidelines

### 6. Performance
- Optimize component rendering
- Use memoization where appropriate
- Implement lazy loading for large components
- Avoid unnecessary re-renders

### 7. Accessibility
- Follow WCAG guidelines
- Use semantic HTML
- Ensure keyboard navigation
- Add ARIA attributes where needed

### 8. Code Organization
- Keep components small and focused
- Use proper folder structure
- Separate concerns logically
- Avoid duplicate code

### 9. Database Development
- Always reference prisma/schema.prisma first when writing database-related code
- Ensure database models and fields match the Prisma schema
- Use Prisma Client for all database operations
- Maintain schema synchronization with Supabase database

### 9. Version Control
- Write meaningful commit messages
- Use feature branches
- Follow pull request guidelines
- Keep master branch stable

### 10. Communication
- Be clear and concise
- Provide context for changes
- Explain technical decisions
- Document trade-offs

### 11. API Development
- Follow RESTful principles
- Use consistent endpoint naming
- Implement proper versioning
- Include comprehensive documentation
- Use appropriate status codes
- Implement rate limiting

### 12. State Management
- Use centralized state management
- Keep state minimal and focused
- Use selectors for derived state
- Implement proper state persistence
- Handle state transitions clearly

### 13. Environment Configuration
- Use environment variables for sensitive data
- Maintain separate configs for different environments
- Validate environment variables at startup
- Keep production configs secure
- Document all required environment variables

### 14. Deployment Procedures
- Use CI/CD pipelines
- Implement zero-downtime deployments
- Use canary releases for major changes
- Maintain rollback procedures
- Monitor deployments closely

### 15. Monitoring and Logging
- Implement centralized logging
- Use structured logging format
- Set up application monitoring
- Create meaningful alerts
- Track key performance metrics

### 16. Code Review Process
- Use pull requests for all changes
- Require at least one approval
- Include meaningful descriptions
- Use code review checklists
- Address feedback promptly

### 17. Dependency Management
- Keep dependencies up-to-date
- Audit dependencies regularly
- Pin dependency versions
- Document all dependencies
- Remove unused dependencies

## Compliance Process
1. At task start: Review relevant rules
2. During execution: Verify rule compliance
3. Before completion: Perform final rule check
4. After completion: Document rule adherence
