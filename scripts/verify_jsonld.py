import urllib.request, re, json

base = 'http://localhost:3000'

def test_jsonld(path):
    res = urllib.request.urlopen(base + path)
    html = res.read().decode('utf-8')
    matches = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
    print(f'=== JSON-LD for {path} ({len(matches)} schemas found) ===')
    for m in matches:
        try:
            data = json.loads(m)
            print('  @type:', data.get('@type'), '| name:', data.get('name') or data.get('headline'))
        except Exception as e:
            print('  Invalid JSON-LD:', e)

test_jsonld('/')
test_jsonld('/nilesh-barela')
test_jsonld('/website-development')
test_jsonld('/hospital-management-software')
test_jsonld('/blog/modern-website-architecture-for-local-businesses')
