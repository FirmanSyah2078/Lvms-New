import { useForm } from '@inertiajs/react';
import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { Transition } from '@headlessui/react';
import { IconPhoto, IconUserCircle, IconTrash, IconRotate2, IconX, IconShield } from "@tabler/icons-react";

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type User } from '@/types';
import 'boxicons/css/boxicons.min.css';

interface ProfileFormData {
  name: string;
  avatar: File | null;
  remove_avatar: boolean;
  _method: 'PUT'; 
}

export default function UpdateProfile({ user }: { user: User }) {
  const [preview, setPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  const { data, setData, post, processing, errors, recentlySuccessful, reset, isDirty } = useForm<ProfileFormData>({
    name: user.name || '',
    avatar: null,
    remove_avatar: false,
    _method: 'PUT',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isDirty) return;

    post('/settings/profile', {
      forceFormData: true,
      onSuccess: () => {
        reset();
        if (preview) {
          URL.revokeObjectURL(preview);
          setPreview(null);
        }
        if (avatarInputRef.current) {
            avatarInputRef.current.value = '';
        }
      },
      preserveScroll: true,
    });
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setData((prevData) => ({...prevData, avatar: file, remove_avatar: false}));
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
    }
  };
  
  const cancelAvatarPreview = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setData('avatar', null);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const queueAvatarForRemoval = () => {
    setData((prevData) => ({ ...prevData, remove_avatar: true, avatar: null }));
  };

  const undoAvatarRemoval = () => {
    setData('remove_avatar', false);
  };
  
  const displayAvatar = () => {
    if (preview) return preview;
    if (data.remove_avatar) return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f8d7da&color=721c24`;
    return user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
  };
  
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</Label>
        
        {/* ✅ UBAH: Semua elemen avatar dibuat sejajar dalam satu flex container */}
        <div className="flex items-center gap-4">
          <div className="relative group flex-shrink-0">
            <img src={displayAvatar()} alt="Profile" className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" />
            {preview && (
              <button type="button" onClick={cancelAvatarPreview} className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 bg-gray-500 rounded-full text-white border-2 border-white shadow-sm hover:bg-gray-600" aria-label="Cancel preview">
                <IconX size={12} />
              </button>
            )}
          </div>
          
          <Label htmlFor="avatar" className="relative flex items-center justify-center w-full px-4 py-2 text-sm text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer text-gray-500 hover:border-blue-500 hover:text-blue-500 dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-500">
            <IconPhoto className="w-5 h-5 mr-2" />
            <span>{data.avatar ? data.avatar.name : "Choose a file"}</span>
            <Input id="avatar" type="file" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" />
          </Label>
          
          {user.avatar_url && !user.avatar_url.includes('ui-avatars.com') && !data.avatar && (
            data.remove_avatar ? (
              <Button type="button" variant="link" size="sm" onClick={undoAvatarRemoval} className="text-white dark:text-white p-0 h-auto">
                <IconRotate2 className="w-4 h-4 mr-1"/> Undo Remove
              </Button>
            ) : (
              <Button type="button" variant="link" size="sm" onClick={queueAvatarForRemoval} className="text-red-600 dark:text-red-500 p-0 h-auto">
                <IconTrash className="w-4 h-4 mr-1"/> Remove Picture
              </Button>
            )
          )}
        </div>
        <InputError className="mt-2" message={errors.avatar} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Username</Label>
        <div className="relative">
          <IconUserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required className="pl-10" />
        </div>
        <InputError className="mt-2" message={errors.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <div className="relative">
          <IconShield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input id="role" value={capitalize(user.role)} readOnly disabled className="pl-10 bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" disabled={!isDirty || processing} className="disabled:cursor-not-allowed flex items-center gap-2">
          {processing ? (
            <>
              <i className='bx bx-loader-alt bx-spin'></i>
              <span>Saving...</span>
            </>
          ) : (
            'Save Changes'
          )}
        </Button>

        <Transition
            show={recentlySuccessful && !isDirty}
            enter="transition-opacity ease-in-out duration-300"
            enterFrom="opacity-0"
            leave="transition-opacity ease-in-out duration-300"
            leaveTo="opacity-0"
        >
          <p className="text-sm text-green-600">✓ Saved.</p>
        </Transition>
      </div>
    </form>
  );
}