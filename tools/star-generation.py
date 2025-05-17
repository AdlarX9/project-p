"""
This script helps creating the star pattern which is used in the Background component by the frontend app.
"""

from PIL import Image
from os.path import join


def change_opaque_pixels(image_path: str, output_path: str, color: tuple | str) -> None:
    """
    Erase all green pixels of a PNG image and set the remaining ones to a new color.

    :param image_path: Path to the image to apply the effects.
    :param output_path: Path where the new image will be saved.
    :param color: New color for the pixels remaining.
    """

    # Open the image
    img = Image.open(image_path).convert("RGBA")
    pixels = img.load()

    # Support the string notation
    if type(color) == str:
        r = int(color[0:2], 16)
        g = int(color[2:4], 16)
        b = int(color[4:6], 16)
        color = (r, g, b)

    # Get through each pixel
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = pixels[x, y]
            if g > 50 and b < 50 and r < 50:  # Check if the pixel is green
                pixels[x, y] = (0,) * 4  # Set to transparent
            else:
                pixels[x, y] = (
                    *color,  # Set to the wanted color
                    a,
                )

    # Save the modified image
    img.save(output_path, "PNG")
    print(f"Image successfully saved at {output_path}")


image_path = "tools/input3.png"
output_path = join("frontend", "src", "assets", "background-shop-pattern.png")
color = "4d1b7b"

change_opaque_pixels(image_path, output_path, color)  # Call to the main function
