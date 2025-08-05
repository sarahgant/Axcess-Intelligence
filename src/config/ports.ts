/**
 * CCH Axcess Intelligence Vibed - Port Configuration
 * 
 * Centralized port configuration for development environment
 * This file defines all ports used by the application services
 */

export interface PortConfig {
  frontend: number;
  backend: number;
  websocket: number;
  preview: number;
}

export interface DevelopmentPorts extends PortConfig {
  /** Additional ports that might be used during development */
  alternate: number[];
  /** Ports to clean up during startup */
  cleanup: number[];
}

/**
 * Primary port configuration for all services
 */
export const PORTS: PortConfig = {
  /** Vite development server (React frontend) */
  frontend: 5173,
  
  /** Express API server (Node.js backend) */
  backend: 3001,
  
  /** WebSocket server for real-time features */
  websocket: 3002,
  
  /** Vite preview server for production builds */
  preview: 4173,
} as const;

/**
 * Development environment port configuration
 * Includes additional ports for cleanup and fallbacks
 */
export const DEV_PORTS: DevelopmentPorts = {
  ...PORTS,
  
  /** Alternative ports to try if primary ports are unavailable */
  alternate: [3000, 5000, 8080, 8000],
  
  /** All ports to clean up during development startup */
  cleanup: [
    PORTS.frontend,
    PORTS.backend,
    PORTS.websocket,
    PORTS.preview,
    3000,  // Common React port
    5000,  // Common Node port
    8080,  // Common dev port
    8000,  // Alternative dev port
  ],
} as const;

/**
 * Environment-specific port overrides
 * Can be used to configure different ports for different environments
 */
export const ENVIRONMENT_PORTS = {
  development: DEV_PORTS,
  production: PORTS,
  test: {
    ...PORTS,
    frontend: 5174,
    backend: 3003,
    websocket: 3004,
  },
} as const;

/**
 * Get port configuration for current environment
 */
export function getPortsForEnvironment(env: keyof typeof ENVIRONMENT_PORTS = 'development'): DevelopmentPorts | PortConfig {
  return ENVIRONMENT_PORTS[env] || ENVIRONMENT_PORTS.development;
}

/**
 * Get all ports that should be cleaned up during startup
 */
export function getCleanupPorts(): number[] {
  const devPorts = getPortsForEnvironment('development') as DevelopmentPorts;
  return devPorts.cleanup || [];
}

/**
 * Check if a port is a known application port
 */
export function isKnownPort(port: number): boolean {
  const devPorts = getPortsForEnvironment('development') as DevelopmentPorts;
  return [
    ...Object.values(PORTS),
    ...devPorts.alternate,
    ...devPorts.cleanup,
  ].includes(port);
}

/**
 * Get service name for a given port
 */
export function getServiceNameForPort(port: number): string {
  switch (port) {
    case PORTS.frontend:
      return 'Frontend (Vite)';
    case PORTS.backend:
      return 'Backend (Express)';
    case PORTS.websocket:
      return 'WebSocket Server';
    case PORTS.preview:
      return 'Preview (Vite)';
    case 3000:
      return 'React Dev Server (Legacy)';
    case 5000:
      return 'Node.js Server';
    case 8080:
    case 8000:
      return 'Development Server';
    default:
      return `Unknown Service (Port ${port})`;
  }
}

export default PORTS;