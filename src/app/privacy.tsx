import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Share, View } from 'react-native';

import {
  GhostLink,
  LoadingView,
  MonoText,
  NavBar,
  PrimaryButton,
  Row,
  RowGroup,
  Screen,
  ScrollRegion,
  SHEET_TOP,
  Sheet,
  Tap,
  TextField,
} from '@/components/mono';
import { useAuth, type AccountCheck } from '@/lib/auth';
import { clearDeviceState, useCurrentUser, useDeleteAccountData, useExportData, useUpdateSettings } from '@/lib/backend';
import { openLegal } from '@/lib/legal';
import { mono, sans } from '@/lib/theme';

/**
 * 94 · Data & privacy — the nav row with its caption, then a `gap 16` column
 * from canvas 120: a heading and its line, what you can take with you, what
 * you can switch off, and the warning under `Delete account`.
 *
 * Every row does what it says now (deploy D412):
 *  - `Export my data` gathers the account's records into JSON and hands them
 *    to the system share sheet;
 *  - `Privacy policy` and `Terms of service` open their documents
 *    (`src/lib/legal.ts`); until a privacy-policy URL is configured that row
 *    says so instead of opening nothing;
 *  - the old `Pause analytics` switch (there are no analytics) is named for
 *    what it controls — whether VICI sends your name and email to RevenueCat
 *    (`settings.pauseAnalytics`, inverted; read by the purchases provider);
 *  - `Delete account` opens a confirm sheet: the account proves it is its
 *    owner (an emailed code or the password — Clerk reverification), then
 *    every stored row is erased, the sign-in account is deleted, this phone's
 *    local state is cleared, and the app returns to the door.
 *
 * The heading and line say only what is true (B14): the records live in the
 * account, travel encrypted, and are never sold — not "only yours", which
 * anyone with access to the backend could disprove. The column scrolls
 * between the nav and the screen's foot if it has to (D320).
 */

/**
 * The sheet's buttons are frame-level: the pill's top sits at 852 − 96 − 58,
 * and the panel's column (44 under its top) ends 12 above it — so the panel's
 * top is this less the column's height. Sign Out's two-line body gives 556,
 * the kit's `SHEET_TOP.signOut`.
 */
const SHEET_COLUMN_FOOT = 852 - 96 - 58 - 12 - 44;
/** A first guess at the column's height, replaced by its measured one. */
const SHEET_COLUMN_GUESS = 160;

type Step = 'confirm' | 'check' | 'deleting';

export default function Privacy() {
  const router = useRouter();
  const user = useCurrentUser();
  const update = useUpdateSettings();
  const exportData = useExportData();
  const deleteData = useDeleteAccountData();
  const { email, prepareAccountDeletion, confirmAccountDeletion, deleteAccount } = useAuth();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  const [exporting, setExporting] = useState(false);
  const [exportNote, setExportNote] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [step, setStep] = useState<Step>('confirm');
  const [check, setCheck] = useState<AccountCheck>('email_code');
  const [secret, setSecret] = useState('');
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);
  const [columnH, setColumnH] = useState(SHEET_COLUMN_GUESS);
  /** Set once erasing starts: the account record this screen reads is about to vanish. */
  const [holding, setHolding] = useState(false);

  // Deleting erases the account record this screen reads; hold the screen
  // (and its sheet, which may still have an error to show) up from then on.
  if (user === undefined && !holding) return <LoadingView onBack={back} />;
  const pauseAnalytics = user?.settings.pauseAnalytics ?? false;

  async function exportNow() {
    if (exporting) return;
    setExporting(true);
    setExportNote(null);
    try {
      const data = await exportData();
      const file = {
        app: 'VICI',
        format: 'vici-account-export',
        version: 1,
        exportedAt: new Date().toISOString(),
        account: { email },
        ...data,
      };
      await Share.share({ title: 'VICI data export', message: JSON.stringify(file, null, 2) });
      if (data.truncated.length) setExportNote(`Some of your history was too long for one export (${data.truncated.join(', ')}). Contact support for the rest.`);
    } catch {
      setExportNote('Couldn’t export your data. Try again.');
    } finally {
      setExporting(false);
    }
  }

  const openDelete = () => {
    setStep('confirm');
    setSecret('');
    setDeleteError(null);
    setDeleteNotice(null);
    setDeleteOpen(true);
  };
  const closeDelete = () => {
    if (busy) return;
    setDeleteOpen(false);
  };

  /** Erase the records, then the sign-in account, then this phone's state — and leave. */
  async function finish() {
    setHolding(true);
    setStep('deleting');
    setDeleteError(null);
    setDeleteNotice(null);
    try {
      await deleteData();
    } catch {
      setStep('confirm');
      setDeleteError('Couldn’t erase your data. Nothing was deleted. Try again.');
      return;
    }
    const res = await deleteAccount();
    if (!res.ok) {
      setStep('confirm');
      setDeleteError(`Your data was erased, but the account couldn’t be closed: ${res.error ?? 'try again.'}`);
      return;
    }
    await clearDeviceState();
    setDeleteOpen(false);
    router.replace('/');
  }

  /** The sheet's pill: ask for proof of ownership, or — with it given — delete. */
  async function onDelete() {
    if (busy) return;
    setBusy(true);
    setDeleteError(null);
    setDeleteNotice(null);
    try {
      if (step === 'confirm') {
        const res = await prepareAccountDeletion();
        if (!res.ok) return setDeleteError(res.error ?? 'Couldn’t start the deletion. Try again.');
        if (res.check) {
          setCheck(res.check);
          setSecret('');
          setStep('check');
          return;
        }
        await finish();
        return;
      }
      if (step === 'check') {
        if (!secret.trim()) return setDeleteError(check === 'password' ? 'Enter your password.' : 'Enter the code from the email.');
        const res = await confirmAccountDeletion(secret);
        if (!res.ok) return setDeleteError(res.error ?? 'Couldn’t confirm it’s you. Try again.');
        await finish();
      }
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    if (busy) return;
    setDeleteError(null);
    const res = await prepareAccountDeletion();
    if (!res.ok) setDeleteError(res.error ?? 'Couldn’t send a new code.');
    else setDeleteNotice('Code re-sent.');
  }

  const sheetTop = Math.min(SHEET_TOP.signOut, SHEET_COLUMN_FOOT - columnH);
  const message = deleteError ?? deleteNotice;

  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Data & privacy' }} right="empty" onBack={back} />

      <ScrollRegion top={100} contentStyle={{ paddingTop: 20, paddingHorizontal: 24, paddingBottom: 24, gap: 16 }}>
        <MonoText v="h1">How your data is kept.</MonoText>
        <MonoText v="p">
          Your journal, urges and log are stored in your private account, encrypted in transit and at rest. They aren’t end-to-end encrypted: our servers read them to run the app. We never sell your data.
        </MonoText>
        <View style={{ height: 2 }} />

        <RowGroup label="Your data">
          <Row label="Export my data" value={exporting ? 'Preparing…' : 'JSON'} onPress={() => void exportNow()} />
          <Row label="Privacy policy" onPress={() => void openLegal('privacy')} />
          <Row label="Terms of service" onPress={() => void openLegal('terms')} />
        </RowGroup>

        {exportNote ? (
          <MonoText v="p" color={mono.mute} style={{ fontSize: 13, lineHeight: 19 }}>
            {exportNote}
          </MonoText>
        ) : null}

        <RowGroup label="Controls">
          <Row label="Share email with billing" toggle={{ value: !pauseAnalytics, onChange: (next) => void update({ pauseAnalytics: !next }) }} />
          <Row label="Delete account" muted onPress={openDelete} />
        </RowGroup>

        <MonoText v="p" color={mono.mute} style={{ fontSize: 13, lineHeight: 19 }}>
          While sharing is on, VICI sends your name and email to RevenueCat, which runs subscriptions, so a purchase can be matched to you. Turning it off stops
          that from then on.
        </MonoText>
        <MonoText v="p" color={mono.mute} style={{ fontSize: 13, lineHeight: 19 }}>
          Deleting your account erases your journal, urges and log permanently. This can’t be undone.
        </MonoText>
      </ScrollRegion>

      {/* only the pill deletes; the scrim and "Keep my account" just close */}
      <Sheet
        open={deleteOpen}
        top={sheetTop}
        gap={10}
        onClose={busy ? undefined : closeDelete}
        footer={
          <>
            <PrimaryButton
              label={step === 'deleting' ? 'Deleting…' : busy ? 'One moment…' : 'Delete account'}
              bottom={96}
              sheet
              disabled={busy}
              onPress={() => void onDelete()}
            />
            {busy ? null : <GhostLink label="Keep my account" zIndex={42} onPress={closeDelete} />}
          </>
        }>
        <View style={{ gap: 10 }} onLayout={(e) => setColumnH(Math.ceil(e.nativeEvent.layout.height))}>
          {step === 'check' ? (
            <>
              <MonoText v="h1SheetLg">Confirm it’s you.</MonoText>
              <MonoText v="p" color={mono.sub} style={{ lineHeight: 23 }}>
                {check === 'password' ? 'Enter your password to delete this account.' : `Enter the code we just emailed to ${email ?? 'your address'}.`}
              </MonoText>
              <TextField
                variant="sheet"
                value={secret}
                onChangeText={setSecret}
                placeholder={check === 'password' ? 'Your password' : '6-digit code'}
                accessibilityLabel={check === 'password' ? 'Password' : 'Code'}
                secureTextEntry={check === 'password'}
                keyboardType={check === 'password' ? 'default' : 'number-pad'}
                autoComplete={check === 'password' ? 'current-password' : 'one-time-code'}
                textContentType={check === 'password' ? 'password' : 'oneTimeCode'}
                autoCapitalize="none"
                autoFocus
              />
              {check === 'email_code' ? (
                <Tap onPress={() => void resendCode()} hitSlop={{ top: 8, bottom: 8 }} style={{ alignSelf: 'flex-start' }}>
                  <MonoText v="p" color={mono.ink} style={{ ...sans('700'), fontSize: 14, lineHeight: 20 }}>
                    Send a new code
                  </MonoText>
                </Tap>
              ) : null}
            </>
          ) : (
            <>
              <MonoText v="h1SheetLg">Delete your account?</MonoText>
              <MonoText v="p" color={mono.sub} style={{ lineHeight: 23 }}>
                This erases your journal, urges, check-ins and lessons, and closes your account. It can’t be undone. A subscription keeps running
                until you cancel it in your store settings.
              </MonoText>
            </>
          )}
          {message ? (
            <MonoText v="p" color={deleteError ? mono.ink : mono.mute} style={{ ...sans(deleteError ? '700' : '400'), fontSize: 14, lineHeight: 20 }}>
              {message}
            </MonoText>
          ) : null}
        </View>
      </Sheet>
    </Screen>
  );
}
