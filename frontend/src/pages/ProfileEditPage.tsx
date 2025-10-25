import { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Profile, ProfileVisibility } from '../types/profile';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { ProfilePhotoUpload } from '../components/ProfilePhotoUpload';
import { Save, AlertCircle } from 'lucide-react';

type ValidationErrors = {
  [key: string]: string;
};

export function ProfileEditPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const [formData, setFormData] = useState<Partial<Profile>>({
    full_name: '',
    bio: '',
    phone: '',
    location: '',
    country: '',
    job_title: '',
    company: '',
    industry: '',
    years_of_experience: null,
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    resume_url: '',
    skills: [],
    interests: [],
    is_mentor: false,
    mentor_areas: [],
    seeking_mentor: false,
    seeking_mentor_in: [],
    open_to_opportunities: false,
    profile_visibility: 'members_only',
    show_in_directory: true,
    show_resume_to_employers: false,
    show_phone_to_members: false,
    organization_name: '',
    organization_size: '',
    organization_industry: '',
    organization_website: '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [mentorAreaInput, setMentorAreaInput] = useState('');
  const [seekingMentorInput, setSeekingMentorInput] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else if (data) {
      setFormData(data);
    }
    setLoading(false);
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Empty is valid
    // Basic phone validation - at least 7 digits
    const digitCount = phone.replace(/\D/g, '').length;
    return digitCount >= 7 && digitCount <= 15;
  };

  const validateField = (fieldName: string, value: any): string | null => {
    switch (fieldName) {
      case 'linkedin_url':
      case 'github_url':
      case 'portfolio_url':
      case 'resume_url':
      case 'organization_website':
        if (value && !validateUrl(value)) {
          return 'Please enter a valid URL (e.g., https://example.com)';
        }
        break;
      case 'phone':
        if (value && !validatePhone(value)) {
          return 'Please enter a valid phone number with 7-15 digits';
        }
        break;
      case 'years_of_experience':
        if (value !== null && value !== '' && (value < 0 || value > 100)) {
          return 'Years of experience must be between 0 and 100';
        }
        break;
      case 'full_name':
        if (value && value.length > 100) {
          return 'Full name must be less than 100 characters';
        }
        break;
      case 'bio':
        if (value && value.length > 1000) {
          return 'Bio must be less than 1000 characters';
        }
        break;
    }
    return null;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        errors[key] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value });
    
    // Clear validation error when user starts typing
    if (validationErrors[fieldName]) {
      const newErrors = { ...validationErrors };
      delete newErrors[fieldName];
      setValidationErrors(newErrors);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate form before submitting
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the validation errors before saving.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', user.id);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setSaving(false);
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...(formData.skills || []), skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills?.filter(s => s !== skill) });
  };

  const addInterest = () => {
    if (interestInput.trim() && !formData.interests?.includes(interestInput.trim())) {
      setFormData({ ...formData, interests: [...(formData.interests || []), interestInput.trim()] });
      setInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({ ...formData, interests: formData.interests?.filter(i => i !== interest) });
  };

  const addMentorArea = () => {
    if (mentorAreaInput.trim() && !formData.mentor_areas?.includes(mentorAreaInput.trim())) {
      setFormData({ ...formData, mentor_areas: [...(formData.mentor_areas || []), mentorAreaInput.trim()] });
      setMentorAreaInput('');
    }
  };

  const removeMentorArea = (area: string) => {
    setFormData({ ...formData, mentor_areas: formData.mentor_areas?.filter(a => a !== area) });
  };

  const addSeekingMentorArea = () => {
    if (seekingMentorInput.trim() && !formData.seeking_mentor_in?.includes(seekingMentorInput.trim())) {
      setFormData({ ...formData, seeking_mentor_in: [...(formData.seeking_mentor_in || []), seekingMentorInput.trim()] });
      setSeekingMentorInput('');
    }
  };

  const removeSeekingMentorArea = (area: string) => {
    setFormData({ ...formData, seeking_mentor_in: formData.seeking_mentor_in?.filter(a => a !== area) });
  };

  const ValidationError = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-1 mt-1 text-sm text-red-600 dark:text-red-400">
        <AlertCircle size={14} />
        <span>{error}</span>
      </div>
    );
  };

  const SaveButtons = () => (
    <div className="flex gap-4">
      <Button 
        type="submit" 
        disabled={saving || Object.keys(validationErrors).length > 0} 
        className="flex items-center gap-2"
      >
        <Save size={16} />
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
      <Button type="button" variant="outline" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <SaveButtons />
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Photo */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
              {user && (
                <ProfilePhotoUpload
                  userId={user.id}
                  currentAvatarUrl={formData.avatar_url || null}
                  onUploadComplete={(url) => setFormData({ ...formData, avatar_url: url })}
                  onRemove={() => setFormData({ ...formData, avatar_url: null })}
                />
              )}
            </section>

            {/* Basic Information */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    value={formData.full_name || ''}
                    onChange={(e) => handleFieldChange('full_name', e.target.value)}
                    placeholder="Your full name"
                    className={validationErrors.full_name ? 'border-red-500' : ''}
                  />
                  <ValidationError error={validationErrors.full_name} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <Textarea
                    value={formData.bio || ''}
                    onChange={(e) => handleFieldChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className={validationErrors.bio ? 'border-red-500' : ''}
                  />
                  <ValidationError error={validationErrors.bio} />
                  {formData.bio && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.bio.length} / 1000 characters
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                      (Used for WhatsApp connections with other members)
                    </span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    placeholder="+1 (876) 123-4567"
                    className={validationErrors.phone ? 'border-red-500' : ''}
                  />
                  <ValidationError error={validationErrors.phone} />
                  {formData.phone && (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="show_phone_to_members"
                        checked={formData.show_phone_to_members || false}
                        onChange={(e) => setFormData({ ...formData, show_phone_to_members: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <label htmlFor="show_phone_to_members" className="text-sm">
                        Show my phone number to other members for WhatsApp connections
                      </label>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Kingston, Jamaica"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <Input
                      value={formData.country || ''}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Jamaica"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* Professional Information */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Title</label>
                    <Input
                      value={formData.job_title || ''}
                      onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <Input
                      value={formData.company || ''}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <Input
                      value={formData.industry || ''}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="Technology"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience</label>
                    <Input
                      type="number"
                      value={formData.years_of_experience || ''}
                      onChange={(e) => handleFieldChange('years_of_experience', parseInt(e.target.value) || null)}
                      placeholder="5"
                      min="0"
                      max="100"
                      className={validationErrors.years_of_experience ? 'border-red-500' : ''}
                    />
                    <ValidationError error={validationErrors.years_of_experience} />
                  </div>
                </div>
              </div>
            </section>

            {/* Links */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Links & Resources</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                  <Input
                    type="url"
                    value={formData.linkedin_url || ''}
                    onChange={(e) => handleFieldChange('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className={validationErrors.linkedin_url ? 'border-red-500' : ''}
                  />
                  <ValidationError error={validationErrors.linkedin_url} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GitHub URL</label>
                  <Input
                    type="url"
                    value={formData.github_url || ''}
                    onChange={(e) => handleFieldChange('github_url', e.target.value)}
                    placeholder="https://github.com/yourusername"
                    className={validationErrors.github_url ? 'border-red-500' : ''}
                  />
                  <ValidationError error={validationErrors.github_url} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Portfolio URL</label>
                  <Input
                    type="url"
                    value={formData.portfolio_url || ''}
                    onChange={(e) => handleFieldChange('portfolio_url', e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className={validationErrors.portfolio_url ? 'border-red-500' : ''}
                  />
                  <ValidationError error={validationErrors.portfolio_url} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Resume URL</label>
                  <Input
                    type="url"
                    value={formData.resume_url || ''}
                    onChange={(e) => handleFieldChange('resume_url', e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className={validationErrors.resume_url ? 'border-red-500' : ''}
                  />
                  <ValidationError error={validationErrors.resume_url} />
                </div>
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill (press Enter)"
                  />
                  <Button type="button" onClick={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-600">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Interests */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Interests</h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    placeholder="Add an interest (press Enter)"
                  />
                  <Button type="button" onClick={addInterest}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.interests?.map((interest, idx) => (
                    <span key={idx} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm flex items-center gap-2">
                      {interest}
                      <button type="button" onClick={() => removeInterest(interest)} className="hover:text-red-600">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Mentorship */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Mentorship</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_mentor"
                    checked={formData.is_mentor || false}
                    onChange={(e) => setFormData({ ...formData, is_mentor: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_mentor" className="text-sm font-medium">I'm available as a mentor</label>
                </div>

                {formData.is_mentor && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Areas I can mentor in:</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={mentorAreaInput}
                        onChange={(e) => setMentorAreaInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMentorArea())}
                        placeholder="Add mentorship area (press Enter)"
                      />
                      <Button type="button" onClick={addMentorArea}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.mentor_areas?.map((area, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm flex items-center gap-2">
                          {area}
                          <button type="button" onClick={() => removeMentorArea(area)} className="hover:text-red-600">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="seeking_mentor"
                    checked={formData.seeking_mentor || false}
                    onChange={(e) => setFormData({ ...formData, seeking_mentor: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="seeking_mentor" className="text-sm font-medium">I'm seeking a mentor</label>
                </div>

                {formData.seeking_mentor && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Areas I want mentorship in:</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={seekingMentorInput}
                        onChange={(e) => setSeekingMentorInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSeekingMentorArea())}
                        placeholder="Add area (press Enter)"
                      />
                      <Button type="button" onClick={addSeekingMentorArea}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.seeking_mentor_in?.map((area, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-2">
                          {area}
                          <button type="button" onClick={() => removeSeekingMentorArea(area)} className="hover:text-red-600">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Privacy & Visibility */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Privacy & Visibility</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Profile Visibility</label>
                  <select
                    value={formData.profile_visibility || 'members_only'}
                    onChange={(e) => setFormData({ ...formData, profile_visibility: e.target.value as ProfileVisibility })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-background"
                  >
                    <option value="public">Public - Anyone can view</option>
                    <option value="members_only">Members Only</option>
                    <option value="private">Private - Only me</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="show_in_directory"
                    checked={formData.show_in_directory || false}
                    onChange={(e) => setFormData({ ...formData, show_in_directory: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="show_in_directory" className="text-sm font-medium">Show in member directory</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="show_resume_to_employers"
                    checked={formData.show_resume_to_employers || false}
                    onChange={(e) => setFormData({ ...formData, show_resume_to_employers: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="show_resume_to_employers" className="text-sm font-medium">Make resume visible to employers</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="open_to_opportunities"
                    checked={formData.open_to_opportunities || false}
                    onChange={(e) => setFormData({ ...formData, open_to_opportunities: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="open_to_opportunities" className="text-sm font-medium">Open to new opportunities</label>
                </div>
              </div>
            </section>

            {/* Organization Info (for organizational members) */}
            {formData.membership_tier === 'organizational' && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Organization Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Name</label>
                    <Input
                      value={formData.organization_name || ''}
                      onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                      placeholder="Company/Organization name"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Organization Size</label>
                      <Input
                        value={formData.organization_size || ''}
                        onChange={(e) => setFormData({ ...formData, organization_size: e.target.value })}
                        placeholder="1-10, 11-50, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Industry</label>
                      <Input
                        value={formData.organization_industry || ''}
                        onChange={(e) => setFormData({ ...formData, organization_industry: e.target.value })}
                        placeholder="Technology"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Website</label>
                    <Input
                      type="url"
                      value={formData.organization_website || ''}
                      onChange={(e) => handleFieldChange('organization_website', e.target.value)}
                      placeholder="https://yourcompany.com"
                      className={validationErrors.organization_website ? 'border-red-500' : ''}
                    />
                    <ValidationError error={validationErrors.organization_website} />
                  </div>
                </div>
              </section>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <SaveButtons />
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

