import React from 'react';

type ConditionalProps = { showIf: boolean; children: React.ReactNode };

export const Conditional = ({ showIf, children }: ConditionalProps) => <>{showIf && children}</>;
