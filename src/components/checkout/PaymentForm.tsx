import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, Smartphone, Globe } from 'lucide-react';
import { clsx } from 'clsx';

interface PaymentMethodProps {
    onMethodSelect: (method: string) => void;
    selectedMethod: string;
    onCardDataChange: (data: any) => void;
}

export function PaymentMethodSelector({ onMethodSelect, selectedMethod, onCardDataChange }: PaymentMethodProps) {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardName, setCardName] = useState('');

    const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 16) val = val.slice(0, 16);
        setCardNumber(val);
        // Simulate sending valid data back
        onCardDataChange({ number: val, expiry, cvc, name: cardName });
    };

    const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length >= 2) {
            val = val.slice(0, 2) + '/' + val.slice(2, 4);
        }
        setExpiry(val);
        onCardDataChange({ number: cardNumber, expiry: val, cvc, name: cardName });
    };

    const handleCvc = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 4) val = val.slice(0, 4);
        setCvc(val);
        onCardDataChange({ number: cardNumber, expiry, cvc: val, name: cardName });
    };

    return (
        <div className="space-y-4">
            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2">
                <button
                    type="button"
                    onClick={() => onMethodSelect('stripe')}
                    className={clsx(
                        "p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all",
                        selectedMethod === 'stripe' ? "bg-monza-red/10 border-monza-red text-monza-red" : "bg-carbon-800 border-white/5 text-gray-400 hover:bg-carbon-700"
                    )}
                >
                    <CreditCard size={24} />
                    <span className="text-xs font-bold uppercase">Credit Card</span>
                </button>
                <button
                    type="button"
                    onClick={() => onMethodSelect('mercadopago')}
                    className={clsx(
                        "p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all",
                        selectedMethod === 'mercadopago' ? "bg-blue-500/10 border-blue-500 text-blue-500" : "bg-carbon-800 border-white/5 text-gray-400 hover:bg-carbon-700"
                    )}
                >
                    <Smartphone size={24} />
                    <span className="text-xs font-bold uppercase">MercadoPago</span>
                </button>
                <button
                    type="button"
                    onClick={() => onMethodSelect('shopify_payments')}
                    className={clsx(
                        "p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all",
                        selectedMethod === 'shopify_payments' ? "bg-green-500/10 border-green-500 text-green-500" : "bg-carbon-800 border-white/5 text-gray-400 hover:bg-carbon-700"
                    )}
                >
                    <Globe size={24} />
                    <span className="text-xs font-bold uppercase">Shopify Pay</span>
                </button>
            </div>

            {/* Credit Card Details (Stripe Style) */}
            <AnimatePresence mode="wait">
                {selectedMethod === 'stripe' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase text-gray-500">Card Details</span>
                            <div className="flex gap-2 opacity-50">
                                <div className="w-8 h-5 bg-white rounded"></div>
                                <div className="w-8 h-5 bg-white rounded"></div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Card Number"
                                value={cardNumber.replace(/(.{4})/g, '$1 ').trim()}
                                onChange={handleCardNumber}
                                maxLength={19}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-monza-red outline-none"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="MM / YY"
                                    value={expiry}
                                    onChange={handleExpiry}
                                    maxLength={5}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-monza-red outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="CVC"
                                    value={cvc}
                                    onChange={handleCvc}
                                    maxLength={4}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-monza-red outline-none"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Cardholder Name"
                                value={cardName}
                                onChange={(e) => {
                                    setCardName(e.target.value);
                                    onCardDataChange({ number: cardNumber, expiry, cvc, name: e.target.value });
                                }}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white uppercase text-sm focus:border-monza-red outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
                            <Lock size={12} />
                            <span>Payments are secure and encrypted.</span>
                        </div>
                    </motion.div>
                )}

                {selectedMethod === 'mercadopago' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#009EE3]/10 border border-[#009EE3]/30 rounded-xl p-6 text-center"
                    >
                        <p className="text-white font-bold mb-2">Redirect to MercadoPago</p>
                        <p className="text-sm text-gray-400">You will be redirected to complete your purchase securely.</p>
                    </motion.div>
                )}

                {selectedMethod === 'shopify_payments' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#5A31F4]/10 border border-[#5A31F4]/30 rounded-xl p-6 text-center"
                    >
                        <p className="text-white font-bold mb-2">Shopify Secure Checkout</p>
                        <p className="text-sm text-gray-400">Use your saved Shop Pay credentials.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
