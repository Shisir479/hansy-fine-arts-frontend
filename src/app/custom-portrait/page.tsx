'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';

export default function CustomPortraitPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    portraitType: 'individual',
    size: 'medium',
    style: 'realistic',
    description: '',
    referencePhotos: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Custom portrait request submitted!');
    // Handle form submission
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Custom Portrait Commission</h1>
          <p className="text-lg text-muted-foreground">
            Commission a unique portrait tailored to your vision
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Portrait Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="portraitType">Portrait Type</Label>
                      <select
                        id="portraitType"
                        name="portraitType"
                        value={formData.portraitType}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="individual">Individual</option>
                        <option value="couple">Couple</option>
                        <option value="family">Family</option>
                        <option value="pet">Pet</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="size">Size</Label>
                      <select
                        id="size"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="small">Small (8x10&quot;)</option>
                        <option value="medium">Medium (16x20&quot;)</option>
                        <option value="large">Large (24x36&quot;)</option>
                        <option value="xlarge">X-Large (30x40&quot;)</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="style">Style</Label>
                      <select
                        id="style"
                        name="style"
                        value={formData.style}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="realistic">Realistic</option>
                        <option value="abstract">Abstract</option>
                        <option value="impressionist">Impressionist</option>
                        <option value="contemporary">Contemporary</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description & Special Requests</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us about your vision for this portrait..."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="referencePhotos">Reference Photo URLs</Label>
                    <Textarea
                      id="referencePhotos"
                      name="referencePhotos"
                      value={formData.referencePhotos}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Paste URLs of reference photos (one per line)"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Submit Commission Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Info */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Pricing Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Size</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>Small (8x10&quot;): $199</li>
                    <li>Medium (16x20&quot;): $399</li>
                    <li>Large (24x36&quot;): $699</li>
                    <li>X-Large (30x40&quot;): $999</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  <p className="text-sm text-muted-foreground">
                    Custom portraits typically take 2-4 weeks to complete.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Process</h3>
                  <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                    <li>Submit your request</li>
                    <li>Artist consultation</li>
                    <li>Sketch approval</li>
                    <li>Final creation</li>
                    <li>Delivery</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
