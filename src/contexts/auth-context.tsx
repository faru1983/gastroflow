
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User, Visit, Reservation } from '@/lib/types';
import { mockUser, mockAdminUser, mockVisits, mockReservations } from '@/lib/data';

type RegisterData = {
    email: string;
    password: string;
    nombre: string;
    apellidos: string;
    celular: string;
    fechaNacimiento?: string;
    comuna?: string;
    instagram?: string;
    promociones: boolean;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  showAuthModal: (options?: { onLoginSuccess?: () => void; onRegisterSuccess?: () => void }) => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; callbackHandled: boolean }>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<{ success: boolean; callbackHandled: boolean }>;
  updateUser: (userData: Partial<User>) => void;
  // Data managed by pages now, but exposed via context for simplicity for now
  visits: Visit[];
  addVisit: (reason: string) => void;
  reservations: Reservation[];
  addReservation: (reservationData: Omit<Reservation, 'id' | 'status'>) => void;
  updateReservation: (id: string, newStatus: 'confirmada' | 'cancelada') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [onLoginSuccess, setOnLoginSuccess] = useState<(() => void) | null>(null);
  const [onRegisterSuccess, setOnRegisterSuccess] = useState<(() => void) | null>(null);

  // These should be fetched by pages, but we keep them in context for mock data simplicity
  const [visits, setVisits] = useState<Visit[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    // Simulate fetching data when user logs in
    if (user) {
      setVisits(mockVisits);
      setReservations(mockReservations);
    } else {
      setVisits([]);
      setReservations([]);
    }
  }, [user]);


  const showAuthModal = (options?: { onLoginSuccess?: () => void; onRegisterSuccess?: () => void }) => {
    if (options?.onLoginSuccess) {
      setOnLoginSuccess(() => options.onLoginSuccess);
    }
    if (options?.onRegisterSuccess) {
      setOnRegisterSuccess(() => options.onRegisterSuccess);
    }
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setOnLoginSuccess(null);
    setOnRegisterSuccess(null);
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; callbackHandled: boolean }> => {
    // Mock login logic
    return new Promise(resolve => {
      setTimeout(() => {
        let loggedInUser: User | null = null;
        if (email.toLowerCase() === 'ana.perez@example.com' && pass === 'password') {
          loggedInUser = mockUser;
        } else if (email.toLowerCase() === 'admin@admin.com' && pass === 'admin') {
          loggedInUser = mockAdminUser;
        }

        if (loggedInUser) {
          setUser(loggedInUser);
          closeAuthModal();
          if (onLoginSuccess) {
            onLoginSuccess();
            setOnLoginSuccess(null);
            resolve({ success: true, callbackHandled: true });
          } else {
            resolve({ success: true, callbackHandled: false });
          }
        } else {
          resolve({ success: false, callbackHandled: false });
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; callbackHandled: boolean }> => {
    // Mock register logic
    return new Promise(resolve => {
      setTimeout(() => {
        const { password, fechaNacimiento, ...rest } = userData;
        const formattedFechaNacimiento = fechaNacimiento ? fechaNacimiento.split('-').reverse().join('-') : undefined;

        const newUser: User = { 
          id: `u${Date.now()}`,
          ...rest,
          fechaNacimiento: formattedFechaNacimiento,
          comuna: userData.comuna || '',
          instagram: userData.instagram || '',
        };

        setUser(newUser);
        closeAuthModal();
         if (onRegisterSuccess) {
            onRegisterSuccess();
            setOnRegisterSuccess(null);
            resolve({ success: true, callbackHandled: true });
          } else {
            resolve({ success: true, callbackHandled: false });
          }
      }, 1000);
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser(prevUser => ({ ...prevUser!, ...userData }));
    }
  }

  const addVisit = (reason: string) => {
    const newVisit: Visit = {
      id: `v${visits.length + 1}`,
      date: new Date(),
      reason: reason,
    };
    setVisits(prevVisits => [newVisit, ...prevVisits]);
  };
  
  const addReservation = (reservationData: Omit<Reservation, 'id' | 'status'>) => {
    const newReservation: Reservation = {
      ...reservationData,
      id: `res-${Date.now()}`,
      status: 'pendiente',
    };
    setReservations(prev => [newReservation, ...prev]);
  };
  
  const updateReservation = (id: string, newStatus: 'confirmada' | 'cancelada') => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };


  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isAuthModalOpen, 
      showAuthModal, 
      closeAuthModal, 
      login, 
      logout,
      register,
      updateUser,
      visits,
      addVisit,
      reservations,
      addReservation,
      updateReservation,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
