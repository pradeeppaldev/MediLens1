import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { User, Mail, Phone, Calendar, MapPin, Heart, Shield, Edit3, ShieldAlert, LogOut, CheckCircle2, AlertTriangle, FileText, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { INDIAN_PATIENT_PROFILE } from '../data/indianClinicalData';
import { toast } from 'sonner';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || INDIAN_PATIENT_PROFILE.displayName,
    email: user?.email || INDIAN_PATIENT_PROFILE.email,
    photoURL: user?.photoURL || INDIAN_PATIENT_PROFILE.photoURL,
    phone: user?.phone || INDIAN_PATIENT_PROFILE.phone,
    bloodGroup: user?.bloodGroup || INDIAN_PATIENT_PROFILE.bloodGroup,
    dateOfBirth: '1986-05-14',
    location: user?.city || INDIAN_PATIENT_PROFILE.city,
    emergencyContact: user?.emergencyContact || INDIAN_PATIENT_PROFILE.emergencyContact,
    allergies: Array.isArray(user?.allergies) ? user.allergies.join(', ') : 'Penicillin, Sulfa Drugs',
    joinDate: 'Jan 2024'
  });
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        if (!user.isDemo) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfileData(prev => ({
              ...prev,
              ...data,
              displayName: data.displayName || user.displayName || INDIAN_PATIENT_PROFILE.displayName,
              email: data.email || user.email || INDIAN_PATIENT_PROFILE.email,
              photoURL: data.photoURL || user.photoURL || INDIAN_PATIENT_PROFILE.photoURL,
              phone: data.phone || INDIAN_PATIENT_PROFILE.phone,
              bloodGroup: data.bloodGroup || INDIAN_PATIENT_PROFILE.bloodGroup,
              emergencyContact: data.emergencyContact || INDIAN_PATIENT_PROFILE.emergencyContact,
              allergies: Array.isArray(data.allergies) ? data.allergies.join(', ') : (data.allergies || 'Penicillin, Sulfa Drugs'),
              location: data.location || data.city || INDIAN_PATIENT_PROFILE.city
            }));
          }
        }
      } catch (error) {
        console.warn('Error fetching profile, using demo profile:', error?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleEditProfile = () => {
    setEditForm({ ...profileData });
    setShowEditModal(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user && !user.isDemo) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, editForm);
      }
      setProfileData(editForm);
      setShowEditModal(false);
      toast.success('Patient profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out of MediLens session');
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Patient Health Card
            </h1>
            <Badge variant="outline" className="font-bold text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              ABDM Verified
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Personal identity, emergency triage dossier, and chronic condition summary.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            onClick={handleEditProfile}
            size="sm"
            variant="outline"
            className="rounded-xl text-xs font-bold gap-1.5 shadow-xs"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit Profile
          </Button>
          <Button
            onClick={handleLogout}
            size="sm"
            variant="destructive"
            className="rounded-xl text-xs font-bold gap-1.5 shadow-xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Identity Hero Card */}
      <Card className="border-border/80 shadow-xs overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 relative" />
        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-4 gap-4">
            <div className="flex items-end gap-4">
              {profileData.photoURL ? (
                <img
                  src={profileData.photoURL}
                  alt="Profile"
                  className="h-24 w-24 rounded-2xl object-cover ring-4 ring-background shadow-md"
                />
              ) : (
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-3xl ring-4 ring-background shadow-md">
                  {profileData.displayName ? profileData.displayName.charAt(0).toUpperCase() : 'P'}
                </div>
              )}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    {profileData.displayName || 'Aarav Sharma'}
                  </h2>
                  <Badge variant="secondary" className="text-[10px] font-bold">
                    Primary Patient
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3 text-primary" />
                  {profileData.email || 'demo@medilens.in'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs py-1 px-3 font-semibold">
                Member since: {profileData.joinDate || 'Jan 2024'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-border/50">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Blood Group</p>
              <p className="text-base font-extrabold text-foreground mt-0.5">{profileData.bloodGroup || 'B+'}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phone Number</p>
              <p className="text-sm font-bold text-foreground mt-0.5 tabular-numbers">{profileData.phone || '+91 98765 43210'}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date of Birth</p>
              <p className="text-sm font-bold text-foreground mt-0.5 tabular-numbers">{profileData.dateOfBirth || '14 May 1986'}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Location</p>
              <p className="text-sm font-bold text-foreground mt-0.5 truncate">{profileData.location || 'Bengaluru, Karnataka'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency & Safety Dossier */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-bold text-foreground">
            <Shield className="h-4 w-4 text-primary" />
            Emergency Clinical Information
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Vital details accessible in medical triage or first responder emergency.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="p-4 rounded-xl border border-destructive/25 bg-destructive/10 text-destructive space-y-1">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs">
              <AlertTriangle className="h-4 w-4" />
              <span>Known Drug Allergies & Contraindications</span>
            </div>
            <p className="text-sm font-bold text-foreground mt-1">
              {profileData.allergies || 'Penicillin, Sulfa Drugs'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/70 bg-muted/30 space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Emergency Contact (Spouse / Next of Kin)</p>
            <p className="text-sm font-bold text-foreground">
              {profileData.emergencyContact || 'Priya Sharma (Spouse) - +91 98765 43211'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Primary Physician</span>
              <p className="text-xs font-bold text-foreground mt-0.5">Dr. Rajesh Sharma, MD (AIIMS New Delhi)</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Health Insurance</span>
              <p className="text-xs font-bold text-foreground mt-0.5">Star Health Premier Gold (₹10,00,000 Sum Insured)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Session Actions */}
      <Card className="border-border/80 shadow-xs bg-muted/20">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-foreground">Session Security</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Signed in with {user?.isDemo ? 'Evaluation Demo Profile' : user?.email || 'email credentials'}.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="rounded-xl text-xs font-bold gap-2 shrink-0 w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4" />
            Sign Out of Account
          </Button>
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Profile Details</DialogTitle>
            <DialogDescription className="text-xs">
              Update personal identity and emergency healthcare data.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className="space-y-3 py-1">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Display Name</Label>
              <Input
                value={editForm.displayName || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Full name"
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Phone Number</Label>
                <Input
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="h-10 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Blood Group</Label>
                <Input
                  value={editForm.bloodGroup || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bloodGroup: e.target.value }))}
                  placeholder="e.g. B+, O+, A+"
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Date of Birth</Label>
                <Input
                  type="date"
                  value={editForm.dateOfBirth || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Location / City</Label>
                <Input
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. Bengaluru, Karnataka"
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Known Drug Allergies</Label>
              <Input
                value={editForm.allergies || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, allergies: e.target.value }))}
                placeholder="e.g. Penicillin, Sulfa Drugs"
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Emergency Contact & Phone</Label>
              <Input
                value={editForm.emergencyContact || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder="Name, relation & phone number"
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowEditModal(false)} className="rounded-xl text-xs font-bold">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={saving} className="rounded-xl text-xs font-bold">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
