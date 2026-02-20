import { collection, doc, setDoc, getDocs, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, isFirebaseEnabled } from './firebase';
import type { CarReport } from '../types';

export interface SavedReport {
  id: string;
  vin: string;
  report: CarReport;
  createdAt: number;
}

export async function saveReport(uid: string, report: CarReport): Promise<void> {
  if (!db || !isFirebaseEnabled) throw new Error('Firebase not configured');
  const ref = doc(collection(db, 'users', uid, 'reports'), report.vin);
  await setDoc(ref, {
    vin: report.vin,
    report,
    createdAt: Timestamp.now(),
  });
}

export async function getSavedReports(uid: string): Promise<SavedReport[]> {
  if (!db || !isFirebaseEnabled) return [];
  const snap = await getDocs(collection(db, 'users', uid, 'reports'));
  const list = snap.docs.map((d) => {
    const data = d.data();
    const createdAt = data.createdAt?.toMillis?.() ?? 0;
    return {
      id: d.id,
      vin: data.vin ?? d.id,
      report: data.report as CarReport,
      createdAt,
    };
  });
  list.sort((a, b) => b.createdAt - a.createdAt);
  return list;
}

/** Ištrina visus vartotojo išsaugotus ataskaitų dokumentus (prieš paskyros ištrynimą). */
export async function deleteAllUserReports(uid: string): Promise<void> {
  if (!db || !isFirebaseEnabled) return;
  const snap = await getDocs(collection(db, 'users', uid, 'reports'));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}
