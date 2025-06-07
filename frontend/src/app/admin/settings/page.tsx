import { Save } from "lucide-react";
import { Card } from "../components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="site-name"
                    className="block text-sm font-medium mb-1"
                  >
                    Site Name
                  </label>
                  <input
                    id="site-name"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="My Awesome Site"
                    defaultValue="Community App"
                  />
                </div>

                <div>
                  <label
                    htmlFor="site-description"
                    className="block text-sm font-medium mb-1"
                  >
                    Site Description
                  </label>
                  <textarea
                    id="site-description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="A brief description of your site"
                    defaultValue="A community platform for sharing and discussing ideas."
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="site-url"
                    className="block text-sm font-medium mb-1"
                  >
                    Site URL
                  </label>
                  <input
                    id="site-url"
                    type="url"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com"
                    defaultValue="https://community-app.example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="language"
                    className="block text-sm font-medium mb-1"
                  >
                    Default Language
                  </label>
                  <select
                    id="language"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Appearance</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Color Theme
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <div className="relative">
                      <input
                        type="radio"
                        name="theme"
                        id="theme-light"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <label
                        htmlFor="theme-light"
                        className="flex items-center justify-center w-16 h-16 bg-white border-2 border-gray-200 rounded-md cursor-pointer peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary"
                      >
                        <span className="text-sm">Light</span>
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="radio"
                        name="theme"
                        id="theme-dark"
                        className="sr-only peer"
                      />
                      <label
                        htmlFor="theme-dark"
                        className="flex items-center justify-center w-16 h-16 bg-gray-800 text-white border-2 border-gray-700 rounded-md cursor-pointer peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary"
                      >
                        <span className="text-sm">Dark</span>
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="radio"
                        name="theme"
                        id="theme-system"
                        className="sr-only peer"
                      />
                      <label
                        htmlFor="theme-system"
                        className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white to-gray-800 text-gray-800 border-2 border-gray-200 rounded-md cursor-pointer peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary"
                      >
                        <span className="text-sm">System</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="text-sm font-medium">
                      Show user avatars
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="text-sm font-medium">
                      Enable animations
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium">Compact view</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Email Settings */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Email Settings</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email-from"
                    className="block text-sm font-medium mb-1"
                  >
                    From Email
                  </label>
                  <input
                    id="email-from"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="noreply@example.com"
                    defaultValue="noreply@community-app.example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="smtp-host"
                    className="block text-sm font-medium mb-1"
                  >
                    SMTP Host
                  </label>
                  <input
                    id="smtp-host"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="smtp.example.com"
                    defaultValue="smtp.mailserver.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="smtp-port"
                      className="block text-sm font-medium mb-1"
                    >
                      SMTP Port
                    </label>
                    <input
                      id="smtp-port"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="587"
                      defaultValue="587"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="smtp-security"
                      className="block text-sm font-medium mb-1"
                    >
                      Security
                    </label>
                    <select
                      id="smtp-security"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      defaultValue="tls"
                    >
                      <option value="none">None</option>
                      <option value="ssl">SSL</option>
                      <option value="tls">TLS</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="text-sm font-medium">
                      Enable email notifications
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* API Settings */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">API Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      defaultChecked
                    />
                    <span className="text-sm font-medium">
                      Enable API access
                    </span>
                  </label>
                </div>

                <div>
                  <label
                    htmlFor="api-key"
                    className="block text-sm font-medium mb-1"
                  >
                    API Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="api-key"
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
                      value="sk_live_example_key_cannot_be_displayed"
                      readOnly
                    />
                    <button className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Regenerate
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    This key grants full access to your API. Keep it secure!
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="rate-limit"
                    className="block text-sm font-medium mb-1"
                  >
                    Rate Limit (requests per minute)
                  </label>
                  <input
                    id="rate-limit"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="60"
                    defaultValue="60"
                    min="10"
                    max="1000"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          <Save size={18} />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
}
