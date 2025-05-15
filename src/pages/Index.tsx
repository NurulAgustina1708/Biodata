import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/ModeToggle";
import { StudentCard } from "@/components/StudentCard";
import { AddStudentDialog } from "@/components/AddStudentDialog";
import { Student } from "@/types/student";
import { Search, Plus, ArrowUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import supabase from "@/lib/supabse";

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingStudentIndex, setViewingStudentIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('datakelas')
        .select('*')
        .order('id', { ascending: true }) 

      if (error) {
        console.error('Gagal ambil data:', error.message)
      } else {
        console.log("Data berhasil di ambil");
        
        setStudents(data || [])
      }

      setIsLoading(false)
    }

    fetchStudents()
    
  }, [])
  const addStudent = (newStudent: Student) => {
    setStudents([...students, { ...newStudent, id: students.length + 1 }]);
    toast({
      title: "Sukses!",
      description: "Biodata mahasiswa berhasil ditambahkan.",
      duration: 3000,
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredStudents = students.filter((student) => {
    const matchesFilter = currentFilter === "all" || student.gender === currentFilter;
    const matchesSearch =
      student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nim.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const staggerChildrenVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <motion.header 
        className="relative bg-gradient-to-r from-primary to-purple-600 text-white py-16 md:py-24 px-6 rounded-b-3xl shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-gradient"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Biodata Mahasiswa TI-3D
          </motion.h1>
          <motion.h3 
            className="text-xl md:text-2xl font-medium opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Kelompok 7
          </motion.h3>
        </div>
        <div className="absolute -bottom-1 left-0 w-full h-16 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI4MHB4IiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTAgNTEuNzZjMzYuMjEtMi4yNSA3Ny41Ny0zLjU4IDEyNi40Mi0zLjU4IDMyMCAwIDMyMCA1NyA2NDAgNTcgMjcxLjE1IDAgMzEyLjU4LTQwLjkxIDUxMy41OC01Ny40VjBIMFoiIGZpbGwtb3BhY2l0eT0iLjMiLz48cGF0aCBkPSJNMCA5MC43MmMxNzEtMTcuNTQgMzE3LjUzLTM1LjI4IDQ3MSAwIDMzNy40NSA3Ny4xNiA0NjQtMjguMjQgODA5LTI4LjI0VjBIMFoiIGZpbGwtb3BhY2l0eT0iLjUiLz48cGF0aCBkPSJNMCAyMEMxODAgMTkuOTYgMjg1IDQ5IDUwMCA0OSA2OTggNDkgODQ1LjYzIDIxLjA5IDEyODAgMHYxNDBIMFoiLz48L2c+PC9zdmc+')] bg-no-repeat bg-bottom bg-cover"></div>
      </motion.header>

      <div className="container mx-auto px-4 py-8" ref={containerRef}>
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <AddStudentDialog onAddStudent={addStudent}>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md hover:shadow-lg transition-all">
                <Plus className="mr-2 h-4 w-4" /> Tambah Biodata
              </Button>
            </AddStudentDialog>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <ModeToggle />
          </motion.div>
        </div>

        <motion.div 
          className="max-w-lg mx-auto mb-8 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari mahasiswa berdasarkan nama atau NIM..."
            className="pl-10 rounded-full focus-within:ring-primary shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Tabs
            defaultValue="all"
            className="w-full max-w-lg mx-auto mb-12"
            onValueChange={setCurrentFilter}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white">Semua</TabsTrigger>
              <TabsTrigger value="female" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white">Perempuan</TabsTrigger>
              <TabsTrigger value="male" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white">Laki-laki</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <motion.div
          variants={staggerChildrenVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="h-96 animate-pulse">
                  <div className="h-full bg-muted/30"></div>
                </Card>
              ))}
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 ">
              {filteredStudents.map((student, index) => (
                <StudentCard 
                  key={student.id} 
                  student={student} 
                  delay={prefersReducedMotion ? 0 : index * 100}
                  allStudents={filteredStudents}
                  currentIndex={index}
                />
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tidak ada mahasiswa ditemukan</h3>
              <p className="text-muted-foreground">Coba ubah filter atau pencarian Anda</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-8 left-8 rounded-full shadow-lg transition-opacity"
              onClick={scrollToTop}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1.2
        }}
      >
        <AddStudentDialog onAddStudent={addStudent}>
          <Button 
            size="icon"
            className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </AddStudentDialog>
      </motion.div>

      <footer className="bg-card mt-20 rounded-t-3xl py-8 px-4 shadow-lg">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-2">
            &copy; 2025 TI-3D Kelompok 7 - Politeknik Negeri Lhokseumawe
          </p>
          <p className="text-sm flex items-center justify-center gap-2">
            Made with <span className="text-red-500">❤</span> by Kelompok 7
          </p>
        </div>
      </footer>

      <BackgroundEffects />
      <BackgroundParticles />
    </div>
  );
};

export default Index;
