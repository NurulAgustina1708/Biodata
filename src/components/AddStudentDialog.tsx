import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Student } from "@/types/student";
import { Upload, Camera, X, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import supabase from "@/lib/supabse";

interface AddStudentDialogProps {
  children: React.ReactNode;
  onAddStudent: (student: Student) => void;
}

export function AddStudentDialog({
  children,
  onAddStudent,
}: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    gender: "",
    ttl: "",
    hobi: "",
    cita: "",
    quote: "",
    foto: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const totalSteps = 3;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenderChange = (value: string) => {
    setFormData({
      ...formData,
      gender: value,
    });
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  let uploadedImagePath = "";

  if (photo) {
    try {
      const formData = new FormData();
      formData.append("file", photo);
      formData.append("upload_preset", "DataKelas"); // Ganti dengan upload preset unsigned kamu di Cloudinary

      // Kirim POST ke Cloudinary upload endpoint
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dn91x9r7h/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Gagal upload ke Cloudinary");
      }

      const data = await response.json();
      uploadedImagePath = data.secure_url; 
      console.log("URL foto Cloudinary:", uploadedImagePath);
    } catch (error) {
      console.error("Upload gagal:", error);
      alert("Gagal upload foto ke Cloudinary.");
      setIsSubmitting(false);
      return;
    }
  }

  const newStudent: Omit<Student, "id"> = {
    ...formData,
    foto: uploadedImagePath,
    quote: formData.quote || "Hidup adalah perjalanan, bukan tujuan.",
  };

  const { error } = await supabase.from("datakelas").insert([newStudent]);

  if (error) {
    console.error("Gagal menyimpan ke Supabase:", error);
    setIsSubmitting(false);
    return;
  }

  onAddStudent({ ...newStudent, id: Date.now() });
  setIsSubmitting(false);
  setFormSubmitted(true);

  setTimeout(() => {
    resetForm();
    setOpen(false);
    setFormSubmitted(false);
  }, 1500);
};


  const resetForm = () => {
    setFormData({
      nama: "",
      nim: "",
      gender: "",
      ttl: "",
      hobi: "",
      cita: "",
      quote: "",
      foto: "",
    });
    setPreviewUrl("");
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.nama && formData.nim && formData.gender;
    } else if (currentStep === 2) {
      return formData.ttl && formData.hobi && formData.cita;
    }
    return true;
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTimeout(() => {
        resetForm();
      }, 300);
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[95vh] overflow-y-auto bg-card rounded-xl border-0 shadow-2xl p-0">
        {!formSubmitted ? (
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-t-xl overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-purple-500"
                initial={{
                  width: `${((currentStep - 1) / totalSteps) * 100}%`,
                }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>

            <div className="pt-6">
              <DialogHeader className="px-6">
                <DialogTitle className="text-center text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  {currentStep === 1 && "Informasi Dasar"}
                  {currentStep === 2 && "Detail Personal"}
                  {currentStep === 3 && "Foto & Motto"}
                </DialogTitle>
                <p className="text-center text-sm text-muted-foreground mt-1">
                  Langkah {currentStep} dari {totalSteps}
                </p>
              </DialogHeader>

              <form onSubmit={(e) => e.preventDefault()} className="mt-4">
                <div className="px-6">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="grid gap-2">
                          <Label htmlFor="nama" className="text-sm font-medium">
                            Nama Lengkap
                          </Label>
                          <Input
                            id="nama"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            placeholder="Masukkan nama lengkap"
                            className="focus-visible:ring-primary"
                            autoFocus
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="nim" className="text-sm font-medium">
                            NIM
                          </Label>
                          <Input
                            id="nim"
                            name="nim"
                            value={formData.nim}
                            onChange={handleChange}
                            placeholder="Masukkan NIM"
                            className="focus-visible:ring-primary"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label
                            htmlFor="gender"
                            className="text-sm font-medium"
                          >
                            Jenis Kelamin
                          </Label>
                          <Select
                            value={formData.gender}
                            onValueChange={handleGenderChange}
                          >
                            <SelectTrigger className="focus:ring-primary">
                              <SelectValue placeholder="Pilih jenis kelamin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="female">Perempuan</SelectItem>
                              <SelectItem value="male">Laki-laki</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="grid gap-2">
                          <Label htmlFor="ttl" className="text-sm font-medium">
                            Tempat, Tanggal Lahir
                          </Label>
                          <Input
                            id="ttl"
                            name="ttl"
                            value={formData.ttl}
                            onChange={handleChange}
                            placeholder="Contoh: Banda Aceh, 1 Januari 2000"
                            className="focus-visible:ring-primary"
                            autoFocus
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="hobi" className="text-sm font-medium">
                            Hobi
                          </Label>
                          <Input
                            id="hobi"
                            name="hobi"
                            value={formData.hobi}
                            onChange={handleChange}
                            placeholder="Masukkan hobi"
                            className="focus-visible:ring-primary"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="cita" className="text-sm font-medium">
                            Cita-cita
                          </Label>
                          <Input
                            id="cita"
                            name="cita"
                            value={formData.cita}
                            onChange={handleChange}
                            placeholder="Masukkan cita-cita"
                            className="focus-visible:ring-primary"
                          />
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="grid gap-2">
                          <Label
                            htmlFor="quote"
                            className="text-sm font-medium"
                          >
                            Quote/Motto Hidup
                          </Label>
                          <Textarea
                            id="quote"
                            name="quote"
                            value={formData.quote}
                            onChange={handleChange}
                            placeholder="Masukkan quote favorit"
                            className="focus-visible:ring-primary resize-none min-h-[100px]"
                            autoFocus
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label className="text-sm font-medium">Foto</Label>
                          <div
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors relative group"
                            onClick={() =>
                              document.getElementById("foto")?.click()
                            }
                          >
                            <input
                              type="file"
                              id="foto"
                              name="foto"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                if (
                                  e.target.files &&
                                  e.target.files.length > 0
                                ) {
                                  const file = e.target.files[0];
                                  setPhoto(e.target.files[0]);
                                  setPreviewUrl(URL.createObjectURL(file));
                                }
                              }}
                            />

                            {previewUrl ? (
                              <div className="relative">
                                <img
                                  src={previewUrl}
                                  alt="Preview"
                                  className="w-32 h-32 object-cover rounded-lg mx-auto"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                  <Camera className="h-8 w-8 text-white opacity-80" />
                                </div>
                                <button
                                  type="button"
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewUrl("");
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">
                                  Pilih foto atau seret ke sini
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="px-6 py-4 mt-4 bg-muted/50 flex justify-between items-center border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Sebelumnya
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                    >
                      Selanjutnya
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="relative"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                          Menyimpan
                        </div>
                      ) : (
                        "Simpan"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 px-6"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Berhasil Ditambahkan!
            </h3>
            <p className="text-center text-muted-foreground mb-6">
              Data mahasiswa berhasil disimpan ke dalam sistem
            </p>
            <DialogClose asChild>
              <Button>Selesai</Button>
            </DialogClose>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
