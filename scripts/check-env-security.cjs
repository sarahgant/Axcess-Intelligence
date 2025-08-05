/**
 * Environment Security Checker
 * Validates environment configuration for security issues
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class EnvSecurityChecker {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.suggestions = [];
    }

    /**
     * Check for common security issues in environment configuration
     */
    checkSecurity() {
        console.log(chalk.blue('🔒 Running Environment Security Check...\n'));

        this.checkEnvFiles();
        this.checkGitignore();
        this.checkApiKeyPatterns();
        this.checkFilePermissions();
        this.checkEnvironmentVariables();

        this.displayResults();
    }

    /**
     * Check for .env files and their security
     */
    checkEnvFiles() {
        const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];

        envFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');

                // Check for weak API keys
                const apiKeyPatterns = [
                    { pattern: /API_KEY=test|API_KEY=demo|API_KEY=example/i, type: 'Test API Key' },
                    { pattern: /API_KEY=.{1,10}$/m, type: 'Short API Key' },
                    { pattern: /password=123|password=admin|password=test/i, type: 'Weak Password' }
                ];

                apiKeyPatterns.forEach(({ pattern, type }) => {
                    if (pattern.test(content)) {
                        this.issues.push(`${file}: Contains ${type}`);
                    }
                });

                // Check for missing critical variables
                const requiredVars = ['ENCRYPTION_KEY', 'JWT_SECRET'];
                requiredVars.forEach(varName => {
                    if (!content.includes(varName)) {
                        this.warnings.push(`${file}: Missing ${varName}`);
                    }
                });
            }
        });

        // Check if .env.example exists
        if (!fs.existsSync('.env.example')) {
            this.issues.push('Missing .env.example file');
            this.suggestions.push('Create .env.example with dummy values');
        }
    }

    /**
     * Check .gitignore for environment file exclusions
     */
    checkGitignore() {
        if (!fs.existsSync('.gitignore')) {
            this.issues.push('Missing .gitignore file');
            return;
        }

        const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
        const requiredIgnores = ['.env', '.env.local'];

        requiredIgnores.forEach(ignore => {
            if (!gitignoreContent.includes(ignore)) {
                this.issues.push(`.gitignore: Missing ${ignore}`);
            }
        });
    }

    /**
     * Check for API key patterns in committed files
     */
    checkApiKeyPatterns() {
        const suspiciousPatterns = [
            /sk-[a-zA-Z0-9]{48}/g, // OpenAI API keys
            /sk-ant-api03-[a-zA-Z0-9_-]{95}/g, // Anthropic API keys
            /AKIA[0-9A-Z]{16}/g, // AWS Access Keys
            /ghp_[a-zA-Z0-9]{36}/g, // GitHub Personal Access Tokens
        ];

        const checkFiles = ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.jsx'];

        // This is a simplified check - in production, use a proper file scanner
        try {
            const packageJson = JSON.stringify(require('../package.json'));
            suspiciousPatterns.forEach((pattern, index) => {
                if (pattern.test(packageJson)) {
                    this.issues.push('Potential API key found in package.json');
                }
            });
        } catch (e) {
            // File doesn't exist or can't be read
        }
    }

    /**
     * Check file permissions (Unix-like systems)
     */
    checkFilePermissions() {
        if (process.platform === 'win32') {
            return; // Skip on Windows
        }

        const sensitiveFiles = ['.env', '.env.local', '.env.production'];

        sensitiveFiles.forEach(file => {
            if (fs.existsSync(file)) {
                try {
                    const stats = fs.statSync(file);
                    const mode = stats.mode & parseInt('777', 8);

                    if (mode & parseInt('044', 8)) { // Readable by group/others
                        this.issues.push(`${file}: Too permissive (${mode.toString(8)})`);
                        this.suggestions.push(`Run: chmod 600 ${file}`);
                    }
                } catch (e) {
                    this.warnings.push(`Could not check permissions for ${file}`);
                }
            }
        });
    }

    /**
     * Check current environment variables
     */
    checkEnvironmentVariables() {
        const sensitiveEnvVars = [
            'ANTHROPIC_API_KEY',
            'OPENAI_API_KEY',
            'JWT_SECRET',
            'ENCRYPTION_KEY'
        ];

        sensitiveEnvVars.forEach(varName => {
            const value = process.env[varName];
            if (value) {
                if (value.length < 10) {
                    this.warnings.push(`${varName}: Value appears too short`);
                }
                if (/^(test|demo|example|123)/i.test(value)) {
                    this.issues.push(`${varName}: Contains test/demo value`);
                }
            }
        });

        // Check for development keys in production
        if (process.env.NODE_ENV === 'production') {
            sensitiveEnvVars.forEach(varName => {
                const value = process.env[varName];
                if (value && /dev|development|test/i.test(value)) {
                    this.issues.push(`${varName}: Development key in production`);
                }
            });
        }
    }

    /**
     * Display security check results
     */
    displayResults() {
        console.log(chalk.red.bold('🚨 SECURITY ISSUES:'));
        if (this.issues.length === 0) {
            console.log(chalk.green('  ✅ No critical issues found\n'));
        } else {
            this.issues.forEach(issue => {
                console.log(chalk.red(`  ❌ ${issue}`));
            });
            console.log();
        }

        if (this.warnings.length > 0) {
            console.log(chalk.yellow.bold('⚠️  WARNINGS:'));
            this.warnings.forEach(warning => {
                console.log(chalk.yellow(`  ⚠️  ${warning}`));
            });
            console.log();
        }

        if (this.suggestions.length > 0) {
            console.log(chalk.blue.bold('💡 SUGGESTIONS:'));
            this.suggestions.forEach(suggestion => {
                console.log(chalk.blue(`  💡 ${suggestion}`));
            });
            console.log();
        }

        // Summary
        const totalIssues = this.issues.length + this.warnings.length;
        if (totalIssues === 0) {
            console.log(chalk.green.bold('🎉 Environment security check passed!'));
        } else {
            console.log(chalk.red.bold(`🔍 Found ${this.issues.length} issues and ${this.warnings.length} warnings`));

            if (this.issues.length > 0) {
                console.log(chalk.red('\n❗ Please fix critical issues before deployment'));
                process.exit(1);
            }
        }
    }

    /**
     * Generate security recommendations
     */
    generateRecommendations() {
        return [
            '1. Use strong, unique API keys for each environment',
            '2. Rotate API keys regularly (every 90 days)',
            '3. Never commit .env files to version control',
            '4. Use different keys for development and production',
            '5. Set appropriate file permissions (600) for env files',
            '6. Monitor for leaked credentials in CI/CD logs',
            '7. Use a secret management service for production',
            '8. Implement key rotation procedures',
            '9. Regularly audit environment configurations',
            '10. Use environment-specific .env files'
        ];
    }
}

// Run security check
if (require.main === module) {
    const checker = new EnvSecurityChecker();
    checker.checkSecurity();

    console.log(chalk.blue.bold('\n📋 Security Recommendations:'));
    checker.generateRecommendations().forEach((rec, index) => {
        console.log(chalk.blue(`   ${rec}`));
    });
}

module.exports = EnvSecurityChecker;