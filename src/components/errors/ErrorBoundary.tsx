import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Terminal, Code2, File, MapPin } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

function getErrorDetails(error: Error) {
  const stack = error.stack || '';
  const lines = stack.split('\n');
  
  // Extract file path, line number, and column
  const fileInfo = lines
    .find(line => line.includes('.tsx') || line.includes('.ts'))
    ?.match(/\((.*?):(\d+):(\d+)\)/) || [];

  const [, filePath, lineNumber, column] = fileInfo;

  return {
    name: error.name,
    message: error.message,
    stack: lines,
    filePath: filePath?.split('/src/').pop() || 'Unknown file',
    lineNumber: lineNumber || 'Unknown',
    column: column || 'Unknown',
  };
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log to error reporting service
    console.error('Error details:', {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const errorDetails = error ? getErrorDetails(error) : null;

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-8 flex items-center justify-center">
          <Card className="w-full max-w-3xl bg-black/40 border-red-800/50 backdrop-blur-sm p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-bold">Neural Interface Error Detected</h2>
                  <p className="text-sm text-gray-400">
                    A critical error has occurred in the neural matrix
                  </p>
                </div>
              </div>

              {/* Error Type and Message */}
              <div className="space-y-4">
                <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <Terminal className="w-4 h-4" />
                    <span className="font-mono">Error Type: {errorDetails?.name}</span>
                  </div>
                  <p className="text-red-300 font-mono">{errorDetails?.message}</p>
                </div>

                {/* Location Info */}
                {errorDetails && (
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <File className="w-4 h-4" />
                      <span className="font-mono text-sm">File: {errorDetails.filePath}</span>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-400">
                      <MapPin className="w-4 h-4" />
                      <span className="font-mono text-sm">
                        Location: Line {errorDetails.lineNumber}, Column {errorDetails.column}
                      </span>
                    </div>
                  </div>
                )}

                {/* Stack Trace */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Code2 className="w-4 h-4" />
                    <span className="text-sm">Stack Trace:</span>
                  </div>
                  <pre className="bg-black/30 border border-gray-800 rounded-lg p-4 overflow-x-auto">
                    <code className="text-xs font-mono text-gray-300">
                      {errorDetails?.stack.map((line, index) => (
                        <div
                          key={index}
                          className={`${
                            line.includes('webpack-internal:') ? 'text-gray-500' : 'text-gray-300'
                          }`}
                        >
                          {line}
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>

                {/* Component Stack */}
                {errorInfo && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Terminal className="w-4 h-4" />
                      <span className="text-sm">Component Stack:</span>
                    </div>
                    <pre className="bg-black/30 border border-gray-800 rounded-lg p-4 overflow-x-auto">
                      <code className="text-xs font-mono text-gray-300">
                        {errorInfo.componentStack}
                      </code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/30"
                  onClick={this.handleRefresh}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reinitialize Interface
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}