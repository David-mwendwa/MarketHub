// src/components/checkout/PaymentMethod.jsx
import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CreditCard, ArrowLeft, Check } from 'lucide-react';

const PaymentMethod = ({ onBack, onSubmit }) => {
  const [savedCards] = React.useState([
    { id: '1', last4: '4242', brand: 'Visa', expMonth: 12, expYear: 25 },
    { id: '2', last4: '1881', brand: 'Mastercard', expMonth: 3, expYear: 24 }
  ]);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [useNewCard, setUseNewCard] = React.useState(false);

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        startIcon={<ArrowLeft className="h-4 w-4" />}
        className="mb-6"
      >
        Back to shipping
      </Button>

      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Payment method</h2>

      <div className="space-y-4">
        {savedCards.map((card) => (
          <div
            key={card.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedCard === card.id
                ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => {
              setSelectedCard(card.id);
              setUseNewCard(false);
            }}
          >
            <div className="flex-shrink-0 h-6 w-9 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700">
              <CreditCard className="h-4 w-4 text-gray-500" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {card.brand} ending in {card.last4}
                </p>
                {selectedCard === card.id && (
                  <Check className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Expires {String(card.expMonth).padStart(2, '0')}/{card.expYear}
              </p>
            </div>
          </div>
        ))}

        <div
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            useNewCard
              ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
          onClick={() => {
            setUseNewCard(true);
            setSelectedCard(null);
          }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 h-6 w-9 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700">
              <CreditCard className="h-4 w-4 text-gray-500" />
            </div>
            <p className="ml-4 text-sm font-medium text-gray-900 dark:text-white">
              Use a new payment method
            </p>
            {useNewCard && (
              <Check className="ml-auto h-5 w-5 text-primary-600 dark:text-primary-400" />
            )}
          </div>
        </div>

        {useNewCard && (
          <div className="mt-6 space-y-4">
            <div>
              <Input
                label="Card number"
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                autoComplete="cc-number"
              />
            </div>
            <div>
              <Input
                label="Name on card"
                id="cardName"
                placeholder="John Smith"
                autoComplete="cc-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Expiration date (MM/YY)"
                  id="cardExpiry"
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                />
              </div>
              <div>
                <Input
                  label="CVC"
                  id="cardCvc"
                  placeholder="CVC"
                  autoComplete="cc-csc"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          endIcon={<ArrowRight className="h-4 w-4" />}
        >
          Review order
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethod;