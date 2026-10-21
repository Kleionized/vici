// Regenerates all 12 Week files from the revised course (gen/src-days.json + gen/v3-author.js) with gen/lesson-v3.js.
// Run via run_script: await (eval(await readFile('gen/build-weeks.js')))
// If any text changes: run build-v3 in 'collect' mode, open gen/measure.html, paste the logged line counts into gen/lines-v3.json, then build. gen/check.html reports overflow.
(async () => (eval(await readFile('gen/build-v3.js')))('build'))()
