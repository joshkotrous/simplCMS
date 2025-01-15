export default async function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark:bg-black h-screen w-screen flex justify-center items-center">
      {children}
    </div>
  );
}
