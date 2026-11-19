import urllib.request
import urllib.parse
import json
import re

BASE_URL = "http://localhost:3000"

def get(path):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, headers={'User-Agent': 'SEO-Verifier/1.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            return resp.status, content
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:
        return 500, str(e)

routes_to_test = [
    "/",
    "/about",
    "/services",
    "/products",
    "/portfolio",
    "/nilesh-barela",
    "/contact",
    "/faq",
    "/careers",
    "/blog",
    "/appointment",
    "/enquiry",
    "/request-quote",
    "/website-development",
    "/android-app-development",
    "/web-application-development",
    "/custom-software-development",
    "/business-automation",
    "/software-maintenance",
    "/ui-ux-design",
    "/hospital-management-software",
    "/car-rental-software",
    "/restaurant-management-software",
    "/gym-management-software",
    "/driving-school-software",
    "/privacy-policy",
    "/terms-and-conditions",
    "/refund-policy",
    "/cookie-policy",
    "/googledbca3e63ac5f841c.html",
    "/robots.txt",
    "/sitemap.xml",
    "/llms.txt",
    "/manifest.json",
]

print("=== STARTING FULL SEO, GSC & ROUTE VERIFICATION ===")

errors = []
success_count = 0

for path in routes_to_test:
    status, content = get(path)
    if status != 200:
        errors.append(f"Route {path} returned HTTP {status}")
        print(f"❌ {path} -> HTTP {status}")
        continue

    # Specific checks
    if path == "/googledbca3e63ac5f841c.html":
        if "google-site-verification: googledbca3e63ac5f841c.html" in content:
            print("✅ Google Search Console verification file verified!")
        else:
            errors.append("GSC verification file content mismatch")
    elif path == "/robots.txt":
        if "sitemap.xml" in content:
            print("✅ robots.txt verified with sitemap declaration!")
    elif path == "/sitemap.xml":
        if "https://nileshbarela.site" in content:
            print("✅ sitemap.xml verified with canonical URLs!")
    elif path.endswith(".html") or not path.endswith((".txt", ".json", ".xml")):
        # Check canonical
        if 'rel="canonical"' in content:
            pass
        else:
            errors.append(f"Missing canonical tag in {path}")
        
        # Check H1
        h1_matches = re.findall(r'<h1[^>]*>(.*?)</h1>', content, re.IGNORECASE | re.DOTALL)
        if len(h1_matches) == 1:
            pass
        elif len(h1_matches) == 0:
            errors.append(f"No H1 tag found in {path}")
        else:
            # Notice: Check if multiple h1 exists
            print(f"⚠️ Notice: {path} has {len(h1_matches)} H1 tags")

        # Check GSC meta verification tag in layout
        if 'content="googledbca3e63ac5f841c"' in content:
            pass
        else:
            errors.append(f"Missing GSC meta tag in {path}")

    success_count += 1
    print(f"✅ {path} -> HTTP 200 OK")

print(f"\nVerification Complete: {success_count}/{len(routes_to_test)} routes passed.")
if errors:
    print("Errors found:", errors)
else:
    print("ALL TESTS PASSED WITH 0 ERRORS! 🚀")
