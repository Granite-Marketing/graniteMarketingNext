import Link from "next/link"
import { Separator } from "@/components/ui/separator"

const footerLinks = [
  { label: "About us", href: "#about" },
  { label: "Blog", href: "#blog" },
  { label: "Contact us", href: "#contact" },
  { label: "Advanced ocr", href: "#" },
  { label: "Home", href: "/" },
]

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          {/* Logo section */}
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl italic">Logo</span>
            </Link>
          </div>

          <nav>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} Granite Marketing. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Cookies settings
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
