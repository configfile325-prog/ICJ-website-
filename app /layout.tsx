export const metadata = {
  title: 'Pure Court Energy | ICJ System',
  description: 'International Court of Justice - Discord Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="cyber-grid min-h-screen">
        <div className="scan-line"></div>
        {children}
      </body>
    </html>
  )
}
