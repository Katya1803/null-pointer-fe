export function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-dark-muted text-sm">
          © {new Date().getFullYear()} NullPointer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}