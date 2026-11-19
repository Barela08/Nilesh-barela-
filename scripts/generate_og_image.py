import os
from PIL import Image, ImageDraw, ImageFont

output_path = os.path.join(os.getcwd(), 'public', 'assets', 'hackifypro-og.png')
icon_path = os.path.join(os.getcwd(), 'public', 'assets', 'hackifypro-icon-square.png')

width, height = 1200, 630
img = Image.new('RGB', (width, height), color=(8, 11, 18))
draw = ImageDraw.Draw(img)

# Background subtle grid lines
for x in range(0, width, 40):
    draw.line([(x, 0), (x, height)], fill=(15, 23, 42), width=1)
for y in range(0, height, 40):
    draw.line([(0, y), (width, y)], fill=(15, 23, 42), width=1)

# Inner glowing card
card_rect = [60, 60, width - 60, height - 60]
draw.rounded_rectangle(card_rect, radius=24, fill=(15, 22, 36), outline=(0, 230, 118), width=3)

# Paste logo if exists
if os.path.exists(icon_path):
    try:
        icon = Image.open(icon_path).convert("RGBA")
        icon = icon.resize((140, 140))
        img.paste(icon, (110, 110), icon)
    except Exception as e:
        print("Icon paste error:", e)

# Text using default bitmap or trueType
try:
    # Try system fonts
    font_bold_large = ImageFont.truetype("arialbd.ttf", 46)
    font_title = ImageFont.truetype("arialbd.ttf", 36)
    font_sub = ImageFont.truetype("arial.ttf", 24)
    font_mono = ImageFont.truetype("courbd.ttf", 20)
    font_brand = ImageFont.truetype("arialbd.ttf", 52)
except Exception:
    font_bold_large = ImageFont.load_default()
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_mono = ImageFont.load_default()
    font_brand = ImageFont.load_default()

# Brand Name
draw.text((280, 115), "Hackify", font=font_brand, fill=(255, 255, 255))
draw.text((465, 115), "Pro", font=font_brand, fill=(0, 230, 118))
draw.text((280, 180), "SECURE  |  LEARN  |  INNOVATE", font=font_mono, fill=(56, 189, 248))

# Divider line
draw.line([(110, 280), (width - 110, 280)], fill=(30, 41, 59), width=2)

# Value Proposition
draw.text((110, 310), "Building Powerful Digital Solutions for Modern Businesses", font=font_bold_large, fill=(232, 237, 245))
draw.text((110, 380), "Websites  •  Android Apps  •  Hospital, POS & Custom Management Software", font=font_title, fill=(56, 189, 248))
draw.text((110, 440), "Serving Nashik, Maharashtra & Across India  •  Founder: Nilesh Barela", font=font_sub, fill=(154, 163, 184))

# Domain tag footer pill
pill_rect = [110, 500, 480, 545]
draw.rounded_rectangle(pill_rect, radius=12, fill=(8, 11, 18), outline=(0, 230, 118), width=2)
draw.text((130, 512), "🌐 https://nileshbarela.site", font=font_mono, fill=(0, 230, 118))

# Phone pill
phone_pill = [510, 500, 850, 545]
draw.rounded_rectangle(phone_pill, radius=12, fill=(8, 11, 18), outline=(56, 189, 248), width=2)
draw.text((530, 512), "📞 +91 7414935405", font=font_mono, fill=(56, 189, 248))

img.save(output_path, "PNG")
print("Saved OG image to:", output_path)
