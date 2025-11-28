import React, { useState } from 'react';
import { User, Key, Bell, Shield, Copy, Check, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { supabase } from '../lib/supabase';

const Settings: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'notifications'>('profile');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-sans font-medium text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600 font-mono text-sm">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <nav className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activeTab === 'profile' ? 'bg-black text-white' : 'hover:bg-gray-50'
              }`}
            >
              <User size={18} />
              <span className="font-mono text-xs uppercase tracking-widest">Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-t border-gray-100 ${
                activeTab === 'api' ? 'bg-black text-white' : 'hover:bg-gray-50'
              }`}
            >
              <Key size={18} />
              <span className="font-mono text-xs uppercase tracking-widest">API Tokens</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-t border-gray-100 ${
                activeTab === 'notifications' ? 'bg-black text-white' : 'hover:bg-gray-50'
              }`}
            >
              <Bell size={18} />
              <span className="font-mono text-xs uppercase tracking-widest">Notifications</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && <ProfileSettings user={user} profile={profile} refreshProfile={refreshProfile} />}
          {activeTab === 'api' && <APITokenSettings userId={user?.id} />}
          {activeTab === 'notifications' && <NotificationSettings />}
        </div>
      </div>
    </>
  );
};

const ProfileSettings: React.FC<{ user: any; profile: any; refreshProfile: () => void }> = ({
  user,
  profile,
  refreshProfile,
}) => {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);

    setSaving(false);
    if (!error) {
      setSaved(true);
      refreshProfile();
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
        <p className="text-sm text-gray-500 mt-1">Update your account details</p>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-3 border border-gray-200 rounded bg-gray-50 text-gray-500 font-mono text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-black transition-colors"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
          <div className="flex items-center gap-3">
            <span
              className={`inline-block px-3 py-1 text-sm font-medium uppercase rounded ${
                profile?.plan === 'pro'
                  ? 'bg-orange-100 text-orange-700'
                  : profile?.plan === 'team'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {profile?.plan || 'free'}
            </span>
            {profile?.plan === 'free' && (
              <a href="/dashboard/billing" className="text-sm text-orange-600 hover:underline">
                Upgrade to Pro
              </a>
            )}
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              'Saving...'
            ) : saved ? (
              <>
                <Check size={16} /> Saved
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const APITokenSettings: React.FC<{ userId?: string }> = ({ userId }) => {
  const [tokens, setTokens] = useState<any[]>([]);
  const [showNewToken, setShowNewToken] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateToken = () => {
    // In production, this would call the backend to generate a secure token
    const token = `esp_${Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')}`;
    setGeneratedToken(token);
    setTokens([...tokens, { id: Date.now(), name: newTokenName, created: new Date().toISOString() }]);
    setNewTokenName('');
  };

  const copyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">API Tokens</h2>
          <p className="text-sm text-gray-500 mt-1">Manage tokens for CLI and CI/CD integration</p>
        </div>
        <button
          onClick={() => setShowNewToken(true)}
          className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> New Token
        </button>
      </div>

      {/* New Token Modal */}
      {showNewToken && (
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          {generatedToken ? (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  Make sure to copy your token now. You won't be able to see it again!
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-white border border-yellow-200 rounded font-mono text-sm break-all">
                    {generatedToken}
                  </code>
                  <button
                    onClick={copyToken}
                    className="p-3 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowNewToken(false);
                  setGeneratedToken(null);
                }}
                className="text-sm text-gray-600 hover:text-black"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Token Name</label>
                <input
                  type="text"
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                  placeholder="e.g., CI/CD Pipeline"
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={generateToken}
                  disabled={!newTokenName.trim()}
                  className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  Generate Token
                </button>
                <button
                  onClick={() => setShowNewToken(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Token List */}
      <div className="divide-y divide-gray-100">
        {tokens.length === 0 ? (
          <div className="p-12 text-center">
            <Key size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No API tokens yet</p>
            <p className="text-sm text-gray-400 mt-1">Create a token to use with the CLI or CI/CD</p>
          </div>
        ) : (
          tokens.map((token) => (
            <div key={token.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{token.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Created {new Date(token.created).toLocaleDateString()}
                </p>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [scanComplete, setScanComplete] = useState(true);
  const [criticalVulns, setCriticalVulns] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
        <p className="text-sm text-gray-500 mt-1">Choose what notifications you receive</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Email Notifications</p>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <button
            onClick={() => setEmailNotifs(!emailNotifs)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              emailNotifs ? 'bg-black' : 'bg-gray-200'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                emailNotifs ? 'left-7' : 'left-1'
              }`}
            ></span>
          </button>
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Scan Complete</p>
              <p className="text-xs text-gray-500">Get notified when a scan finishes</p>
            </div>
            <input
              type="checkbox"
              checked={scanComplete}
              onChange={(e) => setScanComplete(e.target.checked)}
              className="w-4 h-4 accent-black"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Critical Vulnerabilities</p>
              <p className="text-xs text-gray-500">Alert when critical issues are found</p>
            </div>
            <input
              type="checkbox"
              checked={criticalVulns}
              onChange={(e) => setCriticalVulns(e.target.checked)}
              className="w-4 h-4 accent-black"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Weekly Summary</p>
              <p className="text-xs text-gray-500">Receive a weekly security report</p>
            </div>
            <input
              type="checkbox"
              checked={weeklyReport}
              onChange={(e) => setWeeklyReport(e.target.checked)}
              className="w-4 h-4 accent-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
