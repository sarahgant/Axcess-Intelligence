import { useState, useEffect } from 'react';

export interface ModelInfo {
    id: string;
    displayName: string;
    provider: 'anthropic' | 'openai';
    description?: string;
    isAvailable: boolean;
}

export const useModels = () => {
    const [models, setModels] = useState<ModelInfo[]>([]);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    // Static model definitions based on your .env configuration
    const availableModels: ModelInfo[] = [
        {
            id: 'claude-sonnet-4-20250514',
            displayName: 'Claude Sonnet 4 (2025-05-14)',
            provider: 'anthropic',
            description: 'Latest Claude model with enhanced reasoning',
            isAvailable: true
        },
        {
            id: 'gpt-4.1',
            displayName: 'GPT-4.1',
            provider: 'openai',
            description: 'Advanced GPT-4 model',
            isAvailable: true
        }
    ];

    useEffect(() => {
        // Set available models
        setModels(availableModels);

        // Set default model to the first available one
        if (availableModels.length > 0 && !selectedModel) {
            setSelectedModel(availableModels[0].id);
        }
    }, [selectedModel]);

    const selectModel = (modelId: string) => {
        const model = models.find(m => m.id === modelId);
        if (model && model.isAvailable) {
            setSelectedModel(modelId);
        }
    };

    const getModelInfo = (modelId: string): ModelInfo | undefined => {
        return models.find(m => m.id === modelId);
    };

    const getModelsByProvider = (provider: 'anthropic' | 'openai'): ModelInfo[] => {
        return models.filter(m => m.provider === provider);
    };

    return {
        models,
        selectedModel,
        selectModel,
        getModelInfo,
        getModelsByProvider,
        isLoadingModels
    };
};