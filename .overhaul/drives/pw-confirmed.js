// paywall-reminders: Paywall Continue (Yearly) -> the drawn pay sheet -> confirm -> Confirmed (yearly line)
await tap('Continue');
await waitFor('Due today');
await __sleep(400);
await tap('Confirm with Side Button');
await waitFor('Receipt sent');
