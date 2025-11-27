"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ebookService } from "@/lib/services/ebook.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { EbookDetail } from "@/lib/types/ebook.types";

export default function EbookDetailPage() {
    const params = useParams();
    const ebookId = params.id as string;

    const [ebook, setEbook] = useState<EbookDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (ebookId) {
            loadEbook();
        }
    }, [ebookId]);

    const loadEbook = async () => {
        try {
            setIsLoading(true);
            setError("");
            const response = await ebookService.getEbookById(ebookId);
            setEbook(response.data.data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
        );
    }

    if (error || !ebook) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                        {error || "Ebook not found"}
                    </div>
                    <Link
                        href="/ebooks"
                        className="inline-block mt-4 text-primary-500 hover:text-primary-600"
                    >
                        ← Back to eBooks
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <Link
                    href="/ebooks"
                    className="inline-flex items-center gap-2 text-dark-muted hover:text-primary-500 transition-colors mb-6"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to eBooks
                </Link>

                {/* Content */}
                <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
                    <div className="md:flex">
                        {/* Cover */}
                        <div className="md:w-1/3 p-6 flex justify-center bg-dark-bg">
                            <div className="rounded-lg overflow-hidden shadow-xl">
                                {ebook.coverUrl ? (
                                    <img
                                        src={ebook.coverUrl}
                                        alt={ebook.title}
                                        className="max-w-full h-auto object-contain"
                                    />
                                ) : (
                                    <div className="w-48 aspect-[3/4] bg-dark-card flex items-center justify-center text-dark-muted">
                                        <svg
                                            className="w-16 h-16"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="md:w-2/3 p-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-dark-text mb-2">
                                {ebook.title}
                            </h1>

                            <p className="text-lg text-dark-muted mb-4">
                                by <span className="text-primary-500">{ebook.author}</span>
                            </p>

                            {/* Meta */}
                            <div className="flex flex-wrap gap-4 mb-6">
                                {ebook.publishedYear && (
                                    <div className="flex items-center gap-2 text-dark-muted">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{ebook.publishedYear}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-dark-muted">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span>PDF</span>
                                </div>
                            </div>

                            {/* Description */}
                            {ebook.description && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-dark-text mb-2">Description</h2>
                                    <p className="text-dark-muted whitespace-pre-line">
                                        {ebook.description}
                                    </p>
                                </div>
                            )}

                            {/* Download Button */}
                            <a
                                href={ebook.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                                Download PDF
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}