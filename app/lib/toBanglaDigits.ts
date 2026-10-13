// Swaps every ASCII digit for its Bangla counterpart and leaves everything
// else untouched, so it works on plain numbers as well as mixed strings.
// 125 -> "১২৫", "3.5" -> "৩.৫", "25/10/2026" -> "২৫/১০/২০২৬"
export function toBanglaDigits(value: string | number) {
  return String(value).replace(/[0-9]/g, (d) => String.fromCharCode(0x09e6 + Number(d)));
}
