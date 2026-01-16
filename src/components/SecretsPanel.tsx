
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { CloseIcon } from '../assets/icons';

interface SecretsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  currentSettings: AppSettings;
}

export const SecretsPanel: React.FC<SecretsPanelProps> = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [settings, setSettings] = useState<AppSettings>(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(settings);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value 
    }));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md relative border border-gray-700 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Configure Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="gameTimeLength" className="block text-sm font-medium text-gray-300 mb-1">
              Game Time Length (seconds)
            </label>
            <input
              type="number"
              id="gameTimeLength"
              name="gameTimeLength"
              value={settings.gameTimeLength}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-600 text-white rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., 180"
            />
            <p className="text-xs text-gray-400 mt-1">Set total thinking time per player. Use 0 for no time limit.</p>
          </div>
          <hr className="border-gray-600"/>
          <h3 className="text-lg font-semibold text-gray-200 pt-2">API Keys</h3>
          <div>
            <label htmlFor="gemini" className="block text-sm font-medium text-gray-300 mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              id="gemini"
              name="gemini"
              value={settings.gemini}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-600 text-white rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your Gemini key"
            />
          </div>
          <div>
            <label htmlFor="openai" className="block text-sm font-medium text-gray-300 mb-1">
              OpenAI API Key
            </label>
            <input
              type="password"
              id="openai"
              name="openai"
              value={settings.openai}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-600 text-white rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your OpenAI key"
            />
          </div>
          <div>
            <label htmlFor="anthropic" className="block text-sm font-medium text-gray-300 mb-1">
              Anthropic API Key
            </label>
            <input
              type="password"
              id="anthropic"
              name="anthropic"
              value={settings.anthropic}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-600 text-white rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your Anthropic key"
            />
          </div>
           <div>
            <label htmlFor="deepseek" className="block text-sm font-medium text-gray-300 mb-1">
              DeepSeek API Key
            </label>
            <input
              type="password"
              id="deepseek"
              name="deepseek"
              value={settings.deepseek}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-600 text-white rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your DeepSeek key"
            />
          </div>
           <div>
            <label htmlFor="mistral" className="block text-sm font-medium text-gray-300 mb-1">
              Mistral API Key
            </label>
            <input
              type="password"
              id="mistral"
              name="mistral"
              value={settings.mistral}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-600 text-white rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your Mistral key"
            />
          </div>
          <hr className="border-gray-600"/>
           <h3 className="text-lg font-semibold text-gray-200 pt-2">IBM Watsonx</h3>
           <div>
            <label htmlFor="ibm" className="block text-sm font-medium text-gray-300 mb-1">
              IBM Cloud API Key
            </label>
            <input
              type="password"
              id="ibm"
              name="ibm"
              value={settings.ibm}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-600 text-white rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your IBM Cloud key"
            />
          </div>
           <div>
            <label htmlFor="ibmProjectId" className="block text-sm font-medium text-gray-300 mb-1">
              IBM Watsonx Project ID
            </label>
            <input
              type="text"
              id="ibmProjectId"
              name="ibmProjectId"
              value={settings.ibmProjectId}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-600 text-white rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your Project ID"
            />
          </div>
           <div>
            <label htmlFor="ibmRegion" className="block text-sm font-medium text-gray-300 mb-1">
              IBM Cloud Region
            </label>
            <input
              type="text"
              id="ibmRegion"
              name="ibmRegion"
              value={settings.ibmRegion}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-600 text-white rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., us-south, eu-de"
            />
          </div>
        </div>
        <div className="flex justify-end p-4 bg-gray-800/50 border-t border-gray-700 rounded-b-lg mt-auto">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
