import { db } from '@/config/firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs, updateDoc, doc, DocumentData } from 'firebase/firestore';

export interface BookingDetails {
  brands: string[];
  issues: string[];
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    floorUnit: string;
    blockStreet: string;
    postalCode: string;
    condoName?: string;
    lobbyTower?: string;
    specialInstructions?: string;
  };
  scheduledDateTime: Date;
  scheduledTimeSlot: string;
  selectedService: {
    id: string;
    title: string;
    price: number;
    duration: string;
    description?: string;
  };
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: string;
  otherIssue?: string;
  isAMC?: boolean;
}

export const createBooking = async (bookingDetails: BookingDetails): Promise<string> => {
  try {
    const bookingCollection = collection(db, 'bookings');
    const docRef = await addDoc(bookingCollection, {
      ...bookingDetails,
      scheduledDateTime: bookingDetails.scheduledDateTime.toISOString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
};

export const fetchLastBooking = async (userId: string): Promise<BookingDetails | null> => {
  try {
    const bookingCollection = collection(db, 'bookings');
    const q = query(
      bookingCollection,
      where('customerInfo.email', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return doc.data() as BookingDetails;
  } catch (error) {
    console.error('Error fetching last booking:', error);
    throw new Error('Failed to fetch last booking');
  }
};

export const updateBooking = async (bookingId: string, updateData: Partial<BookingDetails>): Promise<void> => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    throw new Error('Failed to update booking');
  }
};

export type { BookingDetails };
