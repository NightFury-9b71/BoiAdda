import { useState } from 'react';
import { Book, User, FileText, Image, Users, Gift } from 'lucide-react';
import { useDonateBook } from '../hooks/useBooks.js';
import { PageHeader, Card, Button, Input } from '../components/ui/ThemeComponents.jsx';
import { colorClasses } from '../styles/colors.js';
import DemoHelper from '../components/DemoHelper.jsx';

const DonatePage = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        cover_img: '',
        category: 'সাধারণ'
    });

    const donateMutation = useDonateBook();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.author.trim()) {
            alert('অনুগ্রহ করে প্রয়োজনীয় ক্ষেত্রগুলি পূরণ করুন (শিরোনাম এবং লেখক)');
            return;
        }

        donateMutation.mutate(formData, {
            onSuccess: () => {
                setFormData({
                    title: '',
                    author: '',
                    description: '',
                    cover_img: '',
                    category: 'সাধারণ'
                });
            }
        });
    };

    const handleClearForm = () => {
        setFormData({
            title: '',
            author: '',
            description: '',
            cover_img: '',
            category: 'সাধারণ'
        });
    };

    const handleFillDemoData = (demoBook) => {
        setFormData(demoBook);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="বই দান করুন"
                subtitle="কমিউনিটির সাথে আপনার বই ভাগাভাগি করুন এবং অন্যদের নতুন গল্প আবিষ্কার করতে সাহায্য করুন"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-6`}>
                            বইয়ের তথ্য
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="বইয়ের শিরোনাম *"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                icon={Book}
                                placeholder="বইয়ের শিরোনাম লিখুন"
                                required
                            />

                            <Input
                                label="লেখকের নাম *"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                icon={User}
                                placeholder="লেখকের নাম লিখুন"
                                required
                            />

                            <div>
                                <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
                                    <Book className="inline h-4 w-4 mr-1" />
                                    বইয়ের ধরন
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent} focus:border-transparent`}
                                >
                                    <option value="সাধারণ">সাধারণ</option>
                                    <option value="উপন্যাস">উপন্যাস</option>
                                    <option value="সাহিত্য">সাহিত্য</option>
                                    <option value="ইতিহাস">ইতিহাস</option>
                                    <option value="কাব্য">কাব্য</option>
                                    <option value="বিজ্ঞান কল্পকাহিনি">বিজ্ঞান কল্পকাহিনি</option>
                                    <option value="ধর্ম">ধর্ম</option>
                                    <option value="শিক্ষা">শিক্ষা</option>
                                    <option value="প্রযুক্তি">প্রযুক্তি</option>
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${colorClasses.text.secondary} mb-2`}>
                                    <FileText className="inline h-4 w-4 mr-1" />
                                    বইয়ের বিবরণ
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className={`w-full px-3 py-2 border ${colorClasses.border.primary} rounded-md focus:outline-none focus:ring-2 ${colorClasses.ring.accent} focus:border-transparent`}
                                    placeholder="বইটি সম্পর্কে সংক্ষিপ্ত বিবরণ লিখুন"
                                />
                            </div>

                            <Input
                                label="কভার ইমেজ URL"
                                name="cover_img"
                                type="url"
                                value={formData.cover_img}
                                onChange={handleInputChange}
                                icon={Image}
                                placeholder="https://example.com/book-cover.jpg"
                            />

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleClearForm}
                                    className="flex-1"
                                >
                                    ফর্ম পরিষ্কার করুন
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={donateMutation.isPending}
                                    loading={donateMutation.isPending}
                                    className="flex-1"
                                    icon={Gift}
                                >
                                    {donateMutation.isPending ? 'দান করা হচ্ছে...' : 'বই দান করুন'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Donation Impact */}
                    <Card>
                        <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-4`}>
                            দানের প্রভাব
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className={`p-2 rounded-full ${colorClasses.bg.success} mr-3`}>
                                    <Users className={`h-4 w-4 ${colorClasses.text.success}`} />
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${colorClasses.text.primary}`}>
                                        কমিউনিটিকে সাহায্য করুন
                                    </p>
                                    <p className={`text-xs ${colorClasses.text.tertiary}`}>
                                        অন্যদের পড়ার সুযোগ দিন
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <div className={`p-2 rounded-full ${colorClasses.bg.info} mr-3`}>
                                    <Book className={`h-4 w-4 ${colorClasses.text.info}`} />
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${colorClasses.text.primary}`}>
                                        সংগ্রহ বৃদ্ধি করুন
                                    </p>
                                    <p className={`text-xs ${colorClasses.text.tertiary}`}>
                                        লাইব্রেরি সমৃদ্ধ করুন
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Guidelines */}
                    <Card>
                        <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-4`}>
                            দানের নির্দেশনা
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className={`p-3 rounded-md ${colorClasses.bg.success}`}>
                                <p className={`${colorClasses.text.success} font-medium mb-1`}>
                                    ✓ করবেন
                                </p>
                                <ul className={`${colorClasses.text.success} space-y-1 text-xs`}>
                                    <li>• সঠিক তথ্য প্রদান করুন</li>
                                    <li>• বইয়ের অবস্থা ভালো রাখুন</li>
                                    <li>• স্পষ্ট ছবি ব্যবহার করুন</li>
                                </ul>
                            </div>
                            
                            <div className={`p-3 rounded-md ${colorClasses.bg.warning}`}>
                                <p className={`${colorClasses.text.warning} font-medium mb-1`}>
                                    ⚠ এড়িয়ে চলুন
                                </p>
                                <ul className={`${colorClasses.text.warning} space-y-1 text-xs`}>
                                    <li>• ভুল তথ্য দেওয়া</li>
                                    <li>• ক্ষতিগ্রস্ত বই দান</li>
                                    <li>• অস্পষ্ট বিবরণ</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* Stats */}
                    <Card>
                        <h3 className={`text-lg font-semibold ${colorClasses.text.primary} mb-4`}>
                            আপনার অবদান
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${colorClasses.text.secondary}`}>
                                    মোট দান
                                </span>
                                <span className={`font-semibold ${colorClasses.text.accent}`}>
                                    ৮ টি বই
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${colorClasses.text.secondary}`}>
                                    এই মাসে
                                </span>
                                <span className={`font-semibold ${colorClasses.text.accent}`}>
                                    ২ টি বই
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${colorClasses.text.secondary}`}>
                                    ধার নেওয়া হয়েছে
                                </span>
                                <span className={`font-semibold ${colorClasses.text.accent}`}>
                                    ১৫ বার
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Demo Helper */}
            <DemoHelper
                currentPage="donate"
                onFillDonate={handleFillDemoData}
            />
        </div>
    );
};

export default DonatePage;
