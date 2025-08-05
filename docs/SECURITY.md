# Security Guidelines

This document outlines the security measures implemented in CCH Axcess Intelligence Vibed and guidelines for maintaining security standards.

## Overview

Our application implements multiple layers of security to protect user data, API keys, and system integrity:

- **Input Sanitization**: All user inputs are validated and sanitized
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **Rate Limiting**: Protects against abuse and DoS attacks
- **Secure Headers**: Implements security best practices
- **Environment Security**: Proper handling of sensitive configuration

## Security Features

### 1. Input Sanitization

Location: `src/security/sanitization.ts`

**Features:**
- HTML sanitization with allowlist approach
- Text input cleaning (removes all HTML)
- File name sanitization (prevents directory traversal)
- URL validation (allows only HTTP/HTTPS)
- Injection pattern detection

**Usage:**
```typescript
import { sanitizeInput, validationSchemas } from '@/security/sanitization';

// Sanitize user input
const clean = sanitizeInput(userInput, 'text');

// Validate with Zod schemas
const result = validationSchemas.chatMessage.parse(messageData);
```

### 2. Content Security Policy (CSP)

Location: `src/security/headers.ts`

**Features:**
- Environment-specific CSP rules
- Strict script and style policies
- Controlled external resource loading
- Frame protection

**Current Policy:**
- `default-src 'self'`: Only allow resources from same origin
- `script-src 'self' 'unsafe-inline'`: Scripts from same origin + inline (for React)
- `connect-src`: API endpoints + localhost in development
- `img-src`: Self + data URLs + HTTPS images
- `frame-ancestors 'none'`: Prevent clickjacking

### 3. Security Headers

**Implemented Headers:**
- `Strict-Transport-Security`: Force HTTPS in production
- `X-Content-Type-Options`: Prevent MIME sniffing
- `X-Frame-Options`: Prevent clickjacking
- `X-XSS-Protection`: Enable browser XSS protection
- `Referrer-Policy`: Control referrer information
- `Permissions-Policy`: Disable unnecessary browser features

### 4. Rate Limiting

**Client-Side Rate Limiting:**
- 100 requests per 15-minute window (configurable)
- localStorage-based tracking
- Graceful degradation if storage unavailable

**Server-Side Rate Limiting:**
- Configurable limits per environment
- IP-based tracking
- Automatic cleanup of expired entries

## Environment Security

### 1. API Key Management

**Requirements:**
- Never commit API keys to version control
- Use environment variables for all secrets
- Rotate keys regularly
- Use different keys for different environments

**Environment Files:**
```bash
# Development
.env.development

# Staging  
.env.staging

# Production
.env.production

# Template (committed to repo)
.env.example
```

### 2. Key Rotation Process

1. **Generate New Keys:**
   - Anthropic: Generate new API key in dashboard
   - OpenAI: Generate new API key in dashboard

2. **Update Environment:**
   ```bash
   # Update .env file
   ANTHROPIC_API_KEY=new_key_here
   OPENAI_API_KEY=new_key_here
   ```

3. **Deploy and Test:**
   - Deploy to staging first
   - Verify functionality
   - Deploy to production
   - Monitor for errors

4. **Revoke Old Keys:**
   - Wait 24-48 hours for propagation
   - Revoke old keys in provider dashboards

### 3. Environment Variable Validation

All environment variables are validated using Zod schemas:

```typescript
const envSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(20),
  OPENAI_API_KEY: z.string().min(20),
  ENCRYPTION_KEY: z.string().min(32),
  // ... other variables
});
```

## Vulnerability Management

### 1. Dependency Scanning

**Automated Scanning:**
```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (use carefully)
npm audit fix --force
```

**Schedule:**
- Weekly automated scans
- Immediate review of high/critical vulnerabilities
- Monthly dependency updates

### 2. Code Security Review

**Review Checklist:**
- [ ] No hardcoded secrets
- [ ] Input validation implemented
- [ ] Output encoding applied
- [ ] Authentication/authorization checked
- [ ] Error handling doesn't leak information
- [ ] Logging doesn't expose sensitive data

### 3. Security Testing

**Test Types:**
- Unit tests for security functions
- Integration tests for authentication
- Penetration testing (quarterly)
- Code review for security implications

## Incident Response

### 1. Security Incident Classification

**Severity Levels:**
- **Critical**: Data breach, system compromise
- **High**: Successful attack, privilege escalation
- **Medium**: Attempted attack, vulnerability discovered
- **Low**: Security misconfiguration, policy violation

### 2. Response Procedures

**Immediate Actions:**
1. Contain the incident
2. Assess the impact
3. Notify stakeholders
4. Document everything

**Investigation:**
1. Preserve evidence
2. Identify root cause
3. Determine scope of impact
4. Plan remediation

**Recovery:**
1. Implement fixes
2. Verify security
3. Monitor for recurrence
4. Update procedures

## Security Best Practices

### 1. Development Guidelines

**Code Security:**
- Always validate input
- Use parameterized queries
- Implement proper error handling
- Follow least privilege principle
- Regular security training

**API Security:**
- Use HTTPS only
- Implement rate limiting
- Validate all requests
- Log security events
- Use secure authentication

### 2. Deployment Security

**Infrastructure:**
- Keep systems updated
- Use security scanning tools
- Implement monitoring
- Regular backups
- Network segmentation

**Configuration:**
- Secure default settings
- Disable unnecessary features
- Use strong passwords
- Enable logging
- Regular security audits

## Compliance Requirements

### 1. Data Protection

**Requirements:**
- Encrypt data in transit and at rest
- Implement access controls
- Audit data access
- Data retention policies
- User consent mechanisms

### 2. Industry Standards

**Following:**
- OWASP Top 10
- NIST Cybersecurity Framework
- SOC 2 Type II (planned)
- ISO 27001 (planned)

## Security Contacts

**Security Team:**
- Primary Contact: [Your Security Contact]
- Emergency Contact: [24/7 Security Contact]
- Incident Reporting: security@yourcompany.com

**External Resources:**
- CERT/CC: https://www.cert.org/
- OWASP: https://owasp.org/
- CVE Database: https://cve.mitre.org/

## Appendix

### A. Security Testing Checklist

- [ ] SQL Injection testing
- [ ] XSS testing
- [ ] CSRF testing
- [ ] Authentication testing
- [ ] Authorization testing
- [ ] Session management testing
- [ ] Input validation testing
- [ ] Error handling testing
- [ ] Cryptography testing
- [ ] Business logic testing

### B. Security Tools

**Static Analysis:**
- ESLint security rules
- Bandit (Python)
- SonarQube
- CodeQL

**Dynamic Analysis:**
- OWASP ZAP
- Burp Suite
- Nmap
- Wireshark

**Dependency Scanning:**
- npm audit
- Snyk
- OWASP Dependency Check
- GitHub Security Advisories

---

*Last Updated: [Current Date]*  
*Version: 1.0*  
*Next Review: [Review Date]*