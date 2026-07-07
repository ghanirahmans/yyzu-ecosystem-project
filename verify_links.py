#!/usr/bin/env python3
"""Verify all MDX links are well-formed."""
import re
import glob

issues = []
for f in glob.glob('content/docs/**/*.mdx', recursive=True):
    with open(f) as fh:
        for i, line in enumerate(fh, 1):
            for m in re.finditer(r'\[([^\]]*)\]\(([^)]*)\)', line):
                text, url = m.group(1), m.group(2)
                if not text.strip():
                    issues.append(f'{f}:{i}: empty link text')
                if not url.strip():
                    issues.append(f'{f}:{i}: empty link url for "{text}"')
                if 'notion.com' in url:
                    issues.append(f'{f}:{i}: still has Notion URL: {url}')
                if '/docs/archive/' in url:
                    issues.append(f'{f}:{i}: still has archive path: {url}')
            for m in re.finditer(r'\]\([^)]+\)[a-zA-Z*]', line):
                issues.append(f'{f}:{i}: possible corrupted link: {m.group()}')

if issues:
    for i in issues:
        print(i)
    print(f'\n{len(issues)} issue(s) found.')
else:
    print('All MDX links are well-formed. No Notion URLs or archive paths remain.')
