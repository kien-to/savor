import { API_URL } from '../config';
import { getAuth } from 'firebase/auth';
import firebase from '../config/firebase';

export const paymentService = {
  async createPaymentIntent(storeId: string, quantity: number, totalAmount: number, paymentMethod: string, pickupTime: string) {
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
        pickupTime
        }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    return {
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId
    };
  },

  async confirmPayAtStore(paymentIntentId: string) {
    const currentUser = getAuth(firebase).currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const idToken = await currentUser.getIdToken();
    
    const response = await fetch(`${API_URL}/api/payment/confirm-pay-at-store`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        paymentIntentId,
        paymentMethod: 'Pay at Store'
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error };
    }

    return { error: null };
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
      const error = await response.json();
      return { error };
    }

    return { error: null };
  }
}; 