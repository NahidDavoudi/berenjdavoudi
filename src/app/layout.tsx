import type { Metadata } from 'next'
import { Vazirmatn } from 'next/font/google'
import '@/app/globals.css'
import { Providers } from './providers'
import MainLayout from '@/components/layout/MainLayout'

const vazir = Vazirmatn({ 
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-vazir',
})

export const metadata: Metadata = {
  title: 'برنج داودی - فروشگاه برنج شمال',
  description: 'فروشگاه آنلاین برنج داودی - عرضه کننده برنج مرغوب شمال',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazir.className} font-vazir bg-milky min-h-screen paper-texture`}>
        <div className="container mx-auto max-w-lg bg-white/60 min-h-screen sm:shadow-2xl sm:my-4 sm:rounded-3xl">
          <Providers>
            <MainLayout>
              {children}
            </MainLayout>
          </Providers>
        </div>
      </body>
    </html>
  )
}
