import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, Eye, Book, FileText } from 'lucide-react';

const DemoHelper = ({ onFillLogin, onFillRegister, onFillDonate, currentPage }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [loginMode, setLoginMode] = useState('user'); // 'user' or 'admin'

  if (!isVisible) return null;

  const demoData = {
    login: {
      user: {
        email: 'demo@boiadda.com',
        password: 'Demo123456'
      },
      admin: {
        email: 'adiyat_admin@example.com',
        password: 'adminpass1'
      }
    },
    register: {
      name: 'আহমেদ রহমান',
      email: 'ahmed.rahman@boiadda.com',
      phone: '+8801712345678',
      password: 'Demo123456',
      confirmPassword: 'Demo123456'
    },
    donate: [
      {
        title: 'অপরাজেয় যোদ্ধা',
        author: 'হুমায়ূন আহমেদ',
        description: 'একটি অসাধারণ উপন্যাস যা বাংলা সাহিত্যে এক অমূল্য সংযোজন। এই বইটি প্রেম, দ্বন্দ্ব এবং মানবিক আবেগের এক চমৎকার চিত্রায়ণ।',
        cover_img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300',
        category: 'উপন্যাস'
      },
      {
        title: 'আমার দেখা নয়াচীন',
        author: 'শেখ মুজিবুর রহমান',
        description: 'বঙ্গবন্ধুর চীন ভ্রমণের অভিজ্ঞতা নিয়ে লেখা এই বইটি ইতিহাস ও রাজনীতি প্রেমীদের জন্য অত্যন্ত মূল্যবান।',
        cover_img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        category: 'ইতিহাস'
      },
      {
        title: 'সেই সব দিন',
        author: 'সুনীল গঙ্গোপাধ্যায়',
        description: 'কলকাতার সাহিত্য জগতের স্মৃতিচারণ নিয়ে লেখা এই আত্মজীবনীমূলক গ্রন্থটি অত্যন্ত জনপ্রিয়।',
        cover_img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300',
        category: 'সাহিত্য'
      },
      {
        title: 'কালো বরফ',
        author: 'মাহমুদুল হক',
        description: 'মুক্তিযুদ্ধের পটভূমিতে রচিত এই উপন্যাসটি বাংলাদেশের সাহিত্যে এক উল্লেখযোগ্য কাজ।',
        cover_img: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=300',
        category: 'উপন্যাস'
      },
      {
        title: 'লাল সালু',
        author: 'সৈয়দ ওয়ালীউল্লাহ',
        description: 'বাংলা সাহিত্যের একটি যুগান্তকারী উপন্যাস যা গ্রামীণ সমাজের ধর্মীয় কুসংস্কার নিয়ে আলোচনা করে।',
        cover_img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300',
        category: 'সাহিত্য'
      }
    ]
  };

  const handleFillForm = () => {
    if (currentPage === 'login' && onFillLogin) {
      onFillLogin(demoData.login[loginMode]);
    } else if (currentPage === 'register' && onFillRegister) {
      onFillRegister(demoData.register);
    } else if (currentPage === 'donate' && onFillDonate) {
      // Get a random book from the donate demo data
      const randomBook = demoData.donate[Math.floor(Math.random() * demoData.donate.length)];
      onFillDonate(randomBook);
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

              {/* Login Mode Toggle for Login Page */}
              {currentPage === 'login' && (
                <div className="flex bg-white/10 rounded-lg p-1 text-xs">
                  <button
                    onClick={() => setLoginMode('user')}
                    className={`flex-1 py-1 px-2 rounded transition-colors ${
                      loginMode === 'user' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    👤 User
                  </button>
                  <button
                    onClick={() => setLoginMode('admin')}
                    className={`flex-1 py-1 px-2 rounded transition-colors ${
                      loginMode === 'admin' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    🛡️ Admin
                  </button>
                </div>
              )}

              {/* Demo Data Preview */}
              <div className="bg-white/10 rounded-lg p-3 text-xs space-y-1">
                <div className="font-medium mb-2">Demo Data:</div>
                {currentPage === 'login' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      <span>{demoData.login[loginMode].email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      <span>••••••••</span>
                    </div>
                    <div className="text-center mt-2 text-yellow-200">
                      {loginMode === 'admin' ? '🛡️ Admin Access' : '👤 Regular User'}
                    </div>
                  </>
                ) : currentPage === 'register' ? (
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
                ) : currentPage === 'donate' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Book className="w-3 h-3" />
                      <span>Random Bengali books</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      <span>With descriptions & covers</span>
                    </div>
                    <div className="text-center mt-2 text-yellow-200">
                      📚 {demoData.donate.length} books available
                    </div>
                  </>
                ) : null}
              </div>

              {/* Action Button */}
              <button
                onClick={handleFillForm}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                🎯 Fill {currentPage === 'login' ? `${loginMode === 'admin' ? 'Admin' : 'User'} Login` : currentPage === 'register' ? 'Register' : 'Donate'} Form
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