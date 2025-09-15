import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Send, Zap } from 'lucide-react';
import { useCommandStore } from '../../stores/commandStore';
import { useToast } from '@/hooks/use-toast';

export const EmergencyButton: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'critical' as const,
    description: '',
    location: '',
    severity: 0.8,
  });
  
  const { addAlert } = useCommandStore();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Mock coordinates for the location (in a real app, this would use geocoding)
    const mockCoords = {
      lat: 20.5937 + (Math.random() - 0.5) * 10,
      lng: 78.9629 + (Math.random() - 0.5) * 15,
    };

    addAlert({
      title: formData.title,
      category: formData.category,
      location: {
        lat: mockCoords.lat,
        lng: mockCoords.lng,
        name: formData.location,
      },
      severity: formData.severity,
      description: formData.description,
      resolved: false,
    });

    toast({
      title: "Emergency Alert Sent",
      description: `Alert "${formData.title}" has been broadcast to all units`,
    });

    // Reset form
    setFormData({
      title: '',
      category: 'critical',
      description: '',
      location: '',
      severity: 0.8,
    });
    
    setIsDialogOpen(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: 0.5, 
              type: 'spring', 
              stiffness: 200, 
              damping: 10 
            }}
            className="relative"
          >
            <Button
              size="lg"
              className="w-16 h-16 rounded-full bg-gradient-alert hover:scale-110 transition-all duration-300 shadow-alert animate-pulse-alert shadow-lg"
            >
              <AlertTriangle className="w-6 h-6" />
            </Button>
            
            {/* Pulsing Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-alert-critical animate-ping"></div>
            <div className="absolute inset-0 rounded-full border border-alert-critical opacity-75"></div>
          </motion.div>
        </DialogTrigger>
        
        <DialogContent className="bg-neutral-900 border border-white/10 shadow-lg rounded-lg max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-foreground">
              <Zap className="w-5 h-5 text-primary" />
              <span>SEND EMERGENCY ALERT</span>
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-foreground">
                Alert Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Flood Emergency - Sector 7"
                className="mt-1 bg-input border-input-border text-foreground"
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="text-sm font-medium text-foreground">
                Category
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(value: any) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="mt-1 bg-input border-input-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border border-white/10 shadow-lg rounded-lg">
                  <SelectItem value="critical">🔴 Critical</SelectItem>
                  <SelectItem value="warning">🟡 Warning</SelectItem>
                  <SelectItem value="info">🔵 Info</SelectItem>
                  <SelectItem value="success">🟢 Success</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="location" className="text-sm font-medium text-foreground">
                Location *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Mumbai, Maharashtra, India"
                className="mt-1 bg-input border-input-border text-foreground"
              />
            </div>
            
            <div>
              <Label htmlFor="severity" className="text-sm font-medium text-foreground">
                Severity Level: {Math.round(formData.severity * 100)}%
              </Label>
              <input
                type="range"
                id="severity"
                min="0.1"
                max="1"
                step="0.1"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: parseFloat(e.target.value) })}
                className="mt-2 w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the emergency situation in detail..."
                className="mt-1 bg-input border-input-border text-foreground resize-none"
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-alert hover:scale-105 transition-transform"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Alert
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};