import { useState } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

interface ProjectInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export function ProjectInquiryModal({ isOpen, onClose }: ProjectInquiryModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/project-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setIsSuccess(true);
      
      // Reset form after short delay and close
      setTimeout(() => {
        setFormData({ name: '', email: '', company: '', message: '' });
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setErrors({ message: 'Failed to submit inquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-jaia-gold hover:text-jaia-neonGold transition-colors"
          aria-label="Close"
        >
          <X size={32} />
        </button>
        
        <div className="bg-jaia-darkGrey border-2 border-jaia-gold/30 p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-5 pointer-events-none"></div>
          
          {/* Success State */}
          {isSuccess ? (
            <div className="relative z-10 text-center py-12">
              <CheckCircle className="w-16 h-16 text-jaia-green mx-auto mb-4" />
              <h2 className="text-3xl font-display font-bold text-white mb-4">
                MESSAGE RECEIVED
              </h2>
              <p className="text-gray-400 font-mono text-sm">
                We'll be in touch soon to discuss your project.
              </p>
            </div>
          ) : (
            <div className="relative z-10">
              {/* Header */}
              <div className="mb-8 border-b border-jaia-gold/20 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-jaia-gold animate-pulse"></span>
                  <span className="font-mono text-jaia-gold text-xs tracking-widest">GET_IN_TOUCH</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase">
                  Let's Work<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-jaia-gold to-jaia-neonGold">
                    Together
                  </span>
                </h2>
                <p className="text-gray-400 mt-4 text-sm">
                  Whether it's development, training, or consultation - we're here to help. Let's start the conversation.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className="block font-mono text-jaia-green text-xs mb-2 tracking-wider">
                      NAME *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={handleChange('name')}
                      placeholder="Your name"
                      className="bg-black/50 border-jaia-gold/30 text-white placeholder:text-gray-600 focus:border-jaia-gold"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1 font-mono">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block font-mono text-jaia-green text-xs mb-2 tracking-wider">
                      EMAIL *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      placeholder="your@email.com"
                      className="bg-black/50 border-jaia-gold/30 text-white placeholder:text-gray-600 focus:border-jaia-gold"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1 font-mono">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Company Field */}
                <div>
                  <label className="block font-mono text-jaia-green text-xs mb-2 tracking-wider">
                    COMPANY *
                  </label>
                  <Input
                    type="text"
                    value={formData.company}
                    onChange={handleChange('company')}
                    placeholder="Your company or organization"
                    className="bg-black/50 border-jaia-gold/30 text-white placeholder:text-gray-600 focus:border-jaia-gold"
                  />
                  {errors.company && (
                    <p className="text-red-400 text-xs mt-1 font-mono">{errors.company}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label className="block font-mono text-jaia-green text-xs mb-2 tracking-wider">
                    MESSAGE *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={handleChange('message')}
                    placeholder="What's on your mind? Tell us about your project, ideas, or questions..."
                    rows={6}
                    className="bg-black/50 border-jaia-gold/30 text-white placeholder:text-gray-600 focus:border-jaia-gold resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1 font-mono">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-jaia-gold hover:bg-jaia-neonGold text-black font-display font-bold uppercase tracking-wider px-8 py-6 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-pulse">Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Inquiry
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


