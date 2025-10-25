import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Camera, Upload, X, Loader2 } from 'lucide-react';

interface ProfilePhotoUploadProps {
  userId: string;
  currentAvatarUrl: string | null;
  onUploadComplete: (url: string) => void;
  onRemove: () => void;
}

export function ProfilePhotoUpload({ 
  userId, 
  currentAvatarUrl, 
  onUploadComplete, 
  onRemove 
}: ProfilePhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a valid image file (PNG, JPG, GIF, or WebP)');
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be less than 5MB');
      }

      // Create file path
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Delete old avatar if exists
      if (currentAvatarUrl) {
        try {
          const oldPath = currentAvatarUrl.split('/').slice(-2).join('/');
          await supabase.storage.from('avatars').remove([oldPath]);
        } catch (err) {
          console.warn('Could not delete old avatar:', err);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const publicUrl = getPublicUrl(filePath);
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      onUploadComplete(publicUrl);
    } catch (error: any) {
      setError(error.message || 'Error uploading avatar');
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setUploading(true);
      setError(null);

      if (currentAvatarUrl) {
        // Delete from storage
        const path = currentAvatarUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([path]);
      }

      // Update profile to remove avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      onRemove();
    } catch (error: any) {
      setError(error.message || 'Error removing avatar');
      console.error('Error removing avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        {/* Avatar Preview */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {currentAvatarUrl ? (
              <img 
                src={currentAvatarUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera size={48} className="text-gray-400" />
            )}
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload size={16} />
              {currentAvatarUrl ? 'Change Photo' : 'Upload Photo'}
            </Button>
            
            {currentAvatarUrl && (
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={handleRemoveAvatar}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <X size={16} />
                Remove
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            onChange={uploadAvatar}
            disabled={uploading}
            className="hidden"
          />

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload a profile photo (PNG, JPG, GIF, or WebP, max 5MB)
          </p>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

