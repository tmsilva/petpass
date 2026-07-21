export type PetSpecies = 'Dog' | 'Cat' | 'Bird' | 'Other';
export type PetGender = 'Male' | 'Female';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  gender: PetGender;
  color: string;
  weight: number; // in kg
  birthDate: string;
  microchip?: string;
  registryNumber?: string;
  licenseNumber?: string;
  isNeutered: boolean;
  allergies?: string;
  notes?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface Vaccine {
  id: string;
  petId: string;
  name: string;
  date: string;
  nextDueDate?: string;
  veterinarian?: string;
  clinic?: string;
  manufacturer?: string;
  batch?: string;
  photoUrl?: string;
  pdfUrl?: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  type: 'Consultation' | 'Surgery' | 'Hospitalization' | 'Exam' | 'Other';
  date: string;
  diagnosis?: string;
  prescription?: string;
  weight?: number;
  temperature?: number;
  notes?: string;
  pdfUrl?: string;
  photoUrl?: string;
}

export interface Medication {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  type: 'General' | 'Dewormer' | 'FleaTick';
}

export interface Document {
  id: string;
  petId: string;
  name: string;
  type: 'RG' | 'Vaccine Card' | 'Other';
  dateAdded: string;
  fileUrl: string;
}

export interface Contact {
  id: string;
  name: string;
  type: 'Veterinarian' | 'Clinic' | 'Hospital' | 'PetShop' | 'PetSitter' | 'Kennel' | 'Hotel';
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
}
