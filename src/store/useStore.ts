import { create } from 'zustand';
import { Pet, Vaccine, MedicalRecord, Medication, Document, Contact, User } from '../types';
import { db, auth } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface AppState {
  user: User | null;
  pets: Pet[];
  vaccines: Vaccine[];
  medicalRecords: MedicalRecord[];
  medications: Medication[];
  documents: Document[];
  contacts: Contact[];
  
  setUser: (user: User | null) => void;
  
  // Setters for listeners
  setPets: (pets: Pet[]) => void;
  setVaccines: (vaccines: Vaccine[]) => void;
  setMedicalRecords: (records: MedicalRecord[]) => void;
  setMedications: (medications: Medication[]) => void;
  setDocuments: (documents: Document[]) => void;
  setContacts: (contacts: Contact[]) => void;
  
  // Async actions
  addPet: (pet: Pet) => Promise<void>;
  updatePet: (pet: Pet) => Promise<void>;
  deletePet: (id: string) => Promise<void>;

  addVaccine: (vaccine: Vaccine) => Promise<void>;
  updateVaccine: (vaccine: Vaccine) => Promise<void>;
  deleteVaccine: (id: string) => Promise<void>;
  
  addMedicalRecord: (record: MedicalRecord) => Promise<void>;
  updateMedicalRecord: (record: MedicalRecord) => Promise<void>;
  deleteMedicalRecord: (id: string) => Promise<void>;

  addMedication: (medication: Medication) => Promise<void>;
  updateMedication: (medication: Medication) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;

  addDocument: (document: Document) => Promise<void>;
  updateDocument: (document: Document) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;

  addContact: (contact: Contact) => Promise<void>;
  updateContact: (contact: Contact) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

function sanitizeData<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data };
  for (const key in sanitized) {
    if (sanitized[key] === undefined || Number.isNaN(sanitized[key]) || sanitized[key] === '') {
      delete sanitized[key];
    }
  }
  return sanitized;
}

export const useStore = create<AppState>()((set, get) => ({
  user: null,
  pets: [],
  vaccines: [],
  medicalRecords: [],
  medications: [],
  documents: [],
  contacts: [],

  setUser: (user) => set({ user }),

  setPets: (pets) => set({ pets }),
  setVaccines: (vaccines) => set({ vaccines }),
  setMedicalRecords: (medicalRecords) => set({ medicalRecords }),
  setMedications: (medications) => set({ medications }),
  setDocuments: (documents) => set({ documents }),
  setContacts: (contacts) => set({ contacts }),

  addPet: async (pet) => {
    const state = get();
    if (!state.user) return;
    const newPet = sanitizeData({ ...pet, userId: state.user.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    try {
      await setDoc(doc(db, 'pets', newPet.id), newPet);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `pets/${newPet.id}`);
    }
  },
  updatePet: async (pet) => {
    const updated = sanitizeData({ ...pet, updatedAt: new Date().toISOString() });
    try {
      await updateDoc(doc(db, 'pets', pet.id), updated as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `pets/${pet.id}`);
    }
  },
  deletePet: async (id) => {
    try {
      await deleteDoc(doc(db, 'pets', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `pets/${id}`);
    }
  },

  addVaccine: async (vaccine) => {
    const state = get();
    if (!state.user) return;
    const newVaccine = sanitizeData({ ...vaccine, userId: state.user.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    try {
      await setDoc(doc(db, 'vaccines', newVaccine.id), newVaccine);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `vaccines/${newVaccine.id}`);
    }
  },
  updateVaccine: async (vaccine) => {
    const updated = sanitizeData({ ...vaccine, updatedAt: new Date().toISOString() });
    try {
      await updateDoc(doc(db, 'vaccines', vaccine.id), updated as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `vaccines/${vaccine.id}`);
    }
  },
  deleteVaccine: async (id) => {
    try {
      await deleteDoc(doc(db, 'vaccines', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `vaccines/${id}`);
    }
  },
  
  addMedicalRecord: async (record) => {
    const state = get();
    if (!state.user) return;
    const newRecord = sanitizeData({ ...record, userId: state.user.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    try {
      await setDoc(doc(db, 'medicalRecords', newRecord.id), newRecord);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `medicalRecords/${newRecord.id}`);
    }
  },
  updateMedicalRecord: async (record) => {
    const updated = sanitizeData({ ...record, updatedAt: new Date().toISOString() });
    try {
      await updateDoc(doc(db, 'medicalRecords', record.id), updated as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `medicalRecords/${record.id}`);
    }
  },
  deleteMedicalRecord: async (id) => {
    try {
      await deleteDoc(doc(db, 'medicalRecords', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `medicalRecords/${id}`);
    }
  },

  addMedication: async (medication) => {
    const state = get();
    if (!state.user) return;
    const newMedication = sanitizeData({ ...medication, userId: state.user.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    try {
      await setDoc(doc(db, 'medications', newMedication.id), newMedication);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `medications/${newMedication.id}`);
    }
  },
  updateMedication: async (medication) => {
    const updated = sanitizeData({ ...medication, updatedAt: new Date().toISOString() });
    try {
      await updateDoc(doc(db, 'medications', medication.id), updated as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `medications/${medication.id}`);
    }
  },
  deleteMedication: async (id) => {
    try {
      await deleteDoc(doc(db, 'medications', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `medications/${id}`);
    }
  },

  addDocument: async (document) => {
    const state = get();
    if (!state.user) return;
    const newDocument = sanitizeData({ ...document, userId: state.user.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    try {
      await setDoc(doc(db, 'documents', newDocument.id), newDocument);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `documents/${newDocument.id}`);
    }
  },
  updateDocument: async (document) => {
    const updated = sanitizeData({ ...document, updatedAt: new Date().toISOString() });
    try {
      await updateDoc(doc(db, 'documents', document.id), updated as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `documents/${document.id}`);
    }
  },
  deleteDocument: async (id) => {
    try {
      await deleteDoc(doc(db, 'documents', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `documents/${id}`);
    }
  },

  addContact: async (contact) => {
    const state = get();
    if (!state.user) return;
    const newContact = sanitizeData({ ...contact, userId: state.user.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    try {
      await setDoc(doc(db, 'contacts', newContact.id), newContact);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `contacts/${newContact.id}`);
    }
  },
  updateContact: async (contact) => {
    const updated = sanitizeData({ ...contact, updatedAt: new Date().toISOString() });
    try {
      await updateDoc(doc(db, 'contacts', contact.id), updated as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `contacts/${contact.id}`);
    }
  },
  deleteContact: async (id) => {
    try {
      await deleteDoc(doc(db, 'contacts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `contacts/${id}`);
    }
  }
}));

// Setup Firestore Listeners when auth state changes
export function setupFirestoreListeners(userId: string) {
  const store = useStore.getState();

  const unsubPets = onSnapshot(query(collection(db, 'pets'), where('userId', '==', userId)), 
    (snap) => store.setPets(snap.docs.map(d => d.data() as Pet)), 
    (err) => handleFirestoreError(err, OperationType.LIST, 'pets')
  );

  const unsubVaccines = onSnapshot(query(collection(db, 'vaccines'), where('userId', '==', userId)), 
    (snap) => store.setVaccines(snap.docs.map(d => d.data() as Vaccine)), 
    (err) => handleFirestoreError(err, OperationType.LIST, 'vaccines')
  );

  const unsubMedications = onSnapshot(query(collection(db, 'medications'), where('userId', '==', userId)), 
    (snap) => store.setMedications(snap.docs.map(d => d.data() as Medication)), 
    (err) => handleFirestoreError(err, OperationType.LIST, 'medications')
  );

  const unsubDocuments = onSnapshot(query(collection(db, 'documents'), where('userId', '==', userId)), 
    (snap) => store.setDocuments(snap.docs.map(d => d.data() as Document)), 
    (err) => handleFirestoreError(err, OperationType.LIST, 'documents')
  );

  const unsubContacts = onSnapshot(query(collection(db, 'contacts'), where('userId', '==', userId)), 
    (snap) => store.setContacts(snap.docs.map(d => d.data() as Contact)), 
    (err) => handleFirestoreError(err, OperationType.LIST, 'contacts')
  );
  
  const unsubMedicalRecords = onSnapshot(query(collection(db, 'medicalRecords'), where('userId', '==', userId)), 
    (snap) => store.setMedicalRecords(snap.docs.map(d => d.data() as MedicalRecord)), 
    (err) => handleFirestoreError(err, OperationType.LIST, 'medicalRecords')
  );

  return () => {
    unsubPets();
    unsubVaccines();
    unsubMedications();
    unsubDocuments();
    unsubContacts();
    unsubMedicalRecords();
  };
}
