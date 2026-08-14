import os
import re
import json

# Use the actual base directory path with backslashes converted to native
base_dir = r"C:\Users\johnr\Downloads\jaystarbliss-studios.name.ng\jaystarbliss-studios.name.ng\htdocs"

console_statements = []
long_comments = []
all_css_classes = set()
css_class_files = {}

def count_comment_lines(start, end):
    return end - start + 1

# First pass: collect CSS classes from all HTML files
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            rel_path = os.path.relpath(filepath, base_dir)

            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            # Extract classes from <style> blocks
            style_blocks = re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL | re.IGNORECASE)
            for style_content in style_blocks:
                # Look for CSS class selectors .className
                classes = re.findall(r'\.([a-zA-Z_][a-zA-Z0-9_-]*)', style_content)
                for cls in classes:
                    if not cls.startswith('-'):
                        all_css_classes.add(cls)
                        if cls not in css_class_files:
                            css_class_files[cls] = []
                        if rel_path not in css_class_files[cls]:
                            css_class_files[cls].append(rel_path)

# Second pass: check usage of CSS classes
used_css_classes = set()
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            # Find class attribute values in both quoted and unquoted forms
            class_attrs = re.findall(r'class\s*=\s*["\']([^"\']+)["\']', content)
            for attr in class_attrs:
                for cls in attr.split():
                    if cls in all_css_classes:
                        used_css_classes.add(cls)

            class_attrs_unquoted = re.findall(r'class\s*=\s*([^\s>]+)', content)
            for attr in class_attrs_unquoted:
                cls = attr.strip()
                if cls in all_css_classes:
                    used_css_classes.add(cls)

# Console statements with line info
console_results = []
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            rel_path = os.path.relpath(filepath, base_dir)

            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()

            for line_num, line in enumerate(lines, 1):
                matches = re.findall(r'console\.(?:log|error|warn)\s*\([^)]*\)', line)
                for match in matches:
                    console_results.append({
                        'file': rel_path.replace('\\', '/'),
                        'line': line_num,
                        'statement': match.strip().rstrip(';')
                    })

# Long comments detection
comment_results = []
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            rel_path = os.path.relpath(filepath, base_dir)

            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()

            in_comment = False
            comment_start = 0
            comment_type = None

            for line_num, line in enumerate(lines, 1):
                html_comment_start = re.search(r'<!--', line)
                html_comment_end = re.search(r'-->', line)
                js_comment_start = re.search(r'/\*', line)
                js_comment_end = re.search(r'\*/', line)

                if html_comment_start and not in_comment:
                    in_comment = True
                    comment_start = line_num
                    comment_type = 'HTML'
                elif html_comment_end and in_comment and comment_type == 'HTML':
                    line_count = count_comment_lines(comment_start, line_num)
                    if line_count > 5:
                        comment_results.append({
                            'file': rel_path.replace('\\', '/'),
                            'startLine': comment_start,
                            'endLine': line_num,
                            'lineCount': line_count,
                            'type': 'HTML'
                        })
                    in_comment = False
                    comment_type = None

                if js_comment_start and not in_comment:
                    in_comment = True
                    comment_start = line_num
                    comment_type = 'JS/CSS'
                elif js_comment_end and in_comment and comment_type == 'JS/CSS':
                    line_count = count_comment_lines(comment_start, line_num)
                    if line_count > 5:
                        comment_results.append({
                            'file': rel_path.replace('\\', '/'),
                            'startLine': comment_start,
                            'endLine': line_num,
                            'lineCount': line_count,
                            'type': 'JS/CSS'
                        })
                    in_comment = False
                    comment_type = None

# Build unused CSS classes list
unused_css = []
for cls in sorted(all_css_classes):
    if cls not in used_css_classes:
        file = css_class_files[cls][0] if css_class_files[cls] else 'unknown'
        unused_css.append({
            'className': cls,
            'definedInFile': file.replace('\\', '/')
        })

# Sort results
console_results.sort(key=lambda x: (x['file'], x['line']))
comment_results.sort(key=lambda x: (x['file'], x['startLine']))

output = {
    'console_statements': console_results,
    'long_comments': comment_results,
    'unused_css_classes': unused_css
}

print(json.dumps(output, indent=2))
print(f"\nSummary: {len(console_results)} console statements, {len(comment_results)} long comments, {len(unused_css)} unused CSS out of {len(all_css_classes)} total defined")
