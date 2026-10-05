/**
 * The context both adapters publish into. Kept in its own module so importing
 * it never drags in either implementation.
 */

import { createContext } from 'react';

import type { PurchasesApi } from './types';

export const PurchasesContext = createContext<PurchasesApi | null>(null);
