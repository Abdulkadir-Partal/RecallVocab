import re

line = 'about       hemen hemen [zf.]             aşağı yukarı [zf.]                  yaklaşık [zf.]'

parts = re.split(r"\s{2,}", line.strip())

print(parts)