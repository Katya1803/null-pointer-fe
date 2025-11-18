import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { APP_ROUTES } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Master Java & Spring
              <span className="block text-primary-500">Without Exceptions</span>
            </h1>
            <p className="text-xl text-dark-muted mb-8">
              Free comprehensive courses for Java developers. Learn Spring Boot, Microservices, and modern Java technologies.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={APP_ROUTES.REGISTER}>
                <Button size="lg" variant="primary">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-dark-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Popular Courses
            </h2>
            <p className="text-dark-muted">
              Start your learning journey with our most popular courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Card 1 */}
            <Card hover>
              <div className="aspect-video bg-gradient-to-br from-primary-500/20 to-transparent rounded-lg mb-4 flex items-center justify-center">
                <span className="text-6xl">☕</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                The Complete Java Spring Boot Course
              </h3>
              <p className="text-dark-muted text-sm mb-4">John Doe</p>
              <div className="flex items-center justify-between">
                <span className="text-primary-500 font-semibold">Free</span>
                <div className="flex items-center text-yellow-500">
                  ⭐ 4.8 <span className="text-dark-muted ml-1">(1,234)</span>
                </div>
              </div>
            </Card>

            {/* Course Card 2 */}
            <Card hover>
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-transparent rounded-lg mb-4 flex items-center justify-center">
                <span className="text-6xl">🔧</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Microservices Architecture Patterns
              </h3>
              <p className="text-dark-muted text-sm mb-4">Jane Smith</p>
              <div className="flex items-center justify-between">
                <span className="text-primary-500 font-semibold">Free</span>
                <div className="flex items-center text-yellow-500">
                  ⭐ 4.9 <span className="text-dark-muted ml-1">(892)</span>
                </div>
              </div>
            </Card>

            {/* Course Card 3 */}
            <Card hover>
              <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-transparent rounded-lg mb-4 flex items-center justify-center">
                <span className="text-6xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Advanced SQL for Data Scientists
              </h3>
              <p className="text-dark-muted text-sm mb-4">Peter Jones</p>
              <div className="flex items-center justify-between">
                <span className="text-primary-500 font-semibold">Free</span>
                <div className="flex items-center text-yellow-500">
                  ⭐ 4.7 <span className="text-dark-muted ml-1">(2,156)</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/courses">
              <Button variant="outline" size="lg">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-dark-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">50+</div>
              <div className="text-dark-muted">Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">10K+</div>
              <div className="text-dark-muted">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">100%</div>
              <div className="text-dark-muted">Free</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">4.8★</div>
              <div className="text-dark-muted">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center max-w-3xl mx-auto bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/30">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-dark-muted mb-8 text-lg">
              Join thousands of Java developers mastering their skills with NullPointer
            </p>
            <Link href={APP_ROUTES.REGISTER}>
              <Button size="lg" variant="primary">
                Create Free Account
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}