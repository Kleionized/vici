// paywall-reminders: Paywall ✕ -> Rescue "Start free trial" -> the drawn pay sheet -> confirm -> Confirmed (trial line)
await tap('Close');
await waitFor('Before you go');
await tap('Start free trial');
await waitFor('Due today');
await __sleep(400); // the sheet's 300 ms rise
await tap('Confirm with Side Button');
await waitFor('Receipt sent');
