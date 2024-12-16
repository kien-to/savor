import { API_URL } from '../config';
import { getAuth } from 'firebase/auth';
import firebase from '../config/firebase';

export const paymentService = {
  async createPaymentIntent(storeId: string, quantity: number, totalAmount: number, paymentMethod: string) {
    const currentUser = getAuth(firebase).currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const idToken = await currentUser.getIdToken();
    
    const response = await fetch(`${API_URL}/api/payment/create-intent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storeId,
        quantity,
        totalAmount,
        paymentMethod,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return response.json();
  },

  async confirmPayment(paymentIntentId: string) {
    const currentUser = getAuth(firebase).currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const idToken = await currentUser.getIdToken();
    
    const response = await fetch(`${API_URL}/api/payment/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentIntentId }),
    });

    if (!response.ok) {
      throw new Error('Failed to confirm payment');
    }

    return response.json();
  }
}; 