export default function BlogsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-500/10 mb-6">
            <span className="text-5xl">📝</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blogs Coming Soon
          </h1>
          <p className="text-lg text-dark-muted">
            We're working hard to bring you insightful articles about Java, Spring Boot, and software development best practices.
          </p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          <h2 className="text-xl font-semibold text-white mb-4">What to expect:</h2>
          <ul className="text-left space-y-3 text-dark-muted">
            <li className="flex items-start gap-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span>In-depth tutorials on Spring Boot and Java ecosystem</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span>Best practices for microservices architecture</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span>Real-world case studies and solutions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span>Tips and tricks from experienced developers</span>
            </li>
          </ul>
        </div>

        <p className="mt-8 text-dark-muted">
          Stay tuned for updates! 🚀
        </p>
      </div>
    </div>
  );
}