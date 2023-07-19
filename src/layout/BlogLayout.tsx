interface IBLogLayoutProps {
  children: React.ReactNode;
}

export default function BlogLayout({ children }: IBLogLayoutProps) {
  return <div className="w-full md:w-[572px] mx-auto mt-8 md:mt-20">{children}</div>;
}
