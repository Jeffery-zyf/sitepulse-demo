import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { Navbar } from "@/components/desktop/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { currentUser, users } from "@/lib/mockData";
import { toast } from "sonner";

const timezones = [
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
];

export default function SettingsPage() {
  const [name, setName] = useState(currentUser.name);
  const [company, setCompany] = useState(currentUser.company || "");
  const [timezone, setTimezone] = useState(currentUser.timezone || "America/Los_Angeles");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Profile updated", {
      description: "Your changes have been saved.",
    });
  };

  // Mock team members (users associated with the current user's projects)
  const teamMembers = [
    { user: users[0], role: "Owner" as const },
    { user: users[1], role: "Member" as const },
    { user: users[2], role: "Member" as const },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-[1440px] px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account and team settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-border bg-card">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-display text-base font-semibold text-foreground">
                  Profile
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Your personal information
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {currentUser.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change avatar
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      JPG, PNG or GIF. 1MB max.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={currentUser.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-8 rounded-lg border border-destructive/30 bg-card">
              <div className="px-6 py-4 border-b border-destructive/30">
                <h2 className="font-display text-base font-semibold text-destructive">
                  Danger Zone
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Delete account</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Permanently delete your account and all associated data.
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete account
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border bg-card">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-display text-base font-semibold text-foreground">
                  Team Members
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  People with access to your projects
                </p>
              </div>
              
              <div className="divide-y divide-border">
                {teamMembers.map(({ user, role }) => (
                  <div key={user.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="text-xs bg-muted">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        role === "Owner"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {role}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-border">
                <Button variant="outline" size="sm" className="w-full">
                  Invite team member
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}