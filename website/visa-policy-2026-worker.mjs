// Narrow read-only origin-response patch for China's 240-hour visa-free transit guide.
// This Worker does not replace the main Magellan website Worker and does not edit the origin.
const GUIDE_PATH = "/guides/chongqing-240-hour-visa-free-transit-guide/";
const PATCH_DATE = "2026-11-15";
const RULES = [
  [
    "55+ countries",
    "57 countries"
  ],
  [
    "since June 2025 — Indonesia",
    "Indonesia (added in 2025), Kyrgyzstan and Vietnam (added August 20, 2026)"
  ],
  [
    "<p>Official source for the current lists: National Immigration Administration (nia.gov.cn) — the lists have expanded repeatedly, so check your passport there before booking. <em>Last checked by us: October 2026.</em></p>",
    "<p><strong>Official 240-hour transit references:</strong> <a href=\"https://en.nia.gov.cn/n147418/n147463/c183412/content.html\" rel=\"noopener noreferrer\">National Immigration Administration — eligible countries, ports and permitted areas (August 20, 2026)</a>; <a href=\"https://en.nia.gov.cn/n147418/n147468/c217849/content.html\" rel=\"noopener noreferrer\">official notice adding Kyrgyzstan and Vietnam</a>; and <a href=\"https://en.nia.gov.cn/n147413/c187308/content.html\" rel=\"noopener noreferrer\">official explanation of the stay calculation</a>. Travel eligibility and temporary entry permits are subject to immigration inspection at the port. <em>Policy verified: November 15, 2026.</em></p>"
  ],
  [
    "<li><strong>Ticket:</strong> confirmed seat, departure within 240 hours of arrival, destination = third country/region (not where you flew in from).</li>",
    "<li><strong>Ticket:</strong> an onward interline ticket with confirmed seat, itinerary and departure date for a third country or region, within the authorized transit stay. For this policy, the stay is counted from 00:00 on the day after entry; confirm your permitted departure deadline with immigration officers.</li>"
  ],
  [
    "<li><strong>Round trip tickets.</strong> A ticket back to your origin country is not a transit. Book onward to a third place — even a cheap hop to Hong Kong fixes it.</li>",
    "<li><strong>Same-origin round trips.</strong> The 240-hour transit exemption requires a genuine onward journey to a third country or region. A separate onward ticket alone never guarantees eligibility or admission; check the entire itinerary and applicable policy before booking.</li>"
  ],
  [
    "<li><strong>Counting hours wrong.</strong> The 240 hours run from entry processing; tight connections plus a \"quick look at the city\" is how overstays happen.</li>",
    "<li><strong>Counting hours wrong.</strong> The 240-hour permitted stay is counted from 00:00 on the day after arrival in China, not from the moment you pass immigration. Confirm your exact permitted exit date and time with the border inspection officer; do not overstay.</li>"
  ],
  [
    "<li><strong>Wrong port fantasies.</strong> Land borders and non-designated ports don't count; fly in and out of designated ones.</li>",
    "<li><strong>Using the wrong entry or exit port.</strong> Only the designated ports and permitted areas qualify for this policy. Some designated ports handle rail or ferry arrivals; flying is not a universal requirement. Check your specific ports against the current official list.</li>"
  ],
  [
    "<li><strong>Can I leave the airport on a 10-hour layover without a visa?</strong> If you're eligible for the 240-hour policy or 30-day visa-free: yes, with onward ticket in hand. If only the 24-hour airside rule covers you: generally no.</li>",
    "<li><strong>Can I leave the airport on a 10-hour layover without a visa?</strong> Only when you satisfy an applicable visa-free entry policy and immigration authorities permit entry or grant a temporary entry permit. A confirmed onward ticket alone is not permission to leave the airport. Under the standard 24-hour airside transit arrangement, leaving the restricted transit area requires separate authorization.</li>"
  ],
  [
    "<li><strong>None of the above</strong> — apply for a tourist (L) visa before you travel.</li>",
    "<li><strong>None of the above</strong> — check with a Chinese embassy or consulate which visa or entry arrangement is appropriate before traveling.</li>"
  ]
];
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.hostname !== "magellanchongqing.com" || url.pathname !== GUIDE_PATH || request.method !== "GET") {
      return fetch(request);
    }
    const upstream = await fetch(request);
    if (!upstream.ok || !(upstream.headers.get("content-type") || "").includes("text/html")) return upstream;
    const original = await upstream.text();
    // Fail open if the original is updated independently: do not replace unknown or mixed markup.
    if (!RULES.every(([from]) => original.includes(from))) {
      const headers = cleanHeaders(upstream.headers);
      headers.set("x-magellan-visa-patch", "unapplied-source-changed");
      return new Response(original, {status: upstream.status, headers});
    }
    let html = original;
    for (const [from, to] of RULES) html = html.replaceAll(from, to);
    const headers = cleanHeaders(upstream.headers);
    headers.set("x-magellan-visa-patch", PATCH_DATE);
    return new Response(html, {status: upstream.status, headers});
  }
};
function cleanHeaders(h) {
  const next = new Headers(h);
  for (const name of ["content-length","content-encoding","etag","last-modified"]) next.delete(name);
  return next;
}
