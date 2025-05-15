
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Student } from "@/types/student";
import { 
  CalendarIcon, 
  HeartIcon, 
  StarIcon, 
  RefreshCcw, 
  Instagram, 
  Linkedin, 
  Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface StudentCardProps {
  student: Student;
  delay?: number;
  allStudents?: Student[];
  currentIndex?: number;
}

export const StudentCard = ({ 
  student, 
  delay = 0, 
  allStudents = [], 
  currentIndex = 0 
}: StudentCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const openProfileDialog = () => {
    setIsProfileOpen(true);
  };

  const closeProfileDialog = () => {
    setIsProfileOpen(false);
  };

  const MotionCard = motion(Card);

  return (
    <>
      <div 
        className="perspective-1000 h-[450px]" 
        data-aos="fade-up" 
        data-aos-delay={delay}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MotionCard 
          className={`relative h-full w-[300px] transition-all duration-500 transform-style-3d hover:shadow-xl ${
            isFlipped ? "rotate-y-180" : ""
          } hover:-translate-y-2 group`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay * 0.001 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Front of card */}
          <div className="absolute inset-0 backface-hidden">
            <div 
              className="h-64 overflow-hidden rounded-t-lg cursor-pointer"
              onClick={openProfileDialog}
            >
              <div className="relative w-[300px] h-[400px] overflow-hidden">
                <img 
                  src={student.foto} 
                  alt={student.nama} 
                  className="w-full h-full object-cover  transition-transform duration-500 group-hover:scale-105"
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 flex items-end justify-center pb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-white text-sm font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                    Lihat Profil
                  </span>
                </motion.div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">{student.nama}</h3>
                <Avatar className="h-8 w-8 border-2 border-primary">
                  <AvatarImage src={student.foto} alt={student.nama} />
                  <AvatarFallback>{student.nama.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{student.nim}</p>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-pink-500" />
                  {student.ttl}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <HeartIcon className="h-4 w-4 text-pink-500" />
                  {student.hobi}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <StarIcon className="h-4 w-4 text-pink-500" />
                  {student.cita}
                </p>
              </div>
            </CardContent>
          </div>

          {/* Back of card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-lg p-6 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="quote-mark text-4xl mb-2 opacity-50">"</div>
              <p className="text-lg italic mb-6 font-medium">{student.quote}</p>
              <div className="quote-mark text-4xl mb-4 opacity-50">"</div>
              
              <h3 className="text-xl font-semibold mb-6">{student.nama}</h3>
              
              <div className="flex justify-center space-x-4 mb-8">
                <motion.a 
                  href="#" 
                  className="bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors"
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Instagram className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors"
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Linkedin className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors"
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Github className="h-5 w-5" />
                </motion.a>
              </div>
              
              <div className="mt-4 pb-2">
                <Button variant="outline" size="sm" onClick={toggleFlip} className="bg-transparent border-white hover:bg-white/20">
                  <RefreshCcw className="h-3 w-3 mr-2" /> Kembali
                </Button>
              </div>
            </div>
          </div>
        </MotionCard>
      </div>

      {/* Student Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
          <div className="relative w-full h-56">
            <img
              src={student.foto}
              alt={student.nama}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            <div className="absolute bottom-4 left-6 flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
                <AvatarImage src={student.foto} alt={student.nama} />
                <AvatarFallback className="text-2xl">{student.nama.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-md">{student.nama}</h2>
                <p className="text-white/90 drop-shadow-md">{student.nim}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Biodata</h3>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CalendarIcon className="h-5 w-5 text-pink-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Tanggal Lahir</p>
                      <p className="text-muted-foreground">{student.ttl}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <HeartIcon className="h-5 w-5 text-pink-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Hobi</p>
                      <p className="text-muted-foreground">{student.hobi}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <StarIcon className="h-5 w-5 text-pink-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Cita-cita</p>
                      <p className="text-muted-foreground">{student.cita}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Motto Hidup</h3>
                <div className="bg-muted/50 p-4 rounded-lg italic text-center">
                  <p className="quote-mark text-2xl opacity-50">"</p>
                  <p className="my-2">{student.quote}</p>
                  <p className="quote-mark text-2xl opacity-50">"</p>
                </div>
                
                <h3 className="text-lg font-semibold border-b pb-2 mt-6">Media Sosial</h3>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Github className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="px-6 pb-6">
            <Button 
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              onClick={closeProfileDialog}
            >
              Tutup Profil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
