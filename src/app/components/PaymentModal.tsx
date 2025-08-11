"use client";
import { useState } from 'react';
import Image from 'next/image';
import { CartItem } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  cartItems: CartItem[];
  onPaymentSuccess: () => void;
}

type PaymentMethod = 'creditcard' | 'paypal' | 'applepay' | 'googlepay' | 'bancontact' | null;

type Step = 'payment-method' | 'personal-info' | 'summary';

export default function PaymentModal({ isOpen, onClose, total, cartItems }: PaymentModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('payment-method');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setPaymentError(null);
    
    // Si PayPal ou Bancontact, aller directement au résumé
    if (method === 'paypal' || method === 'bancontact') {
      setCurrentStep('summary');
    } else {
      setCurrentStep('personal-info');
    }
  };

  const goBack = () => {
    if (currentStep === 'personal-info') {
      setCurrentStep('payment-method');
    } else if (currentStep === 'summary') {
      if (selectedPaymentMethod === 'paypal' || selectedPaymentMethod === 'bancontact') {
        setCurrentStep('payment-method');
      } else {
        setCurrentStep('personal-info');
      }
    }
  };

  const getRequiredFields = () => {
    switch (selectedPaymentMethod) {
      case 'creditcard':
        return ['name', 'email', 'phone', 'cardNumber', 'expiryDate', 'cvv'];
      case 'paypal':
        return [];
      case 'applepay':
        return ['name', 'email', 'phone'];
      case 'googlepay':
        return ['name', 'email', 'phone'];
      case 'bancontact':
        return [];
      default:
        return [];
    }
  };

  const handlePayment = async () => {
    const requiredFields = getRequiredFields();
    const missingFields = requiredFields.filter(field => !customerInfo[field as keyof typeof customerInfo]);
    
    if (missingFields.length > 0) {
      setPaymentError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!selectedPaymentMethod) {
      setPaymentError('Veuillez sélectionner une méthode de paiement');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const response = await fetch('/api/mollie/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          description: `Commande restaurant - ${cartItems.length} article(s)`,
          metadata: {
            customerInfo: selectedPaymentMethod === 'paypal' || selectedPaymentMethod === 'bancontact' ? {} : customerInfo,
            cartItems,
            orderDate: new Date().toISOString(),
            paymentMethod: selectedPaymentMethod
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = data.checkoutUrl;
      } else {
        setPaymentError(data.error || 'Erreur lors de la création du paiement');
      }
    } catch (error) {
      console.error('Erreur paiement:', error);
      setPaymentError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'payment-method', label: 'Méthode', active: currentStep === 'payment-method' },
      { key: 'personal-info', label: 'Infos', active: currentStep === 'personal-info' && selectedPaymentMethod !== 'paypal' && selectedPaymentMethod !== 'bancontact' },
      { key: 'summary', label: 'Résumé', active: currentStep === 'summary' }
    ].filter(step => step.key !== 'personal-info' || (selectedPaymentMethod !== 'paypal' && selectedPaymentMethod !== 'bancontact'));

    return (
      <div className="flex items-center justify-center space-x-2 mb-4">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step.active 
                ? 'bg-yellow-500 text-black' 
                : 'bg-gray-600 text-gray-300'
            }`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-1 mx-2 ${
                step.active ? 'bg-yellow-500' : 'bg-gray-600'
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderPaymentMethods = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Choisissez votre méthode de paiement</h3>
        <p className="text-gray-400 text-sm">Sélectionnez une méthode sécurisée pour finaliser votre commande</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handlePaymentMethodSelect('creditcard')}
          className="group flex flex-col items-center p-4 rounded-xl border transition-all duration-300 hover:scale-105 bg-white border-gray-300 hover:border-yellow-500"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2">
            <Image 
              src="/logoCB.png" 
              alt="Carte bancaire" 
              width={48} 
              height={48} 
              className="w-12 h-12 object-contain"
            />
          </div>
          <span className="text-xs text-center text-gray-700">Carte bancaire</span>
        </button>

        <button
          onClick={() => handlePaymentMethodSelect('bancontact')}
          className="group flex flex-col items-center p-4 rounded-xl border transition-all duration-300 hover:scale-105 bg-white border-gray-300 hover:border-yellow-500"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2">
            <Image 
              src="/logobancontact.png" 
              alt="Bancontact" 
              width={48} 
              height={48} 
              className="w-12 h-12 object-contain"
            />
          </div>
          <span className="text-xs text-center text-gray-700">Bancontact</span>
        </button>

        <button
          onClick={() => handlePaymentMethodSelect('paypal')}
          className="group flex flex-col items-center p-4 rounded-xl border transition-all duration-300 hover:scale-105 bg-white border-gray-300 hover:border-yellow-500"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2">
            <Image 
              src="/logopaypal.png" 
              alt="PayPal" 
              width={48} 
              height={48} 
              className="w-12 h-12 object-contain"
            />
          </div>
          <span className="text-xs text-center text-gray-700">PayPal</span>
        </button>

        <button
          onClick={() => handlePaymentMethodSelect('applepay')}
          className="group flex flex-col items-center p-4 rounded-xl border transition-all duration-300 hover:scale-105 bg-white border-gray-300 hover:border-yellow-500"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2">
            <Image 
              src="/logoapplepay.png" 
              alt="Apple Pay" 
              width={48} 
              height={48} 
              className="w-12 h-12 object-contain"
            />
          </div>
          <span className="text-xs text-center text-gray-700">Apple Pay</span>
        </button>

        <button
          onClick={() => handlePaymentMethodSelect('googlepay')}
          className="group flex flex-col items-center p-4 rounded-xl border transition-all duration-300 hover:scale-105 bg-white border-gray-300 hover:border-yellow-500"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2">
            <Image 
              src="/logogooglepay.png" 
              alt="Google Pay" 
              width={48} 
              height={48} 
              className="w-12 h-12 object-contain"
            />
          </div>
          <span className="text-xs text-center text-gray-700">Google Pay</span>
        </button>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Informations personnelles</h3>
        <p className="text-gray-400 text-sm">Remplissez vos informations pour continuer</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nom complet *
          </label>
          <input
            type="text"
            name="name"
            value={customerInfo.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
            placeholder="Votre nom complet"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
            placeholder="votre@email.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Téléphone *
          </label>
          <input
            type="tel"
            name="phone"
            value={customerInfo.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
            placeholder="06 12 34 56 78"
            required
          />
        </div>

        {selectedPaymentMethod === 'creditcard' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Numéro de carte *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={customerInfo.cardNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date d&apos;expiration *
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={customerInfo.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="MM/AA"
                  maxLength={5}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={customerInfo.cvv}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => setCurrentStep('summary')}
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-yellow-500/25 border border-yellow-400"
      >
        Continuer vers le résumé
      </button>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Résumé de votre commande</h3>
        <p className="text-gray-400 text-sm">Vérifiez les détails avant de procéder au paiement</p>
      </div>

      {/* Méthode de paiement sélectionnée */}
      <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Méthode de paiement :</span>
          <div className="flex items-center space-x-2">
            <Image 
              src={selectedPaymentMethod === 'creditcard' ? '/logoCB.png' : 
                   selectedPaymentMethod === 'paypal' ? '/logopaypal.png' :
                   selectedPaymentMethod === 'bancontact' ? '/logobancontact.png' :
                   selectedPaymentMethod === 'applepay' ? '/logoapplepay.png' : '/logogooglepay.png'} 
              alt={selectedPaymentMethod || ''} 
              width={24} 
              height={24} 
              className="w-6 h-6 object-contain"
            />
            <span className="text-white font-semibold">
              {selectedPaymentMethod === 'creditcard' ? 'Carte bancaire' : 
               selectedPaymentMethod === 'paypal' ? 'PayPal' :
               selectedPaymentMethod === 'bancontact' ? 'Bancontact' :
               selectedPaymentMethod === 'applepay' ? 'Apple Pay' : 'Google Pay'}
            </span>
          </div>
        </div>
      </div>

      {/* Résumé des articles */}
      <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
        <h4 className="text-white font-semibold mb-3">Articles commandés :</h4>
        <div className="space-y-2">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-600 last:border-b-0">
              <span className="text-gray-300 text-sm">{item.name} x{item.quantity}</span>
              <span className="text-white font-semibold">{(parseFloat(item.price) * item.quantity).toFixed(2)}€</span>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t-2 border-yellow-500 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-white">Total</span>
            <span className="text-2xl font-bold text-yellow-400">{total.toFixed(2)}€</span>
          </div>
        </div>
      </div>

      {/* Message d'erreur */}
      {paymentError && (
        <div className="bg-red-900/20 border border-red-600 rounded-xl p-4">
          <p className="text-red-400 text-sm flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {paymentError}
          </p>
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4">
      <div className="bg-gray-800 rounded-none md:rounded-lg w-full h-full md:w-[70%] md:max-w-4xl md:h-[90%] flex flex-col overflow-hidden">
        {/* Header avec navigation */}
        <div className="p-4 border-b border-gray-600 relative bg-gradient-to-r from-gray-800 to-gray-900">
          {/* Bouton retour */}
          {currentStep !== 'payment-method' && (
            <button
              onClick={goBack}
              className="absolute top-4 left-4 text-gray-400 hover:text-white transition-all duration-200 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-200 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center pt-8">
            <h2 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {currentStep === 'payment-method' ? 'Choisir le paiement' :
               currentStep === 'personal-info' ? 'Informations' : 'Finaliser'}
            </h2>
            {renderStepIndicator()}
          </div>
        </div>

        {/* Body avec contenu des étapes */}
        <div className="flex-1 p-4 bg-gradient-to-br from-gray-900 to-gray-800 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {currentStep === 'payment-method' && renderPaymentMethods()}
            {currentStep === 'personal-info' && renderPersonalInfo()}
            {currentStep === 'summary' && renderSummary()}
          </div>
        </div>

        {/* Footer avec boutons */}
        <div className="p-4 border-t border-gray-600 bg-gradient-to-r from-gray-800 to-gray-900">
          {currentStep === 'summary' && (
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-yellow-500/25 border border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Traitement...</span>
                </div>
              ) : (
                selectedPaymentMethod === 'paypal' ? `Payer avec PayPal ${total.toFixed(2)}€` :
                selectedPaymentMethod === 'bancontact' ? `Payer avec Bancontact ${total.toFixed(2)}€` :
                `Payer ${total.toFixed(2)}€`
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
