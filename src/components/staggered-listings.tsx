"use client";

import React from "react";

interface StaggeredListingsProps {
  children: React.ReactNode;
}

export default function StaggeredListings({ children }: StaggeredListingsProps) {
  return (
    <>
      <style>{`
        @keyframes sukan-fade-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sukan-stagger-child {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {React.Children.map(children, (child, index) => (
        <div
          className="sukan-stagger-child"
          style={{
            animation: `sukan-fade-up 600ms cubic-bezier(0.16,1,0.3,1) both`,
            animationDelay: `${index * 80}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </>
  );
}
