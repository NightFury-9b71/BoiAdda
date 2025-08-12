import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Globe, 
  Palette, 
  Shield,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { PageHeader, Card, Button, Input, Badge } from '../components/ui/ThemeComponents.jsx';
import { colorClasses } from '../styles/colors.js';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    language: 'bn',
    timezone: 'Asia/Dhaka',
    theme: 'light',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    reminderNotifications: true,
    
    // Privacy Settings
    profileVisibility: 'public',
    showBorrowHistory: true,
    showDonationHistory: true,
    allowMessages: true,
    
    // Security Settings
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: '30'
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordChange = (key, value) => {
    setPasswords(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    // API call to save settings
  };

  const handleChangePassword = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('নতুন পাসওয়ার্ড মিল নেই');
      return;
    }
    console.log('Changing password');
    // API call to change password
  };

  const handleExportData = () => {
    console.log('Exporting user data');
    // API call to export data
  };

  const handleDeleteAccount = () => {
    if (confirm('আপনি কি নিশ্চিত যে আপনি আপনার অ্যাকাউন্ট মুছে ফেলতে চান?')) {
      console.log('Deleting account');
      // API call to delete account
    }
  };

  const sections = [
    { id: 'general', label: 'সাধারণ', icon: SettingsIcon },
    { id: 'notifications', label: 'বিজ্ঞপ্তি', icon: Bell },
    { id: 'privacy', label: 'গোপনীয়তা', icon: Shield },
    { id: 'security', label: 'নিরাপত্তা', icon: Lock },
    { id: 'data', label: 'ডেটা', icon: Download }
  ];

  const GeneralSettings = () => (
    <Card>
      <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-6`}>
        সাধারণ সেটিংস
      </h3>
      
      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
            ভাষা
          </label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            className={`w-full px-3 py-2 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent}`}
          >
            <option value="bn">বাংলা</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
            সময় অঞ্চল
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            className={`w-full px-3 py-2 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent}`}
          >
            <option value="Asia/Dhaka">ঢাকা (GMT+6)</option>
            <option value="Asia/Kolkata">কলকাতা (GMT+5:30)</option>
            <option value="UTC">UTC (GMT+0)</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
            থিম
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => handleSettingChange('theme', 'light')}
              className={`flex-1 p-3 border rounded-md text-center ${
                settings.theme === 'light'
                  ? `${colorClasses.border.accent} ${colorClasses.bg.success} ${colorClasses.text.success}`
                  : `${colorClasses.border.primary} hover:bg-gray-50`
              }`}
            >
              <div className="w-6 h-6 bg-white border border-gray-300 rounded mx-auto mb-2"></div>
              হালকা
            </button>
            <button
              onClick={() => handleSettingChange('theme', 'dark')}
              className={`flex-1 p-3 border rounded-md text-center ${
                settings.theme === 'dark'
                  ? `${colorClasses.border.accent} ${colorClasses.bg.success} ${colorClasses.text.success}`
                  : `${colorClasses.border.primary} hover:bg-gray-50`
              }`}
            >
              <div className="w-6 h-6 bg-gray-800 rounded mx-auto mb-2"></div>
              গাঢ়
            </button>
            <button
              onClick={() => handleSettingChange('theme', 'auto')}
              className={`flex-1 p-3 border rounded-md text-center ${
                settings.theme === 'auto'
                  ? `${colorClasses.border.accent} ${colorClasses.bg.success} ${colorClasses.text.success}`
                  : `${colorClasses.border.primary} hover:bg-gray-50`
              }`}
            >
              <div className="w-6 h-6 bg-gradient-to-r from-white to-gray-800 rounded mx-auto mb-2"></div>
              স্বয়ংক্রিয়
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button onClick={handleSaveSettings} icon={Save}>
          সংরক্ষণ করুন
        </Button>
      </div>
    </Card>
  );

  const NotificationSettings = () => (
    <Card>
      <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-6`}>
        বিজ্ঞপ্তি সেটিংস
      </h3>
      
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'ইমেইল বিজ্ঞপ্তি', icon: Mail },
          { key: 'smsNotifications', label: 'এসএমএস বিজ্ঞপ্তি', icon: Phone },
          { key: 'pushNotifications', label: 'পুশ বিজ্ঞপ্তি', icon: Bell },
          { key: 'reminderNotifications', label: 'রিমাইন্ডার বিজ্ঞপ্তি', icon: Bell }
        ].map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <Icon className={`h-5 w-5 ${colorClasses.text.secondary} mr-3`} />
              <div>
                <p className={`font-medium ${colorClasses.text.primary}`}>{label}</p>
                <p className={`text-sm ${colorClasses.text.tertiary}`}>
                  {key === 'emailNotifications' && 'নতুন বই এবং মেয়াদ শেষ হওয়ার বিজ্ঞপ্তি'}
                  {key === 'smsNotifications' && 'জরুরি বিজ্ঞপ্তি এসএমএসের মাধ্যমে'}
                  {key === 'pushNotifications' && 'ব্রাউজার পুশ বিজ্ঞপ্তি'}
                  {key === 'reminderNotifications' && 'বই ফেরত দেওয়ার রিমাইন্ডার'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => handleSettingChange(key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={handleSaveSettings} icon={Save}>
          সংরক্ষণ করুন
        </Button>
      </div>
    </Card>
  );

  const PrivacySettings = () => (
    <Card>
      <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-6`}>
        গোপনীয়তা সেটিংস
      </h3>
      
      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
            প্রোফাইল দৃশ্যমানতা
          </label>
          <select
            value={settings.profileVisibility}
            onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
            className={`w-full px-3 py-2 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent}`}
          >
            <option value="public">সবার জন্য</option>
            <option value="members">শুধু সদস্যদের জন্য</option>
            <option value="private">ব্যক্তিগত</option>
          </select>
        </div>

        <div className="space-y-4">
          {[
            { key: 'showBorrowHistory', label: 'ধার নেওয়ার ইতিহাস দেখান' },
            { key: 'showDonationHistory', label: 'দানের ইতিহাস দেখান' },
            { key: 'allowMessages', label: 'অন্যদের থেকে বার্তা গ্রহণ করুন' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-3">
              <span className={`font-medium ${colorClasses.text.primary}`}>{label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={(e) => handleSettingChange(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Button onClick={handleSaveSettings} icon={Save}>
          সংরক্ষণ করুন
        </Button>
      </div>
    </Card>
  );

  const SecuritySettings = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-6`}>
          পাসওয়ার্ড পরিবর্তন
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
              বর্তমান পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwords.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${colorClasses.text.tertiary}`}
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
              নতুন পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwords.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${colorClasses.text.tertiary}`}
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
              নতুন পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwords.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className={`w-full px-3 py-2 pr-10 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${colorClasses.text.tertiary}`}
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleChangePassword} icon={Lock}>
            পাসওয়ার্ড পরিবর্তন করুন
          </Button>
        </div>
      </Card>

      {/* Security Options */}
      <Card>
        <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-6`}>
          নিরাপত্তা বিকল্প
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className={`font-medium ${colorClasses.text.primary}`}>দুই-ফ্যাক্টর প্রমাণীকরণ</p>
              <p className={`text-sm ${colorClasses.text.tertiary}`}>অতিরিক্ত নিরাপত্তার জন্য</p>
            </div>
            <Badge variant={settings.twoFactorAuth ? 'success' : 'error'}>
              {settings.twoFactorAuth ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
            </Badge>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className={`font-medium ${colorClasses.text.primary}`}>লগইন বিজ্ঞপ্তি</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.loginNotifications}
                onChange={(e) => handleSettingChange('loginNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div>
            <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
              সেশন টাইমআউট (মিনিট)
            </label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
              className={`w-full px-3 py-2 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent}`}
            >
              <option value="15">১৫ মিনিট</option>
              <option value="30">৩০ মিনিট</option>
              <option value="60">১ ঘণ্টা</option>
              <option value="120">২ ঘণ্টা</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );

  const DataSettings = () => (
    <div className="space-y-6">
      {/* Data Export */}
      <Card>
        <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-6`}>
          ডেটা এক্সপোর্ট
        </h3>
        <p className={`${colorClasses.text.secondary} mb-6`}>
          আপনার সমস্ত ডেটা ডাউনলোড করুন
        </p>
        <Button onClick={handleExportData} icon={Download} variant="secondary">
          ডেটা এক্সপোর্ট করুন
        </Button>
      </Card>

      {/* Account Deletion */}
      <Card>
        <h3 className={`text-lg font-semibold text-red-600 mb-6`}>
          অ্যাকাউন্ট মুছে ফেলুন
        </h3>
        <p className={`${colorClasses.text.secondary} mb-6`}>
          আপনার অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলুন। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
        </p>
        <Button onClick={handleDeleteAccount} icon={Trash2} variant="danger">
          অ্যাকাউন্ট মুছে ফেলুন
        </Button>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'privacy':
        return <PrivacySettings />;
      case 'security':
        return <SecuritySettings />;
      case 'data':
        return <DataSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="সেটিংস"
        subtitle="আপনার অ্যাকাউন্ট এবং পছন্দ পরিচালনা করুন"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card padding="p-0">
            <div className="p-4 border-b border-gray-200">
              <h3 className={`font-semibold ${colorClasses.text.primary}`}>সেটিংস মেনু</h3>
            </div>
            <nav className="p-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === section.id
                        ? `${colorClasses.bg.success} ${colorClasses.text.success}`
                        : `${colorClasses.text.secondary} hover:bg-gray-100`
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
