'use client';

import React from 'react';
import HealthAssistant from '../../components/HealthAssistant';

export default function HealthAssistantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <HealthAssistant />
      </div>
    </div>
  );
} 