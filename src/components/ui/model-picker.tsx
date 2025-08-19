import React from 'react';
import type { ModelInfo } from '../../hooks/useModels';

interface ModelPickerProps {
    models: ModelInfo[];
    selectedModel: string | null;
    onModelSelect: (modelId: string) => void;
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;
}

export const ModelPicker: React.FC<ModelPickerProps> = ({
    models,
    selectedModel,
    onModelSelect,
    isOpen,
    onClose,
    isLoading = false
}) => {
    if (!isOpen) return null;

    const anthropicModels = models.filter(m => m.provider === 'anthropic');
    const openaiModels = models.filter(m => m.provider === 'openai');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Select AI Model</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[60vh]">
                    {isLoading ? (
                        <div className="px-6 py-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading models...</p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {/* Anthropic Models */}
                            {anthropicModels.length > 0 && (
                                <div className="mb-4">
                                    <div className="px-6 py-2 bg-gray-50 border-b border-gray-100">
                                        <h4 className="text-sm font-medium text-gray-700">Anthropic Claude</h4>
                                    </div>
                                    {anthropicModels.map((model) => (
                                        <button
                                            key={model.id}
                                            onClick={() => onModelSelect(model.id)}
                                            disabled={!model.isAvailable}
                                            className={`w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors ${selectedModel === model.id
                                                    ? 'bg-blue-50 border-r-2 border-blue-500'
                                                    : ''
                                                } ${!model.isAvailable
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'cursor-pointer'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium text-gray-900">{model.displayName}</div>
                                                    {model.description && (
                                                        <div className="text-sm text-gray-500 mt-1">{model.description}</div>
                                                    )}
                                                </div>
                                                <div className="flex items-center">
                                                    {selectedModel === model.id && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                                    )}
                                                    <div className={`w-2 h-2 rounded-full ${model.isAvailable ? 'bg-green-400' : 'bg-red-400'
                                                        }`}></div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* OpenAI Models */}
                            {openaiModels.length > 0 && (
                                <div>
                                    <div className="px-6 py-2 bg-gray-50 border-b border-gray-100">
                                        <h4 className="text-sm font-medium text-gray-700">OpenAI GPT</h4>
                                    </div>
                                    {openaiModels.map((model) => (
                                        <button
                                            key={model.id}
                                            onClick={() => onModelSelect(model.id)}
                                            disabled={!model.isAvailable}
                                            className={`w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors ${selectedModel === model.id
                                                    ? 'bg-blue-50 border-r-2 border-blue-500'
                                                    : ''
                                                } ${!model.isAvailable
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'cursor-pointer'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium text-gray-900">{model.displayName}</div>
                                                    {model.description && (
                                                        <div className="text-sm text-gray-500 mt-1">{model.description}</div>
                                                    )}
                                                </div>
                                                <div className="flex items-center">
                                                    {selectedModel === model.id && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                                    )}
                                                    <div className={`w-2 h-2 rounded-full ${model.isAvailable ? 'bg-green-400' : 'bg-red-400'
                                                        }`}></div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {models.length === 0 && !isLoading && (
                                <div className="px-6 py-8 text-center text-gray-500">
                                    No models available
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};