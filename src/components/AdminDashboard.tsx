/**
 * Admin Dashboard Component
 * Displays analytics, feedback, and usage statistics
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { WKIcons } from './ui/wk-icon';
import { logger } from '../core/logging/logger';

const loggerInstance = logger.component('AdminDashboard');

interface AnalyticsData {
    event_type: string;
    count: number;
    date: string;
}

interface DashboardStats {
    totalConversations: number;
    totalMessages: number;
    totalFeedback: number;
    positiveFeedback: number;
    negativeFeedback: number;
    activeUsers: number;
    avgResponseTime: number;
}

interface AdminDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    adminKey?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    isOpen,
    onClose,
    adminKey = ''
}) => {
    const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalConversations: 0,
        totalMessages: 0,
        totalFeedback: 0,
        positiveFeedback: 0,
        negativeFeedback: 0,
        activeUsers: 0,
        avgResponseTime: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authKey, setAuthKey] = useState(adminKey);

    const fetchAnalytics = async () => {
        if (!authKey) {
            setError('Admin key required');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
            const response = await fetch(`${baseUrl}/conversations/analytics?admin_key=${encodeURIComponent(authKey)}`);

            if (!response.ok) {
                throw new Error(`Analytics request failed: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                setAnalytics(result.data);

                // Calculate summary stats
                const eventCounts = result.data.reduce((acc: Record<string, number>, item: AnalyticsData) => {
                    acc[item.event_type] = (acc[item.event_type] || 0) + item.count;
                    return acc;
                }, {});

                setStats({
                    totalConversations: eventCounts.conversation_created || 0,
                    totalMessages: eventCounts.message_created || 0,
                    totalFeedback: (eventCounts.feedback_created || 0),
                    positiveFeedback: 0, // Would need more detailed query
                    negativeFeedback: 0, // Would need more detailed query
                    activeUsers: eventCounts.user_created || 0,
                    avgResponseTime: 0 // Would need to calculate from processing times
                });

                loggerInstance.info('Analytics data loaded', { eventTypes: Object.keys(eventCounts) });
            } else {
                throw new Error(result.message || 'Failed to fetch analytics');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setError(errorMessage);
            loggerInstance.error('Failed to fetch analytics', { error: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && authKey) {
            fetchAnalytics();
        }
    }, [isOpen, authKey]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <WKIcons.X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Admin Key Input */}
                    {!authKey && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Authentication Required</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        placeholder="Enter admin key"
                                        value={authKey}
                                        onChange={(e) => setAuthKey(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Button onClick={fetchAnalytics} disabled={!authKey}>
                                        Access Dashboard
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Error Display */}
                    {error && (
                        <Card className="mb-6 border-red-200 bg-red-50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 text-red-700">
                                    <WKIcons.AlertTriangle className="w-5 h-5" />
                                    <span>{error}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-gray-600">Loading analytics...</div>
                        </div>
                    )}

                    {/* Dashboard Content */}
                    {authKey && !isLoading && !error && (
                        <>
                            {/* Summary Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                                        <WKIcons.MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.totalConversations}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                                        <WKIcons.MessageCircle className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.totalMessages}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                                        <WKIcons.ThumbsUp className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.totalFeedback}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                                        <WKIcons.Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.activeUsers}</div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Detailed Analytics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Event Analytics (Last 30 Days)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {analytics.length === 0 ? (
                                        <div className="text-center text-gray-500 py-8">
                                            No analytics data available yet
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Event Type Summary */}
                                            <div className="grid gap-4">
                                                {Object.entries(
                                                    analytics.reduce((acc, item) => {
                                                        acc[item.event_type] = (acc[item.event_type] || 0) + item.count;
                                                        return acc;
                                                    }, {} as Record<string, number>)
                                                ).map(([eventType, count]) => (
                                                    <div key={eventType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                            <span className="font-medium capitalize">
                                                                {eventType.replace(/_/g, ' ')}
                                                            </span>
                                                        </div>
                                                        <span className="text-2xl font-bold text-blue-600">{count}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Daily Breakdown */}
                                            <div className="mt-8">
                                                <h4 className="text-lg font-semibold mb-4">Daily Activity</h4>
                                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                                    {analytics
                                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                                        .slice(0, 20)
                                                        .map((item, index) => (
                                                            <div key={index} className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-600">
                                                                    {new Date(item.date).toLocaleDateString()} - {item.event_type.replace(/_/g, ' ')}
                                                                </span>
                                                                <span className="font-medium">{item.count}</span>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="mt-6 flex gap-2">
                                <Button onClick={fetchAnalytics} disabled={isLoading}>
                                    <WKIcons.RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh Data
                                </Button>
                                <Button variant="outline" onClick={() => setAuthKey('')}>
                                    <WKIcons.LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
