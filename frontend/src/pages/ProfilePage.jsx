import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Camera,
  Book,
  Gift,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { PageHeader, Card, Button, Input, StatsCard, Badge } from '../components/ui/ThemeComponents.jsx';
import { colorClasses } from '../styles/colors.js';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="আমার প্রোফাইল"
        subtitle="আপনার ব্যক্তিগত তথ্য এবং পছন্দ পরিচালনা করুন"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${colorClasses.text.primary}`}>
                ব্যক্তিগত তথ্য
              </h3>
              <Button
                variant={isEditing ? 'secondary' : 'primary'}
                size="sm"
                icon={Edit}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'বাতিল' : 'সম্পাদনা'}
              </Button>
            </div>

            {/* Profile Picture */}
            <div className="flex items-center mb-6">
              <div className="relative">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-20 h-20 ${colorClasses.bg.accent} rounded-full flex items-center justify-center`}>
                    <span className={`${colorClasses.text.white} text-2xl font-bold`}>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <button className={`absolute bottom-0 right-0 p-1 ${colorClasses.bg.primary} rounded-full shadow-md border ${colorClasses.border.primary}`}>
                    <Camera className={`h-4 w-4 ${colorClasses.text.secondary}`} />
                  </button>
                )}
              </div>
              <div className="ml-4">
                <h4 className={`text-xl font-semibold ${colorClasses.text.primary}`}>
                  {user?.name || 'ব্যবহারকারী'}
                </h4>
                <p className={colorClasses.text.secondary}>সদস্য</p>
                <Badge variant="success" className="mt-1">
                  সক্রিয় সদস্য
                </Badge>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="নাম"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={User}
              />
              
              <Input
                label="ইমেইল"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={Mail}
              />
              
              <Input
                label="ফোন"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={Phone}
              />
              
              <Input
                label="ঠিকানা"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={MapPin}
              />
            </div>

            <div className="mt-4">
              <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
                আমার সম্পর্কে
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent} focus:border-transparent disabled:bg-gray-50`}
                rows="3"
                placeholder="আপনার সম্পর্কে কিছু বলুন..."
              />
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} className="flex-1">
                  সংরক্ষণ করুন
                </Button>
                <Button variant="secondary" onClick={handleCancel} className="flex-1">
                  বাতিল
                </Button>
              </div>
            )}
          </Card>

          {/* Activity Timeline */}
          <Card>
            <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-4`}>
              সাম্প্রতিক কার্যকলাপ
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className={`p-2 rounded-full ${colorClasses.bg.success} mr-3 mt-1`}>
                  <Book className={`h-4 w-4 ${colorClasses.text.success}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${colorClasses.text.primary}`}>
                    "বাংলা সাহিত্যের ইতিহাস" বই ধার নিয়েছেন
                  </p>
                  <p className={`text-xs ${colorClasses.text.tertiary}`}>২ দিন আগে</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-purple-100 mr-3 mt-1">
                  <Gift className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${colorClasses.text.primary}`}>
                    "প্রোগ্রামিং বেসিক" বই দান করেছেন
                  </p>
                  <p className={`text-xs ${colorClasses.text.tertiary}`}>১ সপ্তাহ আগে</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-4`}>
              আমার পরিসংখ্যান
            </h3>
            <div className="space-y-4">
              <StatsCard
                value="১২"
                label="ধার নেওয়া বই"
                icon={Book}
                color="blue"
              />
              <StatsCard
                value="৮"
                label="দান করা বই"
                icon={Gift}
                color="purple"
              />
            </div>
          </Card>

          {/* Achievements */}
          <Card>
            <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-4`}>
              অর্জন
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-100 mr-3">
                  <Award className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${colorClasses.text.primary}`}>
                    বই প্রেমিক
                  </p>
                  <p className={`text-xs ${colorClasses.text.tertiary}`}>
                    ১০+ বই ধার নিয়েছেন
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 mr-3">
                  <Gift className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${colorClasses.text.primary}`}>
                    দানবীর
                  </p>
                  <p className={`text-xs ${colorClasses.text.tertiary}`}>
                    ৫+ বই দান করেছেন
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Info */}
          <Card>
            <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-4`}>
              অ্যাকাউন্ট তথ্য
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className={`h-4 w-4 ${colorClasses.text.tertiary} mr-2`} />
                <span className={colorClasses.text.secondary}>
                  যোগদান: জানুয়ারি ২০২৪
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
