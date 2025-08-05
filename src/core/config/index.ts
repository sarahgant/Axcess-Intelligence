/**
 * Core Configuration - Public API
 * Application configuration and environment management
 */

// Configuration Management
export { ConfigManager } from './ConfigManager';
export { EnvironmentConfig } from './EnvironmentConfig';
export { FeatureFlags } from './FeatureFlags';

// Configuration Loading
export { loadConfig } from './loader/loadConfig';
export { validateConfig } from './validation/validateConfig';

// Configuration Types
export type {
    AppConfig,
    EnvironmentType,
    ConfigSchema,
    ConfigValidationResult
} from './types';

// Default Configurations
export { defaultConfig } from './defaults/defaultConfig';
export { developmentConfig } from './defaults/developmentConfig';
export { productionConfig } from './defaults/productionConfig';