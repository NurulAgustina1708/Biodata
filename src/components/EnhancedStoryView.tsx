
import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Heart, MessageCircle, Send, Download } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { Student } from '@/types/student';

interface EnhancedStoryViewProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export function EnhancedStoryView({
  student,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false
}: EnhancedStoryViewProps) {
  const [storyProgress, setStoryProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const STORY_DURATION = 8000; // 8 seconds
  const UPDATE_INTERVAL = 50; // 50ms intervals for smooth progress

  useEffect(() => {
    if (isOpen) {
      startStoryProgress();
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      document.body.style.overflow = ''; // Re-enable scrolling
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.body.style.overflow = ''; // Re-enable scrolling on unmount
    };
  }, [isOpen, isPaused]);

  const startStoryProgress = () => {
    setStoryProgress(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    let progress = 0;
    const increment = (UPDATE_INTERVAL / STORY_DURATION) * 100;
    
    intervalRef.current = window.setInterval(() => {
      if (!isPaused) {
        progress += increment;
        setStoryProgress(progress);
        
        if (progress >= 100) {
          clearInterval(intervalRef.current as number);
          
          // If there's a next student, go to them, otherwise close
          if (hasNext && onNext) {
            setTimeout(() => {
              onNext();
              setStoryProgress(0);
              startStoryProgress();
            }, 300);
          } else {
            setTimeout(() => {
              onClose();
            }, 300);
          }
        }
      }
    }, UPDATE_INTERVAL);
  };

  const handleDoubleTap = () => {
    setIsLiked(true);
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 1000);
  };

  // Combined hover effect to pause the story
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (hasPrevious && onPrevious) {
            onPrevious();
            setStoryProgress(0);
            startStoryProgress();
          }
          break;
        case 'ArrowRight':
          if (hasNext && onNext) {
            onNext();
            setStoryProgress(0);
            startStoryProgress();
          } else {
            onClose();
          }
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious, hasPrevious, hasNext]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Progress bar */}
        <div className="absolute top-4 left-4 right-4 h-1 bg-gray-700 rounded-full z-20 flex gap-1">
          <motion.div 
            className="h-full bg-white rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${storyProgress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
        
        {/* Story Header */}
        <div className="absolute top-8 left-0 right-0 px-4 flex items-center justify-between z-20">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src={student.foto} alt={student.nama} />
              <AvatarFallback>{student.nama.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-semibold">{student.nama}</p>
              <p className="text-white/70 text-xs">{student.nim}</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        
        {/* Story Content */}
        <div 
          className="relative w-full max-w-md aspect-[9/16] bg-gray-900"
          onDoubleClick={handleDoubleTap}
        >
          {/* Background gradient for image */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10" />
          
          {/* Main image */}
          <img 
            src={student.foto} 
            alt={student.nama}
            className="w-full h-full object-cover"
          />
          
          {/* Like animation */}
          <AnimatePresence>
            {likeAnimation && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 1, opacity: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <Heart className="h-24 w-24 fill-red-500 text-red-500 drop-shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Story info */}
          <div className="absolute bottom-20 left-4 right-4 z-10">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-white mb-2"
            >
              {student.nama}
            </motion.h2>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-1 mb-4"
            >
              <div className="text-sm text-white/90 flex items-center gap-2">
                <span className="font-semibold">Hobi:</span> {student.hobi}
              </div>
              <div className="text-sm text-white/90 flex items-center gap-2">
                <span className="font-semibold">Cita-cita:</span> {student.cita}
              </div>
            </motion.div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-black/30 backdrop-blur-sm p-4 rounded-xl"
            >
              <p className="text-white italic text-center">"{student.quote}"</p>
            </motion.div>
          </div>
          
          {/* Story interactions */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex space-x-4">
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-white hover:bg-white/20 hover:text-white"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button 
                size="icon"
                variant="ghost" 
                className="text-white hover:bg-white/20 hover:text-white"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-white hover:bg-white/20 hover:text-white"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Navigation buttons */}
        {hasPrevious && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 hover:text-white z-20"
            onClick={onPrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}
        
        {hasNext && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 hover:text-white z-20"
            onClick={onNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
