import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface SpeechPageProps {
  params: {
    slug: string;
  };
}

export default async function SpeechPage({ params }: SpeechPageProps) {
  const speech = await prisma.speech.findUnique({
    where: { slug: params.slug },
    include: { user: true },
  });

  if (!speech) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {speech.speechType}
            </h1>
            <p className="text-lg text-gray-600">
              By {speech.user.name} • {speech.groomName} & {speech.brideName}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {speech.relationship} • {speech.tone} • {speech.length}
            </p>
          </div>

          {/* Speech Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {speech.speech}
              </div>
            </div>
          </div>

          {/* Speech Details */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Speech Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Speaker:</span> {speech.user.name}
              </div>
              <div>
                <span className="font-medium">Speech Type:</span> {speech.speechType}
              </div>
              <div>
                <span className="font-medium">Groom:</span> {speech.groomName}
              </div>
              <div>
                <span className="font-medium">Bride:</span> {speech.brideName}
              </div>
              <div>
                <span className="font-medium">Relationship:</span> {speech.relationship}
              </div>
              <div>
                <span className="font-medium">Tone:</span> {speech.tone}
              </div>
              <div>
                <span className="font-medium">Length:</span> {speech.length}
              </div>
              <div>
                <span className="font-medium">Created:</span> {new Date(speech.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Back to Generator */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Create Another Speech
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 