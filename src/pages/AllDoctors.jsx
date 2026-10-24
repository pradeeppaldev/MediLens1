import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Plus, Phone, MapPin, Calendar, User, Clock, Trash2, Mail, ExternalLink, ShieldCheck, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import AddEventModal from '../components/AddEventModal';
import { INDIAN_DOCTORS } from '../data/indianClinicalData';
import { toast } from 'sonner';

const AllDoctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    type: 'Cardiologist',
    phone: '',
    address: '',
    email: '',
    notes: ''
  });

  const specialties = [
    'Cardiologist',
    'General Physician',
    'Neurologist',
    'Endocrinologist',
    'Dermatologist',
    'Orthopedic Surgeon',
    'Pediatrician',
    'Psychiatrist',
    'Oncologist',
    'Pulmonologist',
    'Other Specialist'
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!user) {
        setDoctors(INDIAN_DOCTORS);
        setLoading(false);
        return;
      }

      try {
        const doctorsRef = collection(db, `users/${user.uid}/doctors`);
        const snapshot = await getDocs(doctorsRef);
        const doctorsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (doctorsData.length > 0) {
          setDoctors(doctorsData);
        } else {
          setDoctors(INDIAN_DOCTORS);
        }
      } catch (error) {
        console.warn('Loading Indian doctors directory fallback:', error?.message);
        setDoctors(INDIAN_DOCTORS);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [user]);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.type) {
      toast.error('Doctor name and specialty are required');
      return;
    }

    try {
      if (user && !user.isDemo) {
        const doctorsRef = collection(db, `users/${user.uid}/doctors`);
        const docRef = await addDoc(doctorsRef, {
          ...newDoctor,
          createdAt: new Date()
        });
        setDoctors(prev => [{ id: docRef.id, ...newDoctor }, ...prev]);
      } else {
        const localDoc = { id: `doc_${Date.now()}`, ...newDoctor, rating: 4.8 };
        setDoctors(prev => [localDoc, ...prev]);
      }

      setNewDoctor({
        name: '',
        type: 'Cardiologist',
        phone: '',
        address: '',
        email: '',
        notes: ''
      });
      setShowAddModal(false);
      toast.success('Doctor added to clinical care team');
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast.error('Failed to save doctor profile');
    }
  };

  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;

    try {
      if (user && !user.isDemo && doctorToDelete.id?.length > 10) {
        const doctorRef = doc(db, `users/${user.uid}/doctors`, doctorToDelete.id);
        await deleteDoc(doctorRef);
      }
      setDoctors(prev => prev.filter(d => d.id !== doctorToDelete.id));
      toast.success(`${doctorToDelete.name} removed from your directory`);
      setShowDeleteModal(false);
      setDoctorToDelete(null);
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.error('Failed to remove doctor');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Clinical Care Providers & Specialists
            </h1>
            <Badge variant="outline" className="font-bold text-xs bg-primary/5 text-primary">
              {doctors.length} Verified Doctors
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Directory of your consulting physicians across AIIMS, Apollo, Fortis, Medanta, and Manipal Hospitals.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          size="sm"
          className="rounded-xl text-xs font-bold gap-1.5 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Add Care Provider
        </Button>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 rounded-2xl bg-muted/40 animate-pulse border border-border/40" />
          ))}
        </div>
      ) : doctors.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="group flex flex-col justify-between border-border/80 hover:border-primary/50 shadow-xs hover:shadow-md transition-[transform,box-shadow,border-color] duration-160 ease-emil-out"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold transition-transform duration-140 group-hover:scale-105 shrink-0">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-foreground">
                        {doctor.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] font-bold">
                          {doctor.type}
                        </Badge>
                        {doctor.rating && (
                          <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            {doctor.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDoctorToDelete(doctor);
                      setShowDeleteModal(true);
                    }}
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    title="Delete Provider"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-2.5 pt-0 text-xs">
                {doctor.hospital && (
                  <p className="font-semibold text-foreground text-xs">
                    {doctor.hospital}
                  </p>
                )}
                {doctor.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                    <a href={`tel:${doctor.phone}`} className="hover:text-foreground tabular-numbers transition-colors font-medium">
                      {doctor.phone}
                    </a>
                  </div>
                )}
                {doctor.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    <a href={`mailto:${doctor.email}`} className="hover:text-foreground truncate transition-colors font-medium">
                      {doctor.email}
                    </a>
                  </div>
                )}
                {doctor.address && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{doctor.address}</span>
                  </div>
                )}
                {doctor.notes && (
                  <p className="p-2.5 rounded-lg bg-muted/40 border border-border/50 text-muted-foreground text-[11px] leading-relaxed mt-2 line-clamp-2">
                    {doctor.notes}
                  </p>
                )}
              </CardContent>

              <CardFooter className="pt-3 border-t border-border/50 flex items-center justify-between">
                {doctor.consultationFee && (
                  <span className="text-xs font-bold text-foreground tabular-numbers">
                    Fee: {doctor.consultationFee}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setShowScheduleModal(true);
                  }}
                  className="rounded-xl text-xs font-bold h-8 gap-1 ml-auto"
                >
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Book Appointment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border/60 max-w-lg mx-auto">
          <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-foreground">No physicians recorded yet</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Add your primary care doctor, cardiologist, or consulting specialists to keep contact information handy.
          </p>
          <Button size="sm" onClick={() => setShowAddModal(true)} className="rounded-xl text-xs font-bold">
            <Plus className="h-4 w-4 mr-1.5" />
            Add First Provider
          </Button>
        </div>
      )}

      {/* Add Doctor Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add Care Provider</DialogTitle>
            <DialogDescription className="text-xs">
              Save contact information for an Indian consulting physician or specialist.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDoctor} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="docName" className="text-xs font-semibold">Doctor Full Name *</Label>
              <Input
                id="docName"
                placeholder="e.g. Dr. Rajesh Sharma, MD"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor(prev => ({ ...prev, name: e.target.value }))}
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="specialty" className="text-xs font-semibold">Specialty *</Label>
              <Select
                value={newDoctor.type}
                onValueChange={(val) => setNewDoctor(prev => ({ ...prev, type: val }))}
              >
                <SelectTrigger className="h-10 text-xs rounded-xl">
                  <SelectValue placeholder="Select Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map(spec => (
                    <SelectItem key={spec} value={spec} className="text-xs">
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="docPhone" className="text-xs font-semibold">Phone Number</Label>
                <Input
                  id="docPhone"
                  placeholder="+91 98765 43210"
                  value={newDoctor.phone}
                  onChange={(e) => setNewDoctor(prev => ({ ...prev, phone: e.target.value }))}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="docEmail" className="text-xs font-semibold">Email</Label>
                <Input
                  id="docEmail"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor(prev => ({ ...prev, email: e.target.value }))}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="docAddress" className="text-xs font-semibold">Hospital / Clinic Address</Label>
              <Input
                id="docAddress"
                placeholder="e.g. AIIMS Hospital, Ansari Nagar, New Delhi"
                value={newDoctor.address}
                onChange={(e) => setNewDoctor(prev => ({ ...prev, address: e.target.value }))}
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="docNotes" className="text-xs font-semibold">Notes / Consultation Fee</Label>
              <Textarea
                id="docNotes"
                placeholder="Consultation hours, clinic room number, fee in INR..."
                value={newDoctor.notes}
                onChange={(e) => setNewDoctor(prev => ({ ...prev, notes: e.target.value }))}
                className="text-xs rounded-xl min-h-[60px]"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="rounded-xl text-xs font-bold">
                Save Care Provider
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive">
              Remove Provider?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to remove <strong className="text-foreground">{doctorToDelete?.name}</strong> from your doctor directory?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
              className="rounded-xl text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteDoctor}
              className="rounded-xl text-xs font-bold"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      {selectedDoctor && (
        <AddEventModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          defaultValues={{
            title: `Appointment with ${selectedDoctor.name}`,
            type: 'appointment',
            notes: `Clinic: ${selectedDoctor.address || selectedDoctor.hospital || ''}. Contact: ${selectedDoctor.phone || ''}`
          }}
          onEventAdded={() => {
            setShowScheduleModal(false);
            toast.success(`Consultation booked with ${selectedDoctor.name}`);
          }}
        />
      )}
    </div>
  );
};

export default AllDoctors;
