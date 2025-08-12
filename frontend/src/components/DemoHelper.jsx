import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, Eye } from 'lucide-react';

const DemoHelper = ({ onFillLogin, onFillRegister, currentPage }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible) return null;

  const demoData = {
    login: {
      email: 'demo@boiadda.com',
      password: 'Demo123456'
    },
    register: {
      name: 'আহমেদ রহমান',
      email: 'ahmed.rahman@boiadda.com',
      phone: '+8801712345678',
      password: 'Demo123456',
      confirmPassword: 'Demo123456'
    }
  };

  const handleFillForm = () => {
    if (currentPage === 'login' && onFillLogin) {
      onFillLogin(demoData.login);
    } else if (currentPage === 'register' && onFillRegister) {
      onFillRegister(demoData.register);
    }
  };

  const handleRemove = () => {
    setIsVisible(false);
    // Store in localStorage to remember user preference
    localStorage.setItem('hideDemoHelper', 'true');
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Check if user has previously hidden the demo helper
  React.useEffect(() => {
    const hidden = localStorage.getItem('hideDemoHelper');
    if (hidden === 'true') {
      setIsVisible(false);
    }
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-16 h-16' : 'w-80'
      }`}>
        {isMinimized ? (
          // Minimized state
          <button
            onClick={handleToggleMinimize}
            className="w-full h-full flex items-center justify-center hover:bg-white/10 rounded-2xl transition-colors"
          >
            <Eye className="w-6 h-6" />
          </button>
        ) : (
          // Expanded state
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="font-semibold text-sm">Demo Helper</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleToggleMinimize}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Minimize"
                >
                  <div className="w-3 h-0.5 bg-white rounded"></div>
                </button>
                <button
                  onClick={handleRemove}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Remove demo helper"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <p className="text-sm opacity-90">
                🚀 Quick demo access! Click to auto-fill the form.
              </p>

              {/* Demo Data Preview */}
              <div className="bg-white/10 rounded-lg p-3 text-xs space-y-1">
                <div className="font-medium mb-2">Demo Data:</div>
                {currentPage === 'login' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      <span>{demoData.login.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      <span>••••••••</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>{demoData.register.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      <span>{demoData.register.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      <span>{demoData.register.phone}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleFillForm}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                🎯 Fill {currentPage === 'login' ? 'Login' : 'Register'} Form
              </button>

              {/* Warning */}
              <p className="text-xs opacity-75 text-center">
                ⚠️ Demo purposes only
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoHelper;