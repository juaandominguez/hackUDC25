export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>{children}</div>;
  }
  
  export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={`p-4 ${className}`}>{children}</div>;
  }
  
  export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={`p-4 border-t ${className}`}>{children}</div>;
  }
  