import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Pill, Plus, Calendar, Clock, Trash2, Search, Info, ExternalLink, ShieldCheck, CheckCircle2, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { INDIAN_MEDICINES } from '../data/indianClinicalData';
import { toast } from 'sonner';

const AllMedicines = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      if (!user) {
        setMedicines(INDIAN_MEDICINES);
        setLoading(false);
        return;
      }

      try {
        const medicinesRef = collection(db, `users/${user.uid}/medicines`);
        const snapshot = await getDocs(medicinesRef);
        const medicinesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (medicinesData.length > 0) {
          setMedicines(medicinesData);
        } else {
          setMedicines(INDIAN_MEDICINES);
        }
      } catch (error) {
        console.warn('Loading Indian medications fallback:', error?.message);
        setMedicines(INDIAN_MEDICINES);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [user]);

  const handleDeleteMedicine = async () => {
    if (!medicineToDelete) return;

    try {
      if (user && !user.isDemo && medicineToDelete.id?.length > 10) {
        const medicineRef = doc(db, `users/${user.uid}/medicines`, medicineToDelete.id);
        await deleteDoc(medicineRef);
      }
      setMedicines(prev => prev.filter(m => m.id !== medicineToDelete.id));
      toast.success(`${medicineToDelete.name} removed from your schedule`);
      setShowDeleteModal(false);
      setMedicineToDelete(null);
    } catch (error) {
      console.error('Error deleting medicine:', error);
      toast.error('Failed to delete medication');
    }
  };

  const filteredMedicines = medicines.filter(m =>
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.dosage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.instructions?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              All Medications & Prescriptions
            </h1>
            <Badge variant="outline" className="font-bold text-xs bg-primary/5 text-primary">
              {filteredMedicines.length} Active Regimens
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Complete list of active Indian prescriptions, dosages, timing, and pill inventory.
          </p>
        </div>
        <Link to="/medications/add">
          <Button size="sm" className="rounded-xl text-xs font-bold gap-1.5 shadow-xs">
            <Plus className="h-4 w-4" />
            Add Medication
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by medicine name, dosage, or instructions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-11 rounded-xl text-sm"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-2xl bg-muted/40 animate-pulse border border-border/40" />
          ))}
        </div>
      ) : filteredMedicines.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredMedicines.map((medicine) => (
            <Card
              key={medicine.id}
              className="group relative flex flex-col justify-between border-border/80 hover:border-primary/50 shadow-xs hover:shadow-md transition-[transform,box-shadow,border-color] duration-160 ease-emil-out"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold transition-transform duration-140 group-hover:scale-105 shrink-0">
                      <Pill className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-foreground">
                        {medicine.name}
                      </CardTitle>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-primary tabular-numbers">
                          {medicine.dosage}
                        </span>
                        {medicine.brand && (
                          <span className="text-[11px] text-muted-foreground">
                            • {medicine.brand}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setMedicineToDelete(medicine);
                      setShowDeleteModal(true);
                    }}
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    title="Delete Medication"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="font-semibold text-foreground">{medicine.frequency || 'Once daily'}</span>
                  {medicine.scheduleTimes && medicine.scheduleTimes.length > 0 && (
                    <div className="flex flex-wrap gap-1 ml-auto">
                      {medicine.scheduleTimes.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-muted text-foreground font-bold tabular-numbers text-[10px] border border-border/40">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {medicine.instructions && (
                  <p className="p-2.5 rounded-lg bg-muted/40 border border-border/50 text-muted-foreground text-xs leading-relaxed">
                    <span className="font-bold text-foreground">Directions:</span> {medicine.instructions}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                  {medicine.cost && (
                    <span className="font-bold text-foreground tabular-numbers">
                      ₹{medicine.cost} <span className="text-[11px] font-normal text-muted-foreground">/ pack</span>
                    </span>
                  )}
                  {medicine.remainingPills && (
                    <span className="text-[11px] text-muted-foreground tabular-numbers">
                      Inventory: <strong className="text-foreground">{medicine.remainingPills}</strong> / {medicine.totalPills || 30} tabs
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t border-border/50 flex justify-between items-center">
                <Badge variant="success" className="text-[11px] font-bold">
                  Active Regimen
                </Badge>
                <Link to={`/medications/${medicine.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 text-xs font-bold gap-1 text-primary hover:text-primary hover:bg-primary/10">
                    <Info className="h-3.5 w-3.5" />
                    Monograph
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 border-dashed border-2">
          <CardContent className="space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
              <Pill className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">No medications match your search</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Try searching for another active ingredient or add a new prescription schedule.
              </p>
            </div>
            <Link to="/medications/add">
              <Button size="sm" className="rounded-xl text-xs font-bold">
                <Plus className="h-4 w-4 mr-1.5" />
                Add Medication
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive">
              Remove Medication?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to remove <strong className="text-foreground">{medicineToDelete?.name}</strong> from your active prescriptions?
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
              onClick={handleDeleteMedicine}
              className="rounded-xl text-xs font-bold"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllMedicines;
