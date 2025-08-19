/**
 * Data Migration Utility
 * Handles migration of existing data and database schema updates
 */

const database = require('../database/Database');
const logger = require('./logger');
const fs = require('fs');
const path = require('path');

class MigrationService {
    constructor() {
        this.migrationPath = path.join(__dirname, '..', 'migrations');
        this.ensureMigrationDir();
    }

    ensureMigrationDir() {
        if (!fs.existsSync(this.migrationPath)) {
            fs.mkdirSync(this.migrationPath, { recursive: true });
        }
    }

    /**
     * Migrate any existing localStorage data to database
     * This would be called from the frontend when the app starts
     */
    async migrateLocalStorageData(localStorageData) {
        try {
            logger.info('Starting localStorage data migration', {
                conversations: localStorageData.conversations?.length || 0,
                feedback: localStorageData.feedback?.length || 0
            });

            let migratedConversations = 0;
            let migratedMessages = 0;
            let migratedFeedback = 0;

            // Create a temporary user for migration
            const migrationUserId = await database.createUser(
                'migration-user',
                'Migration Tool',
                '127.0.0.1'
            );

            // Migrate conversations and messages
            if (localStorageData.conversations && Array.isArray(localStorageData.conversations)) {
                for (const conv of localStorageData.conversations) {
                    try {
                        // Create conversation
                        const conversationId = await database.createConversation(
                            migrationUserId,
                            conv.title || `Migrated Chat ${new Date(conv.createdAt).toLocaleDateString()}`,
                            { migrated: true, originalId: conv.id }
                        );

                        migratedConversations++;

                        // Migrate messages
                        if (conv.messages && Array.isArray(conv.messages)) {
                            for (const msg of conv.messages) {
                                await database.createMessage(
                                    conversationId,
                                    msg.content || msg.text,
                                    msg.sender,
                                    {
                                        metadata: {
                                            migrated: true,
                                            originalId: msg.id,
                                            originalTimestamp: msg.timestamp
                                        }
                                    }
                                );
                                migratedMessages++;
                            }
                        }

                        // Update conversation favorite status
                        if (conv.isFavorited) {
                            await database.toggleFavorite(conversationId);
                        }

                    } catch (error) {
                        logger.error('Failed to migrate conversation', {
                            conversationId: conv.id,
                            error: error.message
                        });
                    }
                }
            }

            // Migrate feedback data
            if (localStorageData.feedback && Array.isArray(localStorageData.feedback)) {
                // This would require mapping message IDs, which is complex
                // For now, just log the feedback data for manual review
                logger.info('Feedback data found for manual review', {
                    count: localStorageData.feedback.length,
                    data: localStorageData.feedback
                });
                migratedFeedback = localStorageData.feedback.length;
            }

            logger.info('Data migration completed', {
                migratedConversations,
                migratedMessages,
                migratedFeedback,
                migrationUserId
            });

            return {
                success: true,
                migrated: {
                    conversations: migratedConversations,
                    messages: migratedMessages,
                    feedback: migratedFeedback
                },
                migrationUserId
            };

        } catch (error) {
            logger.error('Data migration failed', { error: error.message });
            throw error;
        }
    }

    /**
     * Export all data for backup or migration
     */
    async exportAllData() {
        try {
            logger.info('Starting data export');

            const conversations = await database.statements.getConversationsByUser.all();
            const allData = {
                export_timestamp: new Date().toISOString(),
                export_version: '1.0.0',
                conversations: []
            };

            for (const conv of conversations) {
                const messages = await database.statements.getMessagesByConversation.all(conv.id);
                const conversationData = {
                    ...conv,
                    messages: messages.map(msg => ({
                        ...msg,
                        metadata: msg.metadata ? JSON.parse(msg.metadata) : {}
                    })),
                    metadata: conv.metadata ? JSON.parse(conv.metadata) : {}
                };
                allData.conversations.push(conversationData);
            }

            // Save export file
            const exportPath = path.join(this.migrationPath, `export_${Date.now()}.json`);
            fs.writeFileSync(exportPath, JSON.stringify(allData, null, 2));

            logger.info('Data export completed', {
                exportPath,
                conversations: allData.conversations.length,
                totalMessages: allData.conversations.reduce((sum, conv) => sum + conv.messages.length, 0)
            });

            return { success: true, exportPath, data: allData };

        } catch (error) {
            logger.error('Data export failed', { error: error.message });
            throw error;
        }
    }

    /**
     * Import data from export file
     */
    async importData(filePath) {
        try {
            logger.info('Starting data import', { filePath });

            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            if (!data.conversations || !Array.isArray(data.conversations)) {
                throw new Error('Invalid import data format');
            }

            let importedConversations = 0;
            let importedMessages = 0;

            // Create import user
            const importUserId = await database.createUser(
                'import-user',
                'Data Import Tool',
                '127.0.0.1'
            );

            for (const conv of data.conversations) {
                try {
                    const conversationId = await database.createConversation(
                        importUserId,
                        conv.title,
                        { ...conv.metadata, imported: true }
                    );

                    importedConversations++;

                    // Import messages
                    if (conv.messages && Array.isArray(conv.messages)) {
                        for (const msg of conv.messages) {
                            await database.createMessage(
                                conversationId,
                                msg.content,
                                msg.sender,
                                {
                                    tokensUsed: msg.tokens_used || 0,
                                    modelUsed: msg.model_used,
                                    processingTimeMs: msg.processing_time_ms || 0,
                                    metadata: { ...msg.metadata, imported: true }
                                }
                            );
                            importedMessages++;
                        }
                    }

                    // Set favorite status
                    if (conv.is_favorited) {
                        await database.toggleFavorite(conversationId);
                    }

                } catch (error) {
                    logger.error('Failed to import conversation', {
                        conversationId: conv.id,
                        error: error.message
                    });
                }
            }

            logger.info('Data import completed', {
                importedConversations,
                importedMessages,
                importUserId
            });

            return {
                success: true,
                imported: {
                    conversations: importedConversations,
                    messages: importedMessages
                }
            };

        } catch (error) {
            logger.error('Data import failed', { error: error.message });
            throw error;
        }
    }

    /**
     * Clean up old migration files
     */
    async cleanupMigrations(olderThanDays = 30) {
        try {
            const files = fs.readdirSync(this.migrationPath);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

            let deletedCount = 0;

            for (const file of files) {
                const filePath = path.join(this.migrationPath, file);
                const stats = fs.statSync(filePath);

                if (stats.mtime < cutoffDate && file.startsWith('export_')) {
                    fs.unlinkSync(filePath);
                    deletedCount++;
                    logger.info('Deleted old migration file', { file });
                }
            }

            logger.info('Migration cleanup completed', { deletedCount });
            return { success: true, deletedCount };

        } catch (error) {
            logger.error('Migration cleanup failed', { error: error.message });
            throw error;
        }
    }
}

// CLI interface for migration commands
if (require.main === module) {
    const command = process.argv[2];
    const migration = new MigrationService();

    switch (command) {
        case 'export':
            migration.exportAllData()
                .then(result => {
                    console.log('✅ Export completed:', result.exportPath);
                    process.exit(0);
                })
                .catch(error => {
                    console.error('❌ Export failed:', error.message);
                    process.exit(1);
                });
            break;

        case 'import':
            const filePath = process.argv[3];
            if (!filePath) {
                console.error('❌ Please provide import file path');
                process.exit(1);
            }
            migration.importData(filePath)
                .then(result => {
                    console.log('✅ Import completed:', result.imported);
                    process.exit(0);
                })
                .catch(error => {
                    console.error('❌ Import failed:', error.message);
                    process.exit(1);
                });
            break;

        case 'cleanup':
            const days = parseInt(process.argv[3]) || 30;
            migration.cleanupMigrations(days)
                .then(result => {
                    console.log(`✅ Cleanup completed: ${result.deletedCount} files deleted`);
                    process.exit(0);
                })
                .catch(error => {
                    console.error('❌ Cleanup failed:', error.message);
                    process.exit(1);
                });
            break;

        default:
            console.log(`
Usage: node migration.js <command> [options]

Commands:
  export                    Export all data to JSON file
  import <file>            Import data from JSON file  
  cleanup [days]           Clean up old migration files (default: 30 days)

Examples:
  node migration.js export
  node migration.js import ./migrations/export_1234567890.json
  node migration.js cleanup 7
            `);
            process.exit(1);
    }
}

module.exports = MigrationService;
