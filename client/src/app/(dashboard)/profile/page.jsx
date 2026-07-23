"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, changePasswordSchema } from '@/utils/validationSchemas';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/lib/axiosInstance';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { User, Lock, Store } from 'lucide-react';

export default function ProfilePage() {
  const { admin, refreshProfile } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile update form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  // Password change form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  // Prepopulate form fields
  useEffect(() => {
    if (admin) {
      setProfileValue('shopName', admin.shopName || '');
      setProfileValue('fathersName', admin.fathersName || '');
      setProfileValue('villageCity', admin.villageCity || '');
      setProfileValue('gstin', admin.gstin || '');
    }
  }, [admin, setProfileValue]);

  const onUpdateProfile = async (values) => {
    setProfileLoading(true);
    try {
      const { data } = await axiosInstance.put('/admin/profile', values);
      if (data.success) {
        toast.success('Profile details updated successfully', {
          style: { background: '#10B981', color: '#fff' },
        });
        refreshProfile();
      }
    } catch (error) {
      console.error('Failed to update profile', error);
      toast.error(error.response?.data?.message || 'Failed to update profile', {
        style: { background: '#EF4444', color: '#fff' },
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const onChangePassword = async (values) => {
    setPasswordLoading(true);
    try {
      const { data } = await axiosInstance.put('/admin/change-password', values);
      if (data.success) {
        toast.success('Password changed successfully', {
          style: { background: '#10B981', color: '#fff' },
        });
        resetPasswordForm();
      }
    } catch (error) {
      console.error('Failed to change password', error);
      toast.error(error.response?.data?.message || 'Failed to change password', {
        style: { background: '#EF4444', color: '#fff' },
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
          Admin Profile Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update your shop information, verify credentials, and manage passwords.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-white/10 pb-4 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-white">Shop & Store Details</h3>
              <p className="text-xs text-slate-500">Update branding metadata details</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/10">
              <User className="h-4 w-4 text-slate-400" />
              <div className="text-xs">
                <p className="font-bold text-slate-400 uppercase tracking-wider">Account Holder / Register Owner</p>
                <p className="font-semibold text-slate-700 dark:text-slate-200">{admin?.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">Phone: {admin?.phone}</p>
              </div>
            </div>

            <Input
              label="Shop Name"
              type="text"
              placeholder="e.g. KD Sangod Stores"
              error={profileErrors.shopName?.message}
              {...registerProfile('shopName')}
            />

            <Input
              label="Fathers Name"
              type="text"
              placeholder="Enter father's name"
              error={profileErrors.fathersName?.message}
              {...registerProfile('fathersName')}
            />

            <Input
              label="Village / City"
              type="text"
              placeholder="e.g. Sangod, Rajasthan"
              error={profileErrors.villageCity?.message}
              {...registerProfile('villageCity')}
            />

            <Input
              label="GSTIN Number"
              type="text"
              placeholder="e.g. 08AAAAA1111A1Z1"
              error={profileErrors.gstin?.message}
              {...registerProfile('gstin')}
            />

            <Button
              type="submit"
              loading={profileLoading}
              className="w-full mt-2"
            >
              Update Registration details
            </Button>
          </form>
        </Card>

        {/* Change Password Card */}
        <Card className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-white/10 pb-4 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-white">Security Settings</h3>
              <p className="text-xs text-slate-500">Change password credentials</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              required
              error={passwordErrors.currentPassword?.message}
              {...registerPassword('currentPassword')}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              required
              error={passwordErrors.newPassword?.message}
              {...registerPassword('newPassword')}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              required
              error={passwordErrors.confirmPassword?.message}
              {...registerPassword('confirmPassword')}
            />

            <Button
              type="submit"
              variant="danger"
              loading={passwordLoading}
              className="w-full mt-2"
            >
              Change System Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
