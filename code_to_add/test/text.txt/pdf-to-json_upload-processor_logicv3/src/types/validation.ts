import { SourceLocation } from './index';

export interface VerifiedField {
  name: string;
  location: SourceLocation;
  verified: boolean;
}