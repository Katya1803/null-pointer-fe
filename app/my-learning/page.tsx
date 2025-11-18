export default function MyLearningPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-500/10 mb-6">
            <span className="text-5xl">📚</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Learning Coming Soon
          </h1>
          <p className="text-lg text-dark-muted">
            Your personal learning dashboard is under development. Soon you'll be able to track your progress and manage your courses.
          </p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Features in development:</h2>
          <ul className="text-left space-y-3 text-dark-muted">
            <li className="flex items-start gap-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span>Track your course progress and achievements</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span>Access your enrolled courses and materials</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span>View certificates and completion badges</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span>Personalized learning recommendations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span>Continue where you left off</span>
            </li>
          </ul>
        </div>

        <p className="mt-8 text-dark-muted">
          We're building something amazing! 🎯
        </p>
      </div>
    </div>
  );
}