import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { logger } from '../core/logging/logger';

interface ScreenErrorFallbackProps {
  screenName: string;
  onRetry: () => void;
  onGoHome: () => void;
}

const ScreenErrorFallback: React.FC<ScreenErrorFallbackProps> = ({ 
  screenName, 
  onRetry, 
  onGoHome 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-center w-12 h-12 mx-auto bg-orange-100 rounded-full mb-4">
        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
        {screenName} Error
      </h2>
      
      <p className="text-gray-600 text-center mb-6">
        We encountered an issue with the {screenName} screen. You can try again or return to the home screen.
      </p>

      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        
        <button
          onClick={onGoHome}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  </div>
);

interface ScreenErrorBoundaryProps {
  children: ReactNode;
  screenName: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ScreenErrorBoundary extends Component<ScreenErrorBoundaryProps> {
  private errorBoundaryRef = React.createRef<ErrorBoundary>();

  handleRetry = () => {
    this.errorBoundaryRef.current?.handleReset();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Log screen-specific error
    logger.error(`Screen Error Boundary (${this.props.screenName})`, {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      screenName: this.props.screenName,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });

    // Call parent error handler if provided
    this.props.onError?.(error, errorInfo);
  };

  render() {
    return (
      <ErrorBoundary
        ref={this.errorBoundaryRef}
        boundaryName={`Screen-${this.props.screenName}`}
        onError={this.handleError}
        fallback={
          <ScreenErrorFallback
            screenName={this.props.screenName}
            onRetry={this.handleRetry}
            onGoHome={this.handleGoHome}
          />
        }
      >
        {this.props.children}
      </ErrorBoundary>
    );
  }
}
