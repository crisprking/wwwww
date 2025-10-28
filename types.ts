import React from 'react';

export interface Strategy {
  id: string;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

export interface Reference {
  title: string;
  authors: string;
  source: string;
}

export interface Result {
  comment: string;
  references: Reference[];
}
