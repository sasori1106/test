import { Inter } from 'next/font/google';
import './globals.css';
import { AuthContextProvider } from '../context/AuthContext';
import NavigationWrapper from '../components/NavigationWrapper';
import { CartProvider } from '../context/CartContext';
import { OrderProvider } from '../context/OrderContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'VapeonX',
  description: 'VapeonX - Your Ultimate Vape Shop Destination',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <CartProvider>
            <OrderProvider>
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
          </OrderProvider>
          </CartProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}