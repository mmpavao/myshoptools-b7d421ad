import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { createBot, updateBot, deleteBot, getBots, testOpenAIConnection } from './openAIOperations';
import BotList from './components/BotList';
import BotDialog from './components/BotDialog';
import BotChatDialog from './components/BotChatDialog';
import IntegrationLogs from './components/IntegrationLogs';
import APIKeyManager from './components/APIKeyManager';
import { useOpenAIIntegration } from './hooks/useOpenAIIntegration';

const OpenAIIntegration = () => {
  const {
    bots,
    isDialogOpen,
    isChatDialogOpen,
    currentBot,
    isEditing,
    apiKey,
    connectionStatus,
    logs,
    handleApiKeyChange,
    testConnection,
    handleOpenDialog,
    handleSaveBot,
    handleDeleteBot,
    handleChatWithBot,
    setIsDialogOpen,
    setIsChatDialogOpen,
  } = useOpenAIIntegration();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">OpenAI Integration</h1>

      <APIKeyManager
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
        onTestConnection={testConnection}
        connectionStatus={connectionStatus}
      />

      {connectionStatus === 'Connected' && (
        <>
          <BotList
            bots={bots}
            onEdit={handleOpenDialog}
            onChat={handleChatWithBot}
          />

          <BotDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            currentBot={currentBot}
            isEditing={isEditing}
            onSave={handleSaveBot}
            onDelete={handleDeleteBot}
            apiKey={apiKey}
          />

          <BotChatDialog
            isOpen={isChatDialogOpen}
            onOpenChange={setIsChatDialogOpen}
            bot={currentBot}
            apiKey={apiKey}
          />
        </>
      )}

      <IntegrationLogs logs={logs} />
    </div>
  );
};

export default OpenAIIntegration;