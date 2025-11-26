"use client"; 

import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [showQR, setShowQR] = useState(false);

  return (
    <footer className="border-t border-dark-border bg-dark-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo-nullpointer.svg" alt="NullPointer Logo" className="h-10 w-10" />
              <span className="text-xl font-bold text-primary-500">NullPointer</span>
            </div>
            <p className="text-dark-muted text-sm">
              Free e-learning platform for Java developers. Master Spring Framework and modern Java technologies.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-dark-text mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-dark-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:katyavu.work@gmail.com" className="hover:text-primary-500 transition-colors">
                  katyavu.work@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-dark-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:0969193183" className="hover:text-primary-500 transition-colors">
                  0969 193 183
                </a>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold text-dark-text mb-4">Support Us</h3>
            <p className="text-dark-muted text-sm mb-3">
              Help us keep the platform free and ad-free!
            </p>
            <button
              onClick={() => setShowQR(!showQR)}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm transition-colors"
            >
              {showQR ? "Hide QR Code" : "Show QR Code"}
            </button>
            
            {showQR && (
              <div className="mt-4 p-4 bg-dark-bg border border-dark-border rounded-lg">
                <img 
                  src="/qr.jpg" 
                  alt="Support QR Code" 
                  className="w-40 h-40 mx-auto mb-3 rounded"
                />
                <div className="text-center">
                  <p className="text-sm text-dark-text font-medium">Vietcombank (VCB)</p>
                  <p className="text-sm text-dark-muted">9969193183</p>
                  <p className="text-xs text-dark-muted mt-2">Scan QR or use account number</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="border-t border-dark-border pt-6 mb-6 text-center text-dark-muted text-sm">
          © {new Date().getFullYear()} NullPointer. All rights reserved.

        </div>

      </div>
    </footer>
  );
}