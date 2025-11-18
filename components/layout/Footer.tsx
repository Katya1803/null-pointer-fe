import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-primary-500">{'<'}</span>
              <span className="text-xl font-bold text-white">NullPointer</span>
              <span className="text-2xl font-bold text-primary-500">{'/>'}</span>
            </Link>
            <p className="text-dark-muted max-w-md">
              Free E-Learning platform for Java developers. Master Spring Framework and modern Java technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-dark-muted hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-dark-muted hover:text-primary-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-dark-muted hover:text-primary-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-dark-muted hover:text-primary-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-dark-muted hover:text-primary-500 transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-dark-muted hover:text-primary-500 transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-dark-muted hover:text-primary-500 transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-border">
          <p className="text-center text-dark-muted text-sm">
            © {new Date().getFullYear()} NullPointer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}