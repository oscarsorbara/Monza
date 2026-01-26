import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { VehicleProvider } from '@/context/VehicleContext'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { AuthProvider } from '@/context/AuthContext'
import { ProductProvider } from '@/context/ProductContext'

import { OrderProvider } from '@/context/OrderContext'
import { AppointmentProvider } from '@/context/AppointmentContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <AppointmentProvider>
            <VehicleProvider>
              <CartProvider>
                <ToastProvider>
                  <App />
                </ToastProvider>
              </CartProvider>
            </VehicleProvider>
          </AppointmentProvider>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  </StrictMode>,
)
